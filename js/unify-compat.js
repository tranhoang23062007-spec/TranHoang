// js/unify-compat.js

/**
 * ============================================================================
 * UNIFY COMPATIBILITY LAYER: Tương thích ngược, điều hướng & khôi phục trạng thái
 * ============================================================================
 */

(function () {
    // 1. Bọc window.switchNavigation để bắt yêu cầu chuyển sang tab "compose"
    if (typeof window.switchNavigation === 'function' && !window._hasPatchedSwitchNavForCompat) {
        const originalSwitchNavigation = window.switchNavigation;

        window.switchNavigation = function (targetNav) {
            const isComposeNav = targetNav === 'compose';
            const resolvedNav = isComposeNav ? 'modeA' : targetNav;

            // Gọi hàm gốc để điều hướng giao diện tab
            originalSwitchNavigation(resolvedNav);

            // 3. Nhớ chế độ & lưu vào localStorage với try/catch
            let savedMode = 'reply';
            try {
                savedMode = localStorage.getItem('tranhoangspfa_unified_mode') || 'reply';
            } catch (e) {}

            const targetMode = isComposeNav ? 'write' : savedMode;

            if (window.Unified && typeof window.Unified.setMode === 'function') {
                window.Unified.setMode(targetMode);
            }

            // 2. Tương thích dating.js (khi bấm chuyển từ tab Làm quen sang Soạn tin)
            if (isComposeNav) {
                setTimeout(() => {
                    const composeInput = document.getElementById('composeUserInput');
                    if (composeInput && composeInput.value.trim() !== '') {
                        composeInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    if (typeof updateComposeInputModeUI === 'function') {
                        updateComposeInputModeUI();
                    }
                }, 50);
            }
        };

        window._hasPatchedSwitchNavForCompat = true;
    }

    // Khởi tạo trạng thái ban đầu khi DOMContentLoaded
    window.addEventListener('DOMContentLoaded', () => {
        // 3. Khôi phục chế độ từ localStorage (mặc định "reply") với try/catch
        let initialMode = 'reply';
        try {
            initialMode = localStorage.getItem('tranhoangspfa_unified_mode') || 'reply';
        } catch (e) {}

        if (window.Unified && typeof window.Unified.setMode === 'function') {
            window.Unified.setMode(initialMode);
        }

        // 4. Lần đầu vào tab gộp: gọi các hàm khởi tạo giao diện Soạn tin cũ
        setTimeout(() => {
            if (typeof renderComposeThreadSelectUI === 'function') {
                renderComposeThreadSelectUI();
            }
            if (typeof syncComposeUIFromState === 'function') {
                syncComposeUIFromState();
            }
        }, 30);
    });
})();