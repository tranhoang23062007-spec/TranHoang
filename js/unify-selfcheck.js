// js/unify-selfcheck.js

function injectUnifyStyles() {
    if (document.getElementById('unifySelfCheckStyles')) {
        return;
    }

    const styleEl = document.createElement('style');
    styleEl.id = 'unifySelfCheckStyles';
    styleEl.textContent = `
        /* Công tắc 2 chế độ nổi bật & rõ ràng ở cả Light / Dark mode */
        #unifyModeSwitchBar {
            padding: 0.3125rem;
            border-radius: 1rem;
            gap: 0.375rem;
            box-shadow: 0 1px 3px rgba(28, 25, 23, 0.06);
        }
        .dark #unifyModeSwitchBar {
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
        }

        #btnUnifyModeReply,
        #btnUnifyModeWrite {
            min-height: 44px;
            padding: 0.5rem 0.625rem;
            line-height: 1.25;
            user-select: none;
            -webkit-tap-highlight-color: transparent;
        }

        /* Khoảng cách đều nhau giữa các khối bên trong 2 wrapper của tab gộp */
        #unifyReplyOnly:not(.hidden),
        #unifyWriteOnly:not(.hidden) {
            display: flex;
            flex-direction: column;
            gap: 0.875rem;
        }

        /* Nút gửi chính đủ lớn để chạm thoải mái bằng ngón cái */
        #viewModeA #btnSubmitModeA,
        #viewModeA #btnSubmitCompose {
            min-height: 48px;
            padding-top: 0.8125rem;
            padding-bottom: 0.8125rem;
            font-size: 0.9375rem;
        }

        /* Tối ưu hiển thị trên màn hình hẹp 360px */
        @media (max-width: 360px) {
            #unifyModeSwitchBar {
                padding: 0.25rem;
                gap: 0.25rem;
            }
            #btnUnifyModeReply,
            #btnUnifyModeWrite {
                min-height: 42px;
                padding: 0.4375rem 0.375rem;
                font-size: 0.72rem;
                gap: 0.25rem;
            }
            #viewModeA #btnSubmitModeA,
            #viewModeA #btnSubmitCompose {
                min-height: 46px;
                font-size: 0.85rem;
                padding-left: 0.75rem;
                padding-right: 0.75rem;
            }
        }
    `;

    document.head.appendChild(styleEl);
}

function reportUnifySelfCheckError(errorName) {
    console.error('[Unify SelfCheck] Gộp tab gặp lỗi: ' + errorName);
    if (typeof showToast === 'function') {
        showToast('Gộp tab gặp lỗi: ' + errorName);
    }
}

function runUnifySelfCheck() {
    // (a) Kiểm tra mọi ID mà unify-layout, unify-sync, unify-compat dùng đều tồn tại trong DOM
    const requiredIds = [
        'viewModeA',
        'viewCompose',
        'herMessageInput',
        'threadListBar',
        'activeThreadSummary',
        'unifyModeSwitchBar',
        'btnUnifyModeReply',
        'btnUnifyModeWrite',
        'unifyReplyOnly',
        'unifyWriteOnly',
        'btnSubmitModeA',
        'btnSubmitCompose',
        'modeAResultArea',
        'composeResultArea',
        'btnToggleComposeDraftsDrawer',
        'btnSyncStyleFromThread',
        'composeThreadSelect',
        'composeHerMsgInput',
        'modeAAttachmentRoot',
        'modeAExtractEditorArea',
        'ctxWhereGroup',
        'ctxClosenessGroup',
        'ctxGoalGroup',
        'extraContextInput',
        'abbrevSliderA',
        'humorSliderA',
        'pronounGroupA',
        'composeAttachmentRoot',
        'composeDraftsDrawer',
        'btnComposeModeDraft',
        'btnComposeModeIdea',
        'composeInputModeHint',
        'composeInputLabel',
        'btnClearComposeInput',
        'composeUserInput',
        'composeGoalGroup',
        'abbrevSliderCompose',
        'humorSliderCompose',
        'lengthSliderCompose',
        'emojiSliderCompose',
        'pronounGroupCompose',
        'btnClearInputA',
        'composeSavedDraftsList',
        'btnNewThread',
        'btnRenameThread',
        'btnDeleteThread',
        'btnClearThreadMemory',
        'btnModalConfirm'
    ];

    requiredIds.forEach((id) => {
        if (!document.getElementById(id)) {
            reportUnifySelfCheckError('#' + id);
        }
    });

    // (b) Kiểm tra mọi hàm toàn cục được gọi là function
    const requiredFunctions = [
        'handleGenerateModeA',
        'handleGenerateCompose',
        'updateComposeInputModeUI',
        'renderComposeThreadSelectUI',
        'syncComposeUIFromState',
        'saveComposeStateToStorage',
        'highlightChipGroup',
        'switchNavigation',
        'getActiveThread',
        'saveThreadsToStorage',
        'initUnifyLayout',
        'initUnifySync',
        'showToast'
    ];

    requiredFunctions.forEach((fnName) => {
        if (typeof window[fnName] !== 'function') {
            reportUnifySelfCheckError(fnName);
        }
    });

    // Kiểm tra state cốt lõi mà unify-sync sử dụng
    if (typeof appState !== 'object' || !appState || !appState.compose || !appState.compose.prefs) {
        reportUnifySelfCheckError('appState.compose.prefs');
    }

    // (c) Kiểm tra window.Unified tồn tại và có hàm setMode
    if (!window.Unified || typeof window.Unified.setMode !== 'function') {
        reportUnifySelfCheckError('window.Unified');
    }

    // (d) Kiểm tra không còn nút data-nav="compose" trên thanh điều hướng
    if (document.querySelector('.bottom-nav-btn[data-nav="compose"]') || document.querySelector('[data-nav="compose"]')) {
        reportUnifySelfCheckError('data-nav="compose"');
    }

    // (e) Kiểm tra section #viewCompose vẫn nằm trong DOM
    const viewComposeEl = document.getElementById('viewCompose');
    if (!viewComposeEl || !document.body.contains(viewComposeEl)) {
        reportUnifySelfCheckError('viewCompose');
    }
}

function initUnifySelfCheck() {
    injectUnifyStyles();
    setTimeout(runUnifySelfCheck, 600);
}

window.addEventListener('DOMContentLoaded', initUnifySelfCheck);