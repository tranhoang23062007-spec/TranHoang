/**
 * ============================================================================
 * COMPONENT ĐÍNH KÈM ẢNH / FILE CHAT DÙNG LẠI ĐƯỢC, TIỀN XỬ LÝ CANVAS & QUYỀN RIÊNG TƯ
 * (Mục 1.2, 1.3, 1.4, 1.5, 1.9)
 * ============================================================================
 */

const ATTACHMENT_LIMITS = {
    MAX_IMAGES: 10,
    MAX_DIMENSION: 1280,
    JPEG_QUALITY: 0.82,
    MAX_TXT_CHARS: 30000,
    MAX_TOTAL_REQUEST_BYTES: 15 * 1024 * 1024, // Giới hạn khoảng 15MB tổng request
    ALLOWED_IMAGE_MIMES: ['image/png', 'image/jpeg', 'image/webp'],
    ALLOWED_IMAGE_EXTS: ['.png', '.jpg', '.jpeg', '.webp']
};

// Lưu danh sách các instance đính kèm theo containerId để tái sử dụng toàn app
const attachmentInstances = {};

// Kiểm tra xem file có phải là ảnh PNG/JPG/WebP hợp lệ không
function isAllowedImageFile(file) {
    if (!file) return false;
    const mime = String(file.type || '').toLowerCase();
    const name = String(file.name || '').toLowerCase();
    if (ATTACHMENT_LIMITS.ALLOWED_IMAGE_MIMES.includes(mime)) return true;
    return ATTACHMENT_LIMITS.ALLOWED_IMAGE_EXTS.some(ext => name.endsWith(ext));
}

// Kiểm tra xem file có phải là file văn bản .txt hợp lệ không
function isAllowedTxtFile(file) {
    if (!file) return false;
    const mime = String(file.type || '').toLowerCase();
    const name = String(file.name || '').toLowerCase();
    return mime === 'text/plain' || name.endsWith('.txt');
}

