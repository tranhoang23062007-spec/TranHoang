/**
 * ============================================================================
 * 7. QUẢN LÝ GIAO DIỆN THREADS, TRÍCH XUẤT ẢNH CHAT & XỬ LÝ CHẾ ĐỘ A
 * (Mục 1.5, 1.6, 1.7, 1.8, 1.9)
 * ============================================================================
 */

// Trạng thái tạm giữ bản trích xuất từ "📷 Đọc ảnh chat" để người dùng chỉnh sửa trước khi xác nhận (Mục 1.5)
let pendingExtractionDraft = null; // { platformGuess, uncertain: [], messages: [] }

function renderThreadsBarUI() {
    const bar = document.getElementById('threadListBar');
    const activeThread = getActiveThread();

    bar.innerHTML = appState.threads.map(thread => {
        const isActive = thread.id === activeThread.id;
        const msgCount = Array.isArray(thread.messages) ? thread.messages.length : 0;
        const turnCount = Math.floor((thread.apiHistory || []).length / 2);
        const badgeCount = msgCount > 0 ? `${msgCount} tin` : `${turnCount}`;
        const btnStyle = isActive
            ? 'bg-warm-500 text-white border-warm-500 font-bold shadow-xs'
            : 'bg-warm-50 dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-warm-200 dark:border-stone-700 hover:bg-warm-100 dark:hover:bg-stone-700 font-medium';

        return `
            <button type="button" data-thread-id="${escapeHtml(thread.id)}" class="thread-pill-btn flex-shrink-0 px-3 py-1.5 rounded-xl text-xs border transition flex items-center gap-1.5 ${btnStyle}">
                <span class="truncate max-w-[130px]">${escapeHtml(thread.name)}</span>
                <span class="text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-black/20 text-white' : 'bg-warm-200/80 dark:bg-stone-700 text-stone-600 dark:text-stone-400'}">${escapeHtml(badgeCount)}</span>
            </button>
        `;
    }).join('');

    bar.querySelectorAll('.thread-pill-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-thread-id');
            if (targetId && targetId !== appState.activeThreadId) {
                appState.activeThreadId = targetId;
                pendingExtractionDraft = null;
                saveThreadsToStorage();
                syncModeAUIFromActiveThread();
            }
        });
    });

    const activeTurns = Math.floor((activeThread.apiHistory || []).length / 2);
    const savedMsgCount = Array.isArray(activeThread.messages) ? activeThread.messages.length : 0;
    document.getElementById('activeThreadSummary').textContent =
        `Đang chọn "${activeThread.name}" • ${savedMsgCount} tin đã lưu • ${activeTurns} lượt gợi ý`;

    const msgCountBadge = document.getElementById('threadSavedMsgCountBadge');
    if (msgCountBadge) {
        msgCountBadge.textContent = `${savedMsgCount} tin (gửi kèm tối đa 40 tin gần nhất)`;
    }
}

/**
 * Mục 1.6: Hiển thị danh sách `thread.messages[]` đã lưu trong cuộc trò chuyện hiện tại
 * Cho phép xem lại, đổi người gửi, xoá từng tin hoặc thêm nhanh tin nhắn.
 */
function renderThreadStructuredMessagesUI() {
    const container = document.getElementById('threadMessagesListContainer');
    if (!container) return;

    const thread = getActiveThread();
    const msgs = Array.isArray(thread.messages) ? thread.messages : [];

    const countBadge = document.getElementById('threadSavedMsgCountBadge');
    if (countBadge) {
        countBadge.textContent = `${msgs.length} tin (gửi kèm tối đa 40 tin gần nhất)`;
    }

    if (msgs.length === 0) {
        container.innerHTML = `
            <p class="text-[11px] text-stone-400 dark:text-stone-500 text-center py-2">
                Chưa có tin nhắn cấu trúc nào được lưu. Bạn có thể bấm <strong>"📷 Đọc ảnh chat"</strong> rồi bấm <strong>"Thêm vào cuộc trò chuyện này"</strong>, hoặc khi gợi ý trả lời hệ thống sẽ tự lưu mạch tin.
            </p>
        `;
        return;
    }

    const recentMsgs = msgs.slice(-40);
    let html = `<div class="space-y-1.5 max-h-56 overflow-y-auto pr-1">`;
    recentMsgs.forEach((m, idx) => {
        const realIdx = msgs.length - recentMsgs.length + idx;
        const isMe = m.sender === 'me';
        const isUnknown = m.sender === 'unknown';
        const alignClass = isMe ? 'justify-end' : 'justify-start';
        const bubbleClass = isMe
            ? 'bg-warm-500 text-white rounded-2xl rounded-br-xs'
            : isUnknown
            ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 rounded-2xl'
            : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 border border-warm-200 dark:border-stone-700 rounded-2xl rounded-bl-xs';

        const senderLabel = isMe ? '🧑 Tôi' : isUnknown ? '❓ Chưa rõ' : '👩 Cô ấy';
        const sourceBadge = m.source === 'screenshot' ? '📷 ảnh' : '⌨️ nhập';

        html += `
            <div class="flex ${alignClass} items-end gap-1.5 text-xs">
                <div class="max-w-[85%] px-3 py-1.5 ${bubbleClass} shadow-2xs space-y-0.5">
                    <div class="flex items-center justify-between gap-2 text-[10px] opacity-80 font-semibold">
                        <span>${senderLabel} • ${sourceBadge}${m.time ? ` • ${escapeHtml(m.time)}` : ''}</span>
                        <button type="button" data-del-thread-msg="${realIdx}" class="hover:underline text-[10px]" title="Xoá tin này">✕</button>
                    </div>
                    <div class="leading-snug break-words">${escapeHtml(m.text)}</div>
                    ${m.note ? `<div class="text-[10px] italic opacity-75">(${escapeHtml(m.note)})</div>` : ''}
                </div>
            </div>
        `;
    });
    html += `</div>`;
    container.innerHTML = html;

    container.querySelectorAll('button[data-del-thread-msg]').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.getAttribute('data-del-thread-msg'), 10);
            if (!Number.isNaN(idx) && thread.messages[idx]) {
                thread.messages.splice(idx, 1);
                saveThreadsToStorage();
                renderThreadsBarUI();
                renderThreadStructuredMessagesUI();
            }
        });
    });
}

