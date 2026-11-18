// js/unify-sync.js

let isSyncing = false;

function syncHerMessageAtoCompose() {
    if (isSyncing) return;
    const herInput = document.getElementById('herMessageInput');
    const composeHerInput = document.getElementById('composeHerMsgInput');
    if (!herInput || !composeHerInput) return;

    isSyncing = true;
    try {
        const val = herInput.value || '';
        if (composeHerInput.value !== val) {
            composeHerInput.value = val;
        }
        if (typeof appState === 'object' && appState && appState.compose) {
            appState.compose.herContextMsg = val.trim();
        }
        if (typeof getActiveThread === 'function') {
            const activeThread = getActiveThread();
            if (activeThread) {
                activeThread.lastInput = val;
            }
        }
    } finally {
        isSyncing = false;
    }
}

function syncHerMessageComposeToA() {
    if (isSyncing) return;
    const herInput = document.getElementById('herMessageInput');
    const composeHerInput = document.getElementById('composeHerMsgInput');
    if (!herInput || !composeHerInput) return;

    isSyncing = true;
    try {
        const val = composeHerInput.value || '';
        if (herInput.value !== val) {
            herInput.value = val;
        }
        if (typeof appState === 'object' && appState && appState.compose) {
            appState.compose.herContextMsg = val.trim();
        }
        if (typeof getActiveThread === 'function') {
            const activeThread = getActiveThread();
            if (activeThread) {
                activeThread.lastInput = val;
                if (typeof saveThreadsToStorage === 'function') {
                    saveThreadsToStorage();
                }
            }
        }
    } finally {
        isSyncing = false;
    }
}

function forceActiveThreadForCompose() {
    if (typeof appState !== 'object' || !appState || !appState.compose || !appState.compose.prefs) {
        return;
    }
    appState.compose.prefs.contextThreadId = 'active';
    if (typeof saveComposeStateToStorage === 'function') {
        saveComposeStateToStorage();
    }
    if (typeof renderComposeThreadSelectUI === 'function') {
        renderComposeThreadSelectUI();
    }
    const selectEl = document.getElementById('composeThreadSelect');
    if (selectEl && selectEl.value !== 'active') {
        selectEl.value = 'active';
    }
}

function syncControlsFromModeAToCompose() {
    if (isSyncing) return;

    const abbrevA = document.getElementById('abbrevSliderA');
    const abbrevCompose = document.getElementById('abbrevSliderCompose');
    const humorA = document.getElementById('humorSliderA');
    const humorCompose = document.getElementById('humorSliderCompose');
    const pronounGroupCompose = document.getElementById('pronounGroupCompose');

    isSyncing = true;
    try {
        if (abbrevA && abbrevCompose && String(abbrevCompose.value) !== String(abbrevA.value)) {
            abbrevCompose.value = abbrevA.value;
            abbrevCompose.dispatchEvent(new Event('input', { bubbles: true }));
        }

        if (humorA && humorCompose && String(humorCompose.value) !== String(humorA.value)) {
            humorCompose.value = humorA.value;
            humorCompose.dispatchEvent(new Event('input', { bubbles: true }));
        }

        const activeThread = typeof getActiveThread === 'function' ? getActiveThread() : null;
        const targetPronoun = (activeThread && activeThread.pronoun) ? activeThread.pronoun : 'mình - bạn';
        if (pronounGroupCompose) {
            const targetBtn = pronounGroupCompose.querySelector(`button[data-value="${targetPronoun}"]`);
            if (targetBtn) {
                targetBtn.click();
            }
        }
    } finally {
        isSyncing = false;
    }
}

function syncControlsFromComposeToModeA() {
    if (isSyncing) return;

    const abbrevA = document.getElementById('abbrevSliderA');
    const abbrevCompose = document.getElementById('abbrevSliderCompose');
    const humorA = document.getElementById('humorSliderA');
    const humorCompose = document.getElementById('humorSliderCompose');
    const pronounGroupA = document.getElementById('pronounGroupA');

    isSyncing = true;
    try {
        if (abbrevCompose && abbrevA && String(abbrevA.value) !== String(abbrevCompose.value)) {
            abbrevA.value = abbrevCompose.value;
            abbrevA.dispatchEvent(new Event('input', { bubbles: true }));
        }

        if (humorCompose && humorA && String(humorA.value) !== String(humorCompose.value)) {
            humorA.value = humorCompose.value;
            humorA.dispatchEvent(new Event('input', { bubbles: true }));
        }

        const composePronoun = (typeof appState === 'object' && appState?.compose?.prefs?.pronoun)
            ? appState.compose.prefs.pronoun
            : 'mình - bạn';
        if (pronounGroupA) {
            const targetBtn = pronounGroupA.querySelector(`button[data-value="${composePronoun}"]`);
            if (targetBtn) {
                targetBtn.click();
            }
        }
    } finally {
        isSyncing = false;
    }
}

