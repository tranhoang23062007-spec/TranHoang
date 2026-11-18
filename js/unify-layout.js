// js/unify-layout.js

window.Unified = {
    mode: 'reply',
    setMode(mode) {
        const nextMode = mode === 'write' ? 'write' : 'reply';
        this.mode = nextMode;
        try {
            localStorage.setItem('tranhoangspfa_unified_mode', nextMode);
        } catch (e) {}

        const isWrite = nextMode === 'write';

        const replyWrapper = document.getElementById('unifyReplyOnly');
        const writeWrapper = document.getElementById('unifyWriteOnly');
        if (replyWrapper) replyWrapper.classList.toggle('hidden', isWrite);
        if (writeWrapper) writeWrapper.classList.toggle('hidden', !isWrite);

        const btnSubmitA = document.getElementById('btnSubmitModeA');
        const btnSubmitCompose = document.getElementById('btnSubmitCompose');
        if (btnSubmitA) btnSubmitA.classList.toggle('hidden', isWrite);
        if (btnSubmitCompose) btnSubmitCompose.classList.toggle('hidden', !isWrite);

        const resultAreaA = document.getElementById('modeAResultArea');
        const resultAreaCompose = document.getElementById('composeResultArea');
        if (resultAreaA) resultAreaA.classList.toggle('hidden', isWrite);
        if (resultAreaCompose) resultAreaCompose.classList.toggle('hidden', !isWrite);

        const btnReply = document.getElementById('btnUnifyModeReply');
        const btnWrite = document.getElementById('btnUnifyModeWrite');
        const activeBtnClass = 'flex-1 py-2 px-3 rounded-xl text-xs font-extrabold transition bg-warm-500 text-white shadow-xs flex items-center justify-center gap-1.5';
        const inactiveBtnClass = 'flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition bg-warm-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-warm-200 dark:hover:bg-stone-700 flex items-center justify-center gap-1.5';

        if (btnReply && btnWrite) {
            btnReply.className = isWrite ? inactiveBtnClass : activeBtnClass;
            btnWrite.className = isWrite ? activeBtnClass : inactiveBtnClass;
        }

        if (isWrite && typeof updateComposeInputModeUI === 'function') {
            updateComposeInputModeUI();
        }

        window.dispatchEvent(new CustomEvent('unify:modechange', {
            detail: { mode: nextMode }
        }));
    }
};