function syncModeAUIFromActiveThread() {
    renderThreadsBarUI();
    renderThreadStructuredMessagesUI();
    renderExtractChatEditorUI();

    const thread = getActiveThread();

    document.getElementById('herMessageInput').value = thread.lastInput || '';
    document.getElementById('extraContextInput').value = thread.lastNote || '';

    document.getElementById('abbrevSliderA').value = thread.abbrevLevel || 2;
    document.getElementById('humorSliderA').value = thread.humorLevel || 2;
    updateSlidersLabelModeA();

    highlightChipGroup('ctxWhereGroup', thread.where);
    highlightChipGroup('ctxClosenessGroup', thread.closeness);
    highlightChipGroup('ctxGoalGroup', thread.goal);
    highlightChipGroup('pronounGroupA', thread.pronoun);

    const resultArea = document.getElementById('modeAResultArea');
    if (thread.lastResult) {
        renderModeAResult(thread.lastResult);
    } else {
        resultArea.innerHTML = '';
    }
}

function updateSlidersLabelModeA() {
    const thread = getActiveThread();
    const abbrevMap = { 1: 'Ít (viết đầy đủ)', 2: 'Vừa phải (ko, dc, vs)', 3: 'Nhiều (nma, bh, j, r)' };
    const humorMap = { 1: 'Điềm đạm / Chân thành', 2: 'Tự nhiên', 3: 'Vui vẻ / Hay trêu' };
    document.getElementById('abbrevLabelA').textContent = abbrevMap[thread.abbrevLevel] || 'Vừa phải';
    document.getElementById('humorLabelA').textContent = humorMap[thread.humorLevel] || 'Tự nhiên';
}

/**
 * Mục 1.5: Đọc và trích xuất hội thoại từ ảnh chụp màn hình / file .txt
 * Gọi Gemini với SCHEMA_EXTRACT_CHAT rồi mở trình chỉnh sửa bong bóng.
 */
async function handleExtractChatFromAttachments(widgetApi, triggerBtn) {
    const widget = widgetApi || window.modeAAttachments;
    if (!widget || !widget.hasAttachments()) {
        showToast('Hãy chọn hoặc dán ít nhất 1 ảnh chụp màn hình / file chat trước nhé!', '📷');
        return;
    }

    const editorArea = document.getElementById('modeAExtractEditorArea');
    const oldBtnHtml = triggerBtn ? triggerBtn.innerHTML : '';
    if (triggerBtn) {
        triggerBtn.disabled = true;
        triggerBtn.innerHTML = `<span class="animate-spin">⏳</span><span>Đang đọc ảnh...</span>`;
    }

    if (editorArea) {
        editorArea.classList.remove('hidden');
        editorArea.innerHTML = `
            <div class="rounded-2xl bg-amber-50/90 dark:bg-stone-800 border border-amber-300 dark:border-stone-700 p-4 text-center space-y-2 animate-pop">
                <div class="text-xs font-bold text-amber-800 dark:text-amber-300">📷 AI đang đọc từng bong bóng chat trong ảnh...</div>
                <p class="text-[11px] text-stone-500 dark:text-stone-400">Vui lòng đợi vài giây để trích xuất và kiểm tra người gửi.</p>
            </div>
        `;
    }

    try {
        const extraParts = widget.toExtraParts();
        const userInstruction = `Hãy đọc ảnh chụp màn hình / tệp đính kèm này và trích xuất toàn bộ hội thoại theo thứ tự từ trên xuống dưới. Lưu ý: bong bóng bên phải thường là "me" (tôi), bên trái là "her" (cô ấy). Chỉ trả về JSON đúng Schema.`;

        const { parsed } = await callGeminiWithSchemaRetry(
            SYSTEM_PROMPT_EXTRACT_CHAT,
            [],
            userInstruction,
            SCHEMA_EXTRACT_CHAT,
            validateExtractChatJson,
            { temperature: 0.25, extraParts: extraParts }
        );

        pendingExtractionDraft = {
            platformGuess: parsed.platformGuess || 'Ứng dụng chat',
            uncertain: Array.isArray(parsed.uncertain) ? parsed.uncertain : [],
            messages: (parsed.messages || []).map(m => ({
                sender: ['her', 'me', 'unknown'].includes(m.sender) ? m.sender : 'unknown',
                text: String(m.text || '').trim(),
                time: String(m.time || '').trim(),
                note: String(m.note || '').trim(),
                source: 'screenshot'
            }))
        };

        if (pendingExtractionDraft.messages.length === 0) {
            pendingExtractionDraft.messages.push({
                sender: 'her',
                text: '',
                time: '',
                note: '',
                source: 'screenshot'
            });
        }

        renderExtractChatEditorUI();
        showToast(`Đã đọc được ${pendingExtractionDraft.messages.length} tin nhắn! Hãy kiểm tra và xác nhận nhé.`, '📷');
    } catch (err) {
        if (editorArea) {
            renderErrorCard('modeAExtractEditorArea', `Không thể đọc ảnh chat: ${err.message}`);
        }
    } finally {
        if (triggerBtn) {
            triggerBtn.disabled = false;
            triggerBtn.innerHTML = oldBtnHtml || `<span>📷</span><span>Đọc ảnh chat</span>`;
        }
    }
}

