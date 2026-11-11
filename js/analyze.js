/**
 * ============================================================================
 * GIAI ĐOẠN 4: TAB 📡 PHÂN TÍCH (ĐỌC TÍN HIỆU CẢM XÚC & CỨU CUỘC TRÒ CHUYỆN)
 * (Mục 4A.1 -> 4A.4 & Mục 4B.1 -> 4B.6)
 * ============================================================================
 */

let resolvedAnalyzeNavKey = 'analyze';
let resolvedAnalyzeSectionId = 'viewAnalyze';

// Danh sách 6 nút tình huống nhanh ở Mục 4B.5
const RESCUE_QUICK_SITUATIONS = [
    {
        id: 'seen_no_rep',
        icon: '👀',
        label: 'Seen không rep',
        hint: 'Cô ấy đã xem tin nhắn của bạn từ vài tiếng hoặc vài ngày trước nhưng chưa trả lời.',
        placeholder: 'Nhập tin nhắn cuối bạn đã gửi trước khi cô ấy seen (ví dụ: Cuối tuần này cậu có kế hoạch gì vui chưa?)...'
    },
    {
        id: 'short_replies',
        icon: '🧊',
        label: 'Cô ấy trả lời cụt liên tục',
        hint: 'Cô ấy chỉ đáp ngắn gọn kiểu "ừ", "ok", "haha", "đúng rồi" và không hỏi ngược lại.',
        placeholder: 'Dán vài câu hỏi đáp gần nhất mà cô ấy trả lời cụt lủn...'
    },
    {
        id: 'silent_days',
        icon: '⏳',
        label: 'Im lặng nhiều ngày',
        hint: 'Cả hai đã tự nhiên ngưng nhắn tin với nhau vài ngày đến 1-2 tuần do bận hoặc hết chuyện.',
        placeholder: 'Ghi chú chủ đề cuối cùng hai bạn nói trước khi im lặng (hoặc sở thích của cô ấy)...'
    },
    {
        id: 'rejected_hangout',
        icon: '☕',
        label: 'Sau khi bị từ chối rủ đi chơi',
        hint: 'Bạn vừa ngỏ lời rủ đi cafe/xem phim nhưng cô ấy báo bận hoặc từ chối khéo, không khí hơiượng.',
        placeholder: 'Dán lời rủ của bạn và câu trả lời từ chối của cô ấy...'
    },
    {
        id: 'cringe_or_pushy',
        icon: '🙈',
        label: 'Tôi lỡ nhắn sến/ép và cô ấy lạnh đi',
        hint: 'Cần xin lỗi hoặc chữa ngượng thật gọn 1 câu tự nhiên, tuyệt đối không xin lỗi dồn dập.',
        placeholder: 'Dán câu bạn đã lỡ nhắn hơi sến/hơi vội và phản ứng của cô ấy sau đó...'
    },
    {
        id: 'interview_mode',
        icon: '🎤',
        label: 'Toàn hỏi đáp kiểu phỏng vấn',
        hint: 'Cuộc trò chuyện bị khô khan vì bạn hỏi liên tiếp hết câu này đến câu khác như tra khảo.',
        placeholder: 'Dán đoạn chat đang bị giống phỏng vấn để AI giúp bẻ lái sang chia sẻ tự nhiên...'
    }
];

/**
 * Tự động tìm chính xác nút "📡 Phân tích" trên thanh điều hướng dưới đáy
 * và tìm đúng <section> tương ứng trong <main> để gắn giao diện Giai đoạn 4.
 */
