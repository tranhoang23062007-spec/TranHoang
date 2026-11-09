/**
 * ============================================================================
 * GIAI ĐOẠN 2: TAB ✍️ SOẠN TIN (TÔI VIẾT, AI SỬA — GIỮ Ý & GIỌNG CỦA TÔI)
 * (Mục 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7)
 * ============================================================================
 */

// Lấy đối tượng Thread ngữ cảnh được chọn trong Tab Soạn tin (nếu có)
function getComposeSelectedThread() {
    const prefId = appState.compose.prefs.contextThreadId;
    if (prefId === 'none') return null;
    if (prefId === 'active') return getActiveThread();
    return appState.threads.find(t => t.id === prefId) || getActiveThread();
}

// Cập nhật danh sách chọn Thread trong Tab Soạn tin (Mục 2.2)
function renderComposeThreadSelectUI() {
    const selectEl = document.getElementById('composeThreadSelect');
    if (!selectEl) return;

    const currentVal = appState.compose.prefs.contextThreadId || 'active';
    const activeThread = getActiveThread();

    let optionsHtml = `
        <option value="active">🔗 Dùng cuộc trò chuyện đang chọn ("${escapeHtml(activeThread.name)}")</option>
        <option value="none">📝 Không gắn cuộc trò chuyện (Chỉ dùng ngữ cảnh nhập bên dưới)</option>
    `;

    appState.threads.forEach(t => {
        const msgCount = Array.isArray(t.messages) ? t.messages.length : 0;
        optionsHtml += `<option value="${escapeHtml(t.id)}">👤 ${escapeHtml(t.name)} (${msgCount} tin đã lưu)</option>`;
    });

    selectEl.innerHTML = optionsHtml;
    const validValues = ['active', 'none', ...appState.threads.map(t => t.id)];
    selectEl.value = validValues.includes(currentVal) ? currentVal : 'active';
}

// Cập nhật nhãn hiển thị của 4 thanh trượt trong Tab Soạn tin (Mục 2.7)
function updateSlidersLabelCompose() {
    const p = appState.compose.prefs;
    const abbrevMap = { 1: 'Ít (viết đầy đủ)', 2: 'Vừa phải (ko, dc, vs)', 3: 'Nhiều (nma, bh, j, r)' };
    const humorMap = { 1: 'Điềm đạm / Chân thành', 2: 'Tự nhiên', 3: 'Vui vẻ / Hay trêu' };
    const lengthMap = { 1: 'Ngắn gọn (1 tin)', 2: 'Vừa phải (1–2 tin)', 3: 'Đầy đủ (2–3 tin)' };
    const emojiMap = { 1: 'Ít / Không dùng', 2: 'Vừa phải (1–2 emoji)', 3: 'Nhiều biểu cảm' };

    const abbrevEl = document.getElementById('abbrevLabelCompose');
    const humorEl = document.getElementById('humorLabelCompose');
    const lengthEl = document.getElementById('lengthLabelCompose');
    const emojiEl = document.getElementById('emojiLabelCompose');

    if (abbrevEl) abbrevEl.textContent = abbrevMap[p.abbrevLevel] || 'Vừa phải';
    if (humorEl) humorEl.textContent = humorMap[p.humorLevel] || 'Tự nhiên';
    if (lengthEl) lengthEl.textContent = lengthMap[p.lengthLevel] || 'Vừa phải (1–2 tin)';
    if (emojiEl) emojiEl.textContent = emojiMap[p.emojiLevel] || 'Vừa phải (1–2 emoji)';
}

// Cập nhật trạng thái nút chuyển 2 cách nhập (Mục 2.1): "Tôi đã viết nháp" vs "Tôi chỉ có ý"
function updateComposeInputModeUI() {
    const mode = appState.compose.prefs.inputMode;
    const btnDraft = document.getElementById('btnComposeModeDraft');
    const btnIdea = document.getElementById('btnComposeModeIdea');
    const inputLabel = document.getElementById('composeInputLabel');
    const textarea = document.getElementById('composeUserInput');
    const hintText = document.getElementById('composeInputModeHint');

    if (!btnDraft || !btnIdea || !textarea) return;

    if (mode === 'draft') {
        btnDraft.className = 'flex-1 py-2 px-3 rounded-xl text-xs font-extrabold transition bg-warm-500 text-white shadow-xs flex items-center justify-center gap-1.5';
        btnIdea.className = 'flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition bg-warm-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-warm-200 dark:hover:bg-stone-700 flex items-center justify-center gap-1.5';
        if (inputLabel) inputLabel.textContent = '✍️ Dán tin nhắn nháp bạn định gửi:';
        textarea.placeholder = 'Ví dụ: Hôm nay em làm việc có mệt lắm không, tối nay nếu rảnh thì đi uống nước với anh nhé...';
        if (hintText) {
            hintText.textContent = 'AI sẽ giữ nguyên ý & thông tin thật của bạn, chỉ chấm điểm độ tự nhiên và gọt lại câu chữ cho đỡ cứng/sến.';
        }
    } else {
        btnIdea.className = 'flex-1 py-2 px-3 rounded-xl text-xs font-extrabold transition bg-warm-500 text-white shadow-xs flex items-center justify-center gap-1.5';
        btnDraft.className = 'flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition bg-warm-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-warm-200 dark:hover:bg-stone-700 flex items-center justify-center gap-1.5';
        if (inputLabel) inputLabel.textContent = '💡 Gõ vài từ hoặc gạch đầu dòng ý bạn muốn nói:';
        textarea.placeholder = 'Ví dụ: muốn nói tớ cũng thích phim đó nhưng chưa xem tập mới, hỏi cô ấy xem tới đâu rồi...';
        if (hintText) {
            hintText.textContent = 'AI sẽ biến các ý gạch đầu dòng của bạn thành tin nhắn hoàn chỉnh theo đúng giọng văn và xưng hô đã chọn.';
        }
    }
}