/**
 * Mục 1.5 & 1.6: Hiển thị bong bóng hội thoại CHỈNH SỬA ĐƯỢC
 * - Đổi người gửi (her / me / unknown)
 * - Đảo chiều nhanh toàn bộ người gửi (Tôi ↔ Cô ấy)
 * - Sửa chữ, thời gian, ghi chú, xoá dòng, thêm dòng
 * - Nút "✅ Thêm vào cuộc trò chuyện này" và nút "🗑️ Xoá ảnh" (Mục 1.9)
 */
function renderExtractChatEditorUI() {
    const editorArea = document.getElementById('modeAExtractEditorArea');
    if (!editorArea) return;

    if (!pendingExtractionDraft) {
        editorArea.classList.add('hidden');
        editorArea.innerHTML = '';
        return;
    }

    editorArea.classList.remove('hidden');
    const { platformGuess, uncertain, messages } = pendingExtractionDraft;

    // Kiểm tra người gửi của tin nhắn cuối cùng để nhắc người dùng (Mục 1.7)
    const lastMsg = messages.length > 0 ? messages[messages.length - 1] : null;
    const lastSenderBanner = lastMsg
        ? lastMsg.sender === 'me'
            ? `<div class="p-2.5 rounded-xl bg-amber-100/90 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-[11px] text-amber-900 dark:text-amber-200 font-semibold">
                ℹ️ <strong>Tin cuối cùng đang là của BẠN ("Tôi"):</strong> Khi bấm gợi ý, AI sẽ lưu ý bạn nên kiên nhẫn chờ cô ấy trả lời hoặc gợi ý tin nhắn mở lại mạch chuyện sau một khoảng nghỉ hợp lý.
               </div>`
            : `<div class="p-2.5 rounded-xl bg-emerald-50/90 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-900 dark:text-emerald-200 font-semibold">
                💌 <strong>Tin cuối cùng là của Cô ấy:</strong> "${escapeHtml(lastMsg.text)}" — Sẵn sàng để AI gợi ý 3 phương án trả lời!
               </div>`
        : '';

    const uncertainHtml = uncertain && uncertain.length > 0
        ? `
            <div class="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700 text-[11px] text-amber-900 dark:text-amber-200 space-y-1">
                <div class="font-bold">⚠️ Đoạn AI đọc chưa chắc chắn 100% (bạn hãy kiểm tra lại chữ nhé):</div>
                <ul class="list-disc list-inside space-y-0.5">
                    ${uncertain.map(u => `<li>${escapeHtml(u)}</li>`).join('')}
                </ul>
            </div>
        `
        : '';

    let bubblesHtml = '';
    messages.forEach((m, idx) => {
        const isMe = m.sender === 'me';
        const isUnknown = m.sender === 'unknown';
        const rowAlign = isMe ? 'items-end' : 'items-start';
        const cardTint = isMe
            ? 'bg-warm-100/90 dark:bg-warm-950/40 border-warm-300 dark:border-warm-800'
            : isUnknown
            ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800'
            : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700';

        bubblesHtml += `
            <div class="flex flex-col ${rowAlign} w-full">
                <div class="w-full sm:w-[92%] rounded-2xl border p-2.5 space-y-2 shadow-2xs ${cardTint}">
                    <div class="flex flex-wrap items-center justify-between gap-1.5">
                        <div class="flex items-center gap-1">
                            <span class="text-[10px] font-mono text-stone-400">#${idx + 1}</span>
                            <select data-edit-sender="${idx}" class="rounded-lg bg-warm-50 dark:bg-stone-800 border border-warm-200 dark:border-stone-600 px-2 py-1 text-[11px] font-bold text-stone-800 dark:text-stone-100 focus:outline-none">
                                <option value="her" ${m.sender === 'her' ? 'selected' : ''}>👩 Cô ấy (Trái)</option>
                                <option value="me" ${m.sender === 'me' ? 'selected' : ''}>🧑 Tôi (Phải)</option>
                                <option value="unknown" ${m.sender === 'unknown' ? 'selected' : ''}>❓ Chưa rõ</option>
                            </select>
                        </div>

                        <div class="flex items-center gap-1">
                            <input type="text" data-edit-time="${idx}" value="${escapeHtml(m.time || '')}" placeholder="Giờ (vd 21:05)" class="w-24 rounded-lg bg-warm-50 dark:bg-stone-800 border border-warm-200 dark:border-stone-700 px-2 py-0.5 text-[10px] text-stone-700 dark:text-stone-300">
                            <input type="text" data-edit-note="${idx}" value="${escapeHtml(m.note || '')}" placeholder="Ghi chú (sticker/ảnh)" class="w-28 rounded-lg bg-warm-50 dark:bg-stone-800 border border-warm-200 dark:border-stone-700 px-2 py-0.5 text-[10px] text-stone-700 dark:text-stone-300">
                            <button type="button" data-del-extract-row="${idx}" class="p-1 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-300 text-xs font-bold" title="Xoá dòng này">
                                ✕
                            </button>
                        </div>
                    </div>

                    <textarea data-edit-text="${idx}" rows="2" class="w-full rounded-xl bg-white/90 dark:bg-stone-800/90 border border-warm-200 dark:border-stone-700 p-2 text-xs text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-warm-500 resize-none">${escapeHtml(m.text || '')}</textarea>
                </div>
            </div>
        `;
    });

    editorArea.innerHTML = `
        <div class="rounded-2xl bg-warm-100/60 dark:bg-stone-900/90 border-2 border-warm-300 dark:border-stone-700 p-3.5 space-y-3 animate-pop">
            <div class="flex flex-wrap items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                    <span class="text-sm">📷</span>
                    <div>
                        <h3 class="text-xs font-extrabold text-stone-800 dark:text-stone-100">
                            Kiểm tra & Chỉnh sửa hội thoại trích xuất
                        </h3>
                        <p class="text-[11px] text-stone-500 dark:text-stone-400">
                            Bong bóng bên phải thường là <strong>"Tôi"</strong>, bên trái là <strong>"Cô ấy"</strong>. Hãy xác nhận lại trước khi thêm vào cuộc trò chuyện.
                        </p>
                    </div>
                </div>
                <span class="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white dark:bg-stone-800 border border-warm-200 dark:border-stone-700 text-stone-700 dark:text-stone-200">
                    📱 Nền tảng: ${escapeHtml(platformGuess)}
                </span>
            </div>

            ${uncertainHtml}

            <div class="flex flex-wrap items-center gap-1.5">
                <button type="button" id="btnSwapExtractedSenders" class="px-2.5 py-1 rounded-lg bg-white hover:bg-warm-100 dark:bg-stone-800 dark:hover:bg-stone-700 border border-warm-200 dark:border-stone-700 text-[11px] font-bold text-stone-700 dark:text-stone-200 transition">
                    ⇄ Đảo toàn bộ (Tôi ↔ Cô ấy)
                </button>
                <button type="button" id="btnAddExtractedRow" class="px-2.5 py-1 rounded-lg bg-white hover:bg-warm-100 dark:bg-stone-800 dark:hover:bg-stone-700 border border-warm-200 dark:border-stone-700 text-[11px] font-bold text-stone-700 dark:text-stone-200 transition">
                    ＋ Thêm dòng tin nhắn
                </button>
                <button type="button" id="btnCloseExtractedEditor" class="ml-auto px-2.5 py-1 rounded-lg bg-stone-200/70 hover:bg-stone-300/70 dark:bg-stone-800 text-[11px] font-semibold text-stone-600 dark:text-stone-400 transition">
                    Đóng khung
                </button>
            </div>

            <div class="space-y-2 max-h-80 overflow-y-auto pr-1">
                ${bubblesHtml}
            </div>

            ${lastSenderBanner}

            <div class="flex flex-wrap items-center gap-2 pt-2 border-t border-warm-200 dark:border-stone-700">
                <button type="button" id="btnConfirmAddExtractedToThread" class="flex-1 py-2.5 px-3 rounded-xl bg-warm-500 hover:bg-warm-600 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5">
                    <span>✅</span>
                    <span>Thêm vào cuộc trò chuyện này (${messages.length} tin)</span>
                </button>
                <button type="button" id="btnDeleteAttachmentsAfterExtract" class="py-2.5 px-3 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-300 font-bold text-xs border border-red-200 dark:border-red-800/60 transition flex items-center justify-center gap-1">
                    <span>🗑️</span>
                    <span>Xoá ảnh</span>
                </button>
            </div>
        </div>
    `;

    // Gắn sự kiện chỉnh sửa trực tiếp từng bong bóng
    editorArea.querySelectorAll('select[data-edit-sender]').forEach(sel => {
        sel.addEventListener('change', (e) => {
            const idx = parseInt(sel.getAttribute('data-edit-sender'), 10);
            if (pendingExtractionDraft && pendingExtractionDraft.messages[idx]) {
                pendingExtractionDraft.messages[idx].sender = e.target.value;
                renderExtractChatEditorUI();
            }
        });
    });

    editorArea.querySelectorAll('textarea[data-edit-text]').forEach(ta => {
        ta.addEventListener('input', (e) => {
            const idx = parseInt(ta.getAttribute('data-edit-text'), 10);
            if (pendingExtractionDraft && pendingExtractionDraft.messages[idx]) {
                pendingExtractionDraft.messages[idx].text = e.target.value;
            }
        });
    });

    editorArea.querySelectorAll('input[data-edit-time]').forEach(inp => {
        inp.addEventListener('input', (e) => {
            const idx = parseInt(inp.getAttribute('data-edit-time'), 10);
            if (pendingExtractionDraft && pendingExtractionDraft.messages[idx]) {
                pendingExtractionDraft.messages[idx].time = e.target.value;
            }
        });
    });

    editorArea.querySelectorAll('input[data-edit-note]').forEach(inp => {
        inp.addEventListener('input', (e) => {
            const idx = parseInt(inp.getAttribute('data-edit-note'), 10);
            if (pendingExtractionDraft && pendingExtractionDraft.messages[idx]) {
                pendingExtractionDraft.messages[idx].note = e.target.value;
            }
        });
    });

    editorArea.querySelectorAll('button[data-del-extract-row]').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.getAttribute('data-del-extract-row'), 10);
            if (pendingExtractionDraft && pendingExtractionDraft.messages[idx]) {
                pendingExtractionDraft.messages.splice(idx, 1);
                renderExtractChatEditorUI();
            }
        });
    });

    // Nút đảo toàn bộ người gửi Tôi ↔ Cô ấy
    const btnSwap = document.getElementById('btnSwapExtractedSenders');
    if (btnSwap) {
        btnSwap.addEventListener('click', () => {
            if (!pendingExtractionDraft) return;
            pendingExtractionDraft.messages.forEach(m => {
                if (m.sender === 'her') m.sender = 'me';
                else if (m.sender === 'me') m.sender = 'her';
            });
            renderExtractChatEditorUI();
            showToast('Đã đảo chiều người gửi (Tôi ↔ Cô ấy)', '⇄');
        });
    }

    // Nút thêm dòng mới
    const btnAddRow = document.getElementById('btnAddExtractedRow');
    if (btnAddRow) {
        btnAddRow.addEventListener('click', () => {
            if (!pendingExtractionDraft) return;
            pendingExtractionDraft.messages.push({
                sender: 'her',
                text: '',
                time: '',
                note: '',
                source: 'screenshot'
            });
            renderExtractChatEditorUI();
        });
    }

    // Nút đóng trình chỉnh sửa
    const btnClose = document.getElementById('btnCloseExtractedEditor');
    if (btnClose) {
        btnClose.addEventListener('click', () => {
            pendingExtractionDraft = null;
            renderExtractChatEditorUI();
        });
    }

    // Nút Xoá ảnh ngay sau khi đọc xong (Mục 1.9)
    const btnDeleteImg = document.getElementById('btnDeleteAttachmentsAfterExtract');
    if (btnDeleteImg) {
        btnDeleteImg.addEventListener('click', () => {
            if (window.modeAAttachments) {
                window.modeAAttachments.clearAll(false);
            }
        });
    }

    // Mục 1.6: Nút "✅ Thêm vào cuộc trò chuyện này"
    const btnConfirmAdd = document.getElementById('btnConfirmAddExtractedToThread');
    if (btnConfirmAdd) {
        btnConfirmAdd.addEventListener('click', () => {
            if (!pendingExtractionDraft) return;
            const cleanMsgs = pendingExtractionDraft.messages
                .map(m => ({
                    sender: ['her', 'me', 'unknown'].includes(m.sender) ? m.sender : 'her',
                    text: String(m.text || '').trim(),
                    time: String(m.time || '').trim(),
                    note: String(m.note || '').trim(),
                    source: 'screenshot'
                }))
                .filter(m => m.text !== '');

            if (cleanMsgs.length === 0) {
                showToast('Chưa có dòng tin nhắn nào có nội dung chữ để thêm!', '⚠️');
                return;
            }

            const thread = getActiveThread();
            if (!Array.isArray(thread.messages)) thread.messages = [];
            thread.messages.push(...cleanMsgs);

            // Tự động điền tin nhắn cuối vào ô nhập hoặc cập nhật ngữ cảnh
            const lastItem = cleanMsgs[cleanMsgs.length - 1];
            if (lastItem.sender === 'her') {
                document.getElementById('herMessageInput').value = lastItem.text;
                thread.lastInput = lastItem.text;
            } else if (lastItem.sender === 'me') {
                document.getElementById('herMessageInput').value = `[Tin cuối là của tôi vừa gửi]: "${lastItem.text}"`;
                thread.lastInput = document.getElementById('herMessageInput').value;
            }

            // Xoá ảnh khỏi bộ nhớ tạm sau khi đã trích xuất & lưu thành công vào thread (Mục 1.4 & 1.9)
            if (window.modeAAttachments && window.modeAAttachments.hasAttachments()) {
                window.modeAAttachments.clearAll(true);
            }

            pendingExtractionDraft = null;
            saveThreadsToStorage();
            renderThreadsBarUI();
            renderThreadStructuredMessagesUI();
            renderExtractChatEditorUI();

            showToast(`Đã lưu ${cleanMsgs.length} tin vào "${thread.name}" và giải phóng bộ nhớ ảnh!`, '✅');
        });
    }
}

