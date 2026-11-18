package com.tranhoang.floating;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.drawable.GradientDrawable;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.MotionEvent;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

public class MainActivity extends Activity {

    private static final String LOCAL_ASSET_URL = "file:///android_asset/www/index.html";
    private static final String GITHUB_PAGES_URL = "https://tranhoang23062007-spec.github.io/TranHoang/";
    private static final int FILE_CHOOSER_REQUEST_CODE = 1001;

    private WebView mainWebView;
    private ValueCallback<Uri[]> filePathCallback;
    private SharedPreferences prefs;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        prefs = getSharedPreferences("tranhoang_prefs", MODE_PRIVATE);

        // Khung gốc chứa giao diện app toàn màn hình + nút nhỏ mở menu Bong bóng
        FrameLayout rootLayout = new FrameLayout(this);
        rootLayout.setBackgroundColor(Color.parseColor("#0F172A"));

        // 1. WebView toàn màn hình chạy giao diện app TranHoang như cũ
        mainWebView = new WebView(this);
        setupMainWebView();
        rootLayout.addView(mainWebView, new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
        ));

        // 2. Nút tròn nhỏ 💬 có thể kéo thả để bật/tắt Bong bóng chat khi cần
        TextView btnBubbleTrigger = createMiniBubbleTrigger();
        int btnSize = dpToPx(46);
        FrameLayout.LayoutParams triggerParams = new FrameLayout.LayoutParams(btnSize, btnSize);
        triggerParams.gravity = Gravity.END | Gravity.CENTER_VERTICAL;
        triggerParams.setMargins(0, 0, dpToPx(12), 0);
        rootLayout.addView(btnBubbleTrigger, triggerParams);

        setContentView(rootLayout);
    }

    private void setupMainWebView() {
        WebSettings settings = mainWebView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);

        mainWebView.addJavascriptInterface(new MainWebBridge(), "AndroidBridge");
        mainWebView.setWebViewClient(new WebViewClient());

        // Hỗ trợ chọn ảnh từ thư viện điện thoại cho thẻ <input type="file">
        mainWebView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> callback, FileChooserParams params) {
                if (filePathCallback != null) {
                    filePathCallback.onReceiveValue(null);
                }
                filePathCallback = callback;
                try {
                    startActivityForResult(params.createIntent(), FILE_CHOOSER_REQUEST_CODE);
                } catch (Exception e) {
                    filePathCallback = null;
                    Toast.makeText(MainActivity.this, "Không thể mở trình chọn tệp", Toast.LENGTH_SHORT).show();
                    return false;
                }
                return true;
            }
        });

        String targetUrl = prefs.getString("web_url", LOCAL_ASSET_URL);
        mainWebView.loadUrl(targetUrl);
    }

    private TextView createMiniBubbleTrigger() {
        TextView btn = new TextView(this);
        btn.setText("💬");
        btn.setTextSize(TypedValue.COMPLEX_UNIT_SP, 18);
        btn.setGravity(Gravity.CENTER);

        GradientDrawable bg = new GradientDrawable();
        bg.setShape(GradientDrawable.OVAL);
        bg.setColor(Color.parseColor("#CC6366F1"));
        bg.setStroke(dpToPx(2), Color.parseColor("#E0E7FF"));
        btn.setBackground(bg);
        btn.setElevation(dpToPx(6));

        // Cho phép kéo thả nút tự do hoặc chạm nhanh để mở bảng điều khiển Bong bóng
        btn.setOnTouchListener(new View.OnTouchListener() {
            private float dX, dY;
            private float startRawX, startRawY;
            private long downTime;

            @Override
            public boolean onTouch(View v, MotionEvent event) {
                switch (event.getAction()) {
                    case MotionEvent.ACTION_DOWN:
                        dX = v.getX() - event.getRawX();
                        dY = v.getY() - event.getRawY();
                        startRawX = event.getRawX();
                        startRawY = event.getRawY();
                        downTime = System.currentTimeMillis();
                        return true;

                    case MotionEvent.ACTION_MOVE:
                        View parent = (View) v.getParent();
                        float newX = Math.max(0, Math.min(event.getRawX() + dX, parent.getWidth() - v.getWidth()));
                        float newY = Math.max(0, Math.min(event.getRawY() + dY, parent.getHeight() - v.getHeight()));
                        v.setX(newX);
                        v.setY(newY);
                        return true;

                    case MotionEvent.ACTION_UP:
                        float moveDist = Math.abs(event.getRawX() - startRawX) + Math.abs(event.getRawY() - startRawY);
                        if (moveDist < 20 && (System.currentTimeMillis() - downTime) < 350) {
                            showBubbleControlDialog();
                        }
                        return true;
                }
                return false;
            }
        });

        return btn;
    }

    // Hộp thoại gọn gàng bật/tắt Bong bóng chat nổi & kiểm tra quyền
    private void showBubbleControlDialog() {
        boolean hasOverlay = Settings.canDrawOverlays(this);
        boolean hasReader = ScreenReaderService.getInstance() != null;
        String currentUrl = prefs.getString("web_url", LOCAL_ASSET_URL);
        boolean isOffline = currentUrl.equals(LOCAL_ASSET_URL);

        LinearLayout container = new LinearLayout(this);
        container.setOrientation(LinearLayout.VERTICAL);
        container.setBackgroundColor(Color.parseColor("#0F172A"));
        int pad = dpToPx(18);
        container.setPadding(pad, pad, pad, pad);

        TextView title = new TextView(this);
        title.setText("Chế độ Bong bóng chat nổi");
        title.setTextColor(Color.WHITE);
        title.setTextSize(TypedValue.COMPLEX_UNIT_SP, 17);
        title.setPadding(0, 0, 0, dpToPx(8));
        container.addView(title);

        TextView status = new TextView(this);
        status.setText(
                (hasOverlay ? "✅ Quyền Hiển thị đè: Đã bật\n" : "❌ Quyền Hiển thị đè: Chưa bật\n") +
                (hasReader ? "✅ Quyền Đọc màn hình: Đang chạy" : "⚠️ Quyền Đọc màn hình: Chưa bật")
        );
        status.setTextColor(Color.parseColor("#CBD5E1"));
        status.setTextSize(TypedValue.COMPLEX_UNIT_SP, 13);
        status.setPadding(0, 0, 0, dpToPx(12));
        container.addView(status);

        final AlertDialog dialog = new AlertDialog.Builder(this)
                .setView(container)
                .create();

        // Nút bật Bong bóng nổi
        Button btnStart = createDialogButton("🚀 Bật Bong bóng chat nổi", "#10B981");
        btnStart.setOnClickListener(v -> {
            if (!Settings.canDrawOverlays(this)) {
                Toast.makeText(this, "Hãy bật quyền Hiển thị đè trước!", Toast.LENGTH_SHORT).show();
                openOverlaySettings();
                dialog.dismiss();
                return;
            }
            Intent serviceIntent = new Intent(this, FloatingBubbleService.class);
            stopService(serviceIntent);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                startForegroundService(serviceIntent);
            } else {
                startService(serviceIntent);
            }
            dialog.dismiss();
            Toast.makeText(this, "Đã bật Bong bóng AI! Hãy chuyển sang app nhắn tin.", Toast.LENGTH_SHORT).show();
            moveTaskToBack(true);
        });
        container.addView(btnStart);

        // Nút tắt Bong bóng nổi
        Button btnStop = createDialogButton("🛑 Tắt Bong bóng nổi", "#EF4444");
        btnStop.setOnClickListener(v -> {
            stopService(new Intent(this, FloatingBubbleService.class));
            dialog.dismiss();
            Toast.makeText(this, "Đã tắt Bong bóng nổi", Toast.LENGTH_SHORT).show();
        });
        container.addView(btnStop);

        // Các nút cấp quyền (chỉ cần làm 1 lần đầu)
        if (!hasOverlay) {
            Button btnOverlay = createDialogButton("1. Cấp quyền Hiển thị đè", "#4F46E5");
            btnOverlay.setOnClickListener(v -> {
                dialog.dismiss();
                openOverlaySettings();
            });
            container.addView(btnOverlay);
        }

        if (!hasReader) {
            Button btnAccess = createDialogButton("2. Bật quyền Đọc màn hình", "#0EA5E9");
            btnAccess.setOnClickListener(v -> {
                dialog.dismiss();
                startActivity(new Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS));
                Toast.makeText(this, "Tìm và bật 'TranHoang Đọc Màn Hình'", Toast.LENGTH_LONG).show();
            });
            container.addView(btnAccess);
        }

        // Chuyển đổi nhanh giữa bản Offline trong máy và bản Online GitHub Pages
        Button btnSwitchSource = createDialogButton(
                isOffline ? "🌐 Chuyển sang bản Online (GitHub Pages)" : "📱 Chuyển sang bản Offline trong APK",
                "#334155"
        );
        btnSwitchSource.setOnClickListener(v -> {
            String nextUrl = isOffline ? GITHUB_PAGES_URL : LOCAL_ASSET_URL;
            prefs.edit().putString("web_url", nextUrl).apply();
            mainWebView.loadUrl(nextUrl);
            dialog.dismiss();
            Toast.makeText(this, isOffline ? "Đã chuyển sang GitHub Pages" : "Đã chuyển sang bản Offline", Toast.LENGTH_SHORT).show();
        });
        container.addView(btnSwitchSource);

        dialog.show();
    }

    private void openOverlaySettings() {
        Intent intent = new Intent(
                Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                Uri.parse("package:" + getPackageName())
        );
        startActivity(intent);
    }

    private Button createDialogButton(String text, String hexColor) {
        Button btn = new Button(this);
        btn.setText(text);
        btn.setTextColor(Color.WHITE);
        btn.setAllCaps(false);
        btn.setTextSize(TypedValue.COMPLEX_UNIT_SP, 14);
        GradientDrawable bg = new GradientDrawable();
        bg.setCornerRadius(dpToPx(10));
        bg.setColor(Color.parseColor(hexColor));
        btn.setBackground(bg);

        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
        );
        lp.setMargins(0, dpToPx(5), 0, dpToPx(5));
        btn.setLayoutParams(lp);
        return btn;
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == FILE_CHOOSER_REQUEST_CODE && filePathCallback != null) {
            Uri[] results = null;
            if (resultCode == Activity.RESULT_OK && data != null) {
                if (data.getClipData() != null) {
                    int count = data.getClipData().getItemCount();
                    results = new Uri[count];
                    for (int i = 0; i < count; i++) {
                        results[i] = data.getClipData().getItemAt(i).getUri();
                    }
                } else if (data.getData() != null) {
                    results = new Uri[]{ data.getData() };
                }
            }
            filePathCallback.onReceiveValue(results);
            filePathCallback = null;
        }
    }

    @Override
    public void onBackPressed() {
        if (mainWebView != null && mainWebView.canGoBack()) {
            mainWebView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    public class MainWebBridge {
        @JavascriptInterface
        public void openBubbleMenu() {
            runOnUiThread(() -> showBubbleControlDialog());
        }

        @JavascriptInterface
        public void copyToClipboard(String text) {
            ClipboardManager cb = (ClipboardManager) getSystemService(Context.CLIPBOARD_SERVICE);
            if (cb != null) {
                cb.setPrimaryClip(ClipData.newPlainText("TranHoangAI", text));
                runOnUiThread(() -> Toast.makeText(MainActivity.this, "Đã sao chép!", Toast.LENGTH_SHORT).show());
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
}