function syncAttachmentsAndGoalsVisibility(mode) {
    const currentMode = mode || (window.Unified && window.Unified.mode) || 'reply';
    const isWrite = currentMode === 'write';

    // 4. Đính kèm ảnh: giữ widget riêng của mỗi chế độ, chỉ hiện widget của chế độ đang chọn dưới ô tin cô ấy
    const modeAAttachmentRoot = document.getElementById('modeAAttachmentRoot');
    const composeAttachmentRoot = document.getElementById('composeAttachmentRoot');
    if (modeAAttachmentRoot) {
        modeAAttachmentRoot.classList.toggle('hidden', isWrite);
    }
    if (composeAttachmentRoot) {
        composeAttachmentRoot.classList.toggle('hidden', !isWrite);
    }

    // 5. Mục tiêu: giữ hai nhóm riêng (ctxGoalGroup, composeGoalGroup), kiểm tra chỉ hiện nhóm của chế độ đang chọn
    const ctxGoalGroup = document.getElementById('ctxGoalGroup');
    const composeGoalGroup = document.getElementById('composeGoalGroup');
    if (ctxGoalGroup && ctxGoalGroup.parentElement) {
        ctxGoalGroup.parentElement.classList.toggle('hidden', isWrite);
    }
    if (composeGoalGroup && composeGoalGroup.parentElement) {
        composeGoalGroup.parentElement.classList.toggle('hidden', !isWrite);
    }
}