/**
 * Định dạng tối đa 40 tin nhắn gần nhất trong `thread.messages` để gửi kèm lên Gemini (Mục 1.6)
 */
function formatRecentThreadMessagesForPrompt(thread) {
    const msgs = Array.isArray(thread.messages) ? thread.messages : [];
    if (msgs.length === 0) return 'Chưa có lịch sử tin nhắn cấu trúc nào được lưu trước đó.';

    const recent40 = msgs.slice(-40);
    const lines = recent40.map((m, i) => {
        const who = m.sender === 'me' ? 'Tôi' : m.sender === 'her' ? 'Cô ấy' : 'Chưa rõ';
        const meta = [m.time, m.note].filter(Boolean).join(', ');
        return `${i + 1}. [${who}${meta ? ` - ${meta}` : ''}]: ${m.text}`;
    });

    const lastMsg = recent40[recent40.length - 1];
    const lastWhoNote = lastMsg.sender === 'me'
        ? 'LƯU Ý QUAN TRỌNG: Tin nhắn cuối cùng trong lịch sử đang là của TÔI ("Tôi"). Hãy nói rõ điều này trong phần note, khuyên chờ hợp lý hoặc gợi ý tin nhắn tiếp theo sau một khoảng nghỉ.'
        : 'Tin nhắn cuối cùng trong lịch sử là của CÔ ẤY.';

    return `${lines.join('\n')}\n=> ${lastWhoNote}`;
}

