/**
 * ============================================================================
 * GIAI ĐOẠN 3: TAB 💘 LÀM QUEN (MỚI MATCH TRÊN APP HẸN HÒ)
 * (Mục 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8)
 * ============================================================================
 */

// Biến lưu giá trị data-nav và ID section thực tế của tab "💘 Làm quen" trong index.html
let resolvedDatingNavKey = 'dating';
let resolvedDatingSectionId = 'viewDating';

/**
 * Tự động tìm chính xác nút "💘 Làm quen" trên thanh điều hướng dưới đáy
 * và tìm đúng <section> tương ứng trong <main> để gắn giao diện Giai đoạn 3.
 */
function ensureDatingViewMounted() {
    // 1. Dò nút "💘 Làm quen" trên thanh điều hướng dưới đáy
    const navButtons = Array.from(document.querySelectorAll('.bottom-nav-btn'));
    const datingNavBtn =
        navButtons.find(btn => {
            const txt = (btn.textContent || '').toLowerCase();
            const navAttr = (btn.getAttribute('data-nav') || '').toLowerCase();
            return (
                txt.includes('làm quen') ||
                txt.includes('💘') ||
                ['dating', 'match', 'modec', 'lamquen', 'icebreaker'].includes(navAttr)
            );
        }) || navButtons[2]; // Tab thứ 3 trên thanh 5 tab

    if (datingNavBtn && datingNavBtn.getAttribute('data-nav')) {
        resolvedDatingNavKey = datingNavBtn.getAttribute('data-nav');
    }

    // 2. Tìm <section> của tab Làm quen trong <main>
    const mainEl = document.querySelector('main');
    let section = null;

    const candidateIds = [
        'viewDating',
        'viewMatch',
        'viewModeC',
        'viewLamQuen',
        'viewIcebreaker',
        'sectionDating',
        `view-${resolvedDatingNavKey}`,
        `view${resolvedDatingNavKey.charAt(0).toUpperCase() + resolvedDatingNavKey.slice(1)}`
    ];

    for (const cid of candidateIds) {
        const found = document.getElementById(cid);
        if (found) {
            section = found;
            break;
        }
    }

    // Nếu chưa tìm thấy theo ID cố định, quét tất cả <section> trong <main> có chữ "Làm quen"
    if (!section && mainEl) {
        const knownOtherIds = new Set(['viewModeA', 'viewCompose', 'viewModeB', 'viewSettings', 'viewAnalyze']);
        const allSections = Array.from(mainEl.querySelectorAll('section'));
        section = allSections.find(sec => {
            if (knownOtherIds.has(sec.id)) return false;
            const text = (sec.textContent || '').toLowerCase();
            const idLower = (sec.id || '').toLowerCase();
            return (
                idLower.includes('dating') ||
                idLower.includes('match') ||
                idLower.includes('lamquen') ||
                text.includes('làm quen') ||
                text.includes('💘')
            );
        });
    }

    // Nếu vẫn chưa có trong DOM thì tạo mới <section id="viewDating">
    if (!section && mainEl) {
        section = document.createElement('section');
        section.id = 'viewDating';
        section.className = 'space-y-3.5 hidden';
        const composeSec = document.getElementById('viewCompose') || document.getElementById('viewModeA');
        if (composeSec && composeSec.nextSibling) {
            mainEl.insertBefore(section, composeSec.nextSibling);
        } else {
            mainEl.appendChild(section);
        }
    }

    if (!section) return null;
    if (!section.id) {
        section.id = 'viewDating';
    }
    resolvedDatingSectionId = section.id;

    // 3. Dựng toàn bộ giao diện chuẩn cho Tab 💘 Làm quen (thay thế placeholder "Sắp ra mắt")
    section.className = 'space-y-3.5 hidden';
    section.innerHTML = `
        <!-- 1. HEADER & LỊCH SỬ HỒ SƠ MATCH ĐÃ PHÂN TÍCH -->
        <div class="bg-white dark:bg-stone-800/90 border border-warm-200 dark:border-stone-700 rounded-2xl p-4 shadow-xs space-y-3">
            <div class="flex items-start justify-between gap-2">
                <div class="flex items-start gap-2.5">
                    <div class="w-9 h-9 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center text-white text-base shadow-xs flex-shrink-0">
                        💘
                    </div>
                    <div>
                        <h2 class="text-sm font-extrabold text-stone-900 dark:text-white">Làm quen khi mới Match trên App hẹn hò</h2>
                        <p class="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                            Đọc hồ sơ cô ấy để tìm điểm bắt chuyện tự nhiên, gợi ý 5 câu mở đầu và lộ trình 10 tin đầu tiên.
                        </p>
                    </div>
                </div>
                <button type="button" id="btnToggleDatingHistoryDrawer" class="px-2.5 py-1.5 rounded-xl bg-warm-100 hover:bg-warm-200 dark:bg-stone-700 dark:hover:bg-stone-600 text-stone-700 dark:text-stone-200 text-[11px] font-bold transition flex-shrink-0">
                    🗂️ Đã lưu (<span id="datingHistoryCountBadge">0</span>)
                </button>
            </div>

            <!-- Ngăn kéo xem lại các hồ sơ Match đã phân tích -->
            <div id="datingHistoryDrawer" class="hidden pt-2.5 border-t border-warm-100 dark:border-stone-700/70 space-y-2">
                <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-stone-700 dark:text-stone-300">🕘 Hồ sơ Match đã phân tích gần đây:</span>
                    <button type="button" id="btnClearDatingHistory" class="text-[11px] text-red-500 hover:underline font-semibold">Xoá lịch sử</button>
                </div>
                <div id="datingHistoryListContainer" class="space-y-1.5 max-h-52 overflow-y-auto pr-1"></div>
            </div>

            <!-- 3.6 AN TOÀN KHI HẸN GẶP LẦN ĐẦU (HIỂN THỊ GỌN) -->
            <details class="group rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/70 px-3 py-2 text-xs">
                <summary class="cursor-pointer font-bold text-emerald-800 dark:text-emerald-300 flex items-center justify-between select-none">
                    <span>🛡️ Cẩm nang an toàn khi mới Match & hẹn gặp lần đầu (bấm để xem)</span>
                    <span class="text-[10px] text-emerald-600 dark:text-emerald-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <ul class="mt-2 pt-2 border-t border-emerald-200/60 dark:border-emerald-800/60 space-y-1 text-[11px] text-stone-700 dark:text-stone-200 leading-relaxed">
                    <li>• <strong>Gặp ở nơi công cộng:</strong> Luôn chọn quán cafe, trung tâm thương mại đông người vào ban ngày hoặc đầu buổi tối cho buổi hẹn đầu.</li>
                    <li>• <strong>Báo trước cho bạn bè:</strong> Chia sẻ địa điểm hẹn và thông tin cơ bản cho 1 người bạn thân hoặc người nhà.</li>
                    <li>• <strong>Bảo mật thông tin & tài chính:</strong> Tuyệt đối không gửi ảnh nhạy cảm, mã OTP, căn cước hay chuyển tiền / nạp tiền đầu tư dưới mọi hình thức.</li>
                    <li>• <strong>Cảnh giác dấu hiệu lừa đảo (Scam/Booking):</strong> Cẩn trọng nếu đối phương rủ rê đầu tư tài chính/tiền ảo, hoặc ép vào quán bar/nhà hàng lạ chỉ định sẵn ngay buổi đầu.</li>
                </ul>
            </details>
        </div>

        <!-- 2. KHUNG NHẬP THÔNG TIN MATCH (MỤC 3.1) -->
        <div class="bg-white dark:bg-stone-800/90 border border-warm-200 dark:border-stone-700 rounded-2xl p-4 shadow-xs space-y-3.5">
            <div class="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
                <div class="flex-1">
                    <label for="datingMatchNameInput" class="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                        🏷️ Tên hoặc biệt danh cô ấy trên App (tuỳ chọn):
                    </label>
                    <input id="datingMatchNameInput" type="text" placeholder="Ví dụ: Linh Tinder, Thảo thích mèo..." class="w-full rounded-xl bg-warm-50 dark:bg-stone-900 border border-warm-200 dark:border-stone-700 px-3 py-2 text-xs text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-warm-500">
                </div>
            </div>

            <!-- Chọn App hẹn hò & Mục tiêu (Mục 3.1) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-warm-100 dark:border-stone-700/60">
                <div>
                    <span class="text-xs font-bold text-stone-600 dark:text-stone-300 block mb-1.5">📱 Match trên ứng dụng nào:</span>
                    <div class="flex flex-wrap gap-1.5" id="datingAppGroup">
                        <button type="button" data-value="Tinder" class="chip-btn text-xs py-1.5 px-2.5 rounded-xl border transition">🔥 Tinder</button>
                        <button type="button" data-value="Bumble" class="chip-btn text-xs py-1.5 px-2.5 rounded-xl border transition">🐝 Bumble</button>
                        <button type="button" data-value="Hinge" class="chip-btn text-xs py-1.5 px-2.5 rounded-xl border transition">💜 Hinge</button>
                        <button type="button" data-value="Facebook Dating / Khác" class="chip-btn text-xs py-1.5 px-2.5 rounded-xl border transition">✨ App khác</button>
                    </div>
                </div>

                <div>
                    <span class="text-xs font-bold text-stone-600 dark:text-stone-300 block mb-1.5">🎯 Mục tiêu của bạn:</span>
                    <div class="flex flex-wrap gap-1.5" id="datingGoalGroup">
                        <button type="button" data-value="Làm quen / Bạn bè trước" class="chip-btn text-xs py-1.5 px-2.5 rounded-xl border transition">🤝 Làm quen / Bạn bè</button>
                        <button type="button" data-value="Hẹn hò nghiêm túc" class="chip-btn text-xs py-1.5 px-2.5 rounded-xl border transition">💖 Hẹn hò nghiêm túc</button>
                        <button type="button" data-value="Chưa rõ / Tuỳ duyên" class="chip-btn text-xs py-1.5 px-2.5 rounded-xl border transition">🌱 Chưa rõ</button>
                    </div>
                </div>
            </div>

            <!-- Component đính kèm ảnh chụp hồ sơ (Mục 3.1 - dùng js/attachments.js) -->
            <div id="datingAttachmentRoot"></div>

            <!-- Ô dán chữ Bio / Prompt / Sở thích (Mục 3.1) -->
            <div>
                <div class="flex items-center justify-between mb-1">
                    <label for="datingBioInput" class="text-xs font-bold text-stone-700 dark:text-stone-300">
                        📝 Hoặc dán chữ Bio / Prompt / Sở thích hiển thị trên hồ sơ:
                    </label>
                    <button type="button" id="btnClearDatingInput" class="text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition">
                        Xoá chữ
                    </button>
                </div>
                <textarea id="datingBioInput" rows="3" placeholder="Dán câu bio, câu trả lời prompt hoặc mô tả nhanh những gì thấy trên hồ sơ (ví dụ: Thích uống matcha cuối tuần, nuôi 1 bé mèo Anh lông ngắn, mê nhạc Indie... Hoặc để trống nếu cô ấy không viết bio)..." class="w-full rounded-xl bg-warm-50 dark:bg-stone-900/90 border border-warm-200 dark:border-stone-700 p-3 text-sm text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-warm-500 transition resize-none"></textarea>
            </div>

            <!-- Bộ chỉnh giọng văn mở lời -->
            <div class="p-3 rounded-xl bg-warm-100/70 dark:bg-stone-900/60 border border-warm-200/80 dark:border-stone-700 space-y-3">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <div class="flex justify-between text-xs font-bold mb-1">
                            <span>⚡ Mức viết tắt:</span>
                            <span id="abbrevLabelDating" class="text-warm-600 dark:text-amber-400">Vừa phải</span>
                        </div>
                        <input id="abbrevSliderDating" type="range" min="1" max="3" step="1" value="2" class="custom-slider">
                    </div>

                    <div>
                        <div class="flex justify-between text-xs font-bold mb-1">
                            <span>😄 Độ hài hước:</span>
                            <span id="humorLabelDating" class="text-warm-600 dark:text-amber-400">Tự nhiên</span>
                        </div>
                        <input id="humorSliderDating" type="range" min="1" max="3" step="1" value="2" class="custom-slider">
                    </div>
                </div>

                <div>
                    <span class="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1.5">🗣️ Cách xưng hô khi mở lời:</span>
                    <div class="flex flex-wrap gap-1.5" id="pronounGroupDating">
                        <button type="button" data-value="mình - bạn" class="chip-btn text-xs py-1.5 px-2.5 rounded-xl border transition">mình - bạn</button>
                        <button type="button" data-value="tớ - cậu" class="chip-btn text-xs py-1.5 px-2.5 rounded-xl border transition">tớ - cậu</button>
                        <button type="button" data-value="anh - em" class="chip-btn text-xs py-1.5 px-2.5 rounded-xl border transition">anh - em</button>
                        <button type="button" data-value="tui - bà" class="chip-btn text-xs py-1.5 px-2.5 rounded-xl border transition">tui - bà</button>
                        <button type="button" data-value="Để AI tự chọn theo ngữ cảnh" class="chip-btn text-xs py-1.5 px-2.5 rounded-xl border transition">✨ AI tự chọn</button>
                    </div>
                </div>
            </div>

            <!-- Nút Phân tích Hồ sơ & Gợi ý Mở lời -->
            <button type="button" id="btnSubmitDating" class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-500 via-warm-500 to-amber-600 hover:from-rose-600 hover:to-amber-700 text-white font-bold text-sm shadow-md shadow-warm-500/20 active:scale-[0.99] transition flex items-center justify-center gap-2">
                <span>💘 Đọc hồ sơ Match & Tạo chiến lược làm quen</span>
            </button>
        </div>

        <!-- 3. KHU VỰC HIỂN THỊ KẾT QUẢ PHÂN TÍCH HỒ SƠ MATCH (MỤC 3.2 -> 3.8) -->
        <div id="datingResultArea" class="space-y-4"></div>
    `;

    return section;
}