function initUnifyLayout() {
    const viewModeA = document.getElementById('viewModeA');
    const viewCompose = document.getElementById('viewCompose');
    const herMessageInput = document.getElementById('herMessageInput');
    const threadListBar = document.getElementById('threadListBar');
    const activeThreadSummary = document.getElementById('activeThreadSummary');

    if (!viewModeA || !viewCompose || !herMessageInput || !threadListBar || !activeThreadSummary) {
        return;
    }

    // Tránh khởi tạo lặp nếu hàm được gọi nhiều lần
    if (document.getElementById('unifyModeSwitchBar')) {
        return;
    }

    const threadBarCard = threadListBar.parentElement;
    const mainCardA = herMessageInput.parentElement;

    // 1. Tạo công tắc 2 chế độ (segmented control) ngay dưới thanh chọn người và trên ô herMessageInput
    const switchBar = document.createElement('div');
    switchBar.id = 'unifyModeSwitchBar';
    switchBar.className = 'flex items-center gap-1.5 p-1 rounded-2xl bg-warm-100/80 dark:bg-stone-900 border border-warm-200/70 dark:border-stone-700 shadow-2xs';
    switchBar.innerHTML = `
        <button type="button" id="btnUnifyModeReply" class="flex-1 py-2 px-3 rounded-xl text-xs font-extrabold transition bg-warm-500 text-white shadow-xs flex items-center justify-center gap-1.5">
            <span>🤖</span>
            <span>AI gợi ý trả lời</span>
        </button>
        <button type="button" id="btnUnifyModeWrite" class="flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition bg-warm-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-warm-200 dark:hover:bg-stone-700 flex items-center justify-center gap-1.5">
            <span>✍️</span>
            <span>Tôi tự viết / nêu ý</span>
        </button>
    `;

    if (threadBarCard && threadBarCard.parentElement === viewModeA) {
        viewModeA.insertBefore(switchBar, mainCardA);
    } else {
        mainCardA.insertBefore(switchBar, mainCardA.firstChild);
    }

    // 2. ẨN bằng class "hidden" (không xoá): tiêu đề cũ "Soạn tin — ...", composeThreadSelect (và nhãn), composeHerMsgInput (và nhãn)
    const btnToggleComposeDraftsDrawer = document.getElementById('btnToggleComposeDraftsDrawer');
    if (btnToggleComposeDraftsDrawer && btnToggleComposeDraftsDrawer.previousElementSibling) {
        btnToggleComposeDraftsDrawer.previousElementSibling.classList.add('hidden');
    }

    const btnSyncStyleFromThread = document.getElementById('btnSyncStyleFromThread');
    if (btnSyncStyleFromThread && btnSyncStyleFromThread.parentElement) {
        btnSyncStyleFromThread.parentElement.classList.add('hidden');
    }

    const composeThreadSelect = document.getElementById('composeThreadSelect');
    if (composeThreadSelect) {
        composeThreadSelect.classList.add('hidden');
    }

    const composeHerMsgInput = document.getElementById('composeHerMsgInput');
    if (composeHerMsgInput) {
        composeHerMsgInput.classList.add('hidden');
        if (composeHerMsgInput.parentElement) {
            composeHerMsgInput.parentElement.classList.add('hidden');
        }
    }

    // 3. Gom các phần riêng của Gợi ý vào #unifyReplyOnly
    const unifyReplyOnly = document.createElement('div');
    unifyReplyOnly.id = 'unifyReplyOnly';
    unifyReplyOnly.className = 'space-y-3.5';

    const modeAAttachmentRoot = document.getElementById('modeAAttachmentRoot');
    const modeAExtractEditorArea = document.getElementById('modeAExtractEditorArea');
    const ctxWhereGroup = document.getElementById('ctxWhereGroup');
    const ctxClosenessGroup = document.getElementById('ctxClosenessGroup');
    const ctxGoalGroup = document.getElementById('ctxGoalGroup');
    const extraContextInput = document.getElementById('extraContextInput');
    const abbrevSliderA = document.getElementById('abbrevSliderA');
    const humorSliderA = document.getElementById('humorSliderA');
    const pronounGroupA = document.getElementById('pronounGroupA');

    // Khối ngữ cảnh của Gợi ý (bao gồm ctxWhereGroup, ctxClosenessGroup, ctxGoalGroup, extraContextInput và các nhãn)
    const replyContextBlock = (ctxWhereGroup && ctxWhereGroup.parentElement)
        ? ctxWhereGroup.parentElement.parentElement
        : null;

    // Khối bộ chỉnh giọng văn A (bao gồm abbrevSliderA, humorSliderA, pronounGroupA và các nhãn)
    const replyStyleBlock = (pronounGroupA && pronounGroupA.parentElement)
        ? pronounGroupA.parentElement.parentElement
        : null;

    if (modeAAttachmentRoot) unifyReplyOnly.appendChild(modeAAttachmentRoot);
    if (modeAExtractEditorArea) unifyReplyOnly.appendChild(modeAExtractEditorArea);
    if (replyContextBlock && ctxClosenessGroup && ctxGoalGroup && extraContextInput && abbrevSliderA && humorSliderA) {
        unifyReplyOnly.appendChild(replyContextBlock);
    }
    if (replyStyleBlock) {
        unifyReplyOnly.appendChild(replyStyleBlock);
    }

    // 4. Gom và DỜI (appendChild) các phần riêng của Soạn tin vào #unifyWriteOnly
    const unifyWriteOnly = document.createElement('div');
    unifyWriteOnly.id = 'unifyWriteOnly';
    unifyWriteOnly.className = 'space-y-3.5 hidden';

    const composeAttachmentRoot = document.getElementById('composeAttachmentRoot');
    const composeDraftsDrawer = document.getElementById('composeDraftsDrawer');
    const btnComposeModeDraft = document.getElementById('btnComposeModeDraft');
    const btnComposeModeIdea = document.getElementById('btnComposeModeIdea');
    const composeInputModeHint = document.getElementById('composeInputModeHint');
    const composeInputLabel = document.getElementById('composeInputLabel');
    const btnClearComposeInput = document.getElementById('btnClearComposeInput');
    const composeUserInput = document.getElementById('composeUserInput');
    const composeGoalGroup = document.getElementById('composeGoalGroup');
    const abbrevSliderCompose = document.getElementById('abbrevSliderCompose');
    const humorSliderCompose = document.getElementById('humorSliderCompose');
    const lengthSliderCompose = document.getElementById('lengthSliderCompose');
    const emojiSliderCompose = document.getElementById('emojiSliderCompose');
    const pronounGroupCompose = document.getElementById('pronounGroupCompose');

    // Khối hàng nút lịch sử nháp (chứa #btnToggleComposeDraftsDrawer)
    const composeDraftsHeaderRow = btnToggleComposeDraftsDrawer
        ? btnToggleComposeDraftsDrawer.parentElement
        : null;
    if (composeDraftsHeaderRow) {
        composeDraftsHeaderRow.classList.add('justify-end');
    }

    // Khối công tắc Nháp / Ý (chứa #btnComposeModeDraft và #btnComposeModeIdea)
    const composeModeSwitchBlock = (btnComposeModeDraft && btnComposeModeIdea)
        ? btnComposeModeDraft.parentElement
        : null;

    // Khối ô nhập composeUserInput (chứa #composeInputLabel, #btnClearComposeInput và #composeUserInput)
    const composeUserInputBlock = (composeUserInput && composeInputLabel && btnClearComposeInput)
        ? composeUserInput.parentElement
        : null;

    // Khối mục tiêu tin nhắn (chứa nhãn và #composeGoalGroup)
    const composeGoalBlock = composeGoalGroup
        ? composeGoalGroup.parentElement
        : null;

    // Khối bộ 4 thanh trượt + pronounGroupCompose (chứa abbrevSliderCompose, humorSliderCompose, lengthSliderCompose, emojiSliderCompose, pronounGroupCompose và các nhãn)
    const composeStyleBlock = (pronounGroupCompose && pronounGroupCompose.parentElement && abbrevSliderCompose && humorSliderCompose && lengthSliderCompose && emojiSliderCompose)
        ? pronounGroupCompose.parentElement.parentElement
        : null;

    if (composeAttachmentRoot) unifyWriteOnly.appendChild(composeAttachmentRoot);
    if (composeDraftsHeaderRow) unifyWriteOnly.appendChild(composeDraftsHeaderRow);
    if (composeDraftsDrawer) unifyWriteOnly.appendChild(composeDraftsDrawer);
    if (composeModeSwitchBlock) unifyWriteOnly.appendChild(composeModeSwitchBlock);
    if (composeInputModeHint) unifyWriteOnly.appendChild(composeInputModeHint);
    if (composeUserInputBlock) unifyWriteOnly.appendChild(composeUserInputBlock);
    if (composeGoalBlock) unifyWriteOnly.appendChild(composeGoalBlock);
    if (composeStyleBlock) unifyWriteOnly.appendChild(composeStyleBlock);

    // 5. Chèn #unifyReplyOnly, #unifyWriteOnly và #btnSubmitCompose vào đúng thứ tự trong mainCardA
    const btnSubmitModeA = document.getElementById('btnSubmitModeA');
    const btnSubmitCompose = document.getElementById('btnSubmitCompose');

    if (btnSubmitModeA && btnSubmitModeA.parentElement === mainCardA) {
        mainCardA.insertBefore(unifyReplyOnly, btnSubmitModeA);
        mainCardA.insertBefore(unifyWriteOnly, btnSubmitModeA);
    } else {
        mainCardA.appendChild(unifyReplyOnly);
        mainCardA.appendChild(unifyWriteOnly);
    }

    if (btnSubmitCompose) {
        btnSubmitCompose.classList.add('hidden');
        mainCardA.appendChild(btnSubmitCompose);
    }

    // 6. Dời #composeResultArea vào cuối #viewModeA (ngay sau #modeAResultArea)
    const composeResultArea = document.getElementById('composeResultArea');
    if (composeResultArea) {
        composeResultArea.classList.add('hidden');
        viewModeA.appendChild(composeResultArea);
    }

    // 7. Cập nhật thanh điều hướng dưới đáy: xoá hẳn nút data-nav="compose", đổi grid-cols-5 -> grid-cols-4, đổi nhãn nút modeA
    const btnNavCompose = document.querySelector('.bottom-nav-btn[data-nav="compose"]');
    const navGrid = btnNavCompose
        ? btnNavCompose.parentElement
        : document.querySelector('nav .grid-cols-5');

    if (btnNavCompose) {
        btnNavCompose.remove();
    }
    if (navGrid) {
        navGrid.classList.remove('grid-cols-5');
        navGrid.classList.add('grid-cols-4');
    }

    const btnNavModeA = document.querySelector('.bottom-nav-btn[data-nav="modeA"]');
    if (btnNavModeA) {
        const spans = btnNavModeA.querySelectorAll('span');
        if (spans.length >= 2) {
            spans[0].textContent = '💡✍️';
            spans[1].textContent = 'Gợi ý & Soạn';
        } else {
            btnNavModeA.textContent = '💡✍️ Gợi ý & Soạn';
        }
    }

    // 8. Gắn sự kiện click cho công tắc 2 chế độ & đặt mode mặc định lúc tải là "reply"
    const btnReply = document.getElementById('btnUnifyModeReply');
    const btnWrite = document.getElementById('btnUnifyModeWrite');
    if (btnReply) {
        btnReply.addEventListener('click', () => window.Unified.setMode('reply'));
    }
    if (btnWrite) {
        btnWrite.addEventListener('click', () => window.Unified.setMode('write'));
    }

    window.Unified.setMode('reply');
}

window.addEventListener('DOMContentLoaded', initUnifyLayout);