function buildModeAPrompt(thread, herMsg, extraLevelInstruction = '', hasLiveAttachments = false) {
    const abbrevDesc = thread.abbrevLevel === 1
        ? 'Mức 1 - Ít viết tắt (viết rõ chữ: không, được, với, hôm nay)'
        : thread.abbrevLevel === 2
        ? 'Mức 2 - Viết tắt vừa phải tự nhiên (ko, dc, vs, hnay)'
        : 'Mức 3 - Viết tắt kiểu Gen Z (k, dc, vs, nma, hnay, bh, j, r)';

    const humorDesc = thread.humorLevel === 1
        ? 'Mức 1 - Điềm đạm, chân thành, ấm áp'
        : thread.humorLevel === 2
        ? 'Mức 2 - Tự nhiên, gần gũi'
        : 'Mức 3 - Hài hước, nhí nhố, hay trêu đùa tinh tế';

    const recent40Block = formatRecentThreadMessagesForPrompt(thread);
    const myProfileBlock = typeof buildMyProfilePromptContext === 'function'
        ? buildMyProfilePromptContext()
        : '';

    const attachmentInstruction = hasLiveAttachments
        ? `- ĐÍNH KÈM TRỰC TIẾP: Người dùng có đính kèm ảnh chụp màn hình chat / tệp lịch sử chat trong lượt này. Hãy đọc kỹ nội dung trong ảnh/tệp. Nếu tin cuối cùng trong ảnh là của cô ấy (bên trái), hãy gợi ý trả lời cho tin cuối đó. Nếu tin cuối cùng trong ảnh là của TÔI (bên phải), hãy nói rõ trong "note" rằng tin cuối là của tôi và gợi ý tin tiếp theo hoặc khuyên chờ.`
        : '';

    return `Thông tin cuộc trò chuyện với "${thread.name}":
- Tin nhắn / yêu cầu hiện tại: "${herMsg || '(Xem trong ảnh chụp màn hình đính kèm hoặc tin cuối trong lịch sử bên dưới)'}"
- Quen nhau ở đâu: ${thread.where}
- Mức độ thân thiết: ${thread.closeness}
- Mong muốn của mình: ${thread.goal}
- Ghi chú thêm về cô ấy: ${thread.lastNote || 'Không có'}
${myProfileBlock}
- Lịch sử hội thoại gần nhất của cuộc trò chuyện này (tối đa 40 tin gần nhất):
${recent40Block}
${attachmentInstruction}
- Phong cách bắt buộc:
  + Cách xưng hô: ${thread.pronoun}
  + Mức độ viết tắt: ${abbrevDesc}
  + Mức độ hài hước: ${humorDesc}
${extraLevelInstruction}
Chỉ trả về JSON hợp lệ theo đúng cấu trúc yêu cầu.`;
}