function initUnifySync() {
    const herInput = document.getElementById('herMessageInput');
    const composeHerInput = document.getElementById('composeHerMsgInput');

    if (!herInput || !composeHerInput) return;

    // 1. Theo dõi việc gõ trực tiếp hoặc gán .value bằng code trên herMessageInput & composeHerMsgInput
    const textareaValDesc = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value');
    if (textareaValDesc && textareaValDesc.get && textareaValDesc.set) {
        Object.defineProperty(herInput, 'value', {
            configurable: true,
            enumerable: true,
            get() {
                return textareaValDesc.get.call(this);
            },
            set(newVal) {
                textareaValDesc.set.call(this, newVal);
                if (!isSyncing) {
                    syncHerMessageAtoCompose();
                }
            }
        });
    }

    const inputValDesc = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
    if (inputValDesc && inputValDesc.get && inputValDesc.set) {
        Object.defineProperty(composeHerInput, 'value', {
            configurable: true,
            enumerable: true,
            get() {
                return inputValDesc.get.call(this);
            },
            set(newVal) {
                inputValDesc.set.call(this, newVal);
                if (!isSyncing) {
                    syncHerMessageComposeToA();
                }
            }
        });
    }

    herInput.addEventListener('input', () => {
        syncHerMessageAtoCompose();
    });
    herInput.addEventListener('change', () => {
        syncHerMessageAtoCompose();
    });

    composeHerInput.addEventListener('input', () => {
        syncHerMessageComposeToA();
    });
    composeHerInput.addEventListener('change', () => {
        syncHerMessageComposeToA();
    });

    // btnClearInputA xoá cả hai ô
    const btnClearInputA = document.getElementById('btnClearInputA');
    if (btnClearInputA) {
        btnClearInputA.addEventListener('click', () => {
            isSyncing = true;
            try {
                herInput.value = '';
                composeHerInput.value = '';
                if (typeof appState === 'object' && appState && appState.compose) {
                    appState.compose.herContextMsg = '';
                }
                if (typeof getActiveThread === 'function') {
                    const activeThread = getActiveThread();
                    if (activeThread) {
                        activeThread.lastInput = '';
                    }
                }
                if (typeof saveComposeStateToStorage === 'function') {
                    saveComposeStateToStorage();
                }
            } finally {
                isSyncing = false;
            }
        });
    }

    // 3. Đồng bộ 2 chiều ba cặp: abbrevSliderA ↔ abbrevSliderCompose, humorSliderA ↔ humorSliderCompose, pronounGroupA ↔ pronounGroupCompose
    const abbrevA = document.getElementById('abbrevSliderA');
    const abbrevCompose = document.getElementById('abbrevSliderCompose');
    if (abbrevA && abbrevCompose) {
        abbrevA.addEventListener('input', () => {
            if (isSyncing) return;
            isSyncing = true;
            try {
                abbrevCompose.value = abbrevA.value;
                abbrevCompose.dispatchEvent(new Event('input', { bubbles: true }));
            } finally {
                isSyncing = false;
            }
        });

        abbrevCompose.addEventListener('input', () => {
            if (isSyncing) return;
            isSyncing = true;
            try {
                abbrevA.value = abbrevCompose.value;
                abbrevA.dispatchEvent(new Event('input', { bubbles: true }));
            } finally {
                isSyncing = false;
            }
        });
    }

    const humorA = document.getElementById('humorSliderA');
    const humorCompose = document.getElementById('humorSliderCompose');
    if (humorA && humorCompose) {
        humorA.addEventListener('input', () => {
            if (isSyncing) return;
            isSyncing = true;
            try {
                humorCompose.value = humorA.value;
                humorCompose.dispatchEvent(new Event('input', { bubbles: true }));
            } finally {
                isSyncing = false;
            }
        });

        humorCompose.addEventListener('input', () => {
            if (isSyncing) return;
            isSyncing = true;
            try {
                humorA.value = humorCompose.value;
                humorA.dispatchEvent(new Event('input', { bubbles: true }));
            } finally {
                isSyncing = false;
            }
        });
    }

    const pronounGroupA = document.getElementById('pronounGroupA');
    const pronounGroupCompose = document.getElementById('pronounGroupCompose');
    if (pronounGroupA && pronounGroupCompose) {
        pronounGroupA.querySelectorAll('button[data-value]').forEach(btnA => {
            btnA.addEventListener('click', () => {
                if (isSyncing) return;
                const val = btnA.getAttribute('data-value');
                if (!val) return;
                isSyncing = true;
                try {
                    const targetBtn = pronounGroupCompose.querySelector(`button[data-value="${val}"]`);
                    if (targetBtn) {
                        targetBtn.click();
                    }
                } finally {
                    isSyncing = false;
                }
            });
        });

        pronounGroupCompose.querySelectorAll('button[data-value]').forEach(btnCompose => {
            btnCompose.addEventListener('click', () => {
                if (isSyncing) return;
                const val = btnCompose.getAttribute('data-value');
                if (!val) return;
                isSyncing = true;
                try {
                    const targetBtn = pronounGroupA.querySelector(`button[data-value="${val}"]`);
                    if (targetBtn) {
                        targetBtn.click();
                    }
                } finally {
                    isSyncing = false;
                }
            });
        });
    }

    // Khi bấm "Xem lại" một bản nháp cũ trong composeSavedDraftsList, đồng bộ ngược các giá trị nháp sang Mode A
    const composeSavedDraftsList = document.getElementById('composeSavedDraftsList');
    if (composeSavedDraftsList) {
        composeSavedDraftsList.addEventListener('click', (e) => {
            const loadBtn = e.target && typeof e.target.closest === 'function'
                ? e.target.closest('button[data-load-draft-idx]')
                : null;
            if (loadBtn) {
                setTimeout(() => {
                    forceActiveThreadForCompose();
                    syncHerMessageComposeToA();
                    syncControlsFromComposeToModeA();
                }, 0);
            }
        });
    }

    // 2. Bắt mọi thay đổi đổi/tạo/đổi tên/xoá thread bằng MutationObserver và sự kiện click
    const handleThreadChanged = () => {
        forceActiveThreadForCompose();
        syncHerMessageAtoCompose();
        syncControlsFromModeAToCompose();
    };

    const threadListBar = document.getElementById('threadListBar');
    const activeThreadSummary = document.getElementById('activeThreadSummary');

    if (typeof MutationObserver === 'function') {
        const observer = new MutationObserver(() => {
            handleThreadChanged();
        });
        if (threadListBar) {
            observer.observe(threadListBar, { childList: true });
        }
        if (activeThreadSummary) {
            observer.observe(activeThreadSummary, { childList: true, characterData: true, subtree: true });
        }
    }

    ['threadListBar', 'btnNewThread', 'btnRenameThread', 'btnDeleteThread', 'btnClearThreadMemory', 'btnModalConfirm'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('click', () => {
                setTimeout(handleThreadChanged, 0);
            });
        }
    });

    // Lắng nghe sự kiện "unify:modechange" để đồng bộ lại ngay khi đổi chế độ
    window.addEventListener('unify:modechange', (e) => {
        const mode = e && e.detail && e.detail.mode ? e.detail.mode : (window.Unified && window.Unified.mode) || 'reply';
        forceActiveThreadForCompose();
        syncHerMessageAtoCompose();
        syncControlsFromModeAToCompose();
        syncAttachmentsAndGoalsVisibility(mode);
    });

    // Đồng bộ lần đầu ngay khi khởi tạo xong
    forceActiveThreadForCompose();
    if (!herInput.value && composeHerInput.value) {
        syncHerMessageComposeToA();
    } else {
        syncHerMessageAtoCompose();
    }
    syncControlsFromModeAToCompose();
    syncAttachmentsAndGoalsVisibility((window.Unified && window.Unified.mode) || 'reply');
}

window.addEventListener('DOMContentLoaded', initUnifySync);