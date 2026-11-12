// js/pronoun-voices.js
/**
 * ============================================================================
 * ĐỊNH NGHĨA "GIỌNG NÓI CHUYỆN" (VOICE PERSONA) RIÊNG CHO TỪNG CÁCH XƯNG HÔ
 * Quy ước: "tôi xưng - tôi gọi cô ấy"
 * ============================================================================
 */

const PRONOUN_VOICE_ORDER = [
    'mình - bạn',
    'tớ - cậu',
    'anh - em',
    'tui - bà',
    'em - chị',
    'Để AI tự chọn theo ngữ cảnh'
];

const PRONOUN_VOICE_MAP = {
    'mình - bạn': {
        value: 'mình - bạn',
        self: 'mình',
        her: 'bạn',
        vibe: 'Lịch sự, trung tính, thân thiện và tinh tế kiểu người mới quen văn minh.',
        speech: [
            'Độ dài & nhịp: Câu đủ chủ ngữ - vị ngữ (10-18 chữ), nhịp điềm tĩnh, rõ ý.',
            'Từ đệm nên dùng: "nha", "nhé", "hen" (tối đa 1 từ/tin); tránh tiếng lóng gắt ("vãi", "xỉu ngang") và tránh kéo dài chữ.',
            'Cách hỏi han: Hỏi mở nhẹ nhàng gắn với chi tiết cô ấy vừa kể, luôn chừa khoảng trống thoải mái.',
            'Mức trêu đùa: 1/3 (hóm hỉnh nhẹ, tuyệt đối không trêu quá trớn khi chưa rõ tính cách).',
            'Cách dùng emoji: 0-1 emoji hiền hòa (😊, 😄, ☕), không spam biểu cảm.'
        ],
        fitWhen: 'Hợp nhất khi mới quen qua mạng/app hẹn hò, cùng lớp/CLB hoặc chưa rõ tuổi tác.',
        strangerCaution: 'An toàn tuyệt đối với người mới quen; giữ sự ấm áp vừa đủ mà không vồ vập.',
        needsStrangerCaution: false,
        samples: [
            'Nghe bạn nói là thấy hôm nay chạy việc căng thật sự rồi, bạn đã kịp ăn tối chưa?',
            'Hôm nay vất vả cho bạn rồi 😊 tối nay gác bớt việc lại nghỉ ngơi sớm nha.',
            'Mình đọc tin cũng thấy thấm mệt giùm bạn luôn, nay bạn phải xử lý nhiều việc lắm hả?'
        ],
        hint: 'Giọng lịch sự, ấm áp và an toàn nhất khi mới quen. Câu chữ đủ ý, ít tiếng lóng, tạo cảm giác tôn trọng và dễ bắt chuyện.'
    },

    'tớ - cậu': {
        value: 'tớ - cậu',
        self: 'tớ',
        her: 'cậu',
        vibe: 'Bạn bè đồng trang lứa trong sáng, gần gũi, trẻ trung và hơi đáng yêu.',
        speech: [
            'Độ dài & nhịp: Câu ngắn gọn (7-14 chữ), nhịp trò chuyện linh hoạt, tự nhiên như bạn cùng bàn.',
            'Từ đệm nên dùng: "nè", "nhé", "á", "hen"; tránh từ ngữ quá trang trọng, khách sáo hoặc dạy đời.',
            'Cách hỏi han: Chia sẻ nhanh cảm xúc/chuyện nhỏ của "tớ" trước rồi hỏi tiếp chuyện của "cậu".',
            'Mức trêu đùa: 2/3 (trêu nhẹ nhàng, tinh nghịch kiểu bạn bè, không công kích).',
            'Cách dùng emoji: 0-1 emoji tươi tắn (😆, 😭, 🥹) hoặc "haha/hihi" tự nhiên.'
        ],
        fitWhen: 'Hợp khi hai người bằng tuổi, học cùng trường/CLB hoặc nói chuyện hợp gu trẻ trung.',
        strangerCaution: 'Nếu mới bắt chuyện, giữ nét trong sáng thân thiện, chưa trêu sâu vào chuyện riêng tư.',
        needsStrangerCaution: false,
        samples: [
            'Ôi nghe thương thế 😭 nay cậu phải chạy deadline hay có việc gì mà mệt dữ vậy á?',
            'Cố lên nè, về nhà tắm rửa ăn món gì ngon rồi nằm dài nạp lại pin đi cậu nhé 😆',
            'Haha giống tớ mấy hôm chạy bài luôn á, tối nay cậu định nghỉ sớm chưa?'
        ],
        hint: 'Giọng bạn bè đồng trang lứa trong sáng, trẻ trung và hơi đáng yêu. Câu ngắn, hay dùng "nè, nhé, á", dễ chia sẻ cảm xúc.'
    },

    'anh - em': {
        value: 'anh - em',
        self: 'anh',
        her: 'em',
        vibe: 'Chững chạc, ấm áp, biết lắng nghe và mang lại cảm giác che chở, tin cậy.',
        speech: [
            'Độ dài & nhịp: Câu gọn và chắc (8-16 chữ), nhịp trầm ổn, đĩnh đạc, không hấp tấp.',
            'Từ đệm nên dùng: "nhé", "nha", "nè"; tránh từ đệm nhõng nhẽo ("huhu", "xỉu", "ứ chịu") và hạn chế kéo dài chữ.',
            'Cách hỏi han: Quan tâm thiết thực kiểu chăm sóc ("em về tới nhà chưa", "em ăn gì cho ấm bụng chưa"), tuyệt đối KHÔNG gia trưởng, ra lệnh hay áp đặt.',
            'Mức trêu đùa: 2/3 (trêu duyên dáng kiểu người lớn, điềm tĩnh, không cợt nhả).',
            'Cách dùng emoji: Rất tiết chế (0-1 emoji ấm áp như 😊, 😌), ưu tiên sức nặng của câu chữ.'
        ],
        fitWhen: 'Chỉ hợp khi bạn lớn tuổi hơn cô ấy hoặc hai người đã có độ thân thiết, thiện cảm nhất định.',
        strangerCaution: 'Nếu đang mới quen: tiết chế sự săn sóc quá sâu như người yêu, giữ giọng lịch thiệp ấm áp và nói rõ trong note/warnings.',
        needsStrangerCaution: true,
        samples: [
            'Hôm nay vất vả cho em rồi, giờ em đã về tới nhà nghỉ ngơi chưa?',
            'Nghe thương thế, em nhớ ăn tối đàng hoàng rồi tối nay đi ngủ sớm cho lại sức nhé 😊',
            'Nay công việc bên em căng lắm hả, làm gì thì làm cũng đừng bỏ bữa tối nha.'
        ],
        hint: 'Giọng chững chạc, ấm áp và che chở. Câu gọn chắc, hỏi han thiết thực nhưng tôn trọng, không gia trưởng (nếu mới quen sẽ tự giữ mức nhẹ nhàng).'
    },

    'tui - bà': {
        value: 'tui - bà',
        self: 'tui',
        her: 'bà',
        vibe: 'Thân thiết kiểu cạ cứng thoải mái, khẩu ngữ đời thường, nhịp nhanh và tung hứng vui vẻ.',
        speech: [
            'Độ dài & nhịp: Câu rất ngắn (5-12 chữ), nhịp nhanh, khẩu ngữ tự nhiên như đang tám chuyện trực tiếp.',
            'Từ đệm nên dùng: "á", "luôn", "thui", "haha"; tránh văn phong sách vở, trịnh trọng hoặc sến súa.',
            'Cách hỏi han: Phản ứng cảm thán tự nhiên trước rồi hỏi thẳng vào chuyện theo kiểu bạn thân đồng hành.',
            'Mức trêu đùa: 3/3 (đùa qua lại dí dỏm, bắt bài nhau vui vẻ nhưng không vô duyên).',
            'Cách dùng emoji: 0-1 emoji biểu cảm vui (😂, 😆, 😮‍💨) hoặc chữ "haha".'
        ],
        fitWhen: 'Hợp khi hai người đã quen thân, nói chuyện hợp cạ hoặc cô ấy chủ động xưng "tui - bà" trước.',
        strangerCaution: 'Nếu đang mới quen: phải hạ bớt độ suồng sã/lóng, nghiêng nhẹ về sự lịch sự của "tớ - cậu" và nói rõ trong note/warnings.',
        needsStrangerCaution: true,
        samples: [
            'Trời đất nay chạy việc gì mà nghe rệu rã vậy bà 😂 đã ăn uống gì chưa đó?',
            'Nghe mùi chạy deadline căng đét luôn á, thôi tối nay dẹp hết nằm xả hơi đi bà ơi.',
            'Tội dữ vậy trời 😆 nay ai hành bà thế, kể tui nghe xả xui coi nào.'
        ],
        hint: 'Giọng bạn bè thân thoải mái, khẩu ngữ nhịp nhanh, câu ngắn và hay đùa qua lại (nếu mới quen sẽ tự giảm độ suồng sã).'
    },

    'em - chị': {
        value: 'em - chị',
        self: 'em',
        her: 'chị',
        vibe: 'Tôn trọng, ngoan, tinh tế và dễ thương kiểu em trai ấm áp nhưng vẫn đĩnh đạc.',
        speech: [
            'Độ dài & nhịp: Câu vừa phải (8-16 chữ), nhịp lễ phép, chân thành, tạo thiện cảm tự nhiên.',
            'Từ đệm nên dùng: "ạ" (dùng vừa phải, không lặp mọi câu), "dạ", "chị ơi", "nha chị"; tránh tiếng lóng suồng sã hoặc trống không.',
            'Cách hỏi han: Quan tâm lễ phép, khen chân thành, hay hỏi ý kiến/xin lời khuyên từ chị và có thể làm nũng rất nhẹ nhưng vẫn lịch sự.',
            'Mức trêu đùa: 1/3 (dễ thương, tinh tế; tuyệt đối không trêu tuổi tác, không mỉa mai hay hỗn).',
            'Cách dùng emoji: 0-1 emoji ngoan và ấm áp (😊, 🥹, 😭).'
        ],
        fitWhen: 'Hợp khi cô ấy lớn tuổi hơn bạn (đàn chị khóa trên, tiền bối đi làm) hoặc bạn muốn giữ sự lễ phép đáng yêu.',
        strangerCaution: 'Khi mới quen: ưu tiên sự lễ phép, lịch sự và tôn trọng trước; chưa làm nũng sâu.',
        needsStrangerCaution: false,
        samples: [
            'Dạ nghe thương chị quá 🥹 hôm nay trên chỗ làm nhiều việc dồn lắm hả chị?',
            'Chị ơi nay vất vả rồi ạ, chị nhớ ăn tối đầy đủ rồi nghỉ ngơi sớm đừng thức khuya nha 😊',
            'Em nghe thôi đã thấy mệt giùm chị luôn á, tối nay chị tự thưởng món gì ngon để nạp lại năng lượng đi ạ.'
        ],
        hint: 'Giọng lễ phép, tôn trọng và dễ thương kiểu em trai ("dạ", "chị ơi", "ạ" vừa phải). Biết hỏi thăm tinh tế, khen chân thành và không trêu quá đà.'
    },

    'Để AI tự chọn theo ngữ cảnh': {
        value: 'Để AI tự chọn theo ngữ cảnh',
        self: 'tự chọn',
        her: 'tự chọn',
        vibe: 'Linh hoạt suy luận cặp xưng hô phù hợp nhất từ đoạn chat, độ thân thiết và tuổi tác rồi giữ nhất quán 100%.',
        speech: [
            'Quy tắc chọn: Quan sát cách cô ấy tự xưng và gọi tôi trong chat/bio, kết hợp mức độ thân thiết và năm sinh trong Hồ sơ của tôi (nếu có).',
            'Nếu mới quen và chưa rõ tuổi: ưu tiên chọn "mình - bạn" (lịch sự, an toàn) hoặc "tớ - cậu" (nếu trẻ trung đồng trang lứa).',
            'Nếu cô ấy đã xưng "em - anh", "chị - em" hoặc "tui - bà": bắt nhịp đúng cặp xưng hô tương ứng của cô ấy.',
            'Nhất quán tuyệt đối: Sau khi chọn ĐÚNG MỘT cặp xưng hô, phải áp dụng giọng của cặp đó xuyên suốt mọi phương án gợi ý, không trộn lẫn.',
            'Báo cáo rõ: Ghi ngắn gọn trong trường "note" (hoặc "comment") là đã chọn cặp xưng hô nào và vì sao.'
        ],
        fitWhen: 'Dùng khi mới Match hoặc chưa biết nên mở lời bằng cặp xưng hô nào cho hợp hoàn cảnh nhất.',
        strangerCaution: 'Khi mới quen mà thông tin ít, luôn ưu tiên phương án lịch sự ("mình - bạn" hoặc "tớ - cậu"), tránh tự ý xưng "anh - em" hay "tui - bà" ngay.',
        needsStrangerCaution: false,
        samples: [
            '(Chọn mình - bạn khi mới quen): Nghe bạn nói là thấy hôm nay bận rộn thật sự rồi, bạn kịp nghỉ ngơi chút nào chưa?',
            '(Chọn tớ - cậu khi cùng lứa tuổi): Ôi nay cậu chạy việc gì mà vất vả thế, tối nhớ ăn ngon rồi nghỉ sớm nhé 😆',
            '(Chọn anh - em khi cô ấy xưng em): Hôm nay vất vả cho em rồi, về nhà nghỉ ngơi sớm cho lại sức nhé 😊'
        ],
        hint: 'AI tự động quan sát cách cô ấy nhắn, mức độ thân thiết và năm sinh để chọn 1 cặp xưng hô hợp nhất rồi giữ nhất quán.'
    }
};