// Đồng bộ toàn bộ giao diện Tab Soạn tin từ appState
function syncComposeUIFromState() {
    const p = appState.compose.prefs;
    renderComposeThreadSelectUI();
    updateComposeInputModeUI();

    const abbrevSlider = document.getElementById('abbrevSliderCompose');
    const humorSlider = document.getElementById('humorSliderCompose');
    const lengthSlider = document.getElementById('lengthSliderCompose');
    const emojiSlider = document.getElementById('emojiSliderCompose');

    if (abbrevSlider) abbrevSlider.value = p.abbrevLevel || 2;
    if (humorSlider) humorSlider.value = p.humorLevel || 2;
    if (lengthSlider) lengthSlider.value = p.lengthLevel || 2;
    if (emojiSlider) emojiSlider.value = p.emojiLevel || 2;
    updateSlidersLabelCompose();

    highlightChipGroup('composeGoalGroup', p.goal);
    highlightChipGroup('pronounGroupCompose', p.pronoun);

    renderComposeSavedDraftsUI();

    if (appState.compose.lastResult) {
        renderComposeResultUI(appState.compose.lastResult);
    }
}

// Đồng bộ nhanh thanh trượt & xưng hô từ Thread đang chọn ở Chế độ A sang Tab Soạn tin
function syncComposeStyleFromThread() {
    const thread = getComposeSelectedThread() || getActiveThread();
    if (!thread) return;
    appState.compose.prefs.pronoun = thread.pronoun || 'mình - bạn';
    appState.compose.prefs.abbrevLevel = thread.abbrevLevel || 2;
    appState.compose.prefs.humorLevel = thread.humorLevel || 2;
    saveComposeStateToStorage();
    syncComposeUIFromState();
    showToast(`Đã lấy xưng hô (${thread.pronoun}) & phong cách từ "${thread.name}"!`, '🔄');
}

/**
 * Xây dựng Prompt chi tiết gửi lên Gemini cho Tab ✍️ Soạn tin (Mục 2.1, 2.2, 2.3, 2.6, 2.7)
 */
function buildComposeUserPrompt({ isRefinement = false, refinementInstruction = '' } = {}) {
    const p = appState.compose.prefs;
    const rawUserText = document.getElementById('composeUserInput')?.value.trim() || appState.compose.draftInput;
    const herContextText = document.getElementById('composeHerMsgInput')?.value.trim() || appState.compose.herContextMsg;
    const selectedThread = getComposeSelectedThread();
    const hasAttachments = Boolean(window.composeAttachments && window.composeAttachments.hasAttachments());

    const abbrevDesc = p.abbrevLevel === 1
        ? 'Mức 1 - Ít viết tắt (viết đầy đủ rõ chữ: không, được, với, hôm nay)'
        : p.abbrevLevel === 2
        ? 'Mức 2 - Viết tắt vừa phải tự nhiên (ko, dc, vs, hnay)'
        : 'Mức 3 - Viết tắt kiểu Gen Z (k, dc, vs, nma, hnay, bh, j, r)';

    const humorDesc = p.humorLevel === 1
        ? 'Mức 1 - Điềm đạm, chân thành, ấm áp'
        : p.humorLevel === 2
        ? 'Mức 2 - Tự nhiên, gần gũi'
        : 'Mức 3 - Hài hước, nhí nhố, trêu nhẹ tinh tế';

    const lengthDesc = p.lengthLevel === 1
        ? 'Mức 1 - Ngắn gọn (gói gọn trong 1 tin nhắn ngắn 1 câu)'
        : p.lengthLevel === 2
        ? 'Mức 2 - Vừa phải (1 đến 2 tin nhắn ngắn nối tiếp)'
        : 'Mức 3 - Đầy đủ (tách thành 2 đến 3 tin nhắn ngắn theo nhịp chat thật)';

    const emojiDesc = p.emojiLevel === 1
        ? 'Mức 1 - Rất ít hoặc không dùng emoji (tối đa 0-1 emoji)'
        : p.emojiLevel === 2
        ? 'Mức 2 - Vừa phải (1-2 emoji tự nhiên mỗi bản)'
        : 'Mức 3 - Biểu cảm sinh động (2-3 emoji/biểu cảm chữ như haha, hihi, trời ơi)';

    const myProfileBlock = typeof buildMyProfilePromptContext === 'function'
        ? buildMyProfilePromptContext()
        : '';

    let threadContextBlock = '- Ngữ cảnh cuộc trò chuyện: Không gắn cố định vào cuộc trò chuyện nào.';
    if (selectedThread) {
        const recentHistory = typeof formatRecentThreadMessagesForPrompt === 'function'
            ? formatRecentThreadMessagesForPrompt(selectedThread)
            : '';
        threadContextBlock = `- Ngữ cảnh từ cuộc trò chuyện với "${selectedThread.name}":
  + Quen ở đâu: ${selectedThread.where}
  + Mức độ thân: ${selectedThread.closeness}
  + Ghi chú về cô ấy: ${selectedThread.lastNote || 'Không có'}
  + Lịch sử tin nhắn gần đây:
${recentHistory}`;
    }

    const modeLabel = p.inputMode === 'idea'
        ? 'CHẾ ĐỘ B - TÔI CHỈ CÓ Ý (Người dùng gõ vài từ/gạch đầu dòng ý muốn nói, hãy diễn đạt thành lời nhắn hoàn chỉnh tự nhiên mà giữ đúng 100% ý đó)'
        : 'CHẾ ĐỘ A - TÔI ĐÃ VIẾT NHÁP (Người dùng đã viết sẵn câu nháp định gửi, hãy chấm điểm chẩn đoán và gọt lại cho tự nhiên, đỡ sến/ép, giữ nguyên ý)';

    const attachmentNote = hasAttachments
        ? '- ĐÍNH KÈM: Người dùng có đính kèm ảnh chụp màn hình / file chat của cô ấy. Hãy đọc tin nhắn của cô ấy trong ảnh để đối chiếu ngữ cảnh.'
        : '';

    if (isRefinement) {
        const selectedIdx = appState.compose.selectedVersionIndex || 0;
        const chosenVer = appState.compose.lastResult?.versions?.[selectedIdx] || appState.compose.lastResult?.versions?.[0];
        const chosenStyleName = chosenVer ? chosenVer.style : 'Bản đang chọn';
        const chosenMsgsText = chosenVer ? chosenVer.messages.join(' | ') : rawUserText;

        return `YÊU CẦU TINH CHỈNH LIÊN TỤC (Lượt tinh chỉnh tiếp theo trong phiên làm việc):
- Bản gốc ban đầu của tôi: "${rawUserText}"
- Phiên bản tôi đang chọn để sửa tiếp (${chosenStyleName}): "${chosenMsgsText}"
- YÊU CẦU CHỈNH TIẾP CỦA TÔI: "${refinementInstruction}"
- Cấu hình thanh trượt hiện tại:
  + Xưng hô: ${p.pronoun}
  + Mức viết tắt: ${abbrevDesc}
  + Độ hài hước: ${humorDesc}
  + Độ dài mong muốn: ${lengthDesc}
  + Mức dùng emoji: ${emojiDesc}
Hãy dựa vào bản đang chọn và các lần chỉnh trước trong lịch sử phiên, áp dụng đúng yêu cầu "${refinementInstruction}" (vẫn giữ nguyên thông tin thật của tôi, không bịa thêm sự kiện) và trả về JSON đầy đủ 3 bản cập nhật theo Schema.`;
    }

    return `YÊU CẦU SOẠN & CHỈNH SỬA TIN NHẮN CỦA TÔI:
- Chế độ nhập: ${modeLabel}
- Nội dung bản nháp / ý tưởng của tôi: "${rawUserText}"
- Tin nhắn cô ấy vừa gửi (nếu có): "${herContextText || '(Không nhập trực tiếp)'}"
- Mục tiêu tin nhắn này: ${p.goal}
${myProfileBlock}
${threadContextBlock}
${attachmentNote}
- Phong cách & Thanh trượt bắt buộc:
  + Cách xưng hô: ${p.pronoun}
  + Mức viết tắt: ${abbrevDesc}
  + Độ hài hước: ${humorDesc}
  + Độ dài tin nhắn: ${lengthDesc}
  + Mức dùng emoji: ${emojiDesc}
Hãy phân tích bản nháp/ý tưởng của tôi, nêu rõ warnings[] nếu có vấn đề (ép buộc, hỏi dồn, trách móc, quá dài, sến, khen ngoại hình đột ngột...) và tạo 3 phiên bản ("Sát bản gốc", "Tự nhiên hơn", "Ngắn gọn") kèm danh sách changes[] giải thích từng cụm từ đã sửa. Chỉ trả về JSON đúng Schema.`;
}

