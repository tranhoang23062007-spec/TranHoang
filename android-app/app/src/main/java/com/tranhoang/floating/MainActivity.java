package com.tranhoang.floating;

import android.app.Activity;
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
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

public class MainActivity extends Activity {

    private TextView statusOverlay;
    private TextView statusAccessibility;
    private EditText urlInput;

    private static final String LOCAL_ASSET_URL = "file:///android_asset/www/index.html";
    private static final String GITHUB_PAGES_URL = "https://tranhoang23062007-spec.github.io/TranHoang/";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        ScrollView scrollView = new ScrollView(this);
        scrollView.setBackgroundColor(Color.parseColor("#0F172A"));

        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);
        int pad = dpToPx(20);
        layout.setPadding(pad, dpToPx(36), pad, pad);

        TextView title = new TextView(this);
        title.setText("TranHoang Floating AI");
        title.setTextColor(Color.WHITE);
        title.setTextSize(TypedValue.COMPLEX_UNIT_SP, 22);
        layout.addView(title);

        TextView subtitle = new TextView(this);
        subtitle.setText("Bong bóng nổi đọc màn hình trực tiếp & gợi ý tin nhắn");
        subtitle.setTextColor(Color.parseColor("#94A3B8"));
        subtitle.setTextSize(TypedValue.COMPLEX_UNIT_SP, 14);
        subtitle.setPadding(0, dpToPx(4), 0, dpToPx(24));
        layout.addView(subtitle);

        // Bước 1: Quyền hiển thị đè
        statusOverlay = createStatusText();
        layout.addView(statusOverlay);

        Button btnOverlay = createActionButton("1. Cấp quyền Hiển thị đè lên ứng dụng khác", "#4F46E5");
        btnOverlay.setOnClickListener(v -> {
            Intent intent = new Intent(
                    Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                    Uri.parse("package:" + getPackageName())
            );
            startActivity(intent);
        });
        layout.addView(btnOverlay);

        // Bước 2: Quyền Accessibility đọc màn hình
        statusAccessibility = createStatusText();
        layout.addView(statusAccessibility);

        Button btnAccess = createActionButton("2. Bật dịch vụ 'TranHoang Đọc Màn Hình'", "#0EA5E9");
        btnAccess.setOnClickListener(v -> {
            Intent intent = new Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS);
            startActivity(intent);
            Toast.makeText(this, "Tìm và bật 'TranHoang Đọc Màn Hình' trong danh sách", Toast.LENGTH_LONG).show();
        });
        layout.addView(btnAccess);

        // Nguồn giao diện Web
        TextView urlLabel = new TextView(this);
        urlLabel.setText("Nguồn giao diện Web (Offline trong APK hoặc GitHub Pages):");
        urlLabel.setTextColor(Color.parseColor("#CBD5E1"));
        urlLabel.setPadding(0, dpToPx(20), 0, dpToPx(6));
        layout.addView(urlLabel);

        SharedPreferences prefs = getSharedPreferences("tranhoang_prefs", MODE_PRIVATE);
        urlInput = new EditText(this);
        urlInput.setText(prefs.getString("web_url", LOCAL_ASSET_URL));
        urlInput.setTextColor(Color.WHITE);
        urlInput.setBackgroundColor(Color.parseColor("#1E293B"));
        urlInput.setPadding(dpToPx(12), dpToPx(10), dpToPx(12), dpToPx(10));
        layout.addView(urlInput);

        LinearLayout switchRow = new LinearLayout(this);
        switchRow.setOrientation(LinearLayout.HORIZONTAL);
        Button btnUseOffline = createActionButton("Dùng bản Offline", "#334155");
        btnUseOffline.setOnClickListener(v -> urlInput.setText(LOCAL_ASSET_URL));
        Button btnUseOnline = createActionButton("Dùng GitHub Pages", "#334155");
        btnUseOnline.setOnClickListener(v -> urlInput.setText(GITHUB_PAGES_URL));
        switchRow.addView(btnUseOffline, new LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f));
        switchRow.addView(btnUseOnline, new LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f));
        layout.addView(switchRow);

        // Bước 3: Bật / Tắt Bong bóng nổi
        Button btnStart = createActionButton("🚀 KHỞI ĐỘNG BONG BÓNG NỔI", "#10B981");
        btnStart.setOnClickListener(v -> {
            if (!Settings.canDrawOverlays(this)) {
                Toast.makeText(this, "Bạn cần cấp quyền Hiển thị đè ở Bước 1 trước!", Toast.LENGTH_SHORT).show();
                return;
            }
            prefs.edit().putString("web_url", urlInput.getText().toString().trim()).apply();
            Intent serviceIntent = new Intent(this, FloatingBubbleService.class);
            stopService(serviceIntent);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                startForegroundService(serviceIntent);
            } else {
                startService(serviceIntent);
            }
            Toast.makeText(this, "Đã bật Bong bóng AI! Hãy mở ứng dụng chat của bạn.", Toast.LENGTH_SHORT).show();
            moveTaskToBack(true);
        });
        layout.addView(btnStart);

        Button btnStop = createActionButton("🛑 Tắt Bong Bóng Nổi", "#EF4444");
        btnStop.setOnClickListener(v -> {
            stopService(new Intent(this, FloatingBubbleService.class));
            Toast.makeText(this, "Đã tắt Bong bóng nổi", Toast.LENGTH_SHORT).show();
        });
        layout.addView(btnStop);

        scrollView.addView(layout);
        setContentView(scrollView);
    }

    @Override
    protected void onResume() {
        super.onResume();
        boolean hasOverlay = Settings.canDrawOverlays(this);
        statusOverlay.setText(hasOverlay
                ? "✅ Trạng thái Quyền Hiển thị đè: ĐÃ CẤP"
                : "❌ Trạng thái Quyền Hiển thị đè: CHƯA CẤP");
        statusOverlay.setTextColor(hasOverlay ? Color.parseColor("#34D399") : Color.parseColor("#F87171"));

        boolean hasAccess = ScreenReaderService.getInstance() != null;
        statusAccessibility.setText(hasAccess
                ? "✅ Trạng thái Đọc màn hình: ĐANG HOẠT ĐỘNG"
                : "⚠️ Trạng thái Đọc màn hình: CHƯA BẬT");
        statusAccessibility.setTextColor(hasAccess ? Color.parseColor("#34D399") : Color.parseColor("#FBBF24"));
    }

    private TextView createStatusText() {
        TextView tv = new TextView(this);
        tv.setTextSize(TypedValue.COMPLEX_UNIT_SP, 14);
        tv.setPadding(0, dpToPx(14), 0, dpToPx(6));
        return tv;
    }

    private Button createActionButton(String text, String hexColor) {
        Button btn = new Button(this);
        btn.setText(text);
        btn.setTextColor(Color.WHITE);
        btn.setAllCaps(false);
        btn.setGravity(Gravity.CENTER);
        GradientDrawable bg = new GradientDrawable();
        bg.setCornerRadius(dpToPx(10));
        bg.setColor(Color.parseColor(hexColor));
        btn.setBackground(bg);

        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
        );
        lp.setMargins(dpToPx(4), dpToPx(6), dpToPx(4), dpToPx(6));
        btn.setLayoutParams(lp);
        return btn;
    }

    private int dpToPx(int dp) {
        return (int) TypedValue.applyDimension(
                TypedValue.COMPLEX_UNIT_DIP,
                dp,
                getResources().getDisplayMetrics()
        );
    }
}