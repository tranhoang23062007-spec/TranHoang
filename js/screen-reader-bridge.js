// js/screen-reader-bridge.js
(function () {
  // Hàm chuyển Base64 từ Android thành File object để tự động gắn vào <input type="file">
  function base64ToFile(base64Data, filename) {
    try {
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      return new File([byteArray], filename, { type: "image/jpeg" });
    } catch (e) {
      console.error("Lỗi chuyển đổi ảnh chụp màn hình:", e);
      return null;
    }
  }

  // Hàm được Vỏ Android tự động gọi ngay sau khi bấm nút "🎯 Quét Màn Hình"
  window.onAndroidScreenCaptured = function (payload) {
    if (!payload) return;

    // 1. Tự động điền nội dung hội thoại quét được vào ô textarea đang hiển thị
    if (payload.text) {
      const textareas = Array.from(document.querySelectorAll("textarea, input[type='text']"));
      const targetInput = textareas.find((el) => el.offsetParent !== null) || textareas[0];

      if (targetInput) {
        targetInput.value = payload.text;
        targetInput.dispatchEvent(new Event("input", { bubbles: true }));
        targetInput.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }

    // 2. Tự động đính kèm ảnh chụp màn hình vào <input type="file"> (nếu web có ô tải ảnh)
    if (payload.base64Image) {
      const fileInputs = Array.from(document.querySelectorAll("input[type='file']"));
      const targetFileInput = fileInputs[0];
      const imageFile = base64ToFile(payload.base64Image, "screen_chat.jpg");

      if (targetFileInput && imageFile) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(imageFile);
        targetFileInput.files = dataTransfer.files;
        targetFileInput.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }

    // 3. Phát sự kiện tùy chỉnh để các file JS khác trong app có thể lắng nghe nếu cần
    window.dispatchEvent(new CustomEvent("tranhoang:screen-captured", { detail: payload }));
  };

  // Đồng bộ hàm copy trên WebView Android
  if (window.AndroidBridge && navigator.clipboard) {
    const originalWriteText = navigator.clipboard.writeText.bind(navigator.clipboard);
    navigator.clipboard.writeText = async function (text) {
      window.AndroidBridge.copyToClipboard(text);
      try {
        return await originalWriteText(text);
      } catch (_) {
        return Promise.resolve();
      }
    };
  }
})();