/**
 * Xử lý khi bấm nút chính "✨ Phân tích & Chỉnh sửa tin nhắn của tôi" (Mục 2.1 - 2.5)
 */
async function handleGenerateCompose() {
    const inputEl = document.getElementById('composeUserInput');
    const herMsgEl = document.getElementById('composeHerMsgInput');
    const rawUserText = inputEl ? inputEl.value.trim() : '';

    if (!rawUserText) {
        const msg = appState.compose.prefs.inputMode === 'idea'
            ? 'Bạn hãy gõ vài từ hoặc gạch đầu dòng ý muốn nói trước nhé!'
            : 'Bạn hãy dán bản nháp tin nhắn định gửi vào ô trước nhé!';
        showToast(msg, '✍️');
        if (inputEl) inputEl.focus();
        return;
    }

    appState.compose.draftInput = rawUserText;
    appState.compose.herContextMsg = herMsgEl ? herMsgEl.value.trim() : '';
    appState.compose.sessionHistory = [];
    appState.compose.refinementCount = 0;
    saveComposeStateToStorage();

    const btn = document.getElementById('btnSubmitCompose');
    const resultArea = document.getElementById('composeResultArea');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<span class="animate-spin">⏳</span><span>Đang chấm điểm & trau chuốt câu chữ...</span>`;
    }

    if (resultArea) {
        resultArea.innerHTML = `
            <div class="bg-white dark:bg-stone-800/90 border border-warm-200 dark:border-stone-700 rounded-2xl p-5 text-center space-y-2.5 animate-pop">
                <div class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-warm-100 dark:bg-stone-700">
                    <span class="w-2.5 h-2.5 rounded-full bg-warm-500 typing-dot"></span>
                    <span class="w-2.5 h-2.5 rounded-full bg-warm-500 typing-dot"></span>
                    <span class="w-2.5 h-2.5 rounded-full bg-warm-500 typing-dot"></span>
                </div>
                <p class="text-xs font-semibold text-stone-600 dark:text-stone-300">
                    Đang đối chiếu với giọng văn của bạn & tạo 3 bản sửa giữ nguyên ý gốc...
                </p>
            </div>
        `;
    }

    const widget = window.composeAttachments;
    const hasAttachments = Boolean(widget && widget.hasAttachments());
    const extraParts = hasAttachments ? widget.toExtraParts() : [];
    const userPrompt = buildComposeUserPrompt({ isRefinement: false });
    const safeHistoryPrompt = hasAttachments
        ? `${widget.getHistorySummaryText(appState.compose.herContextMsg)}\n\n${userPrompt}`
        : userPrompt;

    try {
        const { parsed, rawText } = await callGeminiWithSchemaRetry(
            SYSTEM_PROMPT_COMPOSE,
            [],
            userPrompt,
            SCHEMA_COMPOSE,
            validateComposeJson,
            {
                temperature: 0.8,
                extraParts: extraParts
            }
        );

        // Lưu lịch sử phiên làm việc (không lưu base64) để phục vụ mục 2.6 Tinh chỉnh liên tục
        appState.compose.sessionHistory = sanitizeHistoryForStorage([
            { role: 'user', parts: [{ text: safeHistoryPrompt }] },
            { role: 'model', parts: [{ text: rawText }] }
        ]);
        appState.compose.lastResult = parsed;
        appState.compose.selectedVersionIndex = parsed.versions.length > 1 ? 1 : 0;

        // Lưu vào danh sách 20 bản nháp gần nhất (Mục 2.7)
        saveComposeDraftEntry({
            inputMode: appState.compose.prefs.inputMode,
            originalInput: rawUserText,
            herContextMsg: appState.compose.herContextMsg,
            goal: appState.compose.prefs.goal,
            pronoun: appState.compose.prefs.pronoun,
            prefs: appState.compose.prefs,
            result: parsed
        });

        renderComposeResultUI(parsed);
        renderComposeSavedDraftsUI();
        showToast('Đã phân tích & tạo 3 phương án chỉnh sửa!', '✨');
    } catch (err) {
        renderErrorCard('composeResultArea', err.message);
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = `<span>✨ Phân tích & Chỉnh sửa tin nhắn</span>`;
        }
    }
}

/**
 * Mục 2.6: Xử lý Tinh chỉnh liên tục (bấm nút nhanh hoặc nhập yêu cầu tự do)
 * Nhớ toàn bộ các lần chỉnh trước trong `appState.compose.sessionHistory`
 */
async function handleRefineCompose(instructionText, triggerBtn = null) {
    const cleanInstruction = String(instructionText || '').trim();
    if (!cleanInstruction) {
        showToast('Hãy chọn một nút tinh chỉnh nhanh hoặc gõ yêu cầu của bạn nhé!', '💡');
        return;
    }
    if (!appState.compose.lastResult) {
        await handleGenerateCompose();
        return;
    }

    const oldBtnHtml = triggerBtn ? triggerBtn.innerHTML : '';
    if (triggerBtn) {
        triggerBtn.disabled = true;
        triggerBtn.innerHTML = `<span class="animate-spin">⏳</span><span>Đang chỉnh...</span>`;
    }

    const refinePrompt = buildComposeUserPrompt({
        isRefinement: true,
        refinementInstruction: cleanInstruction
    });

    try {
        const { parsed, rawText } = await callGeminiWithSchemaRetry(
            SYSTEM_PROMPT_COMPOSE,
            appState.compose.sessionHistory,
            refinePrompt,
            SCHEMA_COMPOSE,
            validateComposeJson,
            0.82
        );

        appState.compose.sessionHistory.push({ role: 'user', parts: [{ text: refinePrompt }] });
        appState.compose.sessionHistory.push({ role: 'model', parts: [{ text: rawText }] });
        appState.compose.sessionHistory = sanitizeHistoryForStorage(appState.compose.sessionHistory);
        if (appState.compose.sessionHistory.length > 16) {
            appState.compose.sessionHistory = appState.compose.sessionHistory.slice(-16);
        }

        appState.compose.refinementCount = (appState.compose.refinementCount || 0) + 1;
        appState.compose.lastResult = parsed;

        // Cập nhật bản nháp gần nhất trong danh sách 20 bản nháp
        saveComposeDraftEntry({
            inputMode: appState.compose.prefs.inputMode,
            originalInput: appState.compose.draftInput,
            herContextMsg: appState.compose.herContextMsg,
            goal: appState.compose.prefs.goal,
            pronoun: appState.compose.prefs.pronoun,
            prefs: appState.compose.prefs,
            result: parsed
        });

        renderComposeResultUI(parsed);
        renderComposeSavedDraftsUI();
        showToast(`Đã tinh chỉnh (lần ${appState.compose.refinementCount}): "${cleanInstruction}"`, '🪄');
    } catch (err) {
        showToast(`Không thể tinh chỉnh tiếp: ${err.message}`, '⚠️');
        if (triggerBtn) {
            triggerBtn.disabled = false;
            triggerBtn.innerHTML = oldBtnHtml;
        }
    }
}

/**
 * Mục 2.5: Tạo HTML đối chiếu đánh dấu các phần đã thay đổi (gạch bỏ `from` / tô màu `to`)
 * Bấm vào thay đổi để bật/tắt xem lý do (`reason`).
 */
function buildHighlightedMessageHtml(messageText, changesArray, verIdx, msgIdx) {
    let safeHtml = escapeHtml(messageText || '');

    // Đánh dấu các chỗ trống [...]
    safeHtml = safeHtml.replace(
        /\[([^\]]+)\]/g,
        '<span class="underline decoration-wavy decoration-amber-300 font-bold bg-amber-500/20 px-1 rounded">[$1]</span>'
    );

    if (!Array.isArray(changesArray) || changesArray.length === 0) {
        return safeHtml;
    }

    // Tô nổi bật cụm từ mới `to` ngay trong câu đã sửa để bấm vào xem lý do
    changesArray.forEach((chg, cIdx) => {
        const toClean = String(chg.to || '').trim();
        if (!toClean || toClean.length < 2) return;
        const escapedTo = escapeHtml(toClean);
        if (safeHtml.includes(escapedTo)) {
            const badgeId = `chg_reason_${verIdx}_${cIdx}`;
            const replacement = `<button type="button" data-toggle-change="${badgeId}" class="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-md bg-emerald-100 dark:bg-emerald-950/90 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 font-bold underline decoration-dotted cursor-pointer hover:bg-emerald-200 transition" title="Bấm để xem lý do thay đổi">${escapedTo}<span class="text-[10px]">💡</span></button>`;
            safeHtml = safeHtml.replace(escapedTo, replacement);
        }
    });

    return safeHtml;
}

/**
 * Mục 2.4, 2.5, 2.6: Hiển thị kết quả Chẩn đoán, Cảnh báo, Đối chiếu Bản gốc & 3 Bản sửa + Khung Tinh chỉnh liên tục
 */
function renderComposeResultUI(data) {
    const container = document.getElementById('composeResultArea');
    if (!container || !data) return;

    const d = data.diagnosis || { naturalness: 7, cringe: 2, pushiness: 1, clarity: 8, comment: '' };
    const warnings = Array.isArray(data.warnings) ? data.warnings.filter(w => String(w).trim() !== '') : [];
    const versions = Array.isArray(data.versions) ? data.versions : [];
    const originalText = appState.compose.draftInput || document.getElementById('composeUserInput')?.value.trim() || '';
    const isIdeaMode = appState.compose.prefs.inputMode === 'idea';

    // Hàm phụ dựng thanh điểm 0-10
    const renderScoreMetric = (label, scoreVal, isGoodWhenHigh = true) => {
        const clamped = Math.max(0, Math.min(10, Number(scoreVal) || 0));
        const pct = clamped * 10;
        let barColor = 'bg-emerald-500';
        let badgeColor = 'text-emerald-700 dark:text-emerald-300';

        if (isGoodWhenHigh) {
            if (clamped < 5) {
                barColor = 'bg-red-500';
                badgeColor = 'text-red-600 dark:text-red-400';
            } else if (clamped < 7.5) {
                barColor = 'bg-amber-500';
                badgeColor = 'text-amber-600 dark:text-amber-400';
            }
        } else {
            // Với Độ sến (cringe) và Độ ép (pushiness): càng thấp càng tốt
            if (clamped >= 6) {
                barColor = 'bg-red-500';
                badgeColor = 'text-red-600 dark:text-red-400';
            } else if (clamped >= 3.5) {
                barColor = 'bg-amber-500';
                badgeColor = 'text-amber-600 dark:text-amber-400';
            }
        }

        return `
            <div class="p-2.5 rounded-xl bg-warm-50 dark:bg-stone-900/80 border border-warm-200/70 dark:border-stone-700 space-y-1">
                <div class="flex items-center justify-between text-xs">
                    <span class="font-bold text-stone-700 dark:text-stone-300">${escapeHtml(label)}</span>
                    <span class="font-extrabold font-mono ${badgeColor}">${clamped}/10</span>
                </div>
                <div class="w-full h-1.5 rounded-full bg-warm-200/70 dark:bg-stone-700 overflow-hidden">
                    <div class="h-full rounded-full ${barColor} transition-all duration-300" style="width: ${pct}%"></div>
                </div>
            </div>
        `;
    };

    // Khối Cảnh báo thẳng nếu bản nháp có vấn đề (ép buộc, hỏi dồn, sến, khen ngoại hình đột ngột...)
    const warningsHtml = warnings.length > 0
        ? `
            <div class="rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-300 dark:border-red-800 p-3.5 space-y-1.5 animate-pop">
                <div class="flex items-center gap-1.5 text-xs font-extrabold text-red-700 dark:text-red-300">
                    <span>⚠️</span>
                    <span>Góp ý thẳng thắn về bản nháp của bạn:</span>
                </div>
                <ul class="list-disc list-inside text-xs text-red-900 dark:text-red-200 space-y-1 leading-relaxed">
                    ${warnings.map(w => `<li>${escapeHtml(w)}</li>`).join('')}
                </ul>
            </div>
        `
        : '';

    // 1. Thẻ Chẩn đoán (Diagnosis) + Bản gốc đối chiếu
    let html = `
        ${warningsHtml}

        <div class="bg-white dark:bg-stone-800/95 border border-warm-200 dark:border-stone-700 rounded-2xl p-4 shadow-xs space-y-3 animate-pop">
            <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-1.5">
                    <span class="text-base">🩺</span>
                    <h3 class="text-xs sm:text-sm font-extrabold text-stone-800 dark:text-stone-100">
                        Chẩn đoán bản nháp & Nhận xét
                    </h3>
                </div>
                ${appState.compose.refinementCount > 0 ? `
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300/60">
                    🪄 Đã tinh chỉnh ${appState.compose.refinementCount} lần
                </span>
                ` : ''}
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                ${renderScoreMetric('🌿 Tự nhiên', d.naturalness, true)}
                ${renderScoreMetric('🎯 Độ rõ ý', d.clarity, true)}
                ${renderScoreMetric('🧀 Độ sến', d.cringe, false)}
                ${renderScoreMetric('⚡ Độ ép buộc', d.pushiness, false)}
            </div>

            <p class="text-xs text-stone-700 dark:text-stone-200 leading-relaxed bg-warm-50 dark:bg-stone-900/60 p-3 rounded-xl border border-warm-200/60 dark:border-stone-700">
                💬 <strong>Nhận xét:</strong> ${escapeHtml(d.comment)}
            </p>
        </div>

        <!-- Mục 2.5: Khung đối chiếu Bản gốc và 3 Bản sửa -->
        <div class="bg-warm-100/70 dark:bg-stone-900/80 border border-warm-200 dark:border-stone-700 rounded-2xl p-3.5 space-y-2">
            <div class="flex items-center justify-between">
                <span class="text-xs font-extrabold text-stone-700 dark:text-stone-200">
                    📌 ${isIdeaMode ? 'Ý tưởng ban đầu của bạn' : 'Bản nháp gốc của bạn'} (để đối chiếu):
                </span>
                <span class="text-[10px] text-stone-500 dark:text-stone-400">Bấm vào chữ tô màu hoặc thẻ thay đổi bên dưới để xem lý do sửa</span>
            </div>
            <div class="p-3 rounded-xl bg-white dark:bg-stone-800 border border-warm-200 dark:border-stone-700 text-xs text-stone-700 dark:text-stone-300 whitespace-pre-line leading-relaxed">
                "${escapeHtml(originalText)}"
            </div>
        </div>
    `;

    // 2. Danh sách 3 Phiên bản sửa (Sát bản gốc / Tự nhiên hơn / Ngắn gọn)
    versions.forEach((ver, vIdx) => {
        const isSelectedForRefine = appState.compose.selectedVersionIndex === vIdx;
        const styleName = ver.style || `Phương án ${vIdx + 1}`;
        const msgs = Array.isArray(ver.messages) ? ver.messages : [];
        const changes = Array.isArray(ver.changes) ? ver.changes : [];

        let styleBadge = '📝 ' + styleName;
        if (styleName.toLowerCase().includes('sát')) styleBadge = '📎 Sát bản gốc';
        else if (styleName.toLowerCase().includes('tự nhiên')) styleBadge = '🌿 Tự nhiên hơn';
        else if (styleName.toLowerCase().includes('ngắn')) styleBadge = '⚡ Ngắn gọn';

        const cardBorder = isSelectedForRefine
            ? 'border-2 border-warm-500 dark:border-amber-500 ring-2 ring-warm-500/15'
            : 'border border-warm-200 dark:border-stone-700';

        // Dựng các bong bóng tin nhắn (1-3 tin) kèm nút Copy từng tin
        const messagesHtml = msgs.map((mText, mIdx) => {
            const highlightedHtml = buildHighlightedMessageHtml(mText, changes, vIdx, mIdx);
            return `
                <div class="flex items-center justify-between gap-2 bg-warm-50 dark:bg-stone-900/90 border border-warm-200/80 dark:border-stone-700 rounded-xl p-2.5">
                    <div class="flex items-start gap-2 min-w-0 flex-1">
                        <span class="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-warm-200/80 dark:bg-stone-700 text-stone-700 dark:text-stone-300 flex-shrink-0 mt-0.5">
                            Tin ${mIdx + 1}
                        </span>
                        <div class="text-xs sm:text-sm text-stone-800 dark:text-stone-100 leading-relaxed break-words flex-1">
                            ${highlightedHtml}
                        </div>
                    </div>
                    <button type="button" data-copy-single-ver="${vIdx}" data-copy-single-msg="${mIdx}" class="btn-copy-compose-single px-2.5 py-1.5 rounded-lg bg-white hover:bg-warm-100 dark:bg-stone-800 dark:hover:bg-stone-700 border border-warm-200 dark:border-stone-600 text-[11px] font-bold text-stone-700 dark:text-stone-200 flex-shrink-0 transition" title="Sao chép riêng tin nhắn này">
                        📋 Copy tin
                    </button>
                </div>
            `;
        }).join('');

        // Dựng danh sách đánh dấu phần đã thay đổi (gạch bỏ `from` -> tô màu `to`, bấm xem `reason`) (Mục 2.5)
        const changesListHtml = changes.length > 0
            ? `
                <div class="space-y-1.5 pt-2 border-t border-warm-100 dark:border-stone-700/60">
                    <div class="text-[11px] font-bold text-stone-600 dark:text-stone-300">
                        🔍 Phần đã tinh chỉnh (bấm vào từng mục để xem lý do):
                    </div>
                    <div class="space-y-1.5">
                        ${changes.map((c, cIdx) => {
                            const badgeId = `chg_reason_${vIdx}_${cIdx}`;
                            return `
                                <div class="rounded-xl bg-warm-50/80 dark:bg-stone-900/60 border border-warm-200/70 dark:border-stone-700/80 p-2 text-xs">
                                    <button type="button" data-toggle-change="${badgeId}" class="w-full text-left flex flex-wrap items-center justify-between gap-1.5">
                                        <div class="flex flex-wrap items-center gap-1.5">
                                            <span class="line-through text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 px-1.5 py-0.5 rounded">${escapeHtml(c.from || 'Ý gốc')}</span>
                                            <span class="text-stone-400 font-bold">→</span>
                                            <span class="font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">${escapeHtml(c.to || '')}</span>
                                        </div>
                                        <span class="text-[10px] font-semibold text-warm-600 dark:text-amber-400 flex-shrink-0">💡 Xem lý do ▾</span>
                                    </button>
                                    <div id="${badgeId}" class="hidden mt-1.5 pt-1.5 border-t border-warm-200/60 dark:border-stone-700 text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
                                        <strong>Lý do sửa:</strong> ${escapeHtml(c.reason || '')}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `
            : '';

        html += `
            <div class="bg-white dark:bg-stone-800/95 ${cardBorder} rounded-2xl p-4 shadow-xs space-y-3 animate-pop">
                <div class="flex flex-wrap items-center justify-between gap-2">
                    <div class="flex items-center gap-2">
                        <span class="text-xs sm:text-sm font-extrabold text-warm-600 dark:text-amber-400">${escapeHtml(styleBadge)}</span>
                        <span class="text-[10px] px-2 py-0.5 rounded-full bg-warm-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 font-semibold">
                            ${msgs.length} tin nhắn
                        </span>
                    </div>

                    <div class="flex items-center gap-1.5">
                        <button type="button" data-select-refine-ver="${vIdx}" class="btn-select-refine-ver px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                            isSelectedForRefine
                                ? 'bg-warm-500 text-white shadow-2xs'
                                : 'bg-warm-100 hover:bg-warm-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200'
                        }">
                            ${isSelectedForRefine ? '🎯 Đang chọn để chỉnh tiếp' : 'Chọn bản này để chỉnh tiếp'}
                        </button>
                        <button type="button" data-copy-all-ver="${vIdx}" class="btn-copy-compose-all px-3 py-1 rounded-lg bg-stone-800 hover:bg-stone-900 dark:bg-stone-700 dark:hover:bg-stone-600 text-white text-[11px] font-bold transition">
                            📋 Copy cả bản
                        </button>
                    </div>
                </div>

                <!-- Đối chiếu trực quan: Bản gốc bên trái (trên desktop) & Bản đã sửa bên phải -->
                <div class="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-stretch">
                    <div class="sm:col-span-4 p-2.5 rounded-xl bg-stone-100/80 dark:bg-stone-900/50 border border-stone-200/80 dark:border-stone-700/70 flex flex-col justify-between">
                        <div class="text-[10px] font-bold text-stone-400 uppercase mb-1">
                            ${isIdeaMode ? 'Ý ban đầu' : 'Bản gốc'}
                        </div>
                        <div class="text-xs text-stone-600 dark:text-stone-400 line-clamp-4 whitespace-pre-line leading-relaxed flex-1">
                            "${escapeHtml(originalText)}"
                        </div>
                    </div>

                    <div class="sm:col-span-8 space-y-2">
                        ${messagesHtml}
                    </div>
                </div>

                <!-- Gợi ý Emoji & Mô tả Sticker đi kèm (Mục 2.4) -->
                <div class="flex flex-wrap items-center gap-2 text-[11px] text-stone-600 dark:text-stone-300 bg-warm-50/70 dark:bg-stone-900/40 px-3 py-2 rounded-xl border border-warm-100 dark:border-stone-700/60">
                    <div><strong>😊 Emoji hợp:</strong> ${escapeHtml(ver.emoji || '😊')}</div>
                    <span class="text-stone-300 dark:text-stone-600">•</span>
                    <div><strong>🧸 Gợi ý Sticker:</strong> ${escapeHtml(ver.stickerIdea || 'Không bắt buộc')}</div>
                </div>

                ${changesListHtml}
            </div>
        `;
    });

    // 3. Khung Tinh chỉnh liên tục (Mục 2.6)
    const activeVer = versions[appState.compose.selectedVersionIndex] || versions[0];
    const activeVerName = activeVer ? activeVer.style : 'Bản đang chọn';

    html += `
        <div class="bg-white dark:bg-stone-800/95 border-2 border-warm-300 dark:border-stone-700 rounded-2xl p-4 shadow-xs space-y-3 animate-pop">
            <div class="flex flex-wrap items-center justify-between gap-2">
                <div>
                    <h4 class="text-xs sm:text-sm font-extrabold text-stone-800 dark:text-stone-100 flex items-center gap-1.5">
                        <span>🪄</span>
                        <span>Tinh chỉnh liên tục (Đang chọn: <span class="text-warm-600 dark:text-amber-400">${escapeHtml(activeVerName)}</span>)</span>
                    </h4>
                    <p class="text-[11px] text-stone-500 dark:text-stone-400">
                        Bấm nút nhanh hoặc gõ yêu cầu thêm. Phiên làm việc nhớ toàn bộ các lần chỉnh trước của bạn.
                    </p>
                </div>
            </div>

            <!-- 6 nút tinh chỉnh nhanh theo đúng Mục 2.6 -->
            <div class="flex flex-wrap gap-1.5">
                <button type="button" data-quick-refine="Làm cho tin nhắn ngắn gọn hơn nữa" class="btn-quick-refine px-2.5 py-1.5 rounded-xl bg-warm-100 hover:bg-warm-200 dark:bg-stone-700 dark:hover:bg-stone-600 text-stone-800 dark:text-stone-100 text-xs font-bold border border-warm-200 dark:border-stone-600 transition">
                    ✂️ Ngắn hơn
                </button>
                <button type="button" data-quick-refine="Làm cho giọng điệu vui vẻ, hài hước và giàu năng lượng hơn" class="btn-quick-refine px-2.5 py-1.5 rounded-xl bg-warm-100 hover:bg-warm-200 dark:bg-stone-700 dark:hover:bg-stone-600 text-stone-800 dark:text-stone-100 text-xs font-bold border border-warm-200 dark:border-stone-600 transition">
                    😄 Vui hơn
                </button>
                <button type="button" data-quick-refine="Giảm bớt độ sến, viết tự nhiên đời thường như bạn bè nói chuyện" class="btn-quick-refine px-2.5 py-1.5 rounded-xl bg-warm-100 hover:bg-warm-200 dark:bg-stone-700 dark:hover:bg-stone-600 text-stone-800 dark:text-stone-100 text-xs font-bold border border-warm-200 dark:border-stone-600 transition">
                    🧊 Bớt sến
                </button>
                <button type="button" data-quick-refine="Thêm 1-2 emoji biểu cảm tự nhiên phù hợp với ngữ cảnh" class="btn-quick-refine px-2.5 py-1.5 rounded-xl bg-warm-100 hover:bg-warm-200 dark:bg-stone-700 dark:hover:bg-stone-600 text-stone-800 dark:text-stone-100 text-xs font-bold border border-warm-200 dark:border-stone-600 transition">
                    😊 Thêm emoji
                </button>
                <button type="button" data-quick-refine="Bớt viết tắt, viết chữ rõ ràng lịch sự hơn" class="btn-quick-refine px-2.5 py-1.5 rounded-xl bg-warm-100 hover:bg-warm-200 dark:bg-stone-700 dark:hover:bg-stone-600 text-stone-800 dark:text-stone-100 text-xs font-bold border border-warm-200 dark:border-stone-600 transition">
                    📖 Bớt viết tắt
                </button>
                <button type="button" data-quick-refine="Viết giọng chân thành, ấm áp và tinh tế hơn" class="btn-quick-refine px-2.5 py-1.5 rounded-xl bg-warm-100 hover:bg-warm-200 dark:bg-stone-700 dark:hover:bg-stone-600 text-stone-800 dark:text-stone-100 text-xs font-bold border border-warm-200 dark:border-stone-600 transition">
                    💛 Chân thành hơn
                </button>
            </div>

            <!-- Ô gõ yêu cầu tinh chỉnh tự do -->
            <div class="flex items-center gap-2 pt-1">
                <input id="composeFreeRefineInput" type="text" placeholder="Hoặc gõ yêu cầu riêng (vd: nhắc tới con mèo của cô ấy, hỏi thêm cuối tuần rảnh ko...)" class="flex-1 rounded-xl bg-warm-50 dark:bg-stone-900 border border-warm-200 dark:border-stone-700 px-3 py-2 text-xs text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-warm-500">
                <button type="button" id="btnSubmitFreeRefine" class="px-3.5 py-2 rounded-xl bg-warm-500 hover:bg-warm-600 text-white font-bold text-xs shadow-xs transition flex-shrink-0">
                    🪄 Chỉnh tiếp
                </button>
            </div>
        </div>
    `;

    container.innerHTML = html;

    // Sự kiện bấm vào từng thay đổi để xem lý do (`reason`)
    container.querySelectorAll('[data-toggle-change]').forEach(el => {
        el.addEventListener('click', () => {
            const targetId = el.getAttribute('data-toggle-change');
            const reasonBox = document.getElementById(targetId);
            if (reasonBox) {
                reasonBox.classList.toggle('hidden');
            }
        });
    });

    // Sự kiện Copy từng tin nhắn lẻ
    container.querySelectorAll('.btn-copy-compose-single').forEach(btn => {
        btn.addEventListener('click', () => {
            const vIdx = parseInt(btn.getAttribute('data-copy-single-ver'), 10);
            const mIdx = parseInt(btn.getAttribute('data-copy-single-msg'), 10);
            const msgText = data.versions?.[vIdx]?.messages?.[mIdx] || '';
            if (msgText) copyText(msgText);
        });
    });

    // Sự kiện Copy cả bản (nối các tin bằng xuống dòng)
    container.querySelectorAll('.btn-copy-compose-all').forEach(btn => {
        btn.addEventListener('click', () => {
            const vIdx = parseInt(btn.getAttribute('data-copy-all-ver'), 10);
            const msgs = data.versions?.[vIdx]?.messages || [];
            if (msgs.length > 0) {
                copyText(msgs.join('\n'));
            }
        });
    });

    // Sự kiện chọn phiên bản để tinh chỉnh tiếp
    container.querySelectorAll('.btn-select-refine-ver').forEach(btn => {
        btn.addEventListener('click', () => {
            const vIdx = parseInt(btn.getAttribute('data-select-refine-ver'), 10);
            appState.compose.selectedVersionIndex = vIdx;
            renderComposeResultUI(data);
        });
    });

    // Sự kiện 6 nút tinh chỉnh nhanh
    container.querySelectorAll('.btn-quick-refine').forEach(btn => {
        btn.addEventListener('click', () => {
            const instruction = btn.getAttribute('data-quick-refine');
            handleRefineCompose(instruction, btn);
        });
    });

    // Sự kiện ô gõ yêu cầu tinh chỉnh tự do
    const freeInput = document.getElementById('composeFreeRefineInput');
    const freeBtn = document.getElementById('btnSubmitFreeRefine');
    if (freeBtn && freeInput) {
        const triggerFreeRefine = () => {
            const val = freeInput.value.trim();
            if (!val) {
                showToast('Hãy gõ nội dung bạn muốn chỉnh thêm vào ô nhé!', '✍️');
                freeInput.focus();
                return;
            }
            handleRefineCompose(val, freeBtn);
        };
        freeBtn.addEventListener('click', triggerFreeRefine);
        freeInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                triggerFreeRefine();
            }
        });
    }
}