function ensureAnalyzeViewMounted() {
    const navButtons = Array.from(document.querySelectorAll('.bottom-nav-btn'));
    const analyzeNavBtn =
        navButtons.find(btn => {
            const txt = (btn.textContent || '').toLowerCase();
            const navAttr = (btn.getAttribute('data-nav') || '').toLowerCase();
            return (
                txt.includes('phân tích') ||
                txt.includes('📡') ||
                ['analyze', 'signal', 'moded', 'phantich', 'rescue'].includes(navAttr)
            );
        }) || navButtons[3]; // Tab thứ 4 trên thanh 5 tab

    if (analyzeNavBtn && analyzeNavBtn.getAttribute('data-nav')) {
        resolvedAnalyzeNavKey = analyzeNavBtn.getAttribute('data-nav');
    }

    const mainEl = document.querySelector('main');
    let section = null;

    const candidateIds = [
        'viewAnalyze',
        'viewSignal',
        'viewModeD',
        'viewPhanTich',
        'sectionAnalyze',
        `view-${resolvedAnalyzeNavKey}`,
        `view${resolvedAnalyzeNavKey.charAt(0).toUpperCase() + resolvedAnalyzeNavKey.slice(1)}`
    ];

    for (const cid of candidateIds) {
        const found = document.getElementById(cid);
        if (found) {
            section = found;
            break;
        }
    }

    if (!section && mainEl) {
        const knownOtherIds = new Set(['viewModeA', 'viewCompose', 'viewDating', 'viewMatch', 'viewModeB', 'viewSettings']);
        const allSections = Array.from(mainEl.querySelectorAll('section'));
        section = allSections.find(sec => {
            if (knownOtherIds.has(sec.id)) return false;
            const text = (sec.textContent || '').toLowerCase();
            const idLower = (sec.id || '').toLowerCase();
            return (
                idLower.includes('analyze') ||
                idLower.includes('signal') ||
                idLower.includes('phantich') ||
                text.includes('phân tích') ||
                text.includes('📡')
            );
        });
    }

    if (!section && mainEl) {
        section = document.createElement('section');
        section.id = 'viewAnalyze';
        section.className = 'space-y-3.5 hidden';
        const modeBSec = document.getElementById('viewModeB');
        if (modeBSec) {
            mainEl.insertBefore(section, modeBSec);
        } else {
            mainEl.appendChild(section);
        }
    }

    if (!section) return null;
    if (!section.id) {
        section.id = 'viewAnalyze';
    }
    resolvedAnalyzeSectionId = section.id;

    const quickButtonsHtml = RESCUE_QUICK_SITUATIONS.map(
        item => `
            <button type="button" data-rescue-quick="${item.id}" class="rescue-quick-btn p-2.5 rounded-xl border text-left transition flex items-start gap-2 bg-warm-50 dark:bg-stone-900 border-warm-200 dark:border-stone-700 hover:bg-warm-100 dark:hover:bg-stone-800">
                <span class="text-base leading-none mt-0.5">${item.icon}</span>
                <span class="text-xs font-bold text-stone-800 dark:text-stone-100 leading-snug">${escapeHtml(item.label)}</span>
            </button>
        `
    ).join('');

    section.className = 'space-y-3.5 hidden';
    section.innerHTML = `
        <!-- 1. HEADER & NÚT CHUYỂN CHẾ ĐỘ 4A / 4B -->
        <div class="bg-white dark:bg-stone-800/90 border border-warm-200 dark:border-stone-700 rounded-2xl p-4 shadow-xs space-y-3">
            <div class="flex items-start gap-2.5">
                <div class="w-9 h-9 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white text-base shadow-xs flex-shrink-0">
                    📡
                </div>
                <div>
                    <h2 class="text-sm font-extrabold text-stone-900 dark:text-white">Đọc tín hiệu cảm xúc & Cứu cuộc trò chuyện</h2>
                    <p class="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                        Phân tích khách quan mức độ hứng thú từ câu chữ và lập kế hoạch xử lý khi cuộc trò chuyện nguội lạnh.
                    </p>
                </div>
            </div>

            <!-- NHẮC NHỞ CỐ ĐỊNH MỤC 4A.4 -->
            <div class="p-2.5 rounded-xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/70 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2 font-semibold">
                <span>💡</span>
                <span>Đây là đọc từ chữ, có thể sai. Cô ấy có thể đang bận.</span>
            </div>

            <!-- Thanh chuyển đổi 2 chế độ: 4A (Đọc tín hiệu) & 4B (Cứu cuộc trò chuyện) -->
            <div class="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-warm-100 dark:bg-stone-900 border border-warm-200/80 dark:border-stone-700">
                <button type="button" id="btnSubModeSignal" class="py-2 px-3 rounded-lg text-xs font-extrabold transition flex items-center justify-center gap-1.5">
                    <span>📡</span>
                    <span>4A. Đọc tín hiệu cảm xúc</span>
                </button>
                <button type="button" id="btnSubModeRescue" class="py-2 px-3 rounded-lg text-xs font-extrabold transition flex items-center justify-center gap-1.5">
                    <span>🛟</span>
                    <span>4B. Cứu cuộc trò chuyện</span>
                </button>
            </div>
        </div>

        <!-- 2. KHUNG NGUỒN DỮ LIỆU DÙNG CHUNG (CHỌN THREAD / DÁN CHỮ / ĐÍNH KÈM ẢNH & .TXT) -->
        <div class="bg-white dark:bg-stone-800/90 border border-warm-200 dark:border-stone-700 rounded-2xl p-4 shadow-xs space-y-3.5">
            <!-- Nguồn 1: Chọn cuộc trò chuyện (Thread) -->
            <div class="space-y-1.5">
                <div class="flex items-center justify-between gap-2">
                    <label for="analyzeThreadSelect" class="text-xs font-bold text-stone-700 dark:text-stone-300">
                        👤 1. Chọn cuộc trò chuyện (Thread) để lấy ngữ cảnh & lưu lịch sử tín hiệu:
                    </label>
                    <button type="button" id="btnLoadThreadMsgsToAnalyze" class="text-[11px] font-bold text-warm-600 dark:text-amber-400 hover:underline">
                        📥 Nạp tin nhắn từ Thread
                    </button>
                </div>
                <select id="analyzeThreadSelect" class="w-full rounded-xl bg-warm-50 dark:bg-stone-900 border border-warm-200 dark:border-stone-700 px-3 py-2 text-xs font-semibold text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-warm-500"></select>
            </div>

            <!-- Khungแสดง Xu hướng lịch sử tín hiệu của Thread đang chọn (Mục 4A.3) -->
            <div id="analyzeThreadSignalHistoryBox" class="hidden"></div>

            <!-- KHỐI RIÊNG CỦA 4B.5: LƯỚI 6 NÚT TÌNH HUỐNG NHANH KHI CỨU CUỘC TRÒ CHUYỆN -->
            <div id="analyzeRescueQuickBox" class="hidden space-y-2.5 pt-2 border-t border-warm-100 dark:border-stone-700/60">
                <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-stone-700 dark:text-stone-300">⚡ Tình huống nhanh (bấm để chọn tình huống đang gặp):</span>
                    <button type="button" id="btnClearQuickSituation" class="text-[11px] text-stone-400 hover:text-stone-600 dark:hover:text-stone-200">Bỏ chọn</button>
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-2" id="rescueQuickGrid">
                    ${quickButtonsHtml}
                </div>
                <!-- Khung nhập ngắn mở ra khi bấm vào 1 nút tình huống nhanh (Mục 4B.5) -->
                <div id="rescueQuickDetailBox" class="hidden p-3 rounded-xl bg-amber-50/70 dark:bg-stone-900 border border-amber-200 dark:border-stone-700 space-y-2 animate-pop">
                    <div class="text-xs font-bold text-amber-900 dark:text-amber-300" id="rescueQuickHintText"></div>
                    <input id="rescueQuickNoteInput" type="text" placeholder="Nhập thêm chi tiết ngắn..." class="w-full rounded-xl bg-white dark:bg-stone-800 border border-warm-200 dark:border-stone-700 px-3 py-2 text-xs text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-warm-500">
                </div>
            </div>

            <!-- Nguồn 2: Đính kèm ảnh chụp màn hình / file .txt chat -->
            <div id="analyzeAttachmentRoot"></div>

            <!-- Nguồn 3: Dán văn bản đoạn hội thoại -->
            <div>
                <div class="flex items-center justify-between mb-1">
                    <label for="analyzeChatTextInput" class="text-xs font-bold text-stone-700 dark:text-stone-300">
                        💬 Hoặc dán đoạn hội thoại cần phân tích (ghi rõ Cô ấy / Tôi nếu có nhiều lượt):
                    </label>
                    <button type="button" id="btnClearAnalyzeText" class="text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition">
                        Xoá chữ
                    </button>
                </div>
                <textarea id="analyzeChatTextInput" rows="4" placeholder="Ví dụ:\nTôi: Hôm nay chạy deadline mệt ko cậu?\nCô ấy: Mệt xỉu luôn á 😭 nay tớ phải làm tới 7h tối mới về\nTôi: Thương thế, ăn tối chưa?\nCô ấy: Tớ vừa ăn mì gói xong haha, còn cậu ăn gì chưa?" class="w-full rounded-xl bg-warm-50 dark:bg-stone-900/90 border border-warm-200 dark:border-stone-700 p-3 text-xs sm:text-sm text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-warm-500 transition resize-none"></textarea>
            </div>

            <!-- Thanh chọn giọng văn khi gợi ý tin nhắn hồi sinh (hiện ở chế độ 4B) -->
            <div id="analyzeRescueStyleBox" class="hidden p-3 rounded-xl bg-warm-100/70 dark:bg-stone-900/60 border border-warm-200/80 dark:border-stone-700 space-y-2.5">
                <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-stone-700 dark:text-stone-300">🗣️ Xưng hô cho tin nhắn hồi sinh:</span>
                </div>
                <div class="flex flex-wrap gap-1.5" id="pronounGroupAnalyze">
                    <button type="button" data-value="mình - bạn" class="chip-btn text-xs py-1 px-2.5 rounded-xl border transition">mình - bạn</button>
                    <button type="button" data-value="tớ - cậu" class="chip-btn text-xs py-1 px-2.5 rounded-xl border transition">tớ - cậu</button>
                    <button type="button" data-value="anh - em" class="chip-btn text-xs py-1 px-2.5 rounded-xl border transition">anh - em</button>
                    <button type="button" data-value="tui - bà" class="chip-btn text-xs py-1 px-2.5 rounded-xl border transition">tui - bà</button>
                </div>
            </div>

            <!-- Nút bấm Phân tích chính -->
            <button type="button" id="btnSubmitAnalyze" class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-sky-500/20 active:scale-[0.99] transition flex items-center justify-center gap-2">
                <span id="btnSubmitAnalyzeText">📡 Phân tích tín hiệu cảm xúc chuyên sâu</span>
            </button>
        </div>

        <!-- 3. KHU VỰC HIỂN THỊ KẾT QUẢ 4A HOẶC 4B -->
        <div id="analyzeResultArea" class="space-y-4"></div>
    `;

    return section;
}

// Lấy đối tượng Thread mục tiêu đang được chọn trong Tab Phân tích
function getAnalyzeTargetThread() {
    const sel = appState.analyze?.threadId || 'active';
    if (sel === 'none') return null;
    if (sel === 'active') return getActiveThread();
    return appState.threads.find(t => t.id === sel) || getActiveThread();
}

// Cập nhật danh sách Thread trong dropdown của Tab Phân tích
function renderAnalyzeThreadSelectUI() {
    const selectEl = document.getElementById('analyzeThreadSelect');
    if (!selectEl) return;

    const currentVal = appState.analyze.threadId || 'active';
    const activeThread = getActiveThread();

    let html = `
        <option value="active">📌 Cuộc trò chuyện đang mở: ${escapeHtml(activeThread.name)} (${activeThread.messages?.length || 0} tin)</option>
        <option value="none">🚫 Không gắn với cuộc trò chuyện nào (chỉ đọc chữ/ảnh bên dưới)</option>
    `;

    appState.threads.forEach(t => {
        html += `<option value="${escapeHtml(t.id)}">👤 ${escapeHtml(t.name)} (${t.messages?.length || 0} tin • ${t.signalHistory?.length || 0} lần đo tín hiệu)</option>`;
    });

    selectEl.innerHTML = html;
    if ([...selectEl.options].some(o => o.value === currentVal)) {
        selectEl.value = currentVal;
    } else {
        selectEl.value = 'active';
        appState.analyze.threadId = 'active';
    }

    renderThreadSignalHistoryUI();
}

/**
 * Mục 4A.3: Hiển thị lịch sử xu hướng tín hiệu (`thread.signalHistory[]`) theo thời gian
 */
function renderThreadSignalHistoryUI() {
    const box = document.getElementById('analyzeThreadSignalHistoryBox');
    if (!box) return;

    const targetThread = getAnalyzeTargetThread();
    const hist = targetThread && Array.isArray(targetThread.signalHistory) ? targetThread.signalHistory : [];

    if (!targetThread || hist.length === 0) {
        box.className = 'hidden';
        box.innerHTML = '';
        return;
    }

    const recent = hist.slice(-8);
    const itemsHtml = recent
        .map((item, idx) => {
            const timeStr = new Date(item.timestamp).toLocaleString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
                day: '2-digit',
                month: '2-digit'
            });
            const scoreColor =
                item.interestScore >= 65
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : item.interestScore >= 40
                    ? 'text-sky-600 dark:text-sky-400'
                    : 'text-amber-600 dark:text-amber-400';

            return `
                <div class="flex-shrink-0 px-2.5 py-1.5 rounded-xl bg-white dark:bg-stone-800 border border-warm-200 dark:border-stone-700 text-[11px] space-y-0.5">
                    <div class="text-stone-400 font-mono text-[10px]">#${idx + 1} • ${timeStr}</div>
                    <div class="font-extrabold ${scoreColor}">${item.interestScore}/100 • ${escapeHtml(item.trend)}</div>
                </div>
            `;
        })
        .join('');

    box.className =
        'p-3 rounded-xl bg-warm-50/90 dark:bg-stone-900/80 border border-warm-200 dark:border-stone-700 space-y-2';
    box.innerHTML = `
        <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-stone-700 dark:text-stone-300">
                📈 Xu hướng hứng thú theo thời gian của "${escapeHtml(targetThread.name)}" (${hist.length} lần đo):
            </span>
            <button type="button" id="btnClearThreadSignalHist" class="text-[10px] text-red-500 hover:underline font-semibold">
                Xoá lịch sử đo
            </button>
        </div>
        <div class="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
            ${itemsHtml}
        </div>
    `;

    const btnClear = document.getElementById('btnClearThreadSignalHist');
    if (btnClear) {
        btnClear.addEventListener('click', () => {
            targetThread.signalHistory = [];
            saveThreadsToStorage();
            renderThreadSignalHistoryUI();
            showToast('Đã xoá lịch sử đo tín hiệu của cuộc trò chuyện này!', '🗑️');
        });
    }
}

