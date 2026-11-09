/**
 * ============================================================================
 * 6. TIỆN ÍCH GIAO DIỆN: TOAST, MODAL TUỲ CHỈNH, ESCAPE HTML, COPY, ĐIỀU HƯỚNG
 * ============================================================================
 */
function escapeHtml(str) {
    return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

let toastTimer = null;
function showToast(msg, icon = '✅') {
    const box = document.getElementById('toastBox');
    document.getElementById('toastIcon').textContent = icon;
    document.getElementById('toastMessage').textContent = msg;
    box.classList.remove('opacity-0', 'translate-y-2');
    box.classList.add('opacity-100', 'translate-y-0');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        box.classList.remove('opacity-100', 'translate-y-0');
        box.classList.add('opacity-0', 'translate-y-2');
    }, 2600);
}

function copyText(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
        document.execCommand('copy');
        showToast('Đã sao chép! Nhớ điền các chỗ trống [...] nếu có nhé 💬', '📋');
    } catch (e) {
        showToast('Không thể copy tự động, bạn hãy bôi đen chữ nhé!', '⚠️');
    }
    document.body.removeChild(ta);
}

// Hộp thoại Modal đa năng thay cho prompt() và confirm()
function openCustomModal({ title, description, showInput = false, defaultValue = '', placeholder = '', confirmText = 'Xác nhận', isDanger = false, onConfirm }) {
    const overlay = document.getElementById('customModalOverlay');
    const titleEl = document.getElementById('modalTitle');
    const descEl = document.getElementById('modalDescription');
    const inputWrap = document.getElementById('modalInputWrap');
    const textInput = document.getElementById('modalTextInput');
    const btnConfirm = document.getElementById('btnModalConfirm');
    const btnCancel = document.getElementById('btnModalCancel');
    const btnClose = document.getElementById('btnCloseModal');

    titleEl.textContent = title;
    descEl.textContent = description;

    if (showInput) {
        inputWrap.classList.remove('hidden');
        textInput.value = defaultValue;
        textInput.placeholder = placeholder;
    } else {
        inputWrap.classList.add('hidden');
    }

    btnConfirm.textContent = confirmText;
    if (isDanger) {
        btnConfirm.className = 'px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-xs transition';
    } else {
        btnConfirm.className = 'px-4 py-2 rounded-xl text-xs font-bold bg-warm-500 hover:bg-warm-600 text-white shadow-xs transition';
    }

    overlay.classList.remove('hidden');
    overlay.classList.add('flex');
    if (showInput) {
        setTimeout(() => textInput.focus(), 50);
    }

    const closeModal = () => {
        overlay.classList.add('hidden');
        overlay.classList.remove('flex');
        btnConfirm.onclick = null;
        btnCancel.onclick = null;
        btnClose.onclick = null;
    };

    btnCancel.onclick = closeModal;
    btnClose.onclick = closeModal;
    btnConfirm.onclick = () => {
        const val = showInput ? textInput.value.trim() : true;
        closeModal();
        if (onConfirm) onConfirm(val);
    };
}

function renderErrorCard(containerId, errorMsg) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = `
        <div class="rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-300 dark:border-red-800 p-4 text-xs text-red-900 dark:text-red-200 space-y-2.5 animate-pop">
            <div class="flex items-start gap-2.5">
                <span class="text-base leading-none mt-0.5">⚠️</span>
                <div class="space-y-1 flex-1">
                    <h4 class="font-extrabold text-sm text-red-700 dark:text-red-300">Chưa thể tạo phản hồi</h4>
                    <p class="leading-relaxed">${escapeHtml(errorMsg)}</p>
                </div>
            </div>
            <div class="flex justify-end pt-1">
                <button type="button" onclick="switchNavigation('settings')" class="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition">
                    ⚙️ Mở Cài đặt kiểm tra kết nối
                </button>
            </div>
        </div>
    `;
}

function highlightChipGroup(groupId, activeVal) {
    const container = document.getElementById(groupId);
    if (!container) return;
    container.querySelectorAll('button[data-value]').forEach(btn => {
        const isSelected = btn.getAttribute('data-value') === activeVal;
        btn.className = isSelected
            ? 'chip-btn text-xs py-1.5 px-2.5 rounded-xl border transition bg-warm-500 text-white border-warm-500 font-bold shadow-xs'
            : 'chip-btn text-xs py-1.5 px-2.5 rounded-xl border transition bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-warm-200 dark:border-stone-700 hover:bg-warm-100 dark:hover:bg-stone-700';
    });
}

function bindChipGroup(groupId, getActiveValFn, onSelectFn) {
    const container = document.getElementById(groupId);
    if (!container) return;
    highlightChipGroup(groupId, getActiveValFn());
    container.querySelectorAll('button[data-value]').forEach(btn => {
        btn.addEventListener('click', () => {
            const val = btn.getAttribute('data-value');
            onSelectFn(val);
            highlightChipGroup(groupId, val);
        });
    });
}

// Điều hướng giữa 5 tab dưới đáy và trang Cài đặt trên Header (Mục 1.1)
function switchNavigation(targetNav) {
    appState.currentNav = targetNav;

    const viewMap = {
        modeA: 'viewModeA',
        compose: 'viewCompose',
        dating: 'viewDating',
        analyze: 'viewAnalyze',
        modeB: 'viewModeB',
        settings: 'viewSettings'
    };

    Object.entries(viewMap).forEach(([navKey, sectionId]) => {
        const el = document.getElementById(sectionId);
        if (el) {
            el.classList.toggle('hidden', navKey !== targetNav);
        }
    });

    // Cập nhật trạng thái nổi bật cho 5 tab dưới đáy
    document.querySelectorAll('.bottom-nav-btn').forEach(btn => {
        const nav = btn.getAttribute('data-nav');
        if (nav === targetNav) {
            btn.className = 'bottom-nav-btn py-1.5 px-1 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all text-warm-600 dark:text-amber-400 bg-warm-100/90 dark:bg-stone-800 font-bold';
        } else {
            btn.className = 'bottom-nav-btn py-1.5 px-1 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 font-semibold';
        }
    });

    // Cập nhật trạng thái nút ⚙️ Cài đặt trên Header
    const headerSettingsBtn = document.getElementById('btnHeaderSettings');
    if (headerSettingsBtn) {
        if (targetNav === 'settings') {
            headerSettingsBtn.className = 'p-2 rounded-xl bg-warm-500 text-white border border-warm-500 shadow-xs transition flex items-center justify-center';
        } else {
            headerSettingsBtn.className = 'p-2 rounded-xl bg-warm-100 hover:bg-warm-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 border border-warm-200 dark:border-stone-700 transition flex items-center justify-center';
        }
    }
}

function updateTopHeaderBadges() {
    const key = getApiKey();
    const model = getModelName();
    const statusBadge = document.getElementById('apiStatusBadge');
    const modelBadge = document.getElementById('btnQuickModelBadge');

    if (modelBadge) {
        modelBadge.textContent = model;
    }
    if (key) {
        statusBadge.textContent = '● Đã kết nối';
        statusBadge.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/90 dark:text-emerald-300 border border-emerald-300/60 flex-shrink-0';
    } else {
        statusBadge.textContent = 'Chưa có Key';
        statusBadge.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300/60 flex-shrink-0';
    }
}