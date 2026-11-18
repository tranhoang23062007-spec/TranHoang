package com.tranhoang.floating;

import android.accessibilityservice.AccessibilityService;
import android.graphics.Bitmap;
import android.graphics.ColorSpace;
import android.graphics.Rect;
import android.hardware.HardwareBuffer;
import android.os.Build;
import android.util.Base64;
import android.util.DisplayMetrics;
import android.view.Display;
import android.view.WindowManager;
import android.view.accessibility.AccessibilityEvent;
import android.view.accessibility.AccessibilityNodeInfo;

import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.Executors;

public class ScreenReaderService extends AccessibilityService {

    private static ScreenReaderService instance;

    public interface CaptureCallback {
        void onResult(String extractedText, String base64Image);
    }

    private static class TextBlock {
        String text;
        int top;
        int centerX;

        TextBlock(String text, int top, int centerX) {
            this.text = text;
            this.top = top;
            this.centerX = centerX;
        }
    }

    public static ScreenReaderService getInstance() {
        return instance;
    }

    @Override
    protected void onServiceConnected() {
        super.onServiceConnected();
        instance = this;
    }

    @Override
    public void onAccessibilityEvent(AccessibilityEvent event) {
        // Chỉ đọc màn hình khi người dùng bấm nút "Quét Màn Hình"
    }

    @Override
    public void onInterrupt() {
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (instance == this) {
            instance = null;
        }
    }

    public void captureCurrentScreen(final CaptureCallback callback) {
        final String screenText = extractFormattedScreenText();

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            try {
                takeScreenshot(Display.DEFAULT_DISPLAY, Executors.newSingleThreadExecutor(), new TakeScreenshotCallback() {
                    @Override
                    public void onSuccess(ScreenshotResult screenshot) {
                        String base64 = "";
                        try {
                            HardwareBuffer buffer = screenshot.getHardwareBuffer();
                            ColorSpace colorSpace = screenshot.getColorSpace();
                            Bitmap hwBitmap = Bitmap.wrapHardwareBuffer(buffer, colorSpace);
                            if (hwBitmap != null) {
                                Bitmap swBitmap = hwBitmap.copy(Bitmap.Config.ARGB_8888, false);
                                hwBitmap.recycle();
                                buffer.close();

                                // Thu nhỏ ảnh vừa phải để gửi Gemini API cực nhanh
                                int targetW = 720;
                                int targetH = (int) ((double) swBitmap.getHeight() / swBitmap.getWidth() * targetW);
                                Bitmap scaled = Bitmap.createScaledBitmap(swBitmap, targetW, targetH, true);
                                swBitmap.recycle();

                                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                                scaled.compress(Bitmap.CompressFormat.JPEG, 75, baos);
                                scaled.recycle();
                                base64 = Base64.encodeToString(baos.toByteArray(), Base64.NO_WRAP);
                            }
                        } catch (Exception ignored) {
                        }
                        callback.onResult(screenText, base64);
                    }

                    @Override
                    public void onFailure(int errorCode) {
                        callback.onResult(screenText, "");
                    }
                });
            } catch (Exception e) {
                callback.onResult(screenText, "");
            }
        } else {
            callback.onResult(screenText, "");
        }
    }

    private String extractFormattedScreenText() {
        AccessibilityNodeInfo root = getRootInActiveWindow();
        if (root == null) return "";

        WindowManager wm = (WindowManager) getSystemService(WINDOW_SERVICE);
        DisplayMetrics dm = new DisplayMetrics();
        wm.getDefaultDisplay().getRealMetrics(dm);
        int screenWidth = dm.widthPixels;
        int screenHeight = dm.heightPixels;

        List<TextBlock> blocks = new ArrayList<>();
        collectTextNodes(root, blocks, screenHeight);
        root.recycle();

        // Sắp xếp đoạn chat theo thứ tự từ trên xuống dưới
        Collections.sort(blocks, new Comparator<TextBlock>() {
            @Override
            public int compare(TextBlock a, TextBlock b) {
                return Integer.compare(a.top, b.top);
            }
        });

        StringBuilder sb = new StringBuilder();
        int midLeft = (int) (screenWidth * 0.44);
        int midRight = (int) (screenWidth * 0.56);

        for (TextBlock b : blocks) {
            String role;
            if (b.centerX < midLeft) {
                role = "[Đối phương]: ";
            } else if (b.centerX > midRight) {
                role = "[Bạn]: ";
            } else {
                role = "";
            }
            sb.append(role).append(b.text).append("\n");
        }
        return sb.toString().trim();
    }

    private void collectTextNodes(AccessibilityNodeInfo node, List<TextBlock> out, int screenHeight) {
        if (node == null || !node.isVisibleToUser()) return;

        CharSequence cs = node.getText();
        if (cs != null) {
            String text = cs.toString().trim();
            if (!text.isEmpty() && text.length() > 1) {
                Rect rect = new Rect();
                node.getBoundsInScreen(rect);
                // Bỏ qua thanh trạng thái trên cùng và thanh điều hướng dưới cùng
                if (rect.top > 60 && rect.bottom < screenHeight - 80) {
                    out.add(new TextBlock(text, rect.top, rect.centerX()));
                }
            }
        }

        int count = node.getChildCount();
        for (int i = 0; i < count; i++) {
            AccessibilityNodeInfo child = node.getChild(i);
            if (child != null) {
                collectTextNodes(child, out, screenHeight);
                child.recycle();
            }
        }
    }
}