function isStrangerCloseness(closenessStr) {
    if (!closenessStr || typeof closenessStr !== 'string') return false;
    const norm = closenessStr.toLowerCase();
    return (
        norm.includes('mới bắt chuyện') ||
        norm.includes('mới quen') ||
        norm.includes('lần đầu') ||
        norm.includes('chưa thân')
    );
}

function buildFallbackVoice(rawValue) {
    const clean = String(rawValue || '').trim();
    let selfPronoun = 'mình';
    let herPronoun = 'bạn';

    if (clean.includes('-')) {
        const parts = clean.split('-').map(s => s.trim()).filter(Boolean);
        if (parts.length >= 2) {
            selfPronoun = parts[0];
            herPronoun = parts.slice(1).join(' - ');
        }
    }

    const pairLabel = `${selfPronoun} - ${herPronoun}`;
    return {
        value: clean || pairLabel,
        self: selfPronoun,
        her: herPronoun,
        vibe: `Trung tính, lịch sự, tự nhiên và tôn trọng đối phương (tôi xưng "${selfPronoun}", gọi cô ấy là "${herPronoun}").`,
        speech: [
            `Quy ước bắt buộc: Tôi luôn xưng "${selfPronoun}" và gọi cô ấy là "${herPronoun}" nhất quán trong mọi câu, không đảo vai.`,
            'Độ dài & nhịp: Câu gọn gàng 1-2 câu (8-16 chữ), nhịp điệu tự nhiên, dễ trả lời.',
            'Từ đệm: Dùng tối đa 1 từ đệm nhẹ ("nha", "nhé", "hen"), không lạm dụng tiếng lóng.',
            'Cách hỏi han: Lắng nghe và phản hồi chi tiết cô ấy vừa chia sẻ trước khi hỏi mở.',
            'Mức trêu đùa: 1/3 (nhẹ nhàng, lịch thiệp); Emoji: 0-1 mỗi tin.'
        ],
        fitWhen: 'Áp dụng cho cặp xưng hô tuỳ chỉnh theo ngữ cảnh riêng của người dùng.',
        strangerCaution: 'Nếu mới bắt chuyện, giữ thái độ lịch sự, ấm áp vừa phải, không suồng sã.',
        needsStrangerCaution: false,
        samples: [
            `Nghe ${herPronoun} kể là thấy hôm nay vất vả thật rồi, ${herPronoun} đã kịp ăn tối chưa?`,
            `Hôm nay ${herPronoun} bận chạy nhiều việc lắm hả, tối nay nhớ nghỉ ngơi sớm nha 😊`,
            `${selfPronoun.charAt(0).toUpperCase() + selfPronoun.slice(1)} nghe cũng thấy thấm mệt giùm ${herPronoun} luôn, cố lên nhé!`
        ],
        hint: `Giọng trung tính, tự nhiên và lịch sự: bạn xưng "${selfPronoun}" và gọi cô ấy là "${herPronoun}" nhất quán.`
    };
}