async function handleGenerateModeA() {
    const thread = getActiveThread();
    const herMsg = document.getElementById('herMessageInput').value.trim();
    const widget = window.modeAAttachments;
    const hasAttachments = Boolean(widget && widget.hasAttachments());
    const hasSavedMessages = Array.isArray(thread.messages) && thread.messages.length > 0;

    if (!herMsg && !hasAttachments && !hasSavedMessages) {
        showToast('Bạn hãy dán tin nhắn của cô ấy hoặc đính kèm ảnh chụp màn hình chat nhé!', '✍️');
        document.getElementById('herMessageInput').focus();
        return;
    }

    thread.lastInput = herMsg;
    thread.lastNote = document.getElementById('extraContextInput').value.trim();

    // Nếu người dùng gõ tin nhắn mới của cô ấy bằng tay thì lưu vào thread.messages (source: "typed") (Mục 1.6)
    if (herMsg && !herMsg.startsWith('[Tin cuối là của tôi')) {
        const lastSaved = thread.messages[thread.messages.length - 1];
        if (!lastSaved || lastSaved.text !== herMsg) {
            thread.messages.push({
                sender: 'her',
                text: herMsg,
                time: '',
                note: '',
                source: 'typed'
            });
        }
    }
    saveThreadsToStorage();
    renderThreadStructuredMessagesUI();

    const btn = document.getElementById('btnSubmitModeA');
    const resultArea = document.getElementById('modeAResultArea');
    btn.disabled = true;
    btn.innerHTML = `<span>⏳ Đang phân tích tín hiệu...</span>`;

    resultArea.innerHTML = `
        <div class="bg-white dark:bg-stone-800/90 border border-warm-200 dark:border-stone-700 rounded-2xl p-5 text-center space-y-2.5 animate-pop">
            <div class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-warm-100 dark:bg-stone-700">
                <span class="w-2.5 h-2.5 rounded-full bg-warm-500 typing-dot"></span>
                <span class="w-2.5 h-2.5 rounded-full bg-warm-500 typing-dot"></span>
                <span class="w-2.5 h-2.5 rounded-full bg-warm-500 typing-dot"></span>
            </div>
            <p class="text-xs font-semibold text-stone-600 dark:text-stone-300">
                Đang đọc mạch chuyện (${Math.min(40, thread.messages.length)} tin gần nhất${hasAttachments ? ' + ảnh/file đính kèm' : ''}) của "${escapeHtml(thread.name)}"...
            </p>
        </div>
    `;

    const userPrompt = buildModeAPrompt(thread, herMsg, '', hasAttachments);
    const extraParts = hasAttachments ? widget.toExtraParts() : [];
    const safeHistorySummary = hasAttachments
        ? `${widget.getHistorySummaryText(herMsg)}\n\n${userPrompt}`
        : userPrompt;

    try {
        const { parsed, rawText } = await callGeminiWithSchemaRetry(
            SYSTEM_PROMPT_MODE_A,
            thread.apiHistory,
            userPrompt,
            SCHEMA_MODE_A,
            validateModeAJson,
            {
                temperature: 0.88,
                extraParts: extraParts
            }
        );

        // Mục 1.4: Tuyệt đối KHÔNG lưu base64 vào apiHistory hay localStorage.
        // Lưu dòng text mô tả đính kèm kèm prompt đã làm sạch.
        thread.apiHistory.push({ role: 'user', parts: [{ text: safeHistorySummary }] });
        thread.apiHistory.push({ role: 'model', parts: [{ text: rawText }] });
        thread.apiHistory = sanitizeHistoryForStorage(thread.apiHistory);
        if (thread.apiHistory.length > 16) {
            thread.apiHistory = thread.apiHistory.slice(-16);
        }

        thread.lastResult = parsed;
        thread.updatedAt = Date.now();
        saveThreadsToStorage();

        renderThreadsBarUI();
        renderModeAResult(parsed);
    } catch (err) {
        renderErrorCard('modeAResultArea', err.message);
    } finally {
        btn.disabled = false;
        btn.innerHTML = `<span>✨ Phân tích & Gợi ý trả lời</span>`;
    }
}