// Đồng bộ trạng thái của Tab Làm quen lên giao diện
function syncDatingUIFromState() {
    if (!appState.dating && typeof createDefaultDatingState === 'function') {
        appState.dating = createDefaultDatingState();
    }
    const d = appState.dating || {};
    const nameEl = document.getElementById('datingMatchNameInput');
    const bioEl = document.getElementById('datingBioInput');
    const abbrevEl = document.getElementById('abbrevSliderDating');
    const humorEl = document.getElementById('humorSliderDating');

    if (nameEl) nameEl.value = d.matchName || '';
    if (bioEl) bioEl.value = d.bioText || '';
    if (abbrevEl) abbrevEl.value = d.abbrevLevel || 2;
    if (humorEl) humorEl.value = d.humorLevel || 2;

    updateSlidersLabelDating();
    highlightChipGroup('datingAppGroup', d.appName || 'Tinder');
    highlightChipGroup('datingGoalGroup', d.goal || 'Làm quen / Bạn bè trước');
    highlightChipGroup('pronounGroupDating', d.pronoun || 'mình - bạn');
    renderDatingHistoryDrawerUI();

    if (d.lastResult) {
        renderDatingResultUI(d.lastResult);
    } else {
        const resArea = document.getElementById('datingResultArea');
        if (resArea) resArea.innerHTML = '';
    }
}