// Đồng bộ trạng thái giao diện Tab Phân tích (4A / 4B)
function syncAnalyzeUIFromState() {
    if (!appState.analyze && typeof createDefaultAnalyzeState === 'function') {
        appState.analyze = createDefaultAnalyzeState();
    }
    const a = appState.analyze;
    const isSignal = a.subMode !== 'rescue';

    const btnSignal = document.getElementById('btnSubModeSignal');
    const btnRescue = document.getElementById('btnSubModeRescue');
    const rescueQuickBox = document.getElementById('analyzeRescueQuickBox');
    const rescueStyleBox = document.getElementById('analyzeRescueStyleBox');
    const submitBtn = document.getElementById('btnSubmitAnalyze');
    const submitText = document.getElementById('btnSubmitAnalyzeText');

    if (btnSignal && btnRescue) {
        btnSignal.className = isSignal
            ? 'py-2 px-3 rounded-lg text-xs font-extrabold transition flex items-center justify-center gap-1.5 bg-white dark:bg-stone-800 text-sky-600 dark:text-sky-400 shadow-xs'
            : 'py-2 px-3 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 text-stone-500 dark:text-stone-400 hover:text-stone-800';
        btnRescue.className = !isSignal
            ? 'py-2 px-3 rounded-lg text-xs font-extrabold transition flex items-center justify-center gap-1.5 bg-white dark:bg-stone-800 text-amber-600 dark:text-amber-400 shadow-xs'
            : 'py-2 px-3 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 text-stone-500 dark:text-stone-400 hover:text-stone-800';
    }

    if (rescueQuickBox) rescueQuickBox.classList.toggle('hidden', isSignal);
    if (rescueStyleBox) rescueStyleBox.classList.toggle('hidden', isSignal);

    if (submitBtn && submitText) {
        if (isSignal) {
            submitBtn.className =
                'w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-sky-500/20 active:scale-[0.99] transition flex items-center justify-center gap-2';
            submitText.textContent = '📡 Phân tích tín hiệu cảm xúc chuyên sâu';
        } else {
            submitBtn.className =
                'w-full py-3 px-4 rounded-xl bg-gradient-to-r from-warm-500 to-amber-600 hover:from-warm-600 hover:to-amber-700 text-white font-bold text-sm shadow-md shadow-warm-500/20 active:scale-[0.99] transition flex items-center justify-center gap-2';
            submitText.textContent = '🛟 Chẩn đoán độ nguội & Lập kế hoạch xử lý';
        }
    }

    const chatInputEl = document.getElementById('analyzeChatTextInput');
    if (chatInputEl) chatInputEl.value = a.chatTextInput || '';

    renderAnalyzeThreadSelectUI();
    highlightChipGroup('pronounGroupAnalyze', a.pronoun || 'mình - bạn');
    updateRescueQuickButtonsUI();

    const resArea = document.getElementById('analyzeResultArea');
    if (!resArea) return;

    if (isSignal && a.lastSignalResult) {
        renderAnalyzeSignalResultUI(a.lastSignalResult);
    } else if (!isSignal && a.lastRescueResult) {
        renderAnalyzeRescueResultUI(a.lastRescueResult);
    } else {
        resArea.innerHTML = '';
    }
}

// Cập nhật trạng thái lưới 6 nút tình huống nhanh (Mục 4B.5)
function updateRescueQuickButtonsUI() {
    const a = appState.analyze;
    const activeId = a.quickSituation || '';
    const grid = document.getElementById('rescueQuickGrid');
    const detailBox = document.getElementById('rescueQuickDetailBox');
    const hintText = document.getElementById('rescueQuickHintText');
    const noteInput = document.getElementById('rescueQuickNoteInput');

    if (grid) {
        grid.querySelectorAll('.rescue-quick-btn').forEach(btn => {
            const id = btn.getAttribute('data-rescue-quick');
            const isSel = id === activeId;
            btn.className = isSel
                ? 'rescue-quick-btn p-2.5 rounded-xl border-2 text-left transition flex items-start gap-2 bg-amber-50 dark:bg-amber-950/50 border-warm-500 dark:border-amber-500 shadow-xs'
                : 'rescue-quick-btn p-2.5 rounded-xl border text-left transition flex items-start gap-2 bg-warm-50 dark:bg-stone-900 border-warm-200 dark:border-stone-700 hover:bg-warm-100 dark:hover:bg-stone-800';
        });
    }

    const foundSit = RESCUE_QUICK_SITUATIONS.find(s => s.id === activeId);
    if (detailBox && hintText && noteInput) {
        if (foundSit) {
            detailBox.classList.remove('hidden');
            hintText.textContent = `${foundSit.icon} ${foundSit.label}: ${foundSit.hint}`;
            noteInput.placeholder = foundSit.placeholder;
            noteInput.value = a.quickSituationNote || '';
        } else {
            detailBox.classList.add('hidden');
        }
    }
}

// Tổng hợp văn bản hội thoại từ Thread + Ô nhập + Tình huống nhanh để gửi lên Gemini
function buildAnalyzeConversationContext() {
    const a = appState.analyze;
    const targetThread = getAnalyzeTargetThread();
    const typedText = (document.getElementById('analyzeChatTextInput')?.value || '').trim();
    const hasAttach = window.analyzeAttachments && window.analyzeAttachments.hasAttachments();

    const blocks = [];

    if (targetThread) {
        blocks.push(`THÔNG TIN CUỘC TRÒ CHUYỆN VỚI "${targetThread.name}":`);
        blocks.push(`- Hoàn cảnh quen: ${targetThread.where} | Mức độ thân: ${targetThread.closeness}`);
        if (targetThread.lastNote) {
            blocks.push(`- Ghi chú về cô ấy: ${targetThread.lastNote}`);
        }
        if (targetThread.profile && typeof buildThreadProfilePromptContext === 'function') {
            blocks.push(buildThreadProfilePromptContext(targetThread));
        }

        // Lấy tối đa 40 tin nhắn có cấu trúc trong thread.messages
        if (Array.isArray(targetThread.messages) && targetThread.messages.length > 0) {
            const recentMsgs = targetThread.messages.slice(-40);
            const formattedMsgs = recentMsgs
                .map((m, idx) => {
                    const who = m.sender === 'me' ? 'Tôi' : m.sender === 'her' ? 'Cô ấy' : 'Không rõ';
                    const timePart = m.time ? ` [${m.time}]` : '';
                    return `${idx + 1}. ${who}${timePart}: ${m.text}`;
                })
                .join('\n');
            blocks.push(`LỊCH SỬ TIN NHẮN ĐÃ LƯU TRONG THREAD (${recentMsgs.length} tin):\n${formattedMsgs}`);
        } else if (targetThread.lastInput) {
            blocks.push(`TIN NHẮN GẦN NHẤT CỦA CÔ ẤY TRONG THREAD: "${targetThread.lastInput}"`);
        }
    }

    if (typedText) {
        blocks.push(`ĐOẠN HỘI THOẠI / NỘI DUNG NGƯỜI DÙNG DÁN TRỰC TIẾP:\n${typedText}`);
    }

    if (a.subMode === 'rescue' && a.quickSituation) {
        const sitObj = RESCUE_QUICK_SITUATIONS.find(s => s.id === a.quickSituation);
        if (sitObj) {
            blocks.push(
                `TÌNH HUỐNG KHẨN CẤP NGƯỜI DÙNG ĐANG GẶP: "${sitObj.label}" (${sitObj.hint})\nChi tiết bổ sung: ${
                    a.quickSituationNote || 'Không có ghi chú thêm'
                }`
            );
        }
    }

    if (typeof buildMyProfilePromptContext === 'function') {
        blocks.push(buildMyProfilePromptContext());
    }

    return {
        promptText: blocks.join('\n\n'),
        hasValidSource: Boolean(
            typedText ||
                hasAttach ||
                (a.subMode === 'rescue' && a.quickSituation) ||
                (targetThread && ((targetThread.messages && targetThread.messages.length > 0) || targetThread.lastInput))
        )
    };
}

/**
 * Mục 4A.2: Vẽ biểu đồ đường mức độ hứng thú theo từng tin nhắn bằng SVG thuần (không dùng thư viện ngoài)
 */
