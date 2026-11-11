// js/hide-abbrev.js

function hideAbbrevSliderUnit(sliderId) {
    const sliderEl = document.getElementById(sliderId);
    if (!sliderEl) return;

    // Ô <div> con trực tiếp của lưới "grid grid-cols-1 sm:grid-cols-2" chứa nhãn, input và chú thích 1/2/3
    const unitDiv = sliderEl.parentElement;
    if (!unitDiv) return;

    if (!unitDiv.classList.contains('hidden')) {
        unitDiv.classList.add('hidden');
    }

    // Điều chỉnh lưới cha để các thanh trượt còn lại (Độ hài hước, Độ dài, Emoji) không bị lệch trống
    const gridEl = unitDiv.parentElement;
    if (!gridEl) return;

    const visibleChildren = Array.from(gridEl.children).filter(
        child => !child.classList.contains('hidden')
    );

    if (visibleChildren.length === 1) {
        // Ở Gợi ý (abbrevSliderA) và Làm quen (abbrevSliderDating): chỉ còn 1 thanh "Độ hài hước" -> cho giãn đều toàn bộ chiều ngang
        gridEl.classList.remove('sm:grid-cols-2');
    } else if (visibleChildren.length === 3) {
        // Ở Soạn tin (abbrevSliderCompose): còn 3 thanh (Độ hài hước, Độ dài tin, Mức Emoji) -> cho thanh thứ 3 trải ngang 2 cột trên màn sm
        const lastVisible = visibleChildren[visibleChildren.length - 1];
        if (lastVisible && !lastVisible.classList.contains('sm:col-span-2')) {
            lastVisible.classList.add('sm:col-span-2');
        }
    }
}

function applyHideAbbrevAll() {
    hideAbbrevSliderUnit('abbrevSliderA');
    hideAbbrevSliderUnit('abbrevSliderCompose');
    hideAbbrevSliderUnit('abbrevSliderDating');
}

function initHideAbbrev() {
    applyHideAbbrevAll();

    if (typeof MutationObserver === 'function' && document.body) {
        const observer = new MutationObserver(() => {
            applyHideAbbrevAll();
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
}

if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initHideAbbrev);
} else {
    initHideAbbrev();
}