function updateSlidersLabelDating() {
    const d = appState.dating || {};
    const abbrevMap = { 1: 'Ít (viết đầy đủ)', 2: 'Vừa phải (ko, dc, vs)', 3: 'Nhiều (nma, bh, j, r)' };
    const humorMap = { 1: 'Điềm đạm / Chân thành', 2: 'Tự nhiên', 3: 'Vui vẻ / Dí dỏm' };
    const abbrevLbl = document.getElementById('abbrevLabelDating');
    const humorLbl = document.getElementById('humorLabelDating');
    if (abbrevLbl) abbrevLbl.textContent = abbrevMap[d.abbrevLevel] || 'Vừa phải';
    if (humorLbl) humorLbl.textContent = humorMap[d.humorLevel] || 'Tự nhiên';
}

// Hiển thị danh sách các hồ sơ Match đã lưu gần đây
function renderDatingHistoryDrawerUI() {
    const badge = document.getElementById('datingHistoryCountBadge');
    const container = document.getElementById('datingHistoryListContainer');
    const list = appState.datingHistory || [];

    if (badge) badge.textContent = String(list.length);
    if (!container) return;

    if (list.length === 0) {
        container.innerHTML = `<p class="text-xs text-stone-400 italic py-1">Chưa có hồ sơ match nào được lưu.</p>`;
        return;
    }

    container.innerHTML = list
        .map((item, idx) => {
            const timeStr = new Date(item.createdAt).toLocaleString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
                day: '2-digit',
                month: '2-digit'
            });
            return `
                <div class="p-2.5 rounded-xl bg-warm-50 dark:bg-stone-900 border border-warm-200 dark:border-stone-700 flex items-center justify-between gap-2 text-xs">
                    <div class="min-w-0 flex-1">
                        <div class="font-bold text-stone-800 dark:text-stone-100 truncate">
                            💘 ${escapeHtml(item.matchName)} <span class="text-[10px] font-normal text-stone-400">(${escapeHtml(item.appName)} • ${timeStr})</span>
                        </div>
                        <div class="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                            ${escapeHtml(item.result?.profileSummary || item.bioText || 'Hồ sơ ít thông tin')}
                        </div>
                    </div>
                    <button type="button" data-load-match-idx="${idx}" class="px-2.5 py-1 rounded-lg bg-warm-500 hover:bg-warm-600 text-white font-bold text-[11px] flex-shrink-0 transition">
                        Xem lại
                    </button>
                </div>
            `;
        })
        .join('');

    container.querySelectorAll('button[data-load-match-idx]').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.getAttribute('data-load-match-idx'), 10);
            const item = appState.datingHistory[idx];
            if (!item) return;
            appState.dating.matchName = item.matchName;
            appState.dating.appName = item.appName;
            appState.dating.goal = item.goal;
            appState.dating.bioText = item.bioText;
            appState.dating.lastResult = item.result;
            saveDatingStateToStorage();
            syncDatingUIFromState();
            showToast(`Đã tải lại hồ sơ "${item.matchName}"!`, '💘');
        });
    });
}

// Xây dựng Prompt gửi lên Gemini cho Giai đoạn 3
function buildDatingPrompt() {
    const d = appState.dating;
    const hasImages = window.datingAttachments && window.datingAttachments.hasAttachments();
    const imgCount = hasImages ? window.datingAttachments.getImages().length : 0;
    const bioClean = (d.bioText || '').trim();

    const abbrevDesc =
        d.abbrevLevel === 1
            ? 'Mức 1 - Ít viết tắt (viết đầy đủ, rõ chữ)'
            : d.abbrevLevel === 2
            ? 'Mức 2 - Viết tắt vừa phải tự nhiên (ko, dc, vs, hnay)'
            : 'Mức 3 - Viết tắt kiểu Gen Z tự nhiên (k, dc, vs, nma, hnay, bh, j, r)';

    const humorDesc =
        d.humorLevel === 1
            ? 'Mức 1 - Điềm đạm, chân thành, lịch sự'
            : d.humorLevel === 2
            ? 'Mức 2 - Tự nhiên, thân thiện'
            : 'Mức 3 - Vui vẻ, dí dỏm, tinh nghịch nhẹ nhàng';

    return `THÔNG TIN HỒ SƠ MATCH TRÊN APP HẸN HÒ:
- Tên/Biệt danh cô ấy: ${d.matchName || 'Bạn nữ mới match'}
- Ứng dụng hẹn hò: ${d.appName}
- Mục tiêu làm quen của tôi: ${d.goal}
- Số ảnh chụp màn hình hồ sơ đính kèm: ${imgCount} ảnh
- Nội dung chữ Bio / Prompt / Sở thích người dùng nhập: ${bioClean ? `"${bioClean}"` : '(Người dùng không nhập chữ hoặc hồ sơ cô ấy để trống bio)'}
- Yêu cầu giọng văn khi viết câu mở đầu & câu hỏi mở:
  + Cách xưng hô: ${d.pronoun}
  + Mức độ viết tắt: ${abbrevDesc}
  + Mức độ hài hước: ${humorDesc}
${typeof buildMyProfilePromptContext === 'function' ? buildMyProfilePromptContext() : ''}

YÊU CẦU QUAN TRỌNG:
1. Nếu không có ảnh đính kèm VÀ chữ bio trống (hoặc ảnh/bio hầu như không có thông tin gì về sở thích, hoạt động), hãy đặt "isLowInfo": true, giải thích rõ trong "lowInfoNote" và tạo các câu mở đầu dạng chọn A/B vui vẻ hoặc câu hỏi mở nhẹ nhàng.
2. Nếu có ảnh hoặc chữ bio: CHỈ trích xuất "hooks" từ những chi tiết hiển thị rõ (thú cưng, đồ ăn, du lịch, bối cảnh, câu chữ trên bio/prompt). Không đoán thông tin nhạy cảm, không nhận xét ngoại hình/cơ thể.
3. Trả về đầy đủ: hooks[] (3-5 điểm bắt chuyện), openers[] (ĐÚNG 5 câu mở đầu theo 3 phong cách: Nhẹ nhàng, Vui vẻ, Tò mò), roadmap10[] (ĐÚNG 5 chặng cho 10 tin nhắn đầu), và questionBank[] (ĐÚNG 10 câu hỏi mở chia đều vào 5 chủ đề: "Cuối tuần", "Đồ ăn", "Du lịch", "Phim / Nhạc", "Công việc / Học tập").`;
}

