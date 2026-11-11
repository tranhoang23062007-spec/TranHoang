// js/tone-control.js

const TONE_STORAGE_KEY = 'tranhoangspfa_tone_level';

const TONE_SHORT_LABELS = {
    1: 'Trưởng thành',
    2: 'Tự nhiên',
    3: 'Trẻ con',
    4: 'Nũng nịu'
};

const TONE_DESCRIPTIONS = {
    1: 'Mức 1 - Trưởng thành: điềm đạm, chín chắn, câu gọn gàng, ít kéo dài chữ, không làm nũng, rất ít icon.',
    2: 'Mức 2 - Tự nhiên: giọng đời thường, gần gũi như hiện tại.',
    3: 'Mức 3 - Trẻ con (tinh nghịch): hồn nhiên, nghịch ngợm kiểu bạn bè trẻ, hay dùng từ láy và biểu cảm vui. Vẫn là người trưởng thành nhắn tin: KHÔNG bắt chước giọng trẻ em thật và không dùng cách nói coi cô ấy như trẻ con.',
    4: 'Mức 4 - Nũng nịu: mềm mỏng, dễ thương, làm nũng nhẹ, kéo dài chữ vừa phải. Chỉ hợp khi đã thân: nếu mức thân thiết là mới quen thì tự giảm xuống nhẹ và nói rõ trong note/warnings. Không có nội dung gợi dục.'
};

const TONE_SLIDER_TARGETS = [
    {
        humorSliderId: 'humorSliderA',
        humorLabelId: 'humorLabelA',
        sliderId: 'toneSliderA',
        labelId: 'toneLabelA'
    },
    {
        humorSliderId: 'humorSliderCompose',
        humorLabelId: 'humorLabelCompose',
        sliderId: 'toneSliderCompose',
        labelId: 'toneLabelCompose'
    },
    {
        humorSliderId: 'humorSliderDating',
        humorLabelId: 'humorLabelDating',
        sliderId: 'toneSliderDating',
        labelId: 'toneLabelDating'
    }
];

function normalizeToneLevel(val) {
    const n = parseInt(val, 10);
    if (n >= 1 && n <= 4) return n;
    return 2;
}

window.ToneControl = {
    getLevel() {
        try {
            const raw = localStorage.getItem(TONE_STORAGE_KEY);
            if (raw !== null) {
                return normalizeToneLevel(raw);
            }
        } catch (e) {}
        return 2;
    },

    setLevel(n) {
        const validLevel = normalizeToneLevel(n);
        try {
            localStorage.setItem(TONE_STORAGE_KEY, String(validLevel));
        } catch (e) {}
        syncToneSlidersUI(validLevel);
        return validLevel;
    },

    describe(level) {
        const targetLevel = level !== undefined ? normalizeToneLevel(level) : this.getLevel();
        return TONE_DESCRIPTIONS[targetLevel] || TONE_DESCRIPTIONS[2];
    }
};

function syncToneSlidersUI(levelInput) {
    const lvl = levelInput !== undefined ? normalizeToneLevel(levelInput) : window.ToneControl.getLevel();
    const shortLabel = TONE_SHORT_LABELS[lvl] || TONE_SHORT_LABELS[2];

    TONE_SLIDER_TARGETS.forEach(({ sliderId, labelId }) => {
        const sliderEl = document.getElementById(sliderId);
        const labelEl = document.getElementById(labelId);
        if (sliderEl && String(sliderEl.value) !== String(lvl)) {
            sliderEl.value = String(lvl);
        }
        if (labelEl && labelEl.textContent !== shortLabel) {
            labelEl.textContent = shortLabel;
        }
    });
}

function mountToneSliders() {
    const currentLevel = window.ToneControl.getLevel();
    const shortLabel = TONE_SHORT_LABELS[currentLevel] || TONE_SHORT_LABELS[2];

    TONE_SLIDER_TARGETS.forEach(({ humorSliderId, humorLabelId, sliderId, labelId }) => {
        const humorSlider = document.getElementById(humorSliderId);
        const humorLabel = document.getElementById(humorLabelId);
        if (!humorSlider || !humorLabel) return;

        const humorUnit = humorSlider.parentElement;
        const gridEl = humorUnit ? humorUnit.parentElement : null;
        if (!humorUnit || !gridEl) return;

        // Không chèn trùng nếu thanh trượt đã tồn tại trong DOM
        let toneSlider = document.getElementById(sliderId);
        if (!toneSlider) {
            const toneUnit = document.createElement('div');
            toneUnit.innerHTML = `
                <div class="flex justify-between text-xs font-bold mb-1">
                    <span>🎭 Kiểu nói chuyện:</span>
                    <span id="${labelId}" class="text-warm-600 dark:text-amber-400">${shortLabel}</span>
                </div>
                <input id="${sliderId}" type="range" min="1" max="4" step="1" value="${currentLevel}" class="custom-slider">
                <div class="flex justify-between text-[10px] text-stone-400 mt-0.5">
                    <span>1. Trưởng thành</span>
                    <span>2. Tự nhiên</span>
                    <span>3. Trẻ con</span>
                    <span>4. Nũng nịu</span>
                </div>
            `;

            if (humorUnit.nextSibling) {
                gridEl.insertBefore(toneUnit, humorUnit.nextSibling);
            } else {
                gridEl.appendChild(toneUnit);
            }

            toneSlider = document.getElementById(sliderId);
            if (toneSlider) {
                toneSlider.addEventListener('input', (e) => {
                    window.ToneControl.setLevel(e.target.value);
                });
            }
        }

        // Đảm bảo lưới luôn hiển thị 2 cột cân đối trên màn hình sm khi đã có thêm ô Kiểu nói chuyện
        if (!gridEl.classList.contains('sm:grid-cols-2')) {
            gridEl.classList.add('sm:grid-cols-2');
        }
        const visibleChildren = Array.from(gridEl.children).filter(
            child => !child.classList.contains('hidden')
        );
        if (visibleChildren.length % 2 === 0) {
            visibleChildren.forEach(child => {
                if (child.classList.contains('sm:col-span-2')) {
                    child.classList.remove('sm:col-span-2');
                }
            });
        }
    });

    syncToneSlidersUI(currentLevel);
}

function initToneControl() {
    mountToneSliders();

    if (typeof MutationObserver === 'function' && document.body) {
        const observer = new MutationObserver(() => {
            const needsMount = TONE_SLIDER_TARGETS.some(
                ({ humorSliderId, sliderId }) =>
                    Boolean(document.getElementById(humorSliderId)) && !document.getElementById(sliderId)
            );
            if (needsMount) {
                mountToneSliders();
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
}

if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initToneControl);
} else {
    initToneControl();
}