function renderModeAResult(data) {
    const container = document.getElementById('modeAResultArea');
    const signalNorm = String(data.signal || '').toLowerCase();

    let signalBadge = '🟢 Tín hiệu (suy đoán từ chữ): Khá cởi mở / Hào hứng';
    let signalStyle = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200';
    if (signalNorm.includes('nhạt')) {
        signalBadge = '🟠 Tín hiệu (suy đoán từ chữ): Hơi nhạt / Cô ấy có thể đang bận';
        signalStyle = 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200';
    } else if (signalNorm.includes('bình thường')) {
        signalBadge = '🔵 Tín hiệu (suy đoán từ chữ): Bình thường';
        signalStyle = 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800 text-sky-900 dark:text-sky-200';
    }

    const hasRemainingAttachments = Boolean(window.modeAAttachments && window.modeAAttachments.hasAttachments());

    let html = `
        <div class="rounded-2xl border p-3.5 ${signalStyle} animate-pop space-y-2">
            <div class="flex items-start justify-between gap-2.5">
                <div class="flex items-start gap-2.5">
                    <span class="text-base leading-none mt-0.5">${signalNorm.includes('nhạt') ? '🛑' : '💡'}</span>
                    <div class="space-y-1">
                        <div class="text-xs font-extrabold uppercase tracking-wide">${escapeHtml(signalBadge)}</div>
                        <p class="text-xs leading-relaxed">${escapeHtml(data.note || '')}</p>
                        <p class="text-[11px] opacity-80 italic">
                            * Lưu ý: Đọc tín hiệu chỉ là suy đoán từ chữ, cô ấy có thể đang bận việc riêng.
                        </p>
                    </div>
                </div>
                ${hasRemainingAttachments ? `
                <button type="button" id="btnClearImgFromResultCard" class="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold flex-shrink-0 transition">
                    🗑️ Xoá ảnh
                </button>
                ` : ''}
            </div>
        </div>
    `;

    data.options.forEach((opt, idx) => {
        const levelStr = String(opt.level || '').toLowerCase();
        let levelBadge = '🌱 Nhẹ nhàng / An toàn';
        if (levelStr.includes('vui')) levelBadge = '😄 Vui vẻ / Hài hước';
        else if (levelStr.includes('chủ động')) levelBadge = '✨ Chủ động hơn một chút';

        const formattedText = escapeHtml(opt.text || '').replace(
            /\[([^\]]+)\]/g,
            '<span class="underline decoration-wavy decoration-amber-200 font-bold bg-black/15 px-1 rounded">[$1]</span>'
        );

        html += `
            <div class="bg-white dark:bg-stone-800/95 border border-warm-200 dark:border-stone-700 rounded-2xl p-4 shadow-xs space-y-3 animate-pop" style="animation-delay: ${idx * 60}ms">
                <div class="flex items-center justify-between">
                    <span class="text-xs font-extrabold text-warm-600 dark:text-amber-400">${escapeHtml(levelBadge)}</span>
                    <span class="text-[10px] text-stone-400">Phương án ${idx + 1}</span>
                </div>

                <div class="bg-warm-50 dark:bg-stone-900/90 border border-warm-200/70 dark:border-stone-700/80 rounded-2xl p-3 flex justify-end">
                    <div class="max-w-[92%] bg-gradient-to-br from-warm-500 to-amber-600 text-white px-3.5 py-2.5 rounded-2xl rounded-br-xs shadow-xs text-sm leading-relaxed break-words whitespace-pre-line">${formattedText}</div>
                </div>

                <p class="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                    💡 <strong>Vì sao nên nhắn vậy:</strong> ${escapeHtml(opt.why || '')}
                </p>

                <div class="grid grid-cols-2 gap-2 pt-1 border-t border-warm-100 dark:border-stone-700/60">
                    <button type="button" data-idx="${idx}" class="btn-copy-opt py-2 px-3 rounded-xl bg-warm-500 hover:bg-warm-600 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5">
                        <span>📋</span>
                        <span>Sao chép</span>
                    </button>
                    <button type="button" data-idx="${idx}" class="btn-rewrite-opt py-2 px-3 rounded-xl bg-warm-100 hover:bg-warm-200 dark:bg-stone-700 dark:hover:bg-stone-600 text-stone-700 dark:text-stone-200 font-bold text-xs transition flex items-center justify-center gap-1.5">
                        <span>🔄</span>
                        <span>Viết lại kiểu khác</span>
                    </button>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;

    const btnClearImg = document.getElementById('btnClearImgFromResultCard');
    if (btnClearImg) {
        btnClearImg.addEventListener('click', () => {
            if (window.modeAAttachments) {
                window.modeAAttachments.clearAll(false);
                renderModeAResult(data);
            }
        });
    }

    container.querySelectorAll('.btn-copy-opt').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.getAttribute('data-idx'), 10);
            const thread = getActiveThread();
            const text = thread.lastResult?.options?.[idx]?.text || '';
            copyText(text);
        });
    });

    container.querySelectorAll('.btn-rewrite-opt').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.getAttribute('data-idx'), 10);
            handleRewriteOptionA(idx, btn);
        });
    });
}

async function handleRewriteOptionA(optionIndex, buttonEl) {
    const thread = getActiveThread();
    if (!thread.lastResult || !thread.lastResult.options[optionIndex]) return;

    const oldOpt = thread.lastResult.options[optionIndex];
    const herMsg = document.getElementById('herMessageInput').value.trim() || thread.lastInput;

    buttonEl.disabled = true;
    buttonEl.innerHTML = `<span>⏳</span><span>Đang viết lại...</span>`;

    const extraInstruction = `YÊU CẦU ĐẶC BIỆT: Người dùng muốn viết lại phương án ở mức "${oldOpt.level}" theo một góc tiếp cận khác mới mẻ hơn (KHÔNG lặp lại câu cũ: "${oldOpt.text}").`;
    const userPrompt = buildModeAPrompt(thread, herMsg, extraInstruction, false);

    try {
        const { parsed, rawText } = await callGeminiWithSchemaRetry(
            SYSTEM_PROMPT_MODE_A,
            thread.apiHistory,
            userPrompt,
            SCHEMA_MODE_A,
            validateModeAJson,
            0.95
        );

        thread.apiHistory.push({ role: 'user', parts: [{ text: userPrompt }] });
        thread.apiHistory.push({ role: 'model', parts: [{ text: rawText }] });
        thread.apiHistory = sanitizeHistoryForStorage(thread.apiHistory);
        if (thread.apiHistory.length > 16) thread.apiHistory = thread.apiHistory.slice(-16);

        const matchingNew = parsed.options.find(
            o => String(o.level).toLowerCase() === String(oldOpt.level).toLowerCase()
        ) || parsed.options[optionIndex] || parsed.options[0];

        if (matchingNew) {
            thread.lastResult.options[optionIndex] = matchingNew;
        }
        saveThreadsToStorage();
        renderModeAResult(thread.lastResult);
        showToast(`Đã đổi câu mới cho mức "${oldOpt.level}"!`, '✨');
    } catch (err) {
        showToast(`Lỗi khi viết lại: ${err.message}`, '⚠️');
        buttonEl.disabled = false;
        buttonEl.innerHTML = `<span>🔄</span><span>Viết lại kiểu khác</span>`;
    }
}