// Xử lý khi bấm nút "💘 Đọc hồ sơ Match & Tạo chiến lược làm quen"
async function handleAnalyzeDatingProfile() {
    const d = appState.dating;
    d.matchName = (document.getElementById('datingMatchNameInput')?.value || '').trim();
    d.bioText = (document.getElementById('datingBioInput')?.value || '').trim();
    saveDatingStateToStorage();

    const extraParts = window.datingAttachments ? window.datingAttachments.toExtraParts() : [];
    const btn = document.getElementById('btnSubmitDating');
    const resultArea = document.getElementById('datingResultArea');

    if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<span class="animate-spin">⏳</span><span>Đang đọc hồ sơ & tìm điểm bắt chuyện...</span>`;
    }

    if (resultArea) {
        resultArea.innerHTML = `
            <div class="bg-white dark:bg-stone-800/90 border border-warm-200 dark:border-stone-700 rounded-2xl p-5 text-center space-y-2.5 animate-pop">
                <div class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-warm-100 dark:bg-stone-700">
                    <span class="w-2.5 h-2.5 rounded-full bg-rose-500 typing-dot"></span>
                    <span class="w-2.5 h-2.5 rounded-full bg-warm-500 typing-dot"></span>
                    <span class="w-2.5 h-2.5 rounded-full bg-amber-500 typing-dot"></span>
                </div>
                <p class="text-xs font-semibold text-stone-600 dark:text-stone-300">
                    Đang quan sát hồ sơ trên ${escapeHtml(d.appName)}, trích xuất Hooks, soạn 5 câu mở đầu & lộ trình 10 tin...
                </p>
            </div>
        `;
    }

    const userPrompt = buildDatingPrompt();

    try {
        const { parsed } = await callGeminiWithSchemaRetry(
            SYSTEM_PROMPT_DATING,
            [],
            userPrompt,
            SCHEMA_DATING,
            validateDatingJson,
            0.85,
            { extraParts }
        );

        d.lastResult = parsed;
        d.activeQuestionCategory = 'ALL';
        saveDatingHistoryEntry({
            matchName: d.matchName || `Match ${d.appName}`,
            appName: d.appName,
            goal: d.goal,
            bioText: d.bioText,
            result: parsed
        });

        renderDatingHistoryDrawerUI();
        renderDatingResultUI(parsed);
        showToast('Đã phân tích hồ sơ Match & tạo bộ câu mở lời!', '💘');
    } catch (err) {
        renderErrorCard('datingResultArea', err.message);
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = `<span>💘 Đọc hồ sơ Match & Tạo chiến lược làm quen</span>`;
        }
    }
}

// Định dạng nổi bật các chỗ trống [thông tin cá nhân]
function formatBracketPlaceholders(str) {
    return escapeHtml(str || '').replace(
        /\[([^\]]+)\]/g,
        '<span class="underline decoration-wavy decoration-amber-300 font-bold bg-amber-500/20 px-1 rounded">[$1]</span>'
    );
}

// Vẽ toàn bộ kết quả Giai đoạn 3 (Mục 3.2, 3.3, 3.4, 3.5, 3.7, 3.8)
function renderDatingResultUI(data) {
    const container = document.getElementById('datingResultArea');
    if (!container || !data) return;

    const d = appState.dating;
    const activeCat = d.activeQuestionCategory || 'ALL';

    const lowInfoBanner =
        data.isLowInfo || (data.lowInfoNote && data.lowInfoNote.trim())
            ? `
            <div class="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                <span class="text-base leading-none mt-0.5">⚠️</span>
                <div class="space-y-0.5">
                    <div class="font-extrabold">Lưu ý: Hồ sơ có ít thông tin cụ thể</div>
                    <p class="leading-relaxed">${escapeHtml(
                        data.lowInfoNote ||
                            'Hồ sơ của cô ấy hiện có rất ít thông tin hoặc để trống bio. Mở lời chung chung sẽ kém hiệu quả hơn so với khi có chi tiết cụ thể; bạn nên dùng câu hỏi chọn A/B vui vẻ bên dưới để cô ấy dễ bắt nhịp.'
                    )}</p>
                </div>
            </div>
        `
            : '';

    const hooksHtml = (data.hooks || [])
        .map(
            (hook, idx) => `
            <div class="p-3.5 rounded-xl bg-warm-50/90 dark:bg-stone-900/90 border border-warm-200 dark:border-stone-700 space-y-2">
                <div class="flex items-center justify-between gap-2">
                    <span class="text-xs font-extrabold text-warm-600 dark:text-amber-400 flex items-center gap-1.5">
                        <span>🎣 Hook #${idx + 1}:</span>
                        <span>${escapeHtml(hook.title)}</span>
                    </span>
                    <button type="button" data-copy-hook-q="${idx}" class="px-2 py-0.5 rounded-lg bg-warm-200/80 hover:bg-warm-300 dark:bg-stone-700 dark:hover:bg-stone-600 text-[11px] font-bold text-stone-700 dark:text-stone-200 transition">
                        📋 Copy câu hỏi
                    </button>
                </div>
                <p class="text-xs text-stone-700 dark:text-stone-200">
                    🔍 <strong>Quan sát từ hồ sơ:</strong> ${escapeHtml(hook.observation)}
                </p>
                <p class="text-[11px] text-stone-500 dark:text-stone-400">
                    💡 <strong>Vì sao dễ bắt chuyện:</strong> ${escapeHtml(hook.whyEasy)}
                </p>
                <div class="p-2.5 rounded-lg bg-white dark:bg-stone-800 border border-warm-200/80 dark:border-stone-700 text-xs text-stone-800 dark:text-stone-100">
                    💬 <strong>Gợi mở nhanh:</strong> "${formatBracketPlaceholders(hook.starterQuestion)}"
                </div>
            </div>
        `
        )
        .join('');

    const openersHtml = (data.openers || [])
        .map((op, idx) => {
            const st = String(op.style || '').toLowerCase();
            let styleBadge = '🌱 Nhẹ nhàng';
            let styleColor = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300/60';
            if (st.includes('vui')) {
                styleBadge = '😄 Vui vẻ / Dí dỏm';
                styleColor = 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300/60';
            } else if (st.includes('tò mò')) {
                styleBadge = '🔍 Gợi tò mò';
                styleColor = 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border-purple-300/60';
            }

            return `
                <div class="p-3.5 rounded-2xl bg-warm-50/70 dark:bg-stone-900/80 border border-warm-200 dark:border-stone-700 space-y-2.5">
                    <div class="flex flex-wrap items-center justify-between gap-1.5">
                        <div class="flex items-center gap-1.5">
                            <span class="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${styleColor}">
                                ${escapeHtml(styleBadge)}
                            </span>
                            <span class="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-warm-200/70 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                                🎯 Bám vào: ${escapeHtml(op.hookRef)}
                            </span>
                        </div>
                        <span class="text-[10px] text-stone-400">Câu mở đầu #${idx + 1}</span>
                    </div>

                    <div class="flex justify-end">
                        <div class="max-w-[92%] bg-gradient-to-br from-warm-500 to-amber-600 text-white px-3.5 py-2.5 rounded-2xl rounded-br-xs shadow-xs text-sm leading-relaxed break-words">
                            ${formatBracketPlaceholders(op.text)}
                        </div>
                    </div>

                    <p class="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                        💡 <strong>Vì sao hiệu quả:</strong> ${escapeHtml(op.why)}
                    </p>

                    <div class="flex items-center gap-2 pt-1">
                        <button type="button" data-copy-opener="${idx}" class="flex-1 py-2 px-3 rounded-xl bg-warm-500 hover:bg-warm-600 text-white font-bold text-xs transition flex items-center justify-center gap-1.5">
                            <span>📋</span>
                            <span>Sao chép câu mở đầu</span>
                        </button>
                        <button type="button" data-send-compose-opener="${idx}" class="py-2 px-3 rounded-xl bg-warm-100 hover:bg-warm-200 dark:bg-stone-700 dark:hover:bg-stone-600 text-stone-700 dark:text-stone-200 font-bold text-xs transition">
                            ✍️ Chỉnh bên Soạn tin
                        </button>
                    </div>
                </div>
            `;
        })
        .join('');

    const roadmapHtml = (data.roadmap10 || [])
        .map(
            (step, idx) => `
            <div class="relative pl-6 pb-4 last:pb-0 border-l-2 border-warm-300 dark:border-stone-700">
                <div class="absolute -left-[9px] top-0.5 w-4 h-4 rounded-full bg-warm-500 text-white text-[10px] font-extrabold flex items-center justify-center shadow-xs">
                    ${idx + 1}
                </div>
                <div class="p-3 rounded-xl bg-warm-50/80 dark:bg-stone-900/80 border border-warm-200 dark:border-stone-700 space-y-1.5 text-xs">
                    <div class="font-extrabold text-stone-900 dark:text-white text-xs sm:text-sm">${escapeHtml(step.stage)}</div>
                    <p class="text-stone-700 dark:text-stone-200">🎯 <strong>Mục tiêu:</strong> ${escapeHtml(step.goal)}</p>
                    <div class="p-2 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-200 flex items-start justify-between gap-2">
                        <span>✅ <strong>Ví dụ nên làm:</strong> "${formatBracketPlaceholders(step.goodExample)}"</span>
                        <button type="button" data-copy-roadmap="${idx}" class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-600 text-white flex-shrink-0">Copy</button>
                    </div>
                    <p class="text-red-600 dark:text-red-400">🚫 <strong>Nên tránh:</strong> ${escapeHtml(step.avoid)}</p>
                    <p class="text-sky-700 dark:text-sky-300">🟢 <strong>Tín hiệu sang chặng sau:</strong> ${escapeHtml(step.greenSignal)}</p>
                </div>
            </div>
        `
        )
        .join('');

    const categories = ['ALL', 'Cuối tuần', 'Đồ ăn', 'Du lịch', 'Phim / Nhạc', 'Công việc / Học tập'];
    const catButtonsHtml = categories
        .map(cat => {
            const isSel = activeCat === cat;
            const label = cat === 'ALL' ? 'Tất cả (10)' : cat;
            return `
                <button type="button" data-qbank-cat="${escapeHtml(cat)}" class="px-2.5 py-1 rounded-xl text-xs border transition ${
                isSel
                    ? 'bg-warm-500 text-white border-warm-500 font-bold'
                    : 'bg-warm-50 dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-warm-200 dark:border-stone-700'
            }">
                    ${escapeHtml(label)}
                </button>
            `;
        })
        .join('');

    const filteredQuestions = (data.questionBank || [])
        .map((q, originalIdx) => ({ ...q, originalIdx }))
        .filter(q => {
            if (activeCat === 'ALL') return true;
            return String(q.category || '')
                .toLowerCase()
                .includes(activeCat.toLowerCase().split('/')[0].trim());
        });

    const questionBankHtml = filteredQuestions
        .map(
            q => `
            <div class="p-3 rounded-xl bg-warm-50/80 dark:bg-stone-900/80 border border-warm-200 dark:border-stone-700 space-y-2 text-xs">
                <div class="flex items-center justify-between gap-2">
                    <div class="flex items-center gap-1.5">
                        <span class="px-2 py-0.5 rounded-md bg-warm-200/80 dark:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-[11px]">
                            📂 ${escapeHtml(q.category)}
                        </span>
                        <span class="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                            • Hook: ${escapeHtml(q.hookRef)}
                        </span>
                    </div>
                    <button type="button" data-copy-qbank="${q.originalIdx}" class="px-2.5 py-1 rounded-lg bg-warm-500 hover:bg-warm-600 text-white font-bold text-[11px] transition">
                        📋 Copy câu hỏi
                    </button>
                </div>

                <div class="p-2.5 rounded-lg bg-white dark:bg-stone-800 border border-warm-200/70 dark:border-stone-700 text-stone-800 dark:text-stone-100 font-medium leading-relaxed">
                    💬 "${formatBracketPlaceholders(q.question)}"
                </div>

                <div class="flex items-start justify-between gap-2 text-[11px] text-stone-600 dark:text-stone-300 pl-1">
                    <div>↪️ <strong>Câu nối tiếp (khi cô ấy trả lời):</strong> "${formatBracketPlaceholders(q.followUp)}"</div>
                    <button type="button" data-copy-followup="${q.originalIdx}" class="text-warm-600 dark:text-amber-400 hover:underline font-bold flex-shrink-0">
                        Copy nối tiếp
                    </button>
                </div>
            </div>
        `
        )
        .join('');

    container.innerHTML = `
        <!-- KHỐI TÓM TẮT HỒ SƠ & NÚT HÀNH ĐỘNG LIÊN KẾT (MỤC 3.2, 3.7, 3.8) -->
        <div class="bg-white dark:bg-stone-800/95 border-2 border-warm-400 dark:border-amber-600/80 rounded-2xl p-4 shadow-sm space-y-3.5 animate-pop">
            <div class="space-y-1.5">
                <div class="flex items-center justify-between gap-2">
                    <span class="text-xs font-extrabold uppercase tracking-wide text-warm-600 dark:text-amber-400">
                        📋 Tóm tắt hồ sơ Match (${escapeHtml(d.appName)})
                    </span>
                    <span class="text-[11px] font-semibold text-stone-400">${escapeHtml(d.goal)}</span>
                </div>
                <p class="text-xs sm:text-sm font-semibold text-stone-800 dark:text-stone-100 leading-relaxed">
                    ${escapeHtml(data.profileSummary || '')}
                </p>
            </div>

            ${lowInfoBanner}

            <!-- HAI NÚT LIÊN KẾT CHỨC NĂNG (MỤC 3.7 & 3.8) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-warm-100 dark:border-stone-700">
                <button type="button" id="btnCreateThreadFromMatch" class="py-2.5 px-3 rounded-xl bg-warm-500 hover:bg-warm-600 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5">
                    <span>➕</span>
                    <span>Tạo cuộc trò chuyện từ match này</span>
                </button>
                <button type="button" id="btnPracticeMatchInRoleplay" class="py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-900 dark:bg-stone-700 dark:hover:bg-stone-600 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5">
                    <span>🎭</span>
                    <span>Tập mở lời trong phòng luyện tập</span>
                </button>
            </div>
        </div>

        <!-- KHỐI 3.2: CÁC ĐIỂM CÓ THỂ BẮT CHUYỆN (HOOKS) -->
        <div class="bg-white dark:bg-stone-800/95 border border-warm-200 dark:border-stone-700 rounded-2xl p-4 shadow-xs space-y-3 animate-pop">
            <div>
                <h3 class="text-sm font-extrabold text-stone-900 dark:text-white flex items-center gap-1.5">
                    <span>🎣 Điểm bắt chuyện từ hồ sơ (Hooks)</span>
                </h3>
                <p class="text-[11px] text-stone-500 dark:text-stone-400">
                    Chỉ trích xuất từ chi tiết hiển thị rõ trên ảnh/bio, giúp bạn mở lời tự nhiên không bị sến.
                </p>
            </div>
            <div class="space-y-2.5">${hooksHtml}</div>
        </div>

        <!-- KHỐI 3.3: 5 CÂU MỞ ĐẦU THEO 3 PHONG CÁCH -->
        <div class="bg-white dark:bg-stone-800/95 border border-warm-200 dark:border-stone-700 rounded-2xl p-4 shadow-xs space-y-3 animate-pop">
            <div class="space-y-1">
                <h3 class="text-sm font-extrabold text-stone-900 dark:text-white">
                    💬 5 Câu mở đầu dễ trả lời (3 phong cách)
                </h3>
                <p class="text-[11px] text-stone-500 dark:text-stone-400">
                    🚫 Tránh chào "hi/hello" trơn, tránh khen ngoại hình ngay hoặc hỏi tuổi/thu nhập/ny cũ ở tin đầu.
                </p>
            </div>
            <div class="space-y-3">${openersHtml}</div>
        </div>

        <!-- KHỐI 3.4: LỘ TRÌNH 10 TIN NHẮN ĐẦU TIÊN -->
        <div class="bg-white dark:bg-stone-800/95 border border-warm-200 dark:border-stone-700 rounded-2xl p-4 shadow-xs space-y-3 animate-pop">
            <div class="space-y-1">
                <h3 class="text-sm font-extrabold text-stone-900 dark:text-white">
                    🗺️ Lộ trình 10 tin nhắn đầu tiên (5 chặng)
                </h3>
                <div class="p-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-[11px] text-amber-900 dark:text-amber-200">
                    💡 <strong>Nguyên tắc quan trọng:</strong> Thời điểm rủ gặp hay xin IG/Zalo phụ thuộc hoàn toàn vào việc cô ấy có thoải mái và hào hứng trả lời bạn hay không — đừng ép theo số lượng tin cứng nhắc.
                </div>
            </div>
            <div class="pt-1">${roadmapHtml}</div>
        </div>

        <!-- KHỐI 3.5: NGÂN HÀNG 10 CÂU HỎI MỞ CÁ NHÂN HOÁ THEO HOOK -->
        <div class="bg-white dark:bg-stone-800/95 border border-warm-200 dark:border-stone-700 rounded-2xl p-4 shadow-xs space-y-3 animate-pop">
            <div class="space-y-2">
                <div>
                    <h3 class="text-sm font-extrabold text-stone-900 dark:text-white">
                        🎯 Ngân hàng 10 câu hỏi mở cá nhân hoá theo Hook
                    </h3>
                    <p class="text-[11px] text-stone-500 dark:text-stone-400">
                        Dùng khi muốn mở rộng câu chuyện theo chủ đề mà không biến cuộc chat thành buổi phỏng vấn.
                    </p>
                </div>
                <div class="flex flex-wrap gap-1.5">${catButtonsHtml}</div>
            </div>
            <div class="space-y-2.5">${questionBankHtml}</div>
        </div>
    `;

    const btnCreateThread = document.getElementById('btnCreateThreadFromMatch');
    if (btnCreateThread) {
        btnCreateThread.addEventListener('click', () => handleCreateThreadFromMatch(data));
    }

    const btnPracticeRoleplay = document.getElementById('btnPracticeMatchInRoleplay');
    if (btnPracticeRoleplay) {
        btnPracticeRoleplay.addEventListener('click', () => handlePracticeMatchInRoleplay(data));
    }

    container.querySelectorAll('button[data-copy-hook-q]').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.getAttribute('data-copy-hook-q'), 10);
            const text = data.hooks?.[idx]?.starterQuestion || '';
            copyText(text);
        });
    });

    container.querySelectorAll('button[data-copy-opener]').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.getAttribute('data-copy-opener'), 10);
            const text = data.openers?.[idx]?.text || '';
            copyText(text);
        });
    });

    container.querySelectorAll('button[data-send-compose-opener]').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.getAttribute('data-send-compose-opener'), 10);
            const text = data.openers?.[idx]?.text || '';
            if (!text) return;
            appState.compose.prefs.inputMode = 'draft';
            appState.compose.draftInput = text;
            const composeInputEl = document.getElementById('composeUserInput');
            if (composeInputEl) composeInputEl.value = text;
            if (typeof updateComposeInputModeUI === 'function') updateComposeInputModeUI();
            switchNavigation('compose');
            showToast('Đã chuyển câu mở đầu sang tab ✍️ Soạn tin để bạn tuỳ chỉnh!', '✍️');
        });
    });

    container.querySelectorAll('button[data-copy-roadmap]').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.getAttribute('data-copy-roadmap'), 10);
            const text = data.roadmap10?.[idx]?.goodExample || '';
            copyText(text);
        });
    });

    container.querySelectorAll('button[data-qbank-cat]').forEach(btn => {
        btn.addEventListener('click', () => {
            appState.dating.activeQuestionCategory = btn.getAttribute('data-qbank-cat') || 'ALL';
            renderDatingResultUI(data);
        });
    });

    container.querySelectorAll('button[data-copy-qbank]').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.getAttribute('data-copy-qbank'), 10);
            const text = data.questionBank?.[idx]?.question || '';
            copyText(text);
        });
    });

    container.querySelectorAll('button[data-copy-followup]').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.getAttribute('data-copy-followup'), 10);
            const text = data.questionBank?.[idx]?.followUp || '';
            copyText(text);
        });
    });
}

/**
 * MỤC 3.7: Nút "➕ Tạo cuộc trò chuyện từ match này"
 */
function handleCreateThreadFromMatch(matchData) {
    const data = matchData || appState.dating.lastResult;
    if (!data) {
        showToast('Hãy bấm phân tích hồ sơ Match trước khi tạo cuộc trò chuyện nhé!', '⚠️');
        return;
    }

    const d = appState.dating;
    const defaultThreadName = d.matchName
        ? `${d.matchName} (${d.appName})`
        : `Match ${d.appName} #${appState.threads.length + 1}`;

    openCustomModal({
        title: '➕ Tạo cuộc trò chuyện từ Match này',
        description:
            'Toàn bộ tóm tắt hồ sơ (profileSummary) và các điểm bắt chuyện (hooks) sẽ được lưu vào thread.profile để Chế độ A, Soạn tin và Phân tích tự động hiểu ngữ cảnh cô ấy:',
        showInput: true,
        defaultValue: defaultThreadName,
        placeholder: 'Đặt tên cuộc trò chuyện...',
        confirmText: 'Tạo & Mở cuộc trò chuyện',
        onConfirm: (customName) => {
            const finalName = (customName || defaultThreadName).trim();
            const newThread = createDefaultThread(finalName);

            newThread.where = 'Quen qua App hẹn hò';
            newThread.closeness = 'Mới bắt chuyện vài lần';
            newThread.goal =
                d.goal === 'Hẹn hò nghiêm túc'
                    ? 'Đồng cảm & hỏi thăm tự nhiên'
                    : 'Trêu vui hài hước nhẹ nhàng';
            newThread.pronoun =
                d.pronoun && d.pronoun !== 'Để AI tự chọn theo ngữ cảnh' ? d.pronoun : 'mình - bạn';
            newThread.abbrevLevel = d.abbrevLevel || 2;
            newThread.humorLevel = d.humorLevel || 2;

            newThread.profile = {
                source: 'dating_match',
                appName: d.appName,
                goal: d.goal,
                bioText: d.bioText,
                profileSummary: data.profileSummary,
                isLowInfo: Boolean(data.isLowInfo),
                hooks: Array.isArray(data.hooks) ? data.hooks : [],
                openers: Array.isArray(data.openers) ? data.openers : [],
                createdAt: Date.now()
            };

            const hookTitles = (data.hooks || []).map(h => h.title).join(', ');
            newThread.lastNote = `[Match ${d.appName}] ${data.profileSummary}${hookTitles ? ` | Hooks: ${hookTitles}` : ''}`;

            appState.threads.unshift(newThread);
            appState.activeThreadId = newThread.id;
            saveThreadsToStorage();

            if (typeof syncModeAUIFromActiveThread === 'function') {
                syncModeAUIFromActiveThread();
            }
            if (typeof renderComposeThreadSelectUI === 'function') {
                renderComposeThreadSelectUI();
            }
            renderActiveThreadMatchProfileBanner();
            switchNavigation('modeA');
            showToast(`Đã tạo cuộc trò chuyện "${finalName}" kèm hồ sơ Match!`, '💘');
        }
    });
}