function buildInterestLineChartSVG(perMessageList, overallScore) {
    const items = Array.isArray(perMessageList) && perMessageList.length > 0 ? perMessageList : [];
    const pointsData = items.map((m, idx) => ({
        idx: idx + 1,
        score: Math.max(0, Math.min(100, Math.round(typeof m.interestAtTurn === 'number' ? m.interestAtTurn : overallScore || 50))),
        sender: m.sender === 'me' ? 'Tôi' : 'Cô ấy',
        emotion: m.emotion || 'bình thường'
    }));

    if (pointsData.length === 1) {
        pointsData.unshift({
            idx: 0,
            score: pointsData[0].score,
            sender: 'Bắt đầu',
            emotion: pointsData[0].emotion
        });
    }

    const width = 520;
    const height = 175;
    const padL = 36;
    const padR = 20;
    const padT = 22;
    const padB = 30;
    const plotW = width - padL - padR;
    const plotH = height - padT - padB;

    const coords = pointsData.map((pt, i) => {
        const x = padL + (pointsData.length <= 1 ? plotW / 2 : (i / (pointsData.length - 1)) * plotW);
        const y = padT + plotH - (pt.score / 100) * plotH;
        return { ...pt, x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
    });

    const polylinePoints = coords.map(c => `${c.x},${c.y}`).join(' ');
    const areaPoints = `${coords[0].x},${padT + plotH} ${polylinePoints} ${coords[coords.length - 1].x},${padT + plotH}`;

    const gridLines = [0, 50, 100]
        .map(val => {
            const y = Math.round((padT + plotH - (val / 100) * plotH) * 10) / 10;
            return `
                <line x1="${padL}" y1="${y}" x2="${width - padR}" y2="${y}" stroke="currentColor" stroke-opacity="0.12" stroke-dasharray="3,3" />
                <text x="${padL - 6}" y="${y + 3}" text-anchor="end" font-size="10" fill="currentColor" opacity="0.55">${val}</text>
            `;
        })
        .join('');

    const circlesHtml = coords
        .map((c, i) => {
            const dotColor = c.score >= 65 ? '#10B981' : c.score >= 40 ? '#0EA5E9' : '#F59E0B';
            return `
                <g>
                    <circle cx="${c.x}" cy="${c.y}" r="4.5" fill="${dotColor}" stroke="#FFFFFF" stroke-width="1.8" />
                    <text x="${c.x}" y="${c.y - 8}" text-anchor="middle" font-size="9.5" font-weight="bold" fill="currentColor" opacity="0.85">${c.score}</text>
                    <text x="${c.x}" y="${height - 8}" text-anchor="middle" font-size="9.5" fill="currentColor" opacity="0.6">T${i + 1}</text>
                </g>
            `;
        })
        .join('');

    return `
        <svg viewBox="0 0 ${width} ${height}" class="w-full h-40 text-stone-700 dark:text-stone-200 select-none overflow-visible">
            <defs>
                <linearGradient id="signalAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#0EA5E9" stop-opacity="0.32" />
                    <stop offset="100%" stop-color="#0EA5E9" stop-opacity="0.0" />
                </linearGradient>
            </defs>
            ${gridLines}
            <polygon points="${areaPoints}" fill="url(#signalAreaGrad)" />
            <polyline fill="none" stroke="#0EA5E9" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" points="${polylinePoints}" />
            ${circlesHtml}
        </svg>
    `;
}

// Màu sắc bong bóng chat theo cảm xúc (Mục 4A.2)
function getEmotionBubbleTheme(emotionStr) {
    const e = String(emotionStr || '').toLowerCase();
    if (e.includes('vui') || e.includes('hào hứng') || e.includes('thích')) {
        return {
            badge: '😄 ' + emotionStr,
            bubbleBg: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-100',
            pillBg: 'bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200'
        };
    }
    if (e.includes('ngại') || e.includes('dễ thương') || e.includes('thẹn')) {
        return {
            badge: '🙈 ' + emotionStr,
            bubbleBg: 'bg-pink-50 dark:bg-pink-950/50 border-pink-300 dark:border-pink-700 text-pink-950 dark:text-pink-100',
            pillBg: 'bg-pink-100 dark:bg-pink-900/80 text-pink-800 dark:text-pink-200'
        };
    }
    if (e.includes('mệt') || e.includes('bận') || e.includes('buồn')) {
        return {
            badge: '😮‍💨 ' + emotionStr,
            bubbleBg: 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-700 text-amber-950 dark:text-amber-100',
            pillBg: 'bg-amber-100 dark:bg-amber-900/80 text-amber-800 dark:text-amber-200'
        };
    }
    if (e.includes('chán') || e.includes('lạnh') || e.includes('khó chịu') || e.includes('nhạt')) {
        return {
            badge: '🥶 ' + emotionStr,
            bubbleBg: 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-700 text-rose-950 dark:text-rose-100',
            pillBg: 'bg-rose-100 dark:bg-rose-900/80 text-rose-800 dark:text-rose-200'
        };
    }
    return {
        badge: '🙂 ' + (emotionStr || 'Bình thường'),
        bubbleBg: 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800 text-sky-950 dark:text-sky-100',
        pillBg: 'bg-sky-100 dark:bg-sky-900/80 text-sky-800 dark:text-sky-200'
    };
}

// Xử lý khi bấm nút Phân tích chính (Gọi 4A hoặc 4B)
async function handleRunAnalyze() {
    const a = appState.analyze;
    a.chatTextInput = (document.getElementById('analyzeChatTextInput')?.value || '').trim();
    const noteEl = document.getElementById('rescueQuickNoteInput');
    if (noteEl) a.quickSituationNote = noteEl.value.trim();
    saveAnalyzeStateToStorage();

    const { promptText, hasValidSource } = buildAnalyzeConversationContext();
    if (!hasValidSource) {
        showToast('Hãy dán đoạn chat, đính kèm ảnh chụp màn hình hoặc chọn tình huống trước nhé!', '✍️');
        document.getElementById('analyzeChatTextInput')?.focus();
        return;
    }

    const extraParts = window.analyzeAttachments ? window.analyzeAttachments.toExtraParts() : [];
    const btn = document.getElementById('btnSubmitAnalyze');
    const resultArea = document.getElementById('analyzeResultArea');
    const isSignal = a.subMode !== 'rescue';

    if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<span class="animate-spin">⏳</span><span>${
            isSignal ? 'Đang giải mã tín hiệu cảm xúc...' : 'Đang chẩn đoán & lập kế hoạch cứu...'
        }</span>`;
    }

    if (resultArea) {
        resultArea.innerHTML = `
            <div class="bg-white dark:bg-stone-800/90 border border-warm-200 dark:border-stone-700 rounded-2xl p-5 text-center space-y-2.5 animate-pop">
                <div class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-warm-100 dark:bg-stone-700">
                    <span class="w-2.5 h-2.5 rounded-full bg-sky-500 typing-dot"></span>
                    <span class="w-2.5 h-2.5 rounded-full bg-indigo-500 typing-dot"></span>
                    <span class="w-2.5 h-2.5 rounded-full bg-amber-500 typing-dot"></span>
                </div>
                <p class="text-xs font-semibold text-stone-600 dark:text-stone-300">
                    ${
                        isSignal
                            ? 'Đang đo chỉ số hứng thú (0-100), năng lượng từng tin nhắn & bằng chứng cờ xanh/cờ đỏ...'
                            : 'Đang kiểm tra nguyên nhân nguội, đánh giá nên cứu hay nên dừng lịch sự...'
                    }
                </p>
            </div>
        `;
    }

    try {
        if (isSignal) {
            const { parsed } = await callGeminiWithSchemaRetry(
                SYSTEM_PROMPT_ANALYZE_SIGNAL,
                [],
                promptText,
                SCHEMA_ANALYZE_SIGNAL,
                validateAnalyzeSignalJson,
                0.55,
                { extraParts }
            );

            a.lastSignalResult = parsed;
            a.selectedBubbleIdx = 0;
            saveAnalyzeStateToStorage();

            // Mục 4A.3: Lưu vào thread.signalHistory[] nếu đang chọn 1 Thread
            const targetThread = getAnalyzeTargetThread();
            if (targetThread && parsed.overall) {
                if (!Array.isArray(targetThread.signalHistory)) {
                    targetThread.signalHistory = [];
                }
                targetThread.signalHistory.push({
                    timestamp: Date.now(),
                    interestScore: Math.max(0, Math.min(100, Math.round(parsed.overall.interestScore || 50))),
                    trend: parsed.overall.trend || 'ổn định',
                    confidence: parsed.overall.confidence || 'vừa'
                });
                if (targetThread.signalHistory.length > 30) {
                    targetThread.signalHistory = targetThread.signalHistory.slice(-30);
                }
                saveThreadsToStorage();
                renderAnalyzeThreadSelectUI();
            }

            renderAnalyzeSignalResultUI(parsed);
            showToast('Đã hoàn tất phân tích tín hiệu cảm xúc!', '📡');
        } else {
            const rescuePrompt = `${promptText}\n\n- Cách xưng hô mong muốn khi viết tin nhắn: ${a.pronoun || 'mình - bạn'}`;
            const { parsed } = await callGeminiWithSchemaRetry(
                SYSTEM_PROMPT_ANALYZE_RESCUE,
                [],
                rescuePrompt,
                SCHEMA_ANALYZE_RESCUE,
                validateAnalyzeRescueJson,
                0.75,
                { extraParts }
            );

            a.lastRescueResult = parsed;
            saveAnalyzeStateToStorage();
            renderAnalyzeRescueResultUI(parsed);
            showToast('Đã lập xong chẩn đoán & phương án xử lý!', '🛟');
        }
    } catch (err) {
        renderErrorCard('analyzeResultArea', err.message);
    } finally {
        if (btn) {
            btn.disabled = false;
            syncAnalyzeUIFromState();
        }
    }
}

/**
 * Hiển thị kết quả Mục 4A: Đọc tín hiệu cảm xúc chuyên sâu
 */
function renderAnalyzeSignalResultUI(data) {
    const container = document.getElementById('analyzeResultArea');
    if (!container || !data) return;

    const ov = data.overall || {};
    const score = Math.max(0, Math.min(100, Math.round(ov.interestScore ?? 50)));
    const selectedIdx = Math.min(
        Math.max(0, appState.analyze.selectedBubbleIdx || 0),
        Math.max(0, (data.perMessage || []).length - 1)
    );

    const scoreBadgeColor =
        score >= 65
            ? 'from-emerald-500 to-teal-600'
            : score >= 40
            ? 'from-sky-500 to-indigo-600'
            : 'from-amber-500 to-rose-600';

    const svgChartHtml = buildInterestLineChartSVG(data.perMessage || [], score);

    // Đoạn chat tô màu bong bóng theo cảm xúc (bấm vào từng bong bóng để xem chi tiết)
    const bubblesHtml = (data.perMessage || [])
        .map((msg, idx) => {
            const isMe = msg.sender === 'me';
            const theme = getEmotionBubbleTheme(msg.emotion);
            const isSelected = idx === selectedIdx;
            const ringStyle = isSelected ? 'ring-2 ring-warm-500 dark:ring-amber-400 shadow-md' : 'opacity-90 hover:opacity-100';
            const stars = '⚡'.repeat(Math.max(1, Math.min(5, Math.round(msg.energy || 3))));

            const signalsDetailHtml = isSelected
                ? `
                <div class="mt-2 pt-2 border-t border-black/10 dark:border-white/10 space-y-1 text-[11px]">
                    <div class="font-bold">🔍 Phân tích chi tiết tin #${idx + 1} (Năng lượng: ${msg.energy}/5 ${stars} • Hứng thú: ${msg.interestAtTurn}/100):</div>
                    ${
                        Array.isArray(msg.signals) && msg.signals.length > 0
                            ? msg.signals
                                  .map(
                                      s =>
                                          `<div>• <strong>${escapeHtml(s.signal)}:</strong> <span class="italic">"${escapeHtml(
                                              s.evidence
                                          )}"</span></div>`
                                  )
                                  .join('')
                            : `<div>• Không có dấu hiệu đặc biệt ở tin nhắn này.</div>`
                    }
                </div>
            `
                : '';

            return `
                <div class="flex ${isMe ? 'justify-end' : 'justify-start'}">
                    <button type="button" data-signal-bubble-idx="${idx}" class="max-w-[90%] text-left p-3 rounded-2xl border transition ${theme.bubbleBg} ${ringStyle}">
                        <div class="flex flex-wrap items-center justify-between gap-2 mb-1">
                            <span class="text-[10px] font-extrabold uppercase tracking-wider opacity-75">
                                ${isMe ? '🧑 Bạn nhắn' : '👧 Cô ấy nhắn'} • Tin #${idx + 1}
                            </span>
                            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${theme.pillBg}">
                                ${escapeHtml(theme.badge)} • ⚡${msg.energy || 3}/5
                            </span>
                        </div>
                        <div class="text-xs sm:text-sm font-medium leading-relaxed break-words">
                            "${escapeHtml(msg.text)}"
                        </div>
                        ${signalsDetailHtml}
                    </button>
                </div>
            `;
        })
        .join('');

    const m = data.metrics || {};
    const greenFlagsHtml =
        Array.isArray(data.greenFlags) && data.greenFlags.length > 0
            ? data.greenFlags
                  .map(
                      g => `
                <li class="p-2.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-xs space-y-0.5">
                    <div class="font-bold text-emerald-900 dark:text-emerald-200">🟢 ${escapeHtml(g.flag)}</div>
                    <div class="text-[11px] text-stone-600 dark:text-stone-400 italic">Bằng chứng: "${escapeHtml(g.evidence)}"</div>
                </li>
            `
                  )
                  .join('')
            : `<li class="text-xs text-stone-400 italic">Chưa thấy cờ xanh rõ rệt trong đoạn ngắn này.</li>`;

    const redFlagsHtml =
        Array.isArray(data.redFlags) && data.redFlags.length > 0
            ? data.redFlags
                  .map(
                      r => `
                <li class="p-2.5 rounded-xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 text-xs space-y-0.5">
                    <div class="font-bold text-rose-900 dark:text-rose-200">🚩 ${escapeHtml(r.flag)}</div>
                    <div class="text-[11px] text-stone-600 dark:text-stone-400 italic">Bằng chứng: "${escapeHtml(r.evidence)}"</div>
                </li>
            `
                  )
                  .join('')
            : `<li class="text-xs text-stone-400 italic">Không phát hiện cờ đỏ hay dấu hiệu tiêu cực nào.</li>`;

    const rec = data.recommendation || { action: 'giữ nhịp', reasons: [] };
    const recReasonsHtml = (rec.reasons || [])
        .map((r, i) => `<li class="text-xs text-stone-700 dark:text-stone-200"><strong>${i + 1}.</strong> ${escapeHtml(r)}</li>`)
        .join('');

    container.innerHTML = `
        <!-- NHẮC NHỞ CỐ ĐỊNH MỤC 4A.4 -->
        <div class="p-3 rounded-2xl bg-amber-100/90 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-xs font-bold text-amber-950 dark:text-amber-200 flex items-center gap-2 animate-pop">
            <span class="text-base">🔔</span>
            <span>Đây là đọc từ chữ, có thể sai. Cô ấy có thể đang bận.</span>
        </div>

        <!-- 1. TỔNG QUAN ĐIỂM HỨNG THÚ & BIỂU ĐỒ ĐƯỜNG SVG (MỤC 4A.1 & 4A.2) -->
        <div class="bg-white dark:bg-stone-800/95 border border-warm-200 dark:border-stone-700 rounded-2xl p-4 shadow-xs space-y-3.5 animate-pop">
            <div class="flex items-center justify-between gap-3 border-b border-warm-100 dark:border-stone-700 pb-3">
                <div class="space-y-1">
                    <div class="flex flex-wrap items-center gap-1.5">
                        <span class="text-xs font-extrabold uppercase text-sky-600 dark:text-sky-400">📡 Điểm tín hiệu tổng quan</span>
                        <span class="text-[11px] font-bold px-2 py-0.5 rounded-full bg-warm-100 dark:bg-stone-700 text-stone-700 dark:text-stone-200">
                            Xu hướng: ${escapeHtml(ov.trend || 'ổn định')}
                        </span>
                        <span class="text-[11px] font-bold px-2 py-0.5 rounded-full bg-warm-100 dark:bg-stone-700 text-stone-700 dark:text-stone-200">
                            Độ tự tin: ${escapeHtml(ov.confidence || 'vừa')}
                        </span>
                    </div>
                    <p class="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">${escapeHtml(ov.caveat || '')}</p>
                </div>

                <div class="px-4 py-2.5 rounded-2xl bg-gradient-to-br ${scoreBadgeColor} text-white text-center shadow-sm flex-shrink-0">
                    <div class="text-2xl font-extrabold leading-none">${score}</div>
                    <div class="text-[10px] opacity-90 mt-0.5">/ 100 điểm</div>
                </div>
            </div>

            <!-- Biểu đồ đường SVG -->
            <div class="space-y-1">
                <div class="flex items-center justify-between text-xs font-bold text-stone-700 dark:text-stone-300">
                    <span>📈 Biểu đồ đường mức độ hứng thú theo từng lượt tin nhắn:</span>
                    <span class="text-[10px] text-stone-400 font-normal">Đơn vị: 0 - 100</span>
                </div>
                <div class="p-2.5 rounded-xl bg-warm-50/70 dark:bg-stone-900/80 border border-warm-200/70 dark:border-stone-700">
                    ${svgChartHtml}
                </div>
            </div>
        </div>

        <!-- 2. ĐOẠN CHAT TÔ MÀU BONG BÓNG THEO CẢM XÚC (MỤC 4A.2 - BẤM ĐỂ XEM PHÂN TÍCH) -->
        <div class="bg-white dark:bg-stone-800/95 border border-warm-200 dark:border-stone-700 rounded-2xl p-4 shadow-xs space-y-3 animate-pop">
            <div class="flex items-center justify-between">
                <div>
                    <h3 class="text-sm font-extrabold text-stone-900 dark:text-white">💬 Đoạn chat tô màu theo cảm xúc</h3>
                    <p class="text-[11px] text-stone-500 dark:text-stone-400">👆 Bấm vào từng bong bóng tin nhắn để xem mức năng lượng (1-5) và bằng chứng chi tiết.</p>
                </div>
            </div>
            <div class="space-y-2.5 max-h-[420px] overflow-y-auto p-2 rounded-xl bg-warm-50/50 dark:bg-stone-900/60 border border-warm-100 dark:border-stone-800">
                ${bubblesHtml}
            </div>
        </div>

        <!-- 3. THẺ 6 CHỈ SỐ ĐỊNH LƯỢNG (METRICS - MỤC 4A.1 & 4A.2) -->
        <div class="bg-white dark:bg-stone-800/95 border border-warm-200 dark:border-stone-700 rounded-2xl p-4 shadow-xs space-y-3 animate-pop">
            <h3 class="text-sm font-extrabold text-stone-900 dark:text-white">📊 Các chỉ số tương tác thực tế (Metrics)</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div class="p-3 rounded-xl bg-warm-50 dark:bg-stone-900 border border-warm-200 dark:border-stone-700">
                    <div class="text-[10px] font-bold text-stone-400 uppercase">📏 Độ dài tin trung bình</div>
                    <div class="font-semibold text-stone-800 dark:text-stone-100 mt-0.5">${escapeHtml(m.avgLengthComparison || '')}</div>
                </div>
                <div class="p-3 rounded-xl bg-warm-50 dark:bg-stone-900 border border-warm-200 dark:border-stone-700">
                    <div class="text-[10px] font-bold text-stone-400 uppercase">❓ Số lần cô ấy hỏi ngược</div>
                    <div class="font-semibold text-stone-800 dark:text-stone-100 mt-0.5">${escapeHtml(m.herQuestionsCount || '')}</div>
                </div>
                <div class="p-3 rounded-xl bg-warm-50 dark:bg-stone-900 border border-warm-200 dark:border-stone-700">
                    <div class="text-[10px] font-bold text-stone-400 uppercase">🌱 Chủ động mở chuyện / chia sẻ riêng</div>
                    <div class="font-semibold text-stone-800 dark:text-stone-100 mt-0.5">${escapeHtml(m.herInitiationsCount || '')}</div>
                </div>
                <div class="p-3 rounded-xl bg-warm-50 dark:bg-stone-900 border border-warm-200 dark:border-stone-700">
                    <div class="text-[10px] font-bold text-stone-400 uppercase">😆 Mức dùng Emoji / Haha</div>
                    <div class="font-semibold text-stone-800 dark:text-stone-100 mt-0.5">${escapeHtml(m.emojiHahaUsage || '')}</div>
                </div>
                <div class="p-3 rounded-xl bg-warm-50 dark:bg-stone-900 border border-warm-200 dark:border-stone-700">
                    <div class="text-[10px] font-bold text-stone-400 uppercase">⚖️ Tỉ lệ ai nói nhiều hơn</div>
                    <div class="font-semibold text-stone-800 dark:text-stone-100 mt-0.5">${escapeHtml(m.talkRatio || '')}</div>
                </div>
                <div class="p-3 rounded-xl bg-warm-50 dark:bg-stone-900 border border-warm-200 dark:border-stone-700">
                    <div class="text-[10px] font-bold text-stone-400 uppercase">⏱️ Thời gian phản hồi</div>
                    <div class="font-semibold text-stone-800 dark:text-stone-100 mt-0.5">${escapeHtml(m.responseTimeEstimate || '')}</div>
                </div>
            </div>

            <div class="p-3 rounded-xl bg-warm-100/70 dark:bg-stone-900 border border-warm-200 dark:border-stone-700 text-xs">
                <strong>📝 Thói quen nhắn tin của cô ấy (hành vi):</strong> ${escapeHtml(data.herStyle || '')}
            </div>
        </div>

        <!-- 4. DANH SÁCH CỜ XANH & CỜ ĐỎ KÈM BẰNG CHỨNG (MỤC 4A.1 & 4A.2) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-pop">
            <div class="bg-white dark:bg-stone-800/95 border border-warm-200 dark:border-stone-700 rounded-2xl p-4 shadow-xs space-y-2.5">
                <h4 class="text-xs font-extrabold uppercase text-emerald-700 dark:text-emerald-400">🟢 Tín hiệu tích cực (Green Flags)</h4>
                <ul class="space-y-2">${greenFlagsHtml}</ul>
            </div>
            <div class="bg-white dark:bg-stone-800/95 border border-warm-200 dark:border-stone-700 rounded-2xl p-4 shadow-xs space-y-2.5">
                <h4 class="text-xs font-extrabold uppercase text-rose-700 dark:text-rose-400">🚩 Dấu hiệu cần lưu ý (Red Flags)</h4>
                <ul class="space-y-2">${redFlagsHtml}</ul>
            </div>
        </div>

        <!-- 5. KHUYẾN NGHỊ HÀNH ĐỘNG TIẾP THEO (MỤC 4A.1) -->
        <div class="bg-white dark:bg-stone-800/95 border-2 border-sky-400 dark:border-sky-600 rounded-2xl p-4 shadow-xs space-y-3 animate-pop">
            <div class="flex items-center justify-between">
                <span class="text-xs font-extrabold uppercase text-sky-600 dark:text-sky-400">🧭 Khuyến nghị bước tiếp theo</span>
                <span class="px-3 py-1 rounded-full bg-sky-600 text-white text-xs font-extrabold uppercase">
                    ${escapeHtml(rec.action || 'Giữ nhịp')}
                </span>
            </div>
            <ul class="space-y-1.5 pl-1">${recReasonsHtml}</ul>
        </div>
    `;

    // Gắn sự kiện bấm vào từng bong bóng chat để mở xem phân tích chi tiết
    container.querySelectorAll('button[data-signal-bubble-idx]').forEach(btn => {
        btn.addEventListener('click', () => {
            appState.analyze.selectedBubbleIdx = parseInt(btn.getAttribute('data-signal-bubble-idx'), 10);
            renderAnalyzeSignalResultUI(data);
        });
    });
}

/**
 * Hiển thị kết quả Mục 4B: Cứu cuộc trò chuyện sắp nguội
 */
function renderAnalyzeRescueResultUI(data) {
    const container = document.getElementById('analyzeResultArea');
    if (!container || !data) return;

    const dec = data.decision || {};
    const shouldRescue = Boolean(dec.shouldRescue);

    // 1. Chẩn đoán lý do nguội kèm bằng chứng (Mục 4B.1)
    const diagnosesHtml = (data.diagnoses || [])
        .map(
            d => `
            <div class="p-3 rounded-xl bg-warm-50 dark:bg-stone-900 border border-warm-200 dark:border-stone-700 space-y-1 text-xs">
                <div class="font-extrabold text-stone-900 dark:text-white">🔍 Nguyên nhân: ${escapeHtml(d.cause)}</div>
                <div class="text-stone-600 dark:text-stone-300 italic">📌 Bằng chứng: "${escapeHtml(d.evidence)}"</div>
                <div class="text-[11px] text-stone-500 dark:text-stone-400">💡 Tác động: ${escapeHtml(d.impact)}</div>
            </div>
        `
        )
        .join('');

    // 2. Hai tin nhắn kết thúc/tạm dừng lịch sự (Mục 4B.2)
    const politeClosingsHtml = (dec.politeClosings || [])
        .map(
            (pc, idx) => `
            <div class="p-3 rounded-xl bg-white dark:bg-stone-800 border border-warm-200 dark:border-stone-700 space-y-2 text-xs">
                <div class="flex items-center justify-between">
                    <span class="font-bold text-stone-700 dark:text-stone-200">🕊️ Lời nhắn khép lại lịch sự #${idx + 1}</span>
                    <button type="button" data-copy-closing="${idx}" class="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-900 dark:bg-stone-700 text-white font-bold text-[11px]">
                        📋 Copy
                    </button>
                </div>
                <div class="p-2.5 rounded-lg bg-warm-50 dark:bg-stone-900 text-stone-800 dark:text-stone-100 font-medium">
                    "${escapeHtml(pc.text)}"
                </div>
                <div class="text-[11px] text-stone-500 dark:text-stone-400">💡 ${escapeHtml(pc.why)}</div>
            </div>
        `
        )
        .join('');

    // 3. Kịch bản cứu (CHỈ HIỂN THỊ KHI shouldRescue === true theo đúng Mục 4B.2 & 4B.3)
    let strategiesSectionHtml = '';
    if (shouldRescue && Array.isArray(data.strategies) && data.strategies.length > 0) {
        const cards = data.strategies
            .map((st, idx) => {
                const riskNorm = String(st.risk || '').toLowerCase();
                let riskBadge = '🟢 Rủi ro: An toàn';
                let riskClass = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300';
                if (riskNorm.includes('liều')) {
                    riskBadge = '🔴 Rủi ro: Hơi liều';
                    riskClass = 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300';
                } else if (riskNorm.includes('vừa')) {
                    riskBadge = '🟡 Rủi ro: Vừa phải';
                    riskClass = 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300';
                }

                const joinedMsg = (st.messages || []).join('\n');
                const bubbles = (st.messages || [])
                    .map(
                        m => `
                        <div class="flex justify-end">
                            <div class="max-w-[92%] bg-gradient-to-br from-warm-500 to-amber-600 text-white px-3.5 py-2 rounded-2xl rounded-br-xs text-sm shadow-xs break-words">
                                ${escapeHtml(m).replace(
                                    /\[([^\]]+)\]/g,
                                    '<span class="underline decoration-wavy decoration-amber-200 font-bold bg-black/20 px-1 rounded">[$1]</span>'
                                )}
                            </div>
                        </div>
                    `
                    )
                    .join('');

                return `
                    <div class="p-4 rounded-2xl bg-warm-50/80 dark:bg-stone-900/90 border border-warm-200 dark:border-stone-700 space-y-3">
                        <div class="flex flex-wrap items-center justify-between gap-2">
                            <span class="text-xs font-extrabold text-warm-600 dark:text-amber-400">
                                🛟 Chiến lược #${idx + 1}: ${escapeHtml(st.name)}
                            </span>
                            <div class="flex items-center gap-1.5">
                                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300">
                                    ⏰ ${escapeHtml(st.timing)}
                                </span>
                                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${riskClass}">
                                    ${escapeHtml(riskBadge)}
                                </span>
                            </div>
                        </div>

                        <div class="space-y-1.5 p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-warm-100 dark:border-stone-700">
                            ${bubbles}
                        </div>

                        <p class="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                            💡 <strong>Vì sao hiệu quả:</strong> ${escapeHtml(st.why)}
                        </p>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            <button type="button" data-copy-rescue-strat="${idx}" class="py-2 px-3 rounded-xl bg-warm-500 hover:bg-warm-600 text-white font-bold text-xs transition flex items-center justify-center gap-1.5">
                                <span>📋</span>
                                <span>Sao chép tin hồi sinh</span>
                            </button>
                            <button type="button" data-practice-rescue-strat="${idx}" class="py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-900 dark:bg-stone-700 dark:hover:bg-stone-600 text-white font-bold text-xs transition flex items-center justify-center gap-1.5">
                                <span>🎭</span>
                                <span>Thử tin hồi sinh trong phòng luyện tập</span>
                            </button>
                        </div>
                    </div>
                `;
            })
            .join('');

        strategiesSectionHtml = `
            <div class="bg-white dark:bg-stone-800/95 border border-warm-200 dark:border-stone-700 rounded-2xl p-4 shadow-xs space-y-3 animate-pop">
                <div>
                    <h3 class="text-sm font-extrabold text-stone-900 dark:text-white">🛟 Kế hoạch cứu cuộc trò chuyện (${data.strategies.length} chiến lược)</h3>
                    <p class="text-[11px] text-stone-500 dark:text-stone-400">Chọn đúng 1 chiến lược phù hợp nhất với hoàn cảnh của bạn để gửi.</p>
                </div>
                <div class="space-y-3">${cards}</div>
            </div>
        `;
    }

    const fp = data.followUpPlan || {};

    container.innerHTML = `
        <!-- 1. CHẨN ĐOÁN LÝ DO NGUỘI (MỤC 4B.1) -->
        <div class="bg-white dark:bg-stone-800/95 border border-warm-200 dark:border-stone-700 rounded-2xl p-4 shadow-xs space-y-3 animate-pop">
            <h3 class="text-sm font-extrabold text-stone-900 dark:text-white">🩺 Chẩn đoán nguyên nhân cuộc trò chuyện nguội</h3>
            <div class="space-y-2">${diagnosesHtml}</div>
        </div>

        <!-- 2. PHÁN QUYẾT: NÊN CỨU HAY NÊN DỪNG LỊCH SỰ? (MỤC 4B.2) -->
        <div class="rounded-2xl border-2 p-4 shadow-xs space-y-3 animate-pop ${
            shouldRescue
                ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-400 dark:border-emerald-700'
                : 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-400 dark:border-rose-700'
        }">
            <div class="flex items-start gap-2.5">
                <span class="text-xl leading-none mt-0.5">${shouldRescue ? '🟢' : '🛑'}</span>
                <div class="space-y-1 flex-1">
                    <div class="text-xs font-extrabold uppercase tracking-wide ${
                        shouldRescue ? 'text-emerald-800 dark:text-emerald-300' : 'text-rose-800 dark:text-rose-300'
                    }">
                        ${shouldRescue ? 'KẾT LUẬN: CÓ THỂ GỬI 1 TIN HỒI SINH NHẸ NHÀNG' : 'KẾT LUẬN: NÊN DỪNG LẠI LỊCH SỰ (KHÔNG NÊN CỨU TIẾP)'}
                    </div>
                    <h4 class="text-sm font-bold text-stone-900 dark:text-white">${escapeHtml(dec.verdictTitle || '')}</h4>
                    <p class="text-xs text-stone-700 dark:text-stone-200 leading-relaxed">${escapeHtml(dec.verdictReason || '')}</p>
                </div>
            </div>

            ${
                !shouldRescue
                    ? `
                <div class="space-y-2 pt-2 border-t border-rose-200 dark:border-rose-800/60">
                    <div class="text-xs font-bold text-rose-900 dark:text-rose-200">
                        🕊️ Vì đối phương đã từ chối hoặc không còn hứng thú rõ rệt, bạn KHÔNG nên cố cứu thêm. Dưới đây là 2 câu khép lại lịch sự giữ trọn phong độ (hoặc bạn có thể im lặng tôn trọng):
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">${politeClosingsHtml}</div>
                </div>
            `
                    : `
                <details class="pt-1 text-xs">
                    <summary class="cursor-pointer font-bold text-stone-600 dark:text-stone-300 hover:underline">
                        🕊️ Xem thêm 2 câu tạm dừng lịch sự (nếu bạn muốn chủ động khép lại)
                    </summary>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">${politeClosingsHtml}</div>
                </details>
            `
            }
        </div>

        <!-- 3. CÁC CHIẾN LƯỢC CỨU (CHỈ HIỆN KHI shouldRescue === true) -->
        ${strategiesSectionHtml}

        <!-- 4. QUY TẮC "MỘT LẦN" & KẾ HOẠCH 3 BƯỚC (MỤC 4B.4) -->
        <div class="bg-white dark:bg-stone-800/95 border-2 border-amber-400 dark:border-amber-600 rounded-2xl p-4 shadow-xs space-y-3 animate-pop">
            <div class="p-3 rounded-xl bg-amber-100/90 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-xs text-amber-950 dark:text-amber-200 space-y-1">
                <div class="font-extrabold uppercase">⚠️ QUY TẮC "MỘT LẦN" BẮT BUỘC NHỚ:</div>
                <p class="leading-relaxed font-semibold">${escapeHtml(
                    fp.oneShotRuleReminder ||
                        'Tối đa chỉ gửi MỘT tin nhắn hồi sinh duy nhất. Nếu cô ấy vẫn không trả lời thì dừng lại lịch sự hoàn toàn, tuyệt đối không nhắn bồi thêm.'
                )}</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div class="p-3 rounded-xl bg-warm-50 dark:bg-stone-900 border border-warm-200 dark:border-stone-700 space-y-1">
                    <div class="font-extrabold text-warm-600 dark:text-amber-400">1️⃣ Bước 1: Gửi tin hồi sinh</div>
                    <p class="text-stone-700 dark:text-stone-200 leading-relaxed">${escapeHtml(fp.step1Send || '')}</p>
                </div>
                <div class="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-1">
                    <div class="font-extrabold text-emerald-700 dark:text-emerald-300">2️⃣ Nếu cô ấy đáp tích cực</div>
                    <p class="text-stone-700 dark:text-stone-200 leading-relaxed">${escapeHtml(fp.ifPositive || '')}</p>
                </div>
                <div class="p-3 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 space-y-1">
                    <div class="font-extrabold text-rose-700 dark:text-rose-300">3️⃣ Nếu cô ấy đáp cụt / im lặng</div>
                    <p class="text-stone-700 dark:text-stone-200 leading-relaxed">${escapeHtml(fp.ifColdOrSilent || '')}</p>
                </div>
            </div>
        </div>
    `;

    // Gắn sự kiện Copy câu kết thúc lịch sự
    container.querySelectorAll('button[data-copy-closing]').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.getAttribute('data-copy-closing'), 10);
            const text = dec.politeClosings?.[idx]?.text || '';
            copyText(text);
        });
    });

    // Gắn sự kiện Copy & Tập thử tin hồi sinh trong phòng luyện tập (Mục 4B.6)
    container.querySelectorAll('button[data-copy-rescue-strat]').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.getAttribute('data-copy-rescue-strat'), 10);
            const msgs = data.strategies?.[idx]?.messages || [];
            copyText(msgs.join('\n'));
        });
    });

    container.querySelectorAll('button[data-practice-rescue-strat]').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.getAttribute('data-practice-rescue-strat'), 10);
            const strat = data.strategies?.[idx];
            if (strat) {
                handlePracticeRescueInRoleplay(strat, data);
            }
        });
    });
}

/**
 * MỤC 4B.6: Nút "🎭 Thử tin hồi sinh trong phòng luyện tập"
 * Dựng tình huống cuộc trò chuyện đang nguội trong Phòng luyện tập (Chế độ B) và điền sẵn tin hồi sinh để tập trước.
 */
function handlePracticeRescueInRoleplay(strategyObj, rescueData) {
    const targetThread = getAnalyzeTargetThread();
    const herName = targetThread ? targetThread.name : 'Bạn nữ đang nhắn';
    const causeSummary = (rescueData?.diagnoses || []).map(d => d.cause).join('; ');
    const suggestedMsg = (strategyObj?.messages || [])[0] || '';

    const customPersona = `Một bạn nữ trưởng thành (20 tuổi, chắc chắn từ 18 tuổi trở lên) tên là "${herName}". Hiện tại cuộc trò chuyện giữa hai người đang hơi nguội (Lý do: ${
        causeSummary || 'Bận rộn hoặc ngắt quãng vài ngày'
    }). Nếu bạn nam nhắn lại tự nhiên, vui vẻ, không trách móc thì bạn sẽ vui vẻ bắt nhịp trở lại. Nếu bạn nam trách móc ("sao ko rep") hoặc hỏi dồn thì bạn sẽ trả lời nhạt.`;

    const customSituation = `Cuộc trò chuyện đang tạm lắng xuống. Bạn nam áp dụng chiến lược "${
        strategyObj?.name || 'Hồi sinh cuộc trò chuyện'
    }" để nhắn lại bắt chuyện với bạn.`;

    appState.roleplay.persona = customPersona;
    appState.roleplay.situation = customSituation;
    appState.roleplay.history = [];
    appState.roleplay.isFinished = false;
    saveRoleplayState();

    const headerTitleEl = document.getElementById('roleplayHeaderTitle');
    if (headerTitleEl) {
        headerTitleEl.textContent = `${herName} (Tập hồi sinh cuộc trò chuyện)`;
    }
    const evalArea = document.getElementById('roleplayEvaluationArea');
    if (evalArea) evalArea.innerHTML = '';

    if (typeof renderRoleplayMessagesUI === 'function') {
        renderRoleplayMessagesUI();
    }

    switchNavigation('modeB');

    const roleplayInput = document.getElementById('roleplayUserMsg');
    if (roleplayInput && suggestedMsg) {
        roleplayInput.value = suggestedMsg;
        roleplayInput.focus();
    }

    showToast('Đã chuẩn bị sẵn tin hồi sinh trong Phòng luyện tập! Bấm Gửi để thử phản ứng của cô ấy nhé 🎭', '🛟');
}