function resolvePronounVoiceEntry(value) {
    const cleanVal = String(value || '').trim();
    if (!cleanVal) {
        return PRONOUN_VOICE_MAP['mình - bạn'];
    }
    if (PRONOUN_VOICE_MAP[cleanVal]) {
        return PRONOUN_VOICE_MAP[cleanVal];
    }
    const lower = cleanVal.toLowerCase();
    if (lower.includes('ai tự chọn')) {
        return PRONOUN_VOICE_MAP['Để AI tự chọn theo ngữ cảnh'];
    }
    for (const key of PRONOUN_VOICE_ORDER) {
        if (key.toLowerCase() === lower) {
            return PRONOUN_VOICE_MAP[key];
        }
    }
    return buildFallbackVoice(cleanVal);
}

window.PronounVoice = {
    list() {
        return PRONOUN_VOICE_ORDER.map(key => {
            const item = PRONOUN_VOICE_MAP[key];
            return {
                ...item,
                speech: [...item.speech],
                samples: [...item.samples]
            };
        });
    },

    get(value) {
        const entry = resolvePronounVoiceEntry(value);
        return {
            ...entry,
            speech: [...entry.speech],
            samples: [...entry.samples]
        };
    },

    hint(value) {
        const entry = resolvePronounVoiceEntry(value);
        return entry.hint || entry.vibe;
    },

    describe(value, ctx = {}) {
        const entry = resolvePronounVoiceEntry(value);
        const safeCtx = ctx && typeof ctx === 'object' ? ctx : {};
        const isStranger = isStrangerCloseness(safeCtx.closeness);

        const roleHeader = entry.value === 'Để AI tự chọn theo ngữ cảnh'
            ? `Giọng theo xưng hô (Để AI tự chọn theo ngữ cảnh): ${entry.vibe}`
            : `Giọng theo xưng hô (${entry.value} — tôi xưng "${entry.self}", gọi cô ấy là "${entry.her}"): ${entry.vibe}`;

        const speechLines = entry.speech.map(rule => `  * ${rule}`).join('\n');
        const samplesLine = `  * Mẫu tham khảo khi cô ấy than "Hnay mệt quá trời luôn": (1) "${entry.samples[0]}" | (2) "${entry.samples[1]}" | (3) "${entry.samples[2]}"`;

        let cautionLine = '';
        if (isStranger && entry.needsStrangerCaution) {
            cautionLine = `\n  * CẢNH BÁO MỚI QUEN: Hiện mức thân thiết là "${safeCtx.closeness}" nhưng người dùng chọn "${entry.value}". Hãy tự giảm nhẹ độ thân mật/suồng sã cho lịch sự và nói rõ trong note/warnings (${entry.strangerCaution})`;
        } else if (isStranger) {
            cautionLine = `\n  * Lưu ý mới quen: ${entry.strangerCaution}`;
        }

        const coordinationRule = `  * Phối hợp: Giọng theo xưng hô này là NỀN. "Kiểu nói chuyện" và "Độ hài hước" chỉ chỉnh cường độ trong khuôn khổ giọng này, tuyệt đối không phá vai và không đảo chiều xưng hô.`;

        let fullBlock = `${roleHeader}\n${speechLines}${cautionLine}\n${samplesLine}\n${coordinationRule}`;

        if (fullBlock.length > 900) {
            fullBlock = `${roleHeader}\n${speechLines}${cautionLine}\n${coordinationRule}`;
            if (fullBlock.length > 900) {
                fullBlock = fullBlock.slice(0, 897) + '...';
            }
        }
        return fullBlock;
    }
};