/**
 * Hiển thị thẻ tóm tắt "Hồ sơ Match (thread.profile)" ngay trong Chế độ A
 */
function renderActiveThreadMatchProfileBanner() {
    const thread = getActiveThread();
    let bannerEl = document.getElementById('activeThreadMatchProfileBanner');

    if (!bannerEl) {
        const modeASec = document.getElementById('viewModeA');
        if (!modeASec) return;
        bannerEl = document.createElement('div');
        bannerEl.id = 'activeThreadMatchProfileBanner';
        const firstChild = modeASec.firstElementChild;
        if (firstChild && firstChild.nextSibling) {
            modeASec.insertBefore(bannerEl, firstChild.nextSibling);
        } else {
            modeASec.prepend(bannerEl);
        }
    }

    if (!thread || !thread.profile || !Array.isArray(thread.profile.hooks)) {
        bannerEl.className = 'hidden';
        bannerEl.innerHTML = '';
        return;
    }

    const prof = thread.profile;
    const hooksChips = prof.hooks
        .map(
            h =>
                `<span class="px-2 py-0.5 rounded-lg bg-rose-100/80 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 text-[11px] font-semibold">🎣 ${escapeHtml(
                    h.title
                )}</span>`
        )
        .join('');

    bannerEl.className =
        'rounded-2xl bg-gradient-to-r from-rose-50 to-amber-50 dark:from-stone-800 dark:to-stone-800/90 border border-rose-200 dark:border-stone-700 p-3 text-xs space-y-1.5 animate-pop';
    bannerEl.innerHTML = `
        <div class="flex items-center justify-between gap-2">
            <span class="font-extrabold text-rose-700 dark:text-rose-300">
                💘 Đang áp dụng Hồ sơ Match (${escapeHtml(prof.appName || 'App hẹn hò')})
            </span>
            <span class="text-[10px] text-stone-500 dark:text-stone-400">AI đã nhớ ${prof.hooks.length} Hooks</span>
        </div>
        <p class="text-stone-700 dark:text-stone-200 leading-relaxed">${escapeHtml(prof.profileSummary || '')}</p>
        <div class="flex flex-wrap gap-1 pt-0.5">${hooksChips}</div>
    `;
}

