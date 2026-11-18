package com.tranhoang.floating;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.PixelFormat;
import android.graphics.drawable.GradientDrawable;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.util.DisplayMetrics;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONObject;

public class FloatingBubbleService extends Service {

    private WindowManager windowManager;
    private WindowManager.LayoutParams windowParams;
    private FrameLayout rootContainer;
    private TextView bubbleView;
    private LinearLayout panelView;
    private WebView webView;
    private boolean isKeyboardEnabled = true;
    private final Handler mainHandler = new Handler(Looper.getMainLooper());

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        startForegroundNotification();
        initFloatingWindows();
    }

    private void startForegroundNotification() {
        String channelId = "tranhoang_floating_channel";
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    channelId,
                    "TranHoang Bong Bóng Nổi",
                    NotificationManager.IMPORTANCE_LOW
            );
            NotificationManager nm = getSystemService(NotificationManager.class);
            if (nm != null) nm.createNotificationChannel(channel);

            Notification notification = new Notification.Builder(this, channelId)
                    .setContentTitle("TranHoang AI đang chạy nổi")
                    .setContentText("Chạm vào bong bóng AI để đọc màn hình và nhận gợi ý")
                    .setSmallIcon(android.R.drawable.sym_def_app_icon)
                    .build();
            startForeground(101, notification);
        }
    }

    private void initFloatingWindows() {
        windowManager = (WindowManager) getSystemService(WINDOW_SERVICE);
        DisplayMetrics dm = new DisplayMetrics();
        windowManager.getDefaultDisplay().getMetrics(dm);

        int layoutType = Build.VERSION.SDK_INT >= Build.VERSION_CODES.O
                ? WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
                : WindowManager.LayoutParams.TYPE_PHONE;

        windowParams = new WindowManager.LayoutParams(
                WindowManager.LayoutParams.WRAP_CONTENT,
                WindowManager.LayoutParams.WRAP_CONTENT,
                layoutType,
                WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
                PixelFormat.TRANSLUCENT
        );
        windowParams.gravity = Gravity.TOP | Gravity.START;
        windowParams.x = 20;
        windowParams.y = dm.heightPixels / 4;

        rootContainer = new FrameLayout(this);

        // 1. Tạo Bong Bóng Thu Gọn
        bubbleView = new TextView(this);
        bubbleView.setText("💬 AI");
        bubbleView.setTextColor(Color.WHITE);
        bubbleView.setTextSize(TypedValue.COMPLEX_UNIT_SP, 14);
        bubbleView.setGravity(Gravity.CENTER);
        int bubbleSize = dpToPx(58);
        GradientDrawable bubbleBg = new GradientDrawable();
        bubbleBg.setShape(GradientDrawable.OVAL);
        bubbleBg.setColor(Color.parseColor("#6366F1"));
        bubbleBg.setStroke(dpToPx(2), Color.WHITE);
        bubbleView.setBackground(bubbleBg);
        rootContainer.addView(bubbleView, new FrameLayout.LayoutParams(bubbleSize, bubbleSize));

        // 2. Tạo Khung Giao Diện Mở Rộng
        panelView = new LinearLayout(this);
        panelView.setOrientation(LinearLayout.VERTICAL);
        panelView.setVisibility(View.GONE);
        GradientDrawable panelBg = new GradientDrawable();
        panelBg.setCornerRadius(dpToPx(14));
        panelBg.setColor(Color.parseColor("#0F172A"));
        panelBg.setStroke(dpToPx(1), Color.parseColor("#334155"));
        panelView.setBackground(panelBg);

        // Thanh điều khiển phía trên WebView
        LinearLayout topBar = new LinearLayout(this);
        topBar.setOrientation(LinearLayout.HORIZONTAL);
        topBar.setGravity(Gravity.CENTER_VERTICAL);
        topBar.setPadding(dpToPx(8), dpToPx(6), dpToPx(8), dpToPx(6));

        TextView dragHandle = new TextView(this);
        dragHandle.setText("✥ Kéo");
        dragHandle.setTextColor(Color.parseColor("#94A3B8"));
        dragHandle.setTextSize(TypedValue.COMPLEX_UNIT_SP, 12);
        dragHandle.setPadding(dpToPx(6), dpToPx(4), dpToPx(10), dpToPx(4));
        topBar.addView(dragHandle);

        Button btnScan = createHeaderButton("🎯 Quét Màn Hình", "#10B981");
        Button btnKb = createHeaderButton("⌨️ Phím: Bật", "#3B82F6");
        Button btnMin = createHeaderButton("➖", "#475569");

        LinearLayout.LayoutParams spacerParams = new LinearLayout.LayoutParams(0, 1, 1f);
        View spacer = new View(this);
        topBar.addView(btnScan);
        topBar.addView(spacer, spacerParams);
        topBar.addView(btnKb);
        topBar.addView(btnMin);

        panelView.addView(topBar, new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
        ));

        // Khởi tạo WebView chứa ứng dụng TranHoang
        webView = new WebView(this);
        setupWebView();
        panelView.addView(webView, new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                0,
                1f
        ));

        int panelW = (int) (dm.widthPixels * 0.92);
        int panelH = (int) (dm.heightPixels * 0.68);
        rootContainer.addView(panelView, new FrameLayout.LayoutParams(panelW, panelH));

        // Sự kiện kéo thả và mở Bong bóng
        setupDragAndClick(bubbleView, true);
        setupDragAndClick(dragHandle, false);

        // Sự kiện Thu nhỏ về Bong bóng
        btnMin.setOnClickListener(v -> collapseToBubble());

        // Sự kiện Bật/Tắt bàn phím để vừa xem gợi ý vừa gõ phím ở app bên dưới
        btnKb.setOnClickListener(v -> {
            isKeyboardEnabled = !isKeyboardEnabled;
            if (isKeyboardEnabled) {
                windowParams.flags &= ~WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE;
                btnKb.setText("⌨️ Phím: Bật");
            } else {
                windowParams.flags |= WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE;
                btnKb.setText("⌨️ Phím: Tắt");
            }
            windowManager.updateViewLayout(rootContainer, windowParams);
        });

        // Sự kiện Quét Màn Hình Trực Tiếp
        btnScan.setOnClickListener(v -> triggerLiveScreenCapture());

        windowManager.addView(rootContainer, windowParams);
    }

    private Button createHeaderButton(String text, String hexColor) {
        Button btn = new Button(this);
        btn.setText(text);
        btn.setTextColor(Color.WHITE);
        btn.setTextSize(TypedValue.COMPLEX_UNIT_SP, 11);
        btn.setAllCaps(false);
        int padH = dpToPx(10);
        int padV = dpToPx(4);
        btn.setPadding(padH, padV, padH, padV);
        btn.setMinHeight(0);
        btn.setMinimumHeight(0);
        btn.setMinWidth(0);
        btn.setMinimumWidth(0);

        GradientDrawable bg = new GradientDrawable();
        bg.setCornerRadius(dpToPx(8));
        bg.setColor(Color.parseColor(hexColor));
        btn.setBackground(bg);

        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
        );
        lp.setMargins(dpToPx(4), 0, dpToPx(4), 0);
        btn.setLayoutParams(lp);
        return btn;
    }

    private void setupWebView() {
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);

        webView.addJavascriptInterface(new WebAppBridge(), "AndroidBridge");
        webView.setWebChromeClient(new WebChromeClient());
        webView.setWebViewClient(new WebViewClient());

        SharedPreferences prefs = getSharedPreferences("tranhoang_prefs", MODE_PRIVATE);
        settings.setCacheMode(WebSettings.LOAD_NO_CACHE);
        String targetUrl = prefs.getString("web_url", "https://tranhoang23062007-spec.github.io/TranHoang/");
        webView.loadUrl(targetUrl);
    }

    private void triggerLiveScreenCapture() {
        final ScreenReaderService reader = ScreenReaderService.getInstance();
        if (reader == null) {
            Toast.makeText(this, "Vui lòng bật quyền 'TranHoang Đọc Màn Hình' trong Cài đặt Hỗ trợ tiếp cận!", Toast.LENGTH_LONG).show();
            return;
        }

        // Tạm ẩn khung nổi 250ms để đọc toàn bộ màn hình ứng dụng chat phía dưới
        rootContainer.setVisibility(View.INVISIBLE);

        mainHandler.postDelayed(() -> reader.captureCurrentScreen((extractedText, base64Image) -> mainHandler.post(() -> {
            rootContainer.setVisibility(View.VISIBLE);

            if (extractedText.isEmpty() && base64Image.isEmpty()) {
                Toast.makeText(FloatingBubbleService.this, "Không tìm thấy văn bản trên màn hình", Toast.LENGTH_SHORT).show();
                return;
            }

            try {
                JSONObject payload = new JSONObject();
                payload.put("text", extractedText);
                payload.put("base64Image", base64Image);
                final String jsPayload = payload.toString();

                // Truyền dữ liệu vào hàm window.onAndroidScreenCaptured hoặc tự động điền vào ô textarea
                String jsCode = "(function(data){" +
                        "if(window.onAndroidScreenCaptured){ window.onAndroidScreenCaptured(data); }" +
                        "else if(data.text){" +
                        "  var ta = document.querySelector('textarea, input[type=\"text\"]');" +
                        "  if(ta){ ta.value = data.text; ta.dispatchEvent(new Event('input', {bubbles:true})); }" +
                        "}" +
                        "})(" + jsPayload + ");";

                webView.evaluateJavascript(jsCode, null);
                Toast.makeText(FloatingBubbleService.this, "Đã đọc màn hình & điền vào khung gợi ý!", Toast.LENGTH_SHORT).show();
            } catch (Exception e) {
                Toast.makeText(FloatingBubbleService.this, "Lỗi xử lý dữ liệu màn hình", Toast.LENGTH_SHORT).show();
            }
        })), 250);
    }

    private void expandPanel() {
        bubbleView.setVisibility(View.GONE);
        panelView.setVisibility(View.VISIBLE);
        if (isKeyboardEnabled) {
            windowParams.flags &= ~WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE;
        }
        windowManager.updateViewLayout(rootContainer, windowParams);
    }

    private void collapseToBubble() {
        panelView.setVisibility(View.GONE);
        bubbleView.setVisibility(View.VISIBLE);
        windowParams.flags |= WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE;
        windowManager.updateViewLayout(rootContainer, windowParams);
    }

    private void setupDragAndClick(View handleView, final boolean isBubble) {
        handleView.setOnTouchListener(new View.OnTouchListener() {
            private int initialX, initialY;
            private float initialTouchX, initialTouchY;
            private long touchStartTime;

            @Override
            public boolean onTouch(View v, MotionEvent event) {
                switch (event.getAction()) {
                    case MotionEvent.ACTION_DOWN:
                        initialX = windowParams.x;
                        initialY = windowParams.y;
                        initialTouchX = event.getRawX();
                        initialTouchY = event.getRawY();
                        touchStartTime = System.currentTimeMillis();
                        return true;

                    case MotionEvent.ACTION_MOVE:
                        windowParams.x = initialX + (int) (event.getRawX() - initialTouchX);
                        windowParams.y = initialY + (int) (event.getRawY() - initialTouchY);
                        windowManager.updateViewLayout(rootContainer, windowParams);
                        return true;

                    case MotionEvent.ACTION_UP:
                        float dx = Math.abs(event.getRawX() - initialTouchX);
                        float dy = Math.abs(event.getRawY() - initialTouchY);
                        if (isBubble && dx < 15 && dy < 15 && (System.currentTimeMillis() - touchStartTime) < 300) {
                            expandPanel();
                        }
                        return true;
                }
                return false;
            }
        });
    }

    public class WebAppBridge {
        @JavascriptInterface
        public void requestScreenCapture() {
            mainHandler.post(() -> triggerLiveScreenCapture());
        }

        @JavascriptInterface
        public void copyToClipboard(String text) {
            ClipboardManager cb = (ClipboardManager) getSystemService(Context.CLIPBOARD_SERVICE);
            if (cb != null) {
                cb.setPrimaryClip(ClipData.newPlainText("TranHoangAI", text));
                mainHandler.post(() -> Toast.makeText(FloatingBubbleService.this, "Đã sao chép câu trả lời!", Toast.LENGTH_SHORT).show());
            }
        }
    }

    private int dpToPx(int dp) {
        return (int) TypedValue.applyDimension(
                TypedValue.COMPLEX_UNIT_DIP,
                dp,
                getResources().getDisplayMetrics()
        );
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (rootContainer != null && windowManager != null) {
            windowManager.removeView(rootContainer);
        }
    }
}