/**
 * Mục 2.7: Hiển thị danh sách 20 bản nháp gần nhất để xem lại / nạp lại / xoá
 */
function renderComposeSavedDraftsUI() {
    const listContainer = document.getElementById('composeSavedDraftsList');
    const countBadge = document.getElementById('composeSavedDraftsCountBadge');
    const clearAllBtn = document.getElementById('btnClearAllComposeDrafts');
    if (!listContainer) return;

    const drafts = Array.isArray(appState.composeDrafts) ? appState.composeDrafts : [];
    if (countBadge) {
        countBadge.textContent = `${drafts.length}/20 bản nháp`;
    }
    if (clearAllBtn) {
        clearAllBtn.classList.toggle('hidden', drafts.length === 0);
    }

    if (drafts.length === 0) {
        listContainer.innerHTML = `
            <p class="text-xs text-stone-400 dark:text-stone-500 text-center py-3">
                Chưa có bản nháp nào được lưu. Mỗi lần bạn soạn và chỉnh tin nhắn, hệ thống sẽ tự lưu tối đa 20 bản gần nhất tại đây.
            </p>
        `;
        return;
    }

    listContainer.innerHTML = drafts.map((item, idx) => {
        const timeStr = new Date(item.createdAt || Date.now()).toLocaleString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit'
        });
        const modeTag = item.inputMode === 'idea' ? '💡 Chỉ có ý' : '✍️ Viết nháp';
        const previewRevised = item.result?.versions?.[1]?.messages?.[0] || item.result?.versions?.[0]?.messages?.[0] || '';

        return `
            <div class="p-3 rounded-xl bg-warm-50/90 dark:bg-stone-900/70 border border-warm-200 dark:border-stone-700 flex items-start justify-between gap-2.5 text-xs">
                <div class="space-y-1 min-w-0 flex-1">
                    <div class="flex flex-wrap items-center gap-1.5 text-[10px] text-stone-500 dark:text-stone-400 font-semibold">
                        <span class="px-1.5 py-0.5 rounded bg-warm-200/70 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold">${modeTag}</span>
                        <span>• ${escapeHtml(item.pronoun || 'mình - bạn')}</span>
                        <span>• ${escapeHtml(timeStr)}</span>
                    </div>
                    <div class="text-stone-700 dark:text-stone-300 truncate">
                        <strong>Gốc:</strong> "${escapeHtml(item.originalInput)}"
                    </div>
                    ${previewRevised ? `
                    <div class="text-emerald-700 dark:text-emerald-300 truncate">
                        <strong>Bản sửa:</strong> "${escapeHtml(previewRevised)}"
                    </div>
                    ` : ''}
                </div>
                <div class="flex items-center gap-1 flex-shrink-0">
                    <button type="button" data-load-draft-idx="${idx}" class="px-2.5 py-1.5 rounded-lg bg-warm-500 hover:bg-warm-600 text-white font-bold text-[11px] transition">
                        Xem lại
                    </button>
                    <button type="button" data-del-draft-idx="${idx}" class="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-300 font-bold text-xs transition" title="Xoá bản nháp này">
                        ✕
                    </button>
                </div>
            </div>
        `;
    }).join('');

    // Nạp lại bản nháp cũ khi bấm "Xem lại"
    listContainer.querySelectorAll('button[data-load-draft-idx]').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.getAttribute('data-load-draft-idx'), 10);
            const item = appState.composeDrafts[idx];
            if (!item) return;

            appState.compose.prefs = normalizeComposePrefs({
                ...appState.compose.prefs,
                ...(item.prefs || {}),
                inputMode: item.inputMode,
                goal: item.goal || appState.compose.prefs.goal,
                pronoun: item.pronoun || appState.compose.prefs.pronoun
            });
            appState.compose.draftInput = item.originalInput;
            appState.compose.herContextMsg = item.herContextMsg || '';
            appState.compose.lastResult = item.result;
            appState.compose.selectedVersionIndex = item.result?.versions?.length > 1 ? 1 : 0;
            appState.compose.sessionHistory = [];
            appState.compose.refinementCount = 0;

            const userInputEl = document.getElementById('composeUserInput');
            const herMsgEl = document.getElementById('composeHerMsgInput');
            if (userInputEl) userInputEl.value = item.originalInput;
            if (herMsgEl) herMsgEl.value = item.herContextMsg || '';

            syncComposeUIFromState();
            showToast('Đã nạp lại bản nháp và 3 phương án sửa!', '📂');
        });
    });

    // Xoá 1 bản nháp
    listContainer.querySelectorAll('button[data-del-draft-idx]').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.getAttribute('data-del-draft-idx'), 10);
            if (!Number.isNaN(idx) && appState.composeDrafts[idx]) {
                appState.composeDrafts.splice(idx, 1);
                saveComposeStateToStorage();
                renderComposeSavedDraftsUI();
                showToast('Đã xoá bản nháp', '🗑️');
            }
        });
    });
}