/**
 * MỤC 3.8: Nút "🎭 Tập mở lời trong phòng luyện tập"
 */
function handlePracticeMatchInRoleplay(matchData) {
    const data = matchData || appState.dating.lastResult;
    if (!data) {
        showToast('Hãy phân tích hồ sơ Match trước khi vào phòng luyện tập nhé!', '⚠️');
        return;
    }

    const d = appState.dating;
    const hookDetails = (data.hooks || [])
        .map(h => `${h.title} (${h.observation})`)
        .join('; ');

    const customPersona = `Một bạn nữ trưởng thành (21 tuổi, chắc chắn từ 18 tuổi trở lên) tên là "${
        d.matchName || 'Bạn nữ mới Match'
    }" trên ứng dụng ${d.appName}. Tóm tắt bản thân: ${data.profileSummary}. Các sở thích và điểm nổi bật từ hồ sơ: ${
        hookDetails || 'Thích trò chuyện tự nhiên, nhẹ nhàng'
    }. Tính cách: Tự nhiên, lịch sự, sẽ hào hứng nếu người dùng bắt chuyện đúng điểm chung trong hồ sơ, nhưng sẽ trả lời ngắn nếu bị hỏi dồn hoặc thả thính sến.`;

    const customSituation = `Hai bạn vừa mới Match nhau trên ứng dụng hẹn hò ${d.appName} (Mục tiêu: ${d.goal}). Bạn nam bắt đầu nhắn tin mở lời đầu tiên dựa trên hồ sơ của bạn.`;

    appState.roleplay.persona = customPersona;
    appState.roleplay.situation = customSituation;
    appState.roleplay.history = [];
    appState.roleplay.isFinished = false;
    saveRoleplayState();

    const headerTitleEl = document.getElementById('roleplayHeaderTitle');
    if (headerTitleEl) {
        headerTitleEl.textContent = `${d.matchName || 'Bạn nữ Match'} (${d.appName} • 21 tuổi)`;
    }
    const evalArea = document.getElementById('roleplayEvaluationArea');
    if (evalArea) evalArea.innerHTML = '';

    if (typeof renderRoleplayMessagesUI === 'function') {
        renderRoleplayMessagesUI();
    }

    switchNavigation('modeB');
    showToast('Đã dựng nhân vật từ hồ sơ Match! Hãy gõ câu mở lời đầu tiên để tập nhé 🎭', '💘');
}