// Khởi tạo toàn bộ sự kiện và tích hợp điều hướng cho Tab 📡 Phân tích
function initAnalyzeTab() {
    const section = ensureAnalyzeViewMounted();
    if (!section) return;

    // Mở rộng hàm switchNavigation để luôn đóng/mở đúng section của tab "📡 Phân tích"
    if (typeof window.switchNavigation === 'function' && !window._hasPatchedSwitchNavForAnalyze) {
        const origSwitchNav = window.switchNavigation;
        window.switchNavigation = function (targetNav) {
            origSwitchNav(targetNav);
            const isAnalyzeNav =
                targetNav === resolvedAnalyzeNavKey ||
                ['analyze', 'signal', 'modeD', 'phantich', 'rescue'].includes(targetNav);

            const analyzeSec = document.getElementById(resolvedAnalyzeSectionId);
            if (analyzeSec) {
                analyzeSec.classList.toggle('hidden', !isAnalyzeNav);
            }

            if (isAnalyzeNav) {
                const mainEl = document.querySelector('main');
                if (mainEl) {
                    Array.from(mainEl.querySelectorAll('section')).forEach(sec => {
                        if (sec !== analyzeSec) sec.classList.add('hidden');
                    });
                }
                renderAnalyzeThreadSelectUI();
            }
        };
        window._hasPatchedSwitchNavForAnalyze = true;
    }

    // Khởi tạo Widget đính kèm ảnh chụp màn hình / file .txt lịch sử chat
    if (typeof createAttachmentWidget === 'function') {
        window.analyzeAttachments = createAttachmentWidget({
            containerId: 'analyzeAttachmentRoot',
            label: '📎 Đính kèm ảnh chụp màn hình chat / file .txt (tối đa 10 ảnh)',
            allowTxt: true,
            showExtractBtn: false
        });
    }

    // Sự kiện chuyển đổi giữa 4A (Đọc tín hiệu) và 4B (Cứu cuộc trò chuyện)
    const btnSignal = document.getElementById('btnSubModeSignal');
    const btnRescue = document.getElementById('btnSubModeRescue');
    if (btnSignal && btnRescue) {
        btnSignal.addEventListener('click', () => {
            appState.analyze.subMode = 'signal';
            saveAnalyzeStateToStorage();
            syncAnalyzeUIFromState();
        });
        btnRescue.addEventListener('click', () => {
            appState.analyze.subMode = 'rescue';
            saveAnalyzeStateToStorage();
            syncAnalyzeUIFromState();
        });
    }

    // Sự kiện chọn Thread nguồn
    const threadSelect = document.getElementById('analyzeThreadSelect');
    if (threadSelect) {
        threadSelect.addEventListener('change', e => {
            appState.analyze.threadId = e.target.value;
            saveAnalyzeStateToStorage();
            renderThreadSignalHistoryUI();
        });
    }

    // Nút nạp nhanh lịch sử tin nhắn từ Thread vào ô chữ để người dùng xem/sửa
    const btnLoadThreadMsgs = document.getElementById('btnLoadThreadMsgsToAnalyze');
    if (btnLoadThreadMsgs) {
        btnLoadThreadMsgs.addEventListener('click', () => {
            const target = getAnalyzeTargetThread();
            if (!target) {
                showToast('Hãy chọn một cuộc trò chuyện trước nhé!', '⚠️');
                return;
            }
            let textOut = '';
            if (Array.isArray(target.messages) && target.messages.length > 0) {
                textOut = target.messages
                    .map(m => `${m.sender === 'me' ? 'Tôi' : 'Cô ấy'}: ${m.text}`)
                    .join('\n');
            } else if (target.lastInput) {
                textOut = `Cô ấy: ${target.lastInput}`;
            }
            if (!textOut) {
                showToast(`Cuộc trò chuyện "${target.name}" chưa có tin nhắn nào được lưu.`, '💬');
                return;
            }
            const inputEl = document.getElementById('analyzeChatTextInput');
            if (inputEl) inputEl.value = textOut;
            appState.analyze.chatTextInput = textOut;
            saveAnalyzeStateToStorage();
            showToast(`Đã nạp đoạn hội thoại từ "${target.name}"!`, '📥');
        });
    }

    // Sự kiện lưới 6 nút tình huống nhanh ở mục 4B.5
    const quickGrid = document.getElementById('rescueQuickGrid');
    if (quickGrid) {
        quickGrid.querySelectorAll('.rescue-quick-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-rescue-quick');
                appState.analyze.quickSituation = appState.analyze.quickSituation === id ? '' : id;
                saveAnalyzeStateToStorage();
                updateRescueQuickButtonsUI();
                const noteEl = document.getElementById('rescueQuickNoteInput');
                if (appState.analyze.quickSituation && noteEl) {
                    noteEl.focus();
                }
            });
        });
    }

    const btnClearQuick = document.getElementById('btnClearQuickSituation');
    if (btnClearQuick) {
        btnClearQuick.addEventListener('click', () => {
            appState.analyze.quickSituation = '';
            appState.analyze.quickSituationNote = '';
            saveAnalyzeStateToStorage();
            updateRescueQuickButtonsUI();
        });
    }

    const quickNoteInput = document.getElementById('rescueQuickNoteInput');
    if (quickNoteInput) {
        quickNoteInput.addEventListener('input', e => {
            appState.analyze.quickSituationNote = e.target.value;
            saveAnalyzeStateToStorage();
        });
    }

    const chatTextInput = document.getElementById('analyzeChatTextInput');
    if (chatTextInput) {
        chatTextInput.addEventListener('input', e => {
            appState.analyze.chatTextInput = e.target.value;
            saveAnalyzeStateToStorage();
        });
    }

    const btnClearText = document.getElementById('btnClearAnalyzeText');
    if (btnClearText) {
        btnClearText.addEventListener('click', () => {
            if (chatTextInput) chatTextInput.value = '';
            appState.analyze.chatTextInput = '';
            saveAnalyzeStateToStorage();
            if (chatTextInput) chatTextInput.focus();
        });
    }

    bindChipGroup('pronounGroupAnalyze', () => appState.analyze.pronoun, val => {
        appState.analyze.pronoun = val;
        saveAnalyzeStateToStorage();
    });

    const btnSubmit = document.getElementById('btnSubmitAnalyze');
    if (btnSubmit) {
        btnSubmit.addEventListener('click', handleRunAnalyze);
    }

    syncAnalyzeUIFromState();
}