// Định dạng dung lượng byte sang KB / MB dễ đọc
function formatByteSize(bytes) {
    if (!bytes || bytes <= 0) return '0 KB';
    if (bytes < 1024 * 1024) {
        return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Mục 1.9: Hiển thị hộp nhắc quyền riêng tư ngắn gọn khi người dùng tải ảnh lần đầu tiên
 */
function checkAndShowFirstTimePrivacyNotice() {
    try {
        const seen = localStorage.getItem(STORAGE_KEYS.PRIVACY_NOTICE_SEEN);
        if (!seen && typeof openCustomModal === 'function') {
            localStorage.setItem(STORAGE_KEYS.PRIVACY_NOTICE_SEEN, '1');
            openCustomModal({
                title: '🔒 Nhắc nhở quyền riêng tư khi tải ảnh',
                description: 'Bạn có thể che tên hoặc ảnh đại diện của người kia trước khi tải lên nếu muốn. Ảnh chỉ gửi trực tiếp tới Google Gemini API để đọc ngữ cảnh, hoàn toàn KHÔNG lưu vào bộ nhớ ứng dụng. Sau khi dùng xong, bạn có thể bấm nút "Xoá ảnh" bất cứ lúc nào.',
                showInput: false,
                confirmText: 'Đã hiểu',
                onConfirm: () => {}
            });
        }
    } catch (e) {}
}

/**
 * Mục 1.3: Tiền xử lý ảnh bằng <canvas>
 * - Thu nhỏ cạnh dài tối đa 1280px (giữ nguyên tỷ lệ).
 * - Xuất JPEG chất lượng 0.82, chuyển thành base64 (inlineData).
 */
function preprocessImageWithCanvas(file) {
    return new Promise((resolve, reject) => {
        if (!isAllowedImageFile(file)) {
            reject(new Error(`Ảnh "${file?.name || 'không tên'}" sai định dạng. Chỉ nhận ảnh PNG, JPG hoặc WebP.`));
            return;
        }

        const reader = new FileReader();
        reader.onerror = () => reject(new Error(`Không thể đọc tệp ảnh "${file.name}".`));
        reader.onload = (e) => {
            const dataUrlInput = e.target.result;
            const img = new Image();
            img.onerror = () => reject(new Error(`Tệp ảnh "${file.name}" bị lỗi hoặc không hợp lệ.`));
            img.onload = () => {
                const origW = img.naturalWidth || img.width;
                const origH = img.naturalHeight || img.height;
                if (!origW || !origH) {
                    reject(new Error(`Không xác định được kích thước ảnh "${file.name}".`));
                    return;
                }

                // Tính toán kích thước mới sao cho cạnh dài không vượt quá 1280px
                let targetW = origW;
                let targetH = origH;
                const maxSide = Math.max(origW, origH);
                if (maxSide > ATTACHMENT_LIMITS.MAX_DIMENSION) {
                    const scale = ATTACHMENT_LIMITS.MAX_DIMENSION / maxSide;
                    targetW = Math.max(1, Math.round(origW * scale));
                    targetH = Math.max(1, Math.round(origH * scale));
                }

                const canvas = document.createElement('canvas');
                canvas.width = targetW;
                canvas.height = targetH;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Trình duyệt không hỗ trợ xử lý ảnh Canvas.'));
                    return;
                }

                // Tô nền trắng trước khi vẽ để ảnh PNG trong suốt không bị đen nền khi xuất JPEG
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, targetW, targetH);
                ctx.drawImage(img, 0, 0, targetW, targetH);

                const jpegDataUrl = canvas.toDataURL('image/jpeg', ATTACHMENT_LIMITS.JPEG_QUALITY);
                const commaIdx = jpegDataUrl.indexOf(',');
                const base64Data = commaIdx !== -1 ? jpegDataUrl.slice(commaIdx + 1) : '';
                if (!base64Data) {
                    reject(new Error(`Không thể nén ảnh "${file.name}" sang JPEG.`));
                    return;
                }

                // Ước tính kích thước thực tế khi nằm trong JSON request
                const payloadBytes = base64Data.length;

                resolve({
                    id: `att_img_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
                    name: file.name || `anh-chup-${Date.now()}.jpg`,
                    originalWidth: origW,
                    originalHeight: origH,
                    width: targetW,
                    height: targetH,
                    mimeType: 'image/jpeg',
                    base64: base64Data,
                    previewUrl: jpegDataUrl,
                    sizeBytes: payloadBytes
                });
            };
            img.src = dataUrlInput;
        };
        reader.readAsDataURL(file);
    });
}

/**
 * Mục 1.2: Đọc file .txt lịch sử chat bằng FileReader, chỉ lấy tối đa 30.000 ký tự cuối
 */
function readChatHistoryTxtFile(file) {
    return new Promise((resolve, reject) => {
        if (!isAllowedTxtFile(file)) {
            reject(new Error(`Tệp "${file?.name || ''}" không phải định dạng .txt hợp lệ.`));
            return;
        }

        const reader = new FileReader();
        reader.onerror = () => reject(new Error(`Không thể đọc tệp văn bản "${file.name}".`));
        reader.onload = (e) => {
            const rawText = String(e.target.result || '');
            const trimmed = rawText.trim();
            if (!trimmed) {
                reject(new Error(`Tệp "${file.name}" đang trống, không có nội dung chat.`));
                return;
            }

            const originalLength = rawText.length;
            const isTruncated = originalLength > ATTACHMENT_LIMITS.MAX_TXT_CHARS;
            const content = isTruncated
                ? rawText.slice(-ATTACHMENT_LIMITS.MAX_TXT_CHARS)
                : rawText;

            const payloadBytes = new Blob([content]).size;

            resolve({
                id: `att_txt_${Date.now()}`,
                name: file.name || 'lich-su-chat.txt',
                content: content,
                originalLength: originalLength,
                charCount: content.length,
                isTruncated: isTruncated,
                sizeBytes: payloadBytes
            });
        };
        reader.readAsText(file, 'UTF-8');
    });
}

/**
 * Mục 1.4: Tạo dòng text tóm tắt đính kèm để lưu vào apiHistory / localStorage
 * Tuyệt đối KHÔNG lưu chuỗi base64 vào lịch sử.
 */
function buildAttachmentHistorySummary({ imageCount = 0, txtFileName = '', extractedText = '' } = {}) {
    const labels = [];
    if (imageCount > 0) {
        labels.push(`[Người dùng đã gửi ${imageCount} ảnh chụp màn hình chat]`);
    }
    if (txtFileName) {
        labels.push(`[Người dùng đã đính kèm tệp lịch sử chat "${txtFileName}"]`);
    }
    const header = labels.join(' ');
    if (extractedText && String(extractedText).trim()) {
        return `${header}\nNội dung hội thoại đã trích xuất:\n${String(extractedText).trim()}`.trim();
    }
    return header;
}

/**
 * Khởi tạo Component đính kèm dùng lại được cho một vùng giao diện (Mục 1.2, 1.3, 1.5, 1.9)
 * @param {object} options
 * @param {string} options.containerId - ID của phần tử DOM chứa widget
 * @param {string} [options.label] - Tiêu đề hiển thị trên nút/khung
 * @param {boolean} [options.allowTxt=true] - Có cho phép đính kèm file .txt không
 * @param {boolean} [options.showExtractBtn=false] - Có hiển thị nút "📷 Đọc ảnh chat" không (Mục 1.5)
 * @param {function} [options.onExtractChat] - Callback khi bấm nút "📷 Đọc ảnh chat"
 * @param {function} [options.onChange] - Callback mỗi khi danh sách ảnh/file thay đổi
 */
function createAttachmentWidget(options = {}) {
    const {
        containerId,
        label = '📎 Đính kèm ảnh chụp màn hình / file chat (.txt)',
        allowTxt = true,
        showExtractBtn = false,
        onExtractChat = null,
        onChange = null
    } = options;

    const container = document.getElementById(containerId);
    if (!container) return null;

    const state = {
        images: [],    // Tối đa 10 phần tử từ preprocessImageWithCanvas
        txtFile: null, // Tối đa 1 file .txt lịch sử chat
        isProcessing: false
    };

    const fileInputId = `${containerId}_fileInput`;
    const cameraInputId = `${containerId}_cameraInput`;
    const dropzoneId = `${containerId}_dropzone`;
    const previewAreaId = `${containerId}_previewArea`;
    const counterBadgeId = `${containerId}_counterBadge`;
    const clearAllBtnId = `${containerId}_clearAllBtn`;
    const extractBtnId = `${containerId}_extractBtn`;
    const actionBarId = `${containerId}_actionBar`;

    // Tính tổng số byte của toàn bộ đính kèm hiện tại
    function getTotalBytes(extraBytes = 0) {
        const imgBytes = state.images.reduce((sum, item) => sum + (item.sizeBytes || 0), 0);
        const txtBytes = state.txtFile ? (state.txtFile.sizeBytes || 0) : 0;
        return imgBytes + txtBytes + extraBytes;
    }

    function notifyChange() {
        renderPreviewUI();
        if (typeof onChange === 'function') {
            onChange(api);
        }
    }

    // Xử lý danh sách File truyền vào từ Input, Kéo-thả hoặc Dán Clipboard
    async function handleFilesList(fileList) {
        if (!fileList || fileList.length === 0) return;
        const filesArray = Array.from(fileList);

        // Kiểm tra nếu có ít nhất 1 file ảnh thì hiển thị hộp nhắc quyền riêng tư lần đầu (Mục 1.9)
        if (filesArray.some(f => isAllowedImageFile(f))) {
            checkAndShowFirstTimePrivacyNotice();
        }

        state.isProcessing = true;
        renderPreviewUI();

        for (const file of filesArray) {
            try {
                if (isAllowedImageFile(file)) {
                    if (state.images.length >= ATTACHMENT_LIMITS.MAX_IMAGES) {
                        showToast(`Chỉ được đính kèm tối đa ${ATTACHMENT_LIMITS.MAX_IMAGES} ảnh!`, '⚠️');
                        continue;
                    }
                    const processedImg = await preprocessImageWithCanvas(file);
                    if (getTotalBytes(processedImg.sizeBytes) > ATTACHMENT_LIMITS.MAX_TOTAL_REQUEST_BYTES) {
                        showToast('Tổng dung lượng đính kèm vượt quá giới hạn 15MB. Vui lòng xoá bớt ảnh!', '⚠️');
                        continue;
                    }
                    state.images.push(processedImg);
                    showToast(`Đã thêm ảnh "${processedImg.name}" (${processedImg.width}×${processedImg.height}px)`, '🖼️');
                } else if (allowTxt && isAllowedTxtFile(file)) {
                    const processedTxt = await readChatHistoryTxtFile(file);
                    const currentWithoutOldTxt = state.images.reduce((s, i) => s + i.sizeBytes, 0) + processedTxt.sizeBytes;
                    if (currentWithoutOldTxt > ATTACHMENT_LIMITS.MAX_TOTAL_REQUEST_BYTES) {
                        showToast('Tổng dung lượng đính kèm vượt quá giới hạn 15MB!', '⚠️');
                        continue;
                    }
                    state.txtFile = processedTxt;
                    if (processedTxt.isTruncated) {
                        showToast(`Đã đọc "${processedTxt.name}" (lấy 30.000 ký tự cuối cùng)`, '📄');
                    } else {
                        showToast(`Đã đính kèm lịch sử chat "${processedTxt.name}"`, '📄');
                    }
                } else {
                    const supportedMsg = allowTxt
                        ? 'Định dạng không hỗ trợ! Chỉ nhận ảnh PNG, JPG, WebP hoặc file .txt.'
                        : 'Định dạng không hỗ trợ! Chỉ nhận ảnh PNG, JPG hoặc WebP.';
                    showToast(supportedMsg, '⚠️');
                }
            } catch (err) {
                showToast(err.message || 'Lỗi khi xử lý tệp đính kèm.', '⚠️');
            }
        }

        state.isProcessing = false;
        notifyChange();
    }

    // Dựng khung HTML ban đầu cho Widget
    const acceptAttr = allowTxt
        ? 'image/png,image/jpeg,image/webp,.txt,text/plain'
        : 'image/png,image/jpeg,image/webp';

    container.innerHTML = `
        <div class="rounded-xl bg-warm-50/90 dark:bg-stone-900/70 border border-dashed border-warm-300 dark:border-stone-700 p-3 space-y-2.5 transition" id="${dropzoneId}">
            <div class="flex flex-wrap items-center justify-between gap-2">
                <div class="flex items-center gap-1.5">
                    <span class="text-xs font-bold text-stone-700 dark:text-stone-200">${escapeHtml(label)}</span>
                    <span id="${counterBadgeId}" class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-warm-200/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                        0/${ATTACHMENT_LIMITS.MAX_IMAGES} ảnh
                    </span>
                </div>
                <button type="button" id="${clearAllBtnId}" class="hidden px-2 py-0.5 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/60 text-[11px] font-bold text-red-600 dark:text-red-300 border border-red-200 dark:border-red-800/60 transition">
                    🗑️ Xoá ảnh
                </button>
            </div>

            <!-- Các nút thao tác chọn tệp / mở camera / hướng dẫn kéo-thả & dán -->
            <div class="flex flex-wrap items-center gap-2">
                <label for="${fileInputId}" class="cursor-pointer px-3 py-1.5 rounded-xl bg-white dark:bg-stone-800 hover:bg-warm-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 border border-warm-200 dark:border-stone-700 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs">
                    <span>📁</span>
                    <span>Chọn ảnh${allowTxt ? ' / .txt' : ''}</span>
                </label>
                <input id="${fileInputId}" type="file" multiple accept="${acceptAttr}" class="hidden">

                <label for="${cameraInputId}" class="cursor-pointer px-3 py-1.5 rounded-xl bg-white dark:bg-stone-800 hover:bg-warm-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 border border-warm-200 dark:border-stone-700 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs">
                    <span>📸</span>
                    <span>Chụp ảnh</span>
                </label>
                <input id="${cameraInputId}" type="file" accept="image/png,image/jpeg,image/webp" capture="environment" class="hidden">

                <span class="text-[11px] text-stone-400 dark:text-stone-500">
                    Kéo-thả hoặc bấm <kbd class="px-1.5 py-0.5 rounded bg-warm-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-mono text-[10px]">Ctrl+V</kbd> để dán ảnh
                </span>
            </div>

            <!-- Khu vực hiển thị Thumbnail ảnh & Thẻ file .txt -->
            <div id="${previewAreaId}" class="hidden space-y-2 pt-1"></div>

            <!-- Thanh tác vụ "📷 Đọc ảnh chat" & nhắc quyền riêng tư khi có ảnh/file (Mục 1.5 & 1.9) -->
            <div id="${actionBarId}" class="hidden pt-2 border-t border-warm-200/70 dark:border-stone-700/70 space-y-2">
                <div class="flex flex-wrap items-center justify-between gap-2">
                    <p class="text-[11px] text-stone-500 dark:text-stone-400 leading-snug flex-1">
                        🔒 Ảnh chỉ gửi tới Gemini API để đọc chữ, <strong>không lưu trong app</strong>. Bạn có thể che tên/avatar nếu muốn.
                    </p>
                    ${showExtractBtn ? `
                    <button type="button" id="${extractBtnId}" class="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5 flex-shrink-0">
                        <span>📷</span>
                        <span>Đọc ảnh chat</span>
                    </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `;

    const fileInputEl = document.getElementById(fileInputId);
    const cameraInputEl = document.getElementById(cameraInputId);
    const dropzoneEl = document.getElementById(dropzoneId);
    const previewAreaEl = document.getElementById(previewAreaId);
    const counterBadgeEl = document.getElementById(counterBadgeId);
    const clearAllBtnEl = document.getElementById(clearAllBtnId);
    const actionBarEl = document.getElementById(actionBarId);
    const extractBtnEl = document.getElementById(extractBtnId);

    if (extractBtnEl && typeof onExtractChat === 'function') {
        extractBtnEl.addEventListener('click', () => onExtractChat(api, extractBtnEl));
    }

    // Cập nhật giao diện danh sách Thumbnail và file .txt
    function renderPreviewUI() {
        const totalBytes = getTotalBytes();
        const hasAny = state.images.length > 0 || Boolean(state.txtFile);

        counterBadgeEl.textContent = `${state.images.length}/${ATTACHMENT_LIMITS.MAX_IMAGES} ảnh${totalBytes > 0 ? ` • ${formatByteSize(totalBytes)}` : ''}`;
        clearAllBtnEl.classList.toggle('hidden', !hasAny);
        if (actionBarEl) {
            actionBarEl.classList.toggle('hidden', !hasAny);
        }

        if (!hasAny && !state.isProcessing) {
            previewAreaEl.classList.add('hidden');
            previewAreaEl.innerHTML = '';
            return;
        }

        previewAreaEl.classList.remove('hidden');
        let html = '';

        if (state.isProcessing) {
            html += `
                <div class="text-xs text-warm-600 dark:text-amber-400 font-semibold flex items-center gap-1.5 py-1">
                    <span class="animate-spin">⏳</span>
                    <span>Đang thu nhỏ và tối ưu ảnh bằng Canvas...</span>
                </div>
            `;
        }

        // Danh sách thumbnail ảnh
        if (state.images.length > 0) {
            html += `<div class="grid grid-cols-4 sm:grid-cols-5 gap-1.5 sm:gap-2 max-h-48 overflow-y-auto pr-0.5">`;
            state.images.forEach((img, idx) => {
                html += `
                    <div class="relative group rounded-xl overflow-hidden border border-warm-200 dark:border-stone-700 bg-stone-900 aspect-square shadow-xs">
                        <img src="${img.previewUrl}" alt="${escapeHtml(img.name)}" class="w-full h-full object-cover">
                        <div class="absolute inset-x-0 bottom-0 bg-black/65 text-white text-[9px] px-1.5 py-0.5 truncate font-mono">
                            #${idx + 1} • ${img.width}×${img.height}
                        </div>
                        <button type="button" data-remove-img="${img.id}" class="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600/90 hover:bg-red-700 text-white text-xs font-extrabold flex items-center justify-center shadow-md transition" title="Xoá ảnh này">
                            ✕
                        </button>
                    </div>
                `;
            });
            html += `</div>`;
        }

        // Thẻ hiển thị file .txt lịch sử chat
        if (state.txtFile) {
            const t = state.txtFile;
            const previewSnippet = t.content.slice(-180).replace(/\s+/g, ' ').trim();
            html += `
                <div class="p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-warm-200 dark:border-stone-700 flex items-start justify-between gap-2 text-xs">
                    <div class="space-y-0.5 min-w-0 flex-1">
                        <div class="font-bold text-stone-800 dark:text-stone-100 flex items-center gap-1.5 truncate">
                            <span>📄</span>
                            <span class="truncate">${escapeHtml(t.name)}</span>
                            <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-warm-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 flex-shrink-0">
                                ${t.charCount.toLocaleString('vi-VN')} ký tự${t.isTruncated ? ' (đã cắt 30.000 ký tự cuối)' : ''}
                            </span>
                        </div>
                        <p class="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                            Đoạn cuối: "${escapeHtml(previewSnippet)}"
                        </p>
                    </div>
                    <button type="button" data-remove-txt="true" class="px-2 py-1 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-300 font-bold text-xs flex-shrink-0 transition" title="Xoá file .txt">
                        ✕
                    </button>
                </div>
            `;
        }

        previewAreaEl.innerHTML = html;

        // Gắn sự kiện xoá từng ảnh
        previewAreaEl.querySelectorAll('button[data-remove-img]').forEach(btn => {
            btn.addEventListener('click', () => {
                const imgId = btn.getAttribute('data-remove-img');
                state.images = state.images.filter(item => item.id !== imgId);
                notifyChange();
                showToast('Đã xoá ảnh đính kèm', '🗑️');
            });
        });

        // Gắn sự kiện xoá file .txt
        const removeTxtBtn = previewAreaEl.querySelector('button[data-remove-txt]');
        if (removeTxtBtn) {
            removeTxtBtn.addEventListener('click', () => {
                state.txtFile = null;
                notifyChange();
                showToast('Đã xoá tệp lịch sử chat .txt', '🗑️');
            });
        }
    }

    // Sự kiện chọn file từ hộp thoại
    fileInputEl.addEventListener('change', async (e) => {
        await handleFilesList(e.target.files);
        fileInputEl.value = '';
    });

    cameraInputEl.addEventListener('change', async (e) => {
        await handleFilesList(e.target.files);
        cameraInputEl.value = '';
    });

    // Sự kiện Kéo - Thả (Drag & Drop)
    dropzoneEl.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzoneEl.classList.add('ring-2', 'ring-warm-500', 'bg-warm-100/80');
    });

    dropzoneEl.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzoneEl.classList.remove('ring-2', 'ring-warm-500', 'bg-warm-100/80');
    });

    dropzoneEl.addEventListener('drop', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzoneEl.classList.remove('ring-2', 'ring-warm-500', 'bg-warm-100/80');
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            await handleFilesList(e.dataTransfer.files);
        }
    });

    // Nút xoá tất cả ảnh/file (Mục 1.9)
    clearAllBtnEl.addEventListener('click', () => {
        api.clearAll(false);
    });

    const api = {
        containerId,
        getImages: () => [...state.images],
        getTextFile: () => (state.txtFile ? { ...state.txtFile } : null),
        hasAttachments: () => state.images.length > 0 || Boolean(state.txtFile),
        getTotalBytes: () => getTotalBytes(),
        handleFilesList,
        // Tạo mảng extraParts chuẩn để truyền vào callGemini / callGeminiWithSchemaRetry (Mục 1.4)
        toExtraParts: () => {
            const parts = [];
            state.images.forEach(img => {
                parts.push({
                    inlineData: {
                        mimeType: img.mimeType,
                        data: img.base64
                    }
                });
            });
            if (state.txtFile && state.txtFile.content) {
                parts.push({
                    text: `[Lịch sử chat từ tệp "${state.txtFile.name}" (${state.txtFile.charCount} ký tự)]:\n${state.txtFile.content}`
                });
            }
            return parts;
        },
        // Tạo dòng text mô tả an toàn (không chứa base64) để lưu vào apiHistory / localStorage (Mục 1.4)
        getHistorySummaryText: (extractedConversationText = '') => {
            return buildAttachmentHistorySummary({
                imageCount: state.images.length,
                txtFileName: state.txtFile ? state.txtFile.name : '',
                extractedText: extractedConversationText
            });
        },
        clearAll: (silent = true) => {
            state.images = [];
            state.txtFile = null;
            notifyChange();
            if (!silent) {
                showToast('Đã xoá ảnh & tệp đính kèm khỏi bộ nhớ tạm', '🧹');
            }
        }
    };

    attachmentInstances[containerId] = api;
    return api;
}

// Lấy instance đính kèm theo containerId
function getAttachmentWidget(containerId) {
    return attachmentInstances[containerId] || null;
}

// Lắng nghe sự kiện Dán ảnh từ Clipboard (Ctrl+V / Paste) toàn trang và chuyển vào tab đang mở
window.addEventListener('paste', async (e) => {
    const clipboardItems = e.clipboardData?.items;
    if (!clipboardItems || clipboardItems.length === 0) return;

    const pastedFiles = [];
    for (const item of clipboardItems) {
        if (item.kind === 'file') {
            const file = item.getAsFile();
            if (file && (isAllowedImageFile(file) || isAllowedTxtFile(file))) {
                pastedFiles.push(file);
            }
        }
    }
    if (pastedFiles.length === 0) return;

    // Xác định widget đính kèm đang hiển thị trên màn hình hiện tại
    const activeWidget = Object.values(attachmentInstances).find(inst => {
        const el = document.getElementById(inst.containerId);
        return el && el.offsetParent !== null;
    });

    if (activeWidget) {
        e.preventDefault();
        await activeWidget.handleFilesList(pastedFiles);
    }
});