// Khởi tạo toàn bộ sự kiện và tích hợp điều hướng cho Tab 💘 Làm quen
function initDatingTab() {
    const section = ensureDatingViewMounted();
    if (!section) return;

    // Mở rộng hàm switchNavigation để luôn đóng/mở đúng section của tab "💘 Làm quen"
    if (typeof window.switchNavigation === 'function' && !window._hasPatchedSwitchNavForDating) {
        const origSwitchNav = window.switchNavigation;
        window.switchNavigation = function (targetNav) {
            origSwitchNav(targetNav);
            const isDatingNav =
                targetNav === resolvedDatingNavKey ||
                ['dating', 'match', 'modeC', 'lamquen', 'icebreaker'].includes(targetNav);

            const datingSec = document.getElementById(resolvedDatingSectionId);
            if (datingSec) {
                datingSec.classList.toggle('hidden', !isDatingNav);
            }

            if (isDatingNav) {
                const mainEl = document.querySelector('main');
                if (mainEl) {
                    Array.from(mainEl.querySelectorAll('section')).forEach(sec => {
                        if (sec !== datingSec) sec.classList.add('hidden');
                    });
                }
            }
        };
        window._hasPatchedSwitchNavForDating = true;
    }

    // Tự động cập nhật banner Hồ sơ Match mỗi khi chuyển Thread ở Chế độ A
    if (typeof window.syncModeAUIFromActiveThread === 'function' && !window._hasPatchedSyncModeAForDating) {
        const origSyncModeA = window.syncModeAUIFromActiveThread;
        window.syncModeAUIFromActiveThread = function () {
            origSyncModeA();
            renderActiveThreadMatchProfileBanner();
        };
        window._hasPatchedSyncModeAForDating = true;
    }

    // Khởi tạo Widget đính kèm ảnh chụp hồ sơ (Mục 3.1)
    if (typeof createAttachmentWidget === 'function') {
        window.datingAttachments = createAttachmentWidget({
            containerId: 'datingAttachmentRoot',
            label: '📸 Đính kèm ảnh chụp hồ sơ / Bio / Prompt (tối đa 5 ảnh)',
            allowTxt: false,
            showExtractBtn: false
        });
    }

    bindChipGroup('datingAppGroup', () => appState.dating.appName, val => {
        appState.dating.appName = val;
        saveDatingStateToStorage();
    });
    bindChipGroup('datingGoalGroup', () => appState.dating.goal, val => {
        appState.dating.goal = val;
        saveDatingStateToStorage();
    });
    bindChipGroup('pronounGroupDating', () => appState.dating.pronoun, val => {
        appState.dating.pronoun = val;
        saveDatingStateToStorage();
    });

    const abbrevSlider = document.getElementById('abbrevSliderDating');
    if (abbrevSlider) {
        abbrevSlider.addEventListener('input', e => {
            appState.dating.abbrevLevel = parseInt(e.target.value, 10);
            updateSlidersLabelDating();
            saveDatingStateToStorage();
        });
    }

    const humorSlider = document.getElementById('humorSliderDating');
    if (humorSlider) {
        humorSlider.addEventListener('input', e => {
            appState.dating.humorLevel = parseInt(e.target.value, 10);
            updateSlidersLabelDating();
            saveDatingStateToStorage();
        });
    }

    const matchNameInput = document.getElementById('datingMatchNameInput');
    if (matchNameInput) {
        matchNameInput.addEventListener('input', e => {
            appState.dating.matchName = e.target.value;
            saveDatingStateToStorage();
        });
    }

    const bioInput = document.getElementById('datingBioInput');
    if (bioInput) {
        bioInput.addEventListener('input', e => {
            appState.dating.bioText = e.target.value;
            saveDatingStateToStorage();
        });
    }

    const btnClearInput = document.getElementById('btnClearDatingInput');
    if (btnClearInput) {
        btnClearInput.addEventListener('click', () => {
            if (bioInput) bioInput.value = '';
            if (matchNameInput) matchNameInput.value = '';
            appState.dating.bioText = '';
            appState.dating.matchName = '';
            saveDatingStateToStorage();
            if (bioInput) bioInput.focus();
        });
    }

    const btnToggleHist = document.getElementById('btnToggleDatingHistoryDrawer');
    if (btnToggleHist) {
        btnToggleHist.addEventListener('click', () => {
            const drawer = document.getElementById('datingHistoryDrawer');
            if (drawer) {
                drawer.classList.toggle('hidden');
                renderDatingHistoryDrawerUI();
            }
        });
    }

    const btnClearHist = document.getElementById('btnClearDatingHistory');
    if (btnClearHist) {
        btnClearHist.addEventListener('click', () => {
            openCustomModal({
                title: '🗑️ Xoá lịch sử hồ sơ Match?',
                description: 'Danh sách các hồ sơ Match đã lưu trong tab Làm quen sẽ bị xoá.',
                confirmText: 'Xoá lịch sử',
                isDanger: true,
                onConfirm: () => {
                    appState.datingHistory = [];
                    saveDatingStateToStorage();
                    renderDatingHistoryDrawerUI();
                    showToast('Đã xoá lịch sử hồ sơ Match!', '🗑️');
                }
            });
        });
    }

    const btnSubmit = document.getElementById('btnSubmitDating');
    if (btnSubmit) {
        btnSubmit.addEventListener('click', handleAnalyzeDatingProfile);
    }

    syncDatingUIFromState();
    renderActiveThreadMatchProfileBanner();
}