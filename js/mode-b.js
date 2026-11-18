/**
 * ============================================================================
 * 8. XỬ LÝ CHẾ ĐỘ B (TAB 🎭 LUYỆN TẬP) — BƯỚC 5A, 5B & 5C (MỤC 5.1 -> 5.11)
 * ============================================================================
 */

// Mục 5.1: Danh sách 8 nhân vật mẫu (luôn từ 18 tuổi trở lên) kèm Thẻ nhân vật nhất quán
const ROLEPLAY_PRESET_PERSONAS = [
    {
        id: 'extrovert_fun',
        label: '😄 Hướng ngoại, hay đùa',
        persona: 'Một bạn nữ 20 tuổi hướng ngoại, vui tính, hay đùa, thích trà sữa và chụp ảnh dạo',
        card: {
            name: 'Khánh Linh',
            age: 20,
            occupation: 'Sinh viên năm 2 ngành Truyền thông đa phương tiện',
            interests: 'Uống trà sữa ô long, chụp ảnh film dạo phố, xem vlog du lịch, nghe nhạc US-UK',
            messagingStyle: 'Nhắn nhanh, hay tách 2 tin ngắn, dùng từ "haha", "trời ơi", kéo dài chữ và dùng emoji 😆✨',
            likesDislikes: 'Thích người nói chuyện tự nhiên, hài hước, biết chia sẻ; không thích câu thính văn mẫu hoặc hỏi cung',
            summary: 'Hướng ngoại, vui tính, hay đùa'
        }
    },
    {
        id: 'introvert_warm',
        label: '🌙 Trầm tính, ấm áp',
        persona: 'Một bạn nữ 21 tuổi trầm tính, ít nói lúc đầu nhưng ấm áp nếu tìm đúng chủ đề sách/nhạc/mèo',
        card: {
            name: 'Minh Anh',
            age: 21,
            occupation: 'Sinh viên năm 3 ngành Ngữ văn & Cộng tác viên biên tập sách',
            interests: 'Đọc tiểu thuyết trinh thám, nghe nhạc Indie đêm khuya, nuôi mèo mướp, uống bạc xỉu ấm',
            messagingStyle: 'Ban đầu nhắn gọn 1 câu lịch sự, ít viết tắt; khi chạm đúng chủ đề sách/nhạc/mèo thì kể rất nhiệt tình và ấm áp',
            likesDislikes: 'Thích người tinh tế, biết lắng nghe và không vội vã; không thích sự ồn ào, suồng sã hoặc ép đi chơi ngay',
            summary: 'Trầm tính, sâu sắc, yêu sách & mèo'
        }
    },
    {
        id: 'cute_shy',
        label: '🥺 Dễ thương, hay ngại',
        persona: 'Một bạn nữ 19 tuổi dễ thương, hay ngại ngùng, lịch sự, thích xem phim hoạt hình và đồ ngọt',
        card: {
            name: 'Bảo Ngọc',
            age: 19,
            occupation: 'Sinh viên năm nhất ngành Sư phạm Mầm non',
            interests: 'Xem phim hoạt hình Ghibli, tự làm bánh quy bơ, vẽ màu nước, sưu tầm sticker gấu bông',
            messagingStyle: 'Lịch sự, nhẹ nhàng, hay dùng "dạ/vâng", "hihi", "á", hay gửi sticker hoặc emoji ngại ngùng 🥺🙈🌸',
            likesDislikes: 'Thích người hiền lành, kiên nhẫn, khen đúng sự cố gắng; rất sợ bị trêu quá đà hoặc khen ngoại hình đột ngột',
            summary: 'Dễ thương, hay ngại ngùng, lịch sự'
        }
    },
    {
        id: 'smart_witty',
        label: '🧠 Thông minh, sắc sảo',
        persona: 'Một bạn nữ 22 tuổi thông minh, sắc sảo, có gu riêng, thích cà phê cold brew và hay trêu ngược tinh tế',
        card: {
            name: 'Thanh Hà',
            age: 22,
            occupation: 'Chuyên viên Content Marketing tại agency sáng tạo',
            interests: 'Thưởng thức cà phê cold brew, nghe podcast tâm lý học, chạy bộ buổi sáng, xem phim điện ảnh nghệ thuật',
            messagingStyle: 'Câu chữ gãy gọn, thông minh, hay bắt bài hoặc trêu ngược nhẹ nhàng để xem đối phương phản ứng thế nào',
            likesDislikes: 'Thích người có chính kiến, hài hước thông minh, nói chuyện có chiều sâu; chán ngay nếu gặp câu hỏi nhạt hoặc nịnh quá đà',
            summary: 'Thông minh, sắc sảo, hay trêu ngược'
        }
    },
    {
        id: 'busy_ambitious',
        label: '💼 Bận rộn, độc lập',
        persona: 'Một bạn nữ 23 tuổi độc lập, bận rộn với công việc thiết kế nhưng biết trân trọng người tinh tế, đúng mực',
        card: {
            name: 'Phương Thảo',
            age: 23,
            occupation: 'Thiết kế nội thất trẻ đang làm việc tại studio kiến trúc',
            interests: 'Decor không gian sống, cắm hoa cuối tuần, nghe nhạc Jazz, đi cafe yên tĩnh làm việc',
            messagingStyle: 'Nhắn rõ ý, lịch thiệp, đôi khi trả lời ngắn vì bận chạy bản vẽ nhưng luôn phản hồi tử tế nếu câu chuyện thú vị',
            likesDislikes: 'Thích người tôn trọng thời gian riêng, hỏi thăm đúng lúc; cực kỳ dị ứng kiểu trách móc "sao không rep" hay nhắn dồn',
            summary: 'Độc lập, bận rộn, thích sự tinh tế'
        }
    },
    {
        id: 'artistic_dreamy',
        label: '🎨 Nghệ sĩ, bay bổng',
        persona: 'Một bạn nữ 20 tuổi tâm hồn nghệ sĩ, thích đi triển lãm tranh, chụp ảnh hoàng hôn và nghe nhạc đĩa than',
        card: {
            name: 'Lam Nhi',
            age: 20,
            occupation: 'Sinh viên năm 2 Đại học Mỹ thuật Công nghiệp',
            interests: 'Đi triển lãm nghệ thuật, săn ảnh hoàng hôn Hồ Tây, sưu tầm đĩa than cũ, uống trà bá tước',
            messagingStyle: 'Giàu cảm xúc, hay để ý những chi tiết nhỏ đời thường, thích chia sẻ cảm nhận về màu sắc, âm nhạc và thời tiết',
            likesDislikes: 'Thích người biết quan sát và đồng cảm với cái đẹp đời thường; không hợp kiểu nói chuyện khô khan chỉ toàn hỏi số liệu',
            summary: 'Nghệ sĩ, bay bổng, giàu cảm xúc'
        }
    },
    {
        id: 'sporty_energetic',
        label: '🏸 Năng động, mê thể thao',
        persona: 'Một bạn nữ 21 tuổi năng động, thẳng thắn, mê đánh cầu lông, trekking cuối tuần và ăn đồ nướng',
        card: {
            name: 'Mai Chi',
            age: 21,
            occupation: 'Sinh viên năm 3 ngành Kinh tế đối ngoại & Đội trưởng CLB Cầu lông',
            interests: 'Đánh cầu lông 3 buổi/tuần, trekking leo núi cuối tuần, ăn lẩu nướng cùng hội bạn, nuôi chó Corgi',
            messagingStyle: 'Nhiệt huyết, thẳng thắn, nhịp nhắn nhanh gọn, hay dùng "okila", "triển luôn", "haha" 😆🔥',
            likesDislikes: 'Thích người năng động, rõ ràng, rủ đi ăn uống/thể thao tự nhiên; không thích kiểu vòng vo, ấp úng hoặc quá uỷ mị',
            summary: 'Năng động, thẳng thắn, mê thể thao'
        }
    },
    {
        id: 'foodie_cozy',
        label: '🍜 Hệ ẩm thực, gần gũi',
        persona: 'Một bạn nữ 20 tuổi thân thiện, mê khám phá quán ăn ngon trong ngõ nhỏ và thích nấu ăn cuối tuần',
        card: {
            name: 'Thuỳ Trang',
            age: 20,
            occupation: 'Sinh viên năm 2 Đại học Dược',
            interests: 'Khám phá quán bún/phở/ăn vặt trong ngõ nhỏ, tự nấu cơm hộp, xem kênh review ẩm thực, uống matcha latte',
            messagingStyle: 'Gần gũi như bạn bè thân, dễ bắt chuyện, hào hứng nhất khi bàn về món ngon hoặc quán nước mới mở',
            likesDislikes: 'Thích người giản dị, chân thành, có tâm hồn ăn uống; không thích người hay khoe khoang hoặc chê bai sở thích người khác',
            summary: 'Thân thiện, gần gũi, đam mê ẩm thực'
        }
    }
];

// Mục 5.2: Danh sách 10 tình huống thực tế
const ROLEPLAY_PRESET_SITUATIONS = [
    {
        id: 'ig_story_cafe',
        label: '📸 Trả lời story cafe',
        text: 'Mới follow nhau trên Instagram, bạn nam vừa trả lời (rep) story ảnh đi uống cafe cuối tuần của bạn'
    },
    {
        id: 'dating_just_matched',
        label: '💘 Vừa match app hẹn hò',
        text: 'Hai người vừa match nhau trên ứng dụng hẹn hò (Tinder/Bumble), chưa nhắn tin nào và bạn nam đang mở lời làm quen dựa trên hồ sơ của bạn'
    },
    {
        id: 'text_after_silence',
        label: '⏳ Nhắn lại sau vài ngày im',
        text: 'Trước đó hai người từng nói chuyện khá vui nhưng cả hai bận rộn nên đã im lặng khoảng 4-5 ngày, giờ bạn nam nhắn lại bắt chuyện tự nhiên'
    },
    {
        id: 'after_date_invite',
        label: '☕ Sau khi rủ đi chơi',
        text: 'Hai người đã trò chuyện hợp nhau vài hôm, bạn nam vừa ngỏ lời rủ đi cafe/dạo phố cuối tuần hoặc đang xử lý phản hồi của bạn sau lời rủ'
    },
    {
        id: 'group_project',
        label: '🎒 Cùng nhóm làm bài',
        text: 'Học cùng lớp đại học hoặc cùng câu lạc bộ, hai người vừa được xếp chung nhóm làm bài tập lớn / chạy sự kiện'
    },
    {
        id: 'same_event',
        label: '🎪 Cùng sự kiện / Workshop',
        text: 'Hai người vừa tình cờ gặp và trò chuyện ngắn tại một buổi workshop / sự kiện âm nhạc / sinh nhật bạn chung, tối về bạn nam nhắn tin kết nối'
    },
    {
        id: 'friend_intro',
        label: '🐱 Bạn bè giới thiệu',
        text: 'Được một người bạn thân giới thiệu cho làm quen vì thấy cả hai đều có chung sở thích nuôi thú cưng và nghe nhạc'
    },
    {
        id: 'first_date_followup',
        label: '🌙 Sau buổi hẹn đầu tiên',
        text: 'Hai người vừa đi uống nước buổi hẹn đầu tiên về, không khí khá dễ chịu và bạn nam nhắn tin hỏi thăm khi bạn vừa về tới nhà'
    },
    {
        id: 'apologize_awkward',
        label: '🩹 Chữa ngượng sau câu lỡ lời',
        text: 'Ở lần nhắn trước bạn nam lỡ nói một câu hơi sến hoặc hơi vội làm bạn hơi ngại, giờ bạn nam nhắn lại tự nhiên để lấy lại bầu không khí thoải mái'
    },
    {
        id: 'late_night_study',
        label: '📚 Đêm khuya chạy deadline',
        text: 'Khoảng 23h đêm, bạn vừa đăng story/ghi chú đang thức chạy bài tập/deadline mệt mỏi và bạn nam nhắn tin hỏi thăm ngắn gọn'
    }
];

// Mục 5.3: Cấu hình 3 mức độ khó
const ROLEPLAY_DIFFICULTY_CONFIG = {
    easy: {
        id: 'easy',
        label: '🌱 Dễ (Cởi mở)',
        initialInterest: 65,
        shortHint: 'Nhân vật thân thiện, dễ bắt nhịp, hay hỏi ngược và cộng điểm hứng thú hào phóng.',
        promptDesc: 'MỨC DỄ (Cởi mở): Bạn khá thân thiện, cởi mở, dễ bắt nhịp câu chuyện, sẵn sàng đỡ lời và đặt câu hỏi ngược lại để giúp bạn nam tự tin hơn. Điểm hứng thú tăng nhanh nếu bạn nam nói chuyện lịch sự, chân thành.'
    },
    normal: {
        id: 'normal',
        label: '⚖️ Thường (Tự nhiên)',
        initialInterest: 55,
        shortHint: 'Nhân vật phản ứng tự nhiên như ngoài đời: vui vẻ khi hợp chuyện, giảm hứng nếu bị hỏi cung.',
        promptDesc: 'MỨC THƯỜNG (Tự nhiên): Bạn phản ứng tự nhiên đúng như một bạn nữ ngoài đời thực. Bạn hào hứng khi bạn nam biết đồng cảm, chia sẻ và hỏi mở đúng sở thích; nhưng sẽ trả lời ngắn lại nếu bạn nam chỉ hỏi đóng liên tiếp.'
    },
    hard: {
        id: 'hard',
        label: '🔥 Khó (Kiệm lời, hay thử)',
        initialInterest: 40,
        shortHint: 'Nhân vật kiệm lời lúc đầu, đôi khi thử phản xạ của bạn và dễ tụt hứng nếu nhắn nhạt/sến.',
        promptDesc: 'MỨC KHÓ (Kiệm lời, hay thử, dễ nguội): Lúc đầu bạn khá kiệm lời và giữ khoảng cách lịch sự. Đôi khi bạn trả lời ngắn hoặc đưa ra câu hỏi thử sự tinh tế của bạn nam. Nếu bạn nam nhắn câu sáo rỗng, thả thính văn mẫu, hỏi dồn dập hoặc thúc giục, điểm hứng thú sẽ tụt nhanh và bạn sẵn sàng khép lại cuộc trò chuyện.'
    }
};

// Mục 5.8: Cấu hình 5 lựa chọn Nhiệm vụ buổi tập (tuỳ chọn)
const ROLEPLAY_MISSIONS = [
    {
        id: 'none',
        label: '🎯 Tự do',
        title: 'Trò chuyện tự do (Không đặt nhiệm vụ)',
        desc: 'Tập phản xạ tự nhiên theo nhịp của bạn, không áp lực chỉ tiêu.'
    },
    {
        id: 'sustain_10',
        label: '🔥 Duy trì 10 lượt',
        title: 'Nhiệm vụ: Duy trì 10 lượt trao đổi',
        desc: 'Nhắn đủ 10 lượt tin của bạn mà vẫn giữ độ hứng thú của cô ấy từ 50/100 trở lên.'
    },
    {
        id: 'ask_back_3',
        label: '❓ Cô ấy hỏi ngược 3 lần',
        title: 'Nhiệm vụ: Khiến cô ấy hỏi ngược 3 lần',
        desc: 'Gợi mở chủ đề thú vị để nhân vật chủ động đặt câu hỏi ngược lại cho bạn đủ 3 lần.'
    },
    {
        id: 'invite_cafe',
        label: '☕ Rủ đi cafe thành công',
        title: 'Nhiệm vụ: Rủ đi cafe thành công mà không ép',
        desc: 'Đưa độ hứng thú lên >= 60/100 và ngỏ lời rủ đi cafe/dạo phố tinh tế để cô ấy đồng ý.'
    },
    {
        id: 'revive_cold',
        label: '🧊 Hồi sinh chat đang nguội',
        title: 'Nhiệm vụ: Hồi sinh cuộc trò chuyện đang nguội',
        desc: 'Bắt đầu khi cuộc trò chuyện đang nguội (hứng thú 30/100, tâm trạng hơi chán) và kéo hứng thú lên >= 60/100.'
    }
];

// Biến trạng thái giao diện tạm thời cho Bước 5A, 5B & 5C
let roleplayUIState = {
    showCustomPersonaForm: false,
    showCustomSituationForm: false,
    showEditCardForm: false,
    showHistoryDrawer: false,
    revealInnerThoughts: false,
    expandedUserTurnMap: {}, // Bật/tắt xem chi tiết từng tin của tôi trên khung chat (Mục 5.10)
    lastInterestDelta: 0,
    isSimulatingTyping: false
};

/**
 * Định dạng Thẻ nhân vật thành khối văn bản chuẩn để nhúng vào System Prompt mọi lượt (Mục 5.1)
 */
function formatCharacterCardForPrompt(card) {
    const c = card || appState.roleplay.characterCard || ROLEPLAY_PRESET_PERSONAS[0].card;
    const safeAge = Math.max(18, parseInt(c.age, 10) || 20);
    return `- Tên nhân vật: ${c.name || 'Khánh Linh'}
- Tuổi: ${safeAge} tuổi (Người trưởng thành)
- Học tập / Công việc: ${c.occupation || 'Sinh viên đại học'}
- Sở thích cụ thể: ${c.interests || 'Uống trà sữa, nghe nhạc, chụp ảnh'}
- Phong cách nhắn tin: ${c.messagingStyle || 'Tự nhiên, ngắn gọn'}
- Điều thích & không thích: ${c.likesDislikes || 'Thích sự chân thành; không thích bị hỏi dồn hoặc thả thính sến'}
- Tóm tắt tính cách: ${c.summary || appState.roleplay.persona}`;
}

/**
 * Ghép System Prompt hoàn chỉnh cho mỗi lượt đóng vai nhân vật (Mục 5.1 -> 5.5 & 5.8)
 */
function getFormattedRoleplayPrompt() {
    const rp = appState.roleplay;
    const diffObj = ROLEPLAY_DIFFICULTY_CONFIG[rp.difficulty] || ROLEPLAY_DIFFICULTY_CONFIG.normal;
    const charCardText = formatCharacterCardForPrompt(rp.characterCard);
    const currentInterest = typeof rp.interest === 'number' ? rp.interest : diffObj.initialInterest;
    const missionObj = ROLEPLAY_MISSIONS.find(m => m.id === rp.missionId) || ROLEPLAY_MISSIONS[0];

    const humanBehaviorAddon = `${diffObj.promptDesc}
- HÀNH VI NHẮN TIN NHƯ NGƯỜI THẬT (MỤC 5.5):
  + Đôi khi chỉ gửi đúng 1 sticker hoặc emoji biểu cảm (đặt sendType = "sticker_only") nếu tin nhắn của bạn nam vừa mang tính trêu vui nhẹ hoặc cảm thán.
  + Khi độ hứng thú khá tốt (>= 55), hãy biết chủ động hỏi ngược lại bạn nam (đặt askedBack = true) hoặc cài cắm "hint" tự nhiên về sở thích/việc đang làm trong Thẻ nhân vật của bạn để xem bạn nam có tinh ý bắt chuyện không.
  + Đôi khi đặt một câu hỏi thử nhẹ nhàng để xem bạn nam có chân thành hay chỉ đang nói văn mẫu.
  + Nếu bạn nam nhắn câu nhạt, cụt lủn hoặc hỏi đóng liên tiếp như phỏng vấn, bạn hãy trả lời ngắn/cụt lại tương ứng hoặc chỉ xem không rep (sendType = "seen_only").
  + Nếu bạn nam rủ đi cafe/đi chơi một cách tinh tế, có đường lui khi độ hứng thú >= 60, bạn hãy vui vẻ đồng ý và đặt acceptedHangout = true; nếu bạn nam rủ quá vội khi hứng thú < 55 hoặc ép buộc, hãy từ chối khéo và giữ acceptedHangout = false.
- Ngữ cảnh nhiệm vụ người dùng đang luyện: ${missionObj.title}.`;

    return SYSTEM_PROMPT_MODE_B_ROLEPLAY
        .replace('{character_card}', charCardText)
        .replace('{persona}', rp.persona || '')
        .replace('{tinh_huong}', rp.situation || '')
        .replace('{difficulty_desc}', humanBehaviorAddon)
        .replace('{current_interest}', String(currentInterest));
}

/**
 * Tính điểm hứng thú và tâm trạng khởi đầu dựa theo Độ khó & Nhiệm vụ (Mục 5.3 & 5.8)
 */
function getInitialInterestAndMood(difficultyKey, missionId) {
    if (missionId === 'revive_cold') {
        return { initialInterest: 30, initialMood: 'hơi chán' };
    }
    const diffObj = ROLEPLAY_DIFFICULTY_CONFIG[difficultyKey] || ROLEPLAY_DIFFICULTY_CONFIG.normal;
    return {
        initialInterest: diffObj.initialInterest,
        initialMood: difficultyKey === 'hard' ? 'bình thường' : 'vui'
    };
}

/**
 * Khởi tạo lại phiên luyện tập mới (giữ nguyên Nhân vật, Tình huống, Độ khó, Nhiệm vụ đang chọn)
 */
function resetRoleplaySession(showToastMsg = false) {
    const rp = appState.roleplay;
    const { initialInterest, initialMood } = getInitialInterestAndMood(rp.difficulty, rp.missionId);

    rp.sessionId = 'rp_sess_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
    rp.history = [];
    rp.isFinished = false;
    rp.isEndedByLowInterest = false;
    rp.interest = initialInterest;
    rp.mood = initialMood;
    rp.interestCurve = [rp.interest];
    rp.hintsUsed = 0;
    rp.lastHint = null;
    rp.askedBackCount = 0;
    rp.acceptedHangout = false;
    rp.missionCompleted = false;
    rp.lastEvaluation = null;

    roleplayUIState.revealInnerThoughts = false;
    roleplayUIState.expandedUserTurnMap = {};
    roleplayUIState.lastInterestDelta = 0;
    roleplayUIState.isSimulatingTyping = false;

    saveRoleplayState();

    const evalArea = document.getElementById('roleplayEvaluationArea');
    if (evalArea) evalArea.innerHTML = '';

    syncRoleplayUIFromState();
    if (showToastMsg) {
        showToast('Đã tạo buổi luyện tập mới!', '🔄');
    }
}

/**
 * Mục 5.8: Kiểm tra tiến độ và trạng thái hoàn thành Nhiệm vụ buổi tập
 */
function checkRoleplayMissionProgress(notifyOnComplete = true) {
    const rp = appState.roleplay;
    const missionId = rp.missionId || 'none';
    const userTurnsCount = (rp.history || []).filter(t => t.role === 'user' && !t.isSystemTrigger).length;
    const currentInterest = typeof rp.interest === 'number' ? rp.interest : 55;
    const askedBackCount = rp.askedBackCount || 0;
    const acceptedHangout = Boolean(rp.acceptedHangout);

    let isDone = false;
    let progressText = '';
    let progressPct = 0;

    if (missionId === 'sustain_10') {
        progressPct = Math.min(100, Math.round((userTurnsCount / 10) * 100));
        isDone = userTurnsCount >= 10 && currentInterest >= 50 && !rp.isEndedByLowInterest;
        progressText = `Tiến độ: ${Math.min(10, userTurnsCount)}/10 lượt của bạn • Hứng thú: ${currentInterest}/100 (cần >= 50)`;
    } else if (missionId === 'ask_back_3') {
        progressPct = Math.min(100, Math.round((askedBackCount / 3) * 100));
        isDone = askedBackCount >= 3;
        progressText = `Tiến độ: Cô ấy đã hỏi ngược ${Math.min(3, askedBackCount)}/3 lần`;
    } else if (missionId === 'invite_cafe') {
        progressPct = acceptedHangout ? 100 : Math.min(85, Math.round((currentInterest / 60) * 75));
        isDone = acceptedHangout && currentInterest >= 60;
        progressText = acceptedHangout
            ? `Đã rủ đi cafe thành công! (Hứng thú: ${currentInterest}/100)`
            : `Hứng thú hiện tại: ${currentInterest}/60+ • Hãy trò chuyện tự nhiên rồi rủ đi cafe không ép buộc`;
    } else if (missionId === 'revive_cold') {
        const gained = Math.max(0, currentInterest - 30);
        progressPct = Math.min(100, Math.round((gained / 30) * 100));
        isDone = userTurnsCount >= 1 && currentInterest >= 60;
        progressText = `Tiến độ hồi sinh: Hứng thú từ 30 → ${currentInterest}/60 mục tiêu`;
    } else {
        progressText = `Chế độ tự do • Đã nhắn ${userTurnsCount} lượt • Cô ấy hỏi ngược ${askedBackCount} lần`;
        progressPct = 100;
    }

    const wasCompleted = Boolean(rp.missionCompleted);
    if (missionId !== 'none') {
        rp.missionCompleted = isDone || wasCompleted;
        if (rp.missionCompleted && !wasCompleted && notifyOnComplete) {
            const mObj = ROLEPLAY_MISSIONS.find(m => m.id === missionId);
            showToast(`🎉 Hoàn thành nhiệm vụ: "${mObj ? mObj.label : missionId}"!`, '🏆');
        }
    } else {
        rp.missionCompleted = false;
    }

    return {
        missionId,
        isCompleted: Boolean(rp.missionCompleted),
        progressText,
        progressPct
    };
}

/**
 * Dựng toàn bộ cấu trúc giao diện nâng cấp Bước 5A, 5B & 5C vào trong `<section id="viewModeB">`
 */
function initRoleplayTab() {
    const section = document.getElementById('viewModeB');
    if (!section) return;

    if (typeof normalizeRoleplayState === 'function') {
        appState.roleplay = normalizeRoleplayState(appState.roleplay);
    }
    if (!Array.isArray(appState.roleplay.customCharacters)) {
        appState.roleplay.customCharacters = [];
    }
    if (!Array.isArray(appState.roleplayHistory)) {
        appState.roleplayHistory = [];
    }

    section.innerHTML = `
        <!-- KHỐI 1: THIẾT LẬP NHÂN VẬT, THẺ NHÂN VẬT, TÌNH HUỐNG, ĐỘ KHÓ, NHIỆM VỤ & LỊCH SỬ (MỤC 5.1 -> 5.8, 5.11) -->
        <div class="bg-white dark:bg-stone-800/90 border border-warm-200 dark:border-stone-700 rounded-2xl p-4 shadow-xs space-y-3.5">
            <div class="flex flex-wrap items-center justify-between gap-2">
                <div>
                    <h2 class="text-sm font-extrabold text-stone-800 dark:text-stone-100 flex items-center gap-1.5">
                        <span>🎭</span>
                        <span>Phòng luyện tập phản xạ nhắn tin</span>
                    </h2>
                    <p class="text-[11px] text-stone-500 dark:text-stone-400">
                        Nhân vật nhất quán, chấm điểm 6 tiêu chí, vẽ đường cong hứng thú & xem lại từng tin.
                    </p>
                </div>
                <div class="flex items-center gap-1.5 flex-shrink-0">
                    <button type="button" id="btnToggleRoleplayHistoryDrawer" class="text-xs font-bold px-2.5 py-1.5 rounded-xl bg-warm-100 hover:bg-warm-200 dark:bg-stone-700 dark:hover:bg-stone-600 text-stone-700 dark:text-stone-200 transition flex items-center gap-1">
                        <span>🗂️</span>
                        <span id="roleplayHistoryCountBadge">Lịch sử (0)</span>
                    </button>
                    <button type="button" id="btnResetRoleplay" class="text-xs font-bold px-3 py-1.5 rounded-xl bg-warm-500 hover:bg-warm-600 text-white shadow-xs transition">
                        🔄 Tạo buổi mới
                    </button>
                </div>
            </div>

            <!-- MỤC 5.11: NGĂN XEM LẠI LỊCH SỬ CÁC BUỔI LUYỆN TẬP -->
            <div id="roleplayHistoryDrawer" class="hidden p-3 rounded-xl bg-warm-100/60 dark:bg-stone-900/85 border border-warm-200 dark:border-stone-700 space-y-2.5 animate-pop">
                <div class="flex items-center justify-between">
                    <span class="text-xs font-extrabold text-stone-700 dark:text-stone-200">🕒 Lịch sử các buổi luyện tập đã chấm điểm:</span>
                    <button type="button" id="btnClearAllRoleplayHistory" class="text-[11px] font-bold text-red-600 dark:text-red-400 hover:underline">
                        🗑️ Xoá tất cả
                    </button>
                </div>
                <div id="roleplayHistoryListContainer" class="space-y-2 max-h-64 overflow-y-auto pr-1"></div>
            </div>

            <div class="space-y-3 pt-2 border-t border-warm-100 dark:border-stone-700/60">
                <!-- MỤC 5.1: CHỌN NHÂN VẬT (8 TÍNH CÁCH + TỰ TẠO NHÂN VẬT) -->
                <div class="space-y-2">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-bold text-stone-700 dark:text-stone-200">👧 1. Chọn nhân vật bạn nữ (từ 18 tuổi):</span>
                        <span class="text-[10px] text-stone-400">8 tính cách mẫu + Tự tạo bằng AI</span>
                    </div>
                    <div class="flex flex-wrap gap-1.5" id="personaGroupB"></div>

                    <!-- Khung "Tự tạo nhân vật" bằng AI (Mục 5.1) -->
                    <div id="customPersonaBuilderBox" class="hidden p-3 rounded-xl bg-warm-50 dark:bg-stone-900/90 border border-warm-200 dark:border-stone-700 space-y-2.5 animate-pop">
                        <div class="flex items-center justify-between">
                            <span class="text-xs font-extrabold text-warm-600 dark:text-amber-400">✨ Tự tạo nhân vật bằng AI (Luôn >= 18 tuổi)</span>
                            <button type="button" id="btnCloseCustomPersonaForm" class="text-[11px] text-stone-400 hover:text-stone-600">Đóng ✕</button>
                        </div>
                        <textarea id="customPersonaDescInput" rows="2" placeholder="Mô tả nhân vật bạn muốn tập cùng (vd: Bạn nữ 21 tuổi học Y khoa, bề ngoài hơi kiệm lời nhưng rất thích chó Corgi và uống matcha)..." class="w-full rounded-xl bg-white dark:bg-stone-800 border border-warm-200 dark:border-stone-700 p-2.5 text-xs text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-warm-500 resize-none"></textarea>
                        <div class="flex items-center justify-end gap-2">
                            <button type="button" id="btnGenerateCharCard" class="px-3.5 py-2 rounded-xl bg-gradient-to-r from-warm-500 to-amber-600 hover:from-warm-600 hover:to-amber-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5">
                                <span>🪄</span>
                                <span>AI dựng Thẻ nhân vật</span>
                            </button>
                        </div>
                    </div>

                    <!-- Thẻ nhân vật nhất quán (Character Card) gửi kèm mọi lượt (Mục 5.1) -->
                    <div id="roleplayCharacterCardBox"></div>
                </div>

                <!-- MỤC 5.2: CHỌN TÌNH HUỐNG (10 TÌNH HUỐNG + TỰ TẠO TÌNH HUỐNG) -->
                <div class="space-y-2 pt-2 border-t border-warm-100 dark:border-stone-700/60">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-bold text-stone-700 dark:text-stone-200">📌 2. Chọn tình huống bắt đầu:</span>
                        <span class="text-[10px] text-stone-400">10 tình huống + Tự tạo</span>
                    </div>
                    <div class="flex flex-wrap gap-1.5" id="situationGroupB"></div>

                    <!-- Khung "Tự tạo tình huống" (Mục 5.2) -->
                    <div id="customSituationBuilderBox" class="hidden p-3 rounded-xl bg-warm-50 dark:bg-stone-900/90 border border-warm-200 dark:border-stone-700 space-y-2 animate-pop">
                        <div class="flex items-center justify-between">
                            <span class="text-xs font-extrabold text-warm-600 dark:text-amber-400">✨ Tự tạo tình huống riêng</span>
                            <button type="button" id="btnCloseCustomSituationForm" class="text-[11px] text-stone-400 hover:text-stone-600">Đóng ✕</button>
                        </div>
                        <textarea id="customSituationInput" rows="2" placeholder="Nhập bối cảnh của bạn (vd: Tình cờ ngồi chung bàn ở thư viện trường, vừa mượn cục sạc rồi xin IG làm quen)..." class="w-full rounded-xl bg-white dark:bg-stone-800 border border-warm-200 dark:border-stone-700 p-2.5 text-xs text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-warm-500 resize-none"></textarea>
                        <div class="flex justify-end">
                            <button type="button" id="btnApplyCustomSituation" class="px-3.5 py-1.5 rounded-xl bg-warm-500 hover:bg-warm-600 text-white text-xs font-bold shadow-xs transition">
                                ✅ Áp dụng tình huống này
                            </button>
                        </div>
                    </div>

                    <!-- Dòng hiển thị tình huống đang áp dụng -->
                    <div id="activeSituationBanner" class="px-3 py-2 rounded-xl bg-warm-50/90 dark:bg-stone-900/60 border border-warm-200/70 dark:border-stone-700 text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed"></div>
                </div>

                <!-- MỤC 5.3: ĐỘ KHÓ (DỄ / THƯỜNG / KHÓ) -->
                <div class="space-y-1.5 pt-2 border-t border-warm-100 dark:border-stone-700/60">
                    <span class="text-xs font-bold text-stone-700 dark:text-stone-200 block">🎚️ 3. Độ khó phản xạ:</span>
                    <div class="grid grid-cols-3 gap-1.5" id="difficultyGroupB">
                        <button type="button" data-diff="easy" class="diff-btn py-2 px-2 rounded-xl border text-xs transition">
                            🌱 Dễ (Cởi mở)
                        </button>
                        <button type="button" data-diff="normal" class="diff-btn py-2 px-2 rounded-xl border text-xs transition">
                            ⚖️ Thường
                        </button>
                        <button type="button" data-diff="hard" class="diff-btn py-2 px-2 rounded-xl border text-xs transition">
                            🔥 Khó (Hay thử)
                        </button>
                    </div>
                    <p id="difficultyHintText" class="text-[11px] text-stone-500 dark:text-stone-400 italic"></p>
                </div>

                <!-- MỤC 5.8: NHIỆM VỤ MỖI BUỔI (TUỲ CHỌN) + THANH TIẾN ĐỘ HOÀN THÀNH -->
                <div class="space-y-2 pt-2 border-t border-warm-100 dark:border-stone-700/60">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-bold text-stone-700 dark:text-stone-200">🎯 4. Nhiệm vụ buổi tập (tuỳ chọn):</span>
                        <span id="missionStatusBadge" class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-warm-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                            Tự do
                        </span>
                    </div>
                    <div class="flex flex-wrap gap-1.5" id="missionGroupB"></div>
                    <div id="missionProgressBox" class="p-2.5 rounded-xl bg-warm-50/90 dark:bg-stone-900/70 border border-warm-200/80 dark:border-stone-700 space-y-1.5 text-[11px]"></div>
                </div>
            </div>
        </div>

        <!-- KHỐI 2: KHUNG CHAT MESSENGER + THANH ĐỘ HỨNG THÚ, TÂM TRẠNG, GỢI Ý & QUAY LẠI (MỤC 5.4 -> 5.7, 5.10) -->
        <div id="roleplayChatCardContainer" class="bg-white dark:bg-stone-800/90 border border-warm-200 dark:border-stone-700 rounded-2xl shadow-xs flex flex-col h-[530px] overflow-hidden">
            <!-- Header Nhân vật & Nút Xem suy nghĩ thầm / Chấm điểm -->
            <div class="px-3.5 py-2.5 bg-warm-100/80 dark:bg-stone-800 border-b border-warm-200 dark:border-stone-700 space-y-2">
                <div class="flex items-center justify-between gap-2">
                    <div class="flex items-center gap-2 min-w-0">
                        <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-amber-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                            👧
                        </div>
                        <div class="min-w-0">
                            <div class="text-xs font-extrabold text-stone-800 dark:text-stone-100 truncate" id="roleplayHeaderTitle">
                                Khánh Linh (20t)
                            </div>
                            <div class="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold truncate" id="roleplayTurnCount">
                                Đang trực tuyến • 0 lượt
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center gap-1.5 flex-shrink-0">
                        <button type="button" id="btnToggleInnerThoughts" class="hidden px-2.5 py-1.5 rounded-xl bg-warm-200/80 hover:bg-warm-300/80 dark:bg-stone-700 dark:hover:bg-stone-600 text-stone-700 dark:text-stone-200 text-[11px] font-bold transition" title="Bật/tắt xem suy nghĩ thầm của nhân vật">
                            💭 Suy nghĩ thầm
                        </button>
                        <button type="button" id="btnFinishAndScore" class="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition flex items-center gap-1">
                            <span>🏆</span>
                            <span>Chấm điểm</span>
                        </button>
                    </div>
                </div>

                <!-- Thanh "Độ hứng thú" (0-100) và Icon Tâm trạng cập nhật theo từng tin (Mục 5.4) -->
                <div class="px-2.5 py-1.5 rounded-xl bg-white/90 dark:bg-stone-900/80 border border-warm-200/80 dark:border-stone-700/80 space-y-1">
                    <div class="flex items-center justify-between gap-2 text-[11px]">
                        <div class="flex items-center gap-1.5">
                            <span class="font-bold text-stone-700 dark:text-stone-300">💓 Độ hứng thú:</span>
                            <span id="roleplayInterestValue" class="font-extrabold font-mono text-warm-600 dark:text-amber-400">55/100</span>
                            <span id="roleplayInterestDelta" class="hidden text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full"></span>
                        </div>
                        <div id="roleplayMoodBadge" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300/60">
                            <span>😊</span>
                            <span>Tâm trạng: Vui</span>
                        </div>
                    </div>
                    <div class="w-full h-2 rounded-full bg-warm-200/70 dark:bg-stone-700 overflow-hidden">
                        <div id="roleplayInterestBar" class="h-full rounded-full bg-emerald-500 transition-all duration-500" style="width: 55%"></div>
                    </div>
                </div>
            </div>

            <!-- Cửa sổ tin nhắn -->
            <div id="roleplayChatWindow" class="flex-1 p-3.5 overflow-y-auto space-y-2.5 bg-warm-50/60 dark:bg-stone-900/70"></div>

            <!-- Khu vực hiển thị thẻ "💡 Gợi ý hướng đi tiếp" (Mục 5.6 - Không viết sẵn cả câu) -->
            <div id="roleplayHintBox" class="hidden px-3.5 py-2.5 bg-amber-50/95 dark:bg-stone-900/95 border-t border-amber-300 dark:border-amber-800 text-xs space-y-1"></div>

            <!-- Form gửi tin nhắn + Nút "💡 Gợi ý" (Mục 5.6) -->
            <form id="roleplayInputForm" class="p-2.5 bg-white dark:bg-stone-800 border-t border-warm-200 dark:border-stone-700 flex items-center gap-1.5">
                <button type="button" id="btnRoleplayHint" class="px-2.5 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/80 dark:hover:bg-amber-900 text-amber-800 dark:text-amber-300 border border-amber-300/70 dark:border-amber-700 text-xs font-extrabold transition flex items-center gap-1 flex-shrink-0" title="Nhắc hướng đi tiếp (Không viết sẵn câu, dùng sẽ trừ 0.5 điểm cuối buổi)">
                    <span>💡</span>
                    <span id="roleplayHintBtnLabel">Gợi ý</span>
                </button>
                <input id="roleplayUserMsg" type="text" autocomplete="off" placeholder="Nhập tin nhắn của bạn..." class="flex-1 rounded-xl bg-warm-50 dark:bg-stone-900 border border-warm-200 dark:border-stone-700 px-3 py-2.5 text-sm text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-warm-500 min-w-0">
                <button type="submit" id="btnSendRoleplay" class="px-4 py-2.5 rounded-xl bg-warm-500 hover:bg-warm-600 text-white font-bold text-sm shadow-xs transition flex-shrink-0">
                    Gửi
                </button>
            </form>
        </div>

        <!-- KHỐI 3: KHU VỰC HIỂN THỊ BẢNG CHẤM ĐIỂM NÂNG CẤP 6 TIÊU CHÍ, ĐƯỜNG CONG SVG & XEM LẠI TỪNG TIN (MỤC 5.9 & 5.10) -->
        <div id="roleplayEvaluationArea" class="space-y-3"></div>
    `;

    // Gắn sự kiện cho các nút điều khiển chính
    document.getElementById('btnResetRoleplay')?.addEventListener('click', () => resetRoleplaySession(true));

    // Sự kiện bật/tắt ngăn Lịch sử buổi luyện tập (Mục 5.11)
    document.getElementById('btnToggleRoleplayHistoryDrawer')?.addEventListener('click', () => {
        roleplayUIState.showHistoryDrawer = !roleplayUIState.showHistoryDrawer;
        renderRoleplayHistoryDrawerUI();
    });

    document.getElementById('btnClearAllRoleplayHistory')?.addEventListener('click', () => {
        openCustomModal({
            title: '🗑️ Xoá toàn bộ lịch sử buổi luyện tập?',
            description: 'Tất cả các buổi luyện tập đã lưu trong lịch sử sẽ bị xoá khỏi trình duyệt.',
            confirmText: 'Xoá lịch sử',
            isDanger: true,
            onConfirm: () => {
                appState.roleplayHistory = [];
                if (typeof saveRoleplayHistoryToStorage === 'function') {
                    saveRoleplayHistoryToStorage();
                }
                renderRoleplayHistoryDrawerUI();
                showToast('Đã xoá toàn bộ lịch sử buổi luyện tập!', '🗑️');
            }
        });
    });

    document.getElementById('btnCloseCustomPersonaForm')?.addEventListener('click', () => {
        roleplayUIState.showCustomPersonaForm = false;
        renderRoleplayPersonaChipsUI();
    });

    document.getElementById('btnGenerateCharCard')?.addEventListener('click', handleGenerateCustomCharacterCard);

    document.getElementById('btnCloseCustomSituationForm')?.addEventListener('click', () => {
        roleplayUIState.showCustomSituationForm = false;
        renderRoleplaySituationChipsUI();
    });

    document.getElementById('btnApplyCustomSituation')?.addEventListener('click', handleApplyCustomSituation);

    // Sự kiện chọn Độ khó (Mục 5.3)
    document.querySelectorAll('#difficultyGroupB .diff-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const chosenDiff = btn.getAttribute('data-diff');
            if (chosenDiff && ROLEPLAY_DIFFICULTY_CONFIG[chosenDiff]) {
                appState.roleplay.difficulty = chosenDiff;
                resetRoleplaySession(false);
                showToast(`Đã chuyển sang độ khó: ${ROLEPLAY_DIFFICULTY_CONFIG[chosenDiff].label}`, '🎚️');
            }
        });
    });

    // Nút bật/tắt xem suy nghĩ thầm (innerThought)
    document.getElementById('btnToggleInnerThoughts')?.addEventListener('click', () => {
        roleplayUIState.revealInnerThoughts = !roleplayUIState.revealInnerThoughts;
        renderRoleplayMessagesUI();
    });

    // Nút "💡 Gợi ý" (Mục 5.6)
    document.getElementById('btnRoleplayHint')?.addEventListener('click', handleRequestRoleplayHint);

    document.getElementById('roleplayInputForm')?.addEventListener('submit', handleSendRoleplayMessage);
    document.getElementById('btnFinishAndScore')?.addEventListener('click', handleFinishAndScoreRoleplay);

    syncRoleplayUIFromState();
}

/**
 * Đồng bộ toàn bộ giao diện Tab 🎭 Luyện tập từ `appState.roleplay`
 */
function syncRoleplayUIFromState() {
    if (!document.getElementById('roleplayInterestBar')) {
        initRoleplayTab();
        return;
    }

    syncCharacterCardWithPersonaIfExternal();

    renderRoleplayHistoryDrawerUI();
    renderRoleplayPersonaChipsUI();
    renderCharacterCardSummaryUI();
    renderRoleplaySituationChipsUI();
    renderRoleplayDifficultyUI();
    renderRoleplayMissionUI();
    renderRoleplayHintBoxUI();
    updateRoleplayInterestAndMoodUI();
    renderRoleplayMessagesUI();

    const evalArea = document.getElementById('roleplayEvaluationArea');
    if (appState.roleplay.lastEvaluation && appState.roleplay.isFinished) {
        renderRoleplayScoreUI(appState.roleplay.lastEvaluation);
    } else if (evalArea) {
        evalArea.innerHTML = '';
    }
}

/**
 * Đảm bảo nếu người dùng bấm "Tập mở lời trong phòng luyện tập" từ Tab Làm quen (3.8)
 * hoặc "Thử tin hồi sinh" từ Tab Phân tích (4B.6), thẻ nhân vật tự động cập nhật khớp với persona đó.
 */
function syncCharacterCardWithPersonaIfExternal() {
    const rp = appState.roleplay;
    const matchedPreset = ROLEPLAY_PRESET_PERSONAS.find(
        p => p.id === rp.personaId || p.persona === rp.persona
    );

    if (matchedPreset && (!rp.characterCard || rp.characterCard._sourcePersona !== rp.persona)) {
        if (matchedPreset.persona === rp.persona) {
            rp.personaId = matchedPreset.id;
            rp.characterCard = { ...matchedPreset.card, _sourcePersona: rp.persona };
        }
    } else if (!matchedPreset && rp.persona && (!rp.characterCard || rp.characterCard._sourcePersona !== rp.persona)) {
        rp.personaId = 'custom';
        rp.characterCard = {
            name: rp.characterCard?.name || 'Bạn nữ mới Match',
            age: Math.max(18, parseInt(rp.characterCard?.age, 10) || 20),
            occupation: rp.characterCard?.occupation || 'Đang học tập / làm việc (theo hồ sơ)',
            interests: rp.persona,
            messagingStyle: 'Tự nhiên, phản hồi theo đúng hồ sơ và ngữ cảnh hiện tại',
            likesDislikes: 'Thích câu mở lời bám vào chi tiết thật; không thích câu chào "hi/hello" trơn hoặc hỏi cung',
            summary: rp.persona.slice(0, 70),
            _sourcePersona: rp.persona
        };
    }
}

/**
 * Mục 5.11: Lưu buổi luyện tập vừa chấm điểm vào `appState.roleplayHistory` và `localStorage`
 */
function saveRoleplaySessionToHistory(scoreData) {
    if (!scoreData) return;
    const rp = appState.roleplay;
    const c = rp.characterCard || ROLEPLAY_PRESET_PERSONAS[0].card;
    const missionObj = ROLEPLAY_MISSIONS.find(m => m.id === rp.missionId) || ROLEPLAY_MISSIONS[0];
    const missionProgress = checkRoleplayMissionProgress(false);

    if (!Array.isArray(appState.roleplayHistory)) {
        appState.roleplayHistory = [];
    }

    const sessionId = rp.sessionId || ('rp_sess_' + Date.now());
    rp.sessionId = sessionId;

    const entry = {
        id: sessionId,
        createdAt: Date.now(),
        personaId: rp.personaId || 'extrovert_fun',
        persona: rp.persona || '',
        characterName: c.name || 'Bạn nữ',
        characterAge: Math.max(18, parseInt(c.age, 10) || 20),
        characterCard: JSON.parse(JSON.stringify(c)),
        situationId: rp.situationId || 'ig_story_cafe',
        situation: rp.situation || '',
        difficulty: rp.difficulty || 'normal',
        missionId: rp.missionId || 'none',
        missionTitle: missionObj.title,
        missionLabel: missionObj.label,
        missionCompleted: Boolean(missionProgress.isCompleted),
        hintsUsed: rp.hintsUsed || 0,
        askedBackCount: rp.askedBackCount || 0,
        acceptedHangout: Boolean(rp.acceptedHangout),
        finalInterest: rp.interest ?? 55,
        finalMood: rp.mood || 'bình thường',
        interestCurve: Array.isArray(rp.interestCurve) ? [...rp.interestCurve] : [55],
        score: typeof scoreData.score === 'number' ? scoreData.score : 8,
        summary: scoreData.summary || '',
        history: JSON.parse(JSON.stringify(rp.history || [])),
        evaluation: JSON.parse(JSON.stringify(scoreData))
    };

    const existingIdx = appState.roleplayHistory.findIndex(item => item && item.id === sessionId);
    if (existingIdx !== -1) {
        appState.roleplayHistory[existingIdx] = entry;
    } else {
        appState.roleplayHistory.unshift(entry);
    }

    if (appState.roleplayHistory.length > 25) {
        appState.roleplayHistory = appState.roleplayHistory.slice(0, 25);
    }

    if (typeof saveRoleplayHistoryToStorage === 'function') {
        saveRoleplayHistoryToStorage();
    }
    renderRoleplayHistoryDrawerUI();
}

/**
 * Mục 5.11: Hiển thị danh sách Lịch sử các buổi luyện tập (ngày, nhân vật, điểm, nhiệm vụ, nút Xem lại / Xoá)
 */
function renderRoleplayHistoryDrawerUI() {
    const drawer = document.getElementById('roleplayHistoryDrawer');
    const countBadge = document.getElementById('roleplayHistoryCountBadge');
    const listContainer = document.getElementById('roleplayHistoryListContainer');
    const clearAllBtn = document.getElementById('btnClearAllRoleplayHistory');

    const histList = Array.isArray(appState.roleplayHistory) ? appState.roleplayHistory : [];
    if (countBadge) {
        countBadge.textContent = `Lịch sử (${histList.length})`;
    }
    if (!drawer || !listContainer) return;

    drawer.classList.toggle('hidden', !roleplayUIState.showHistoryDrawer);
    if (clearAllBtn) {
        clearAllBtn.classList.toggle('hidden', histList.length === 0);
    }

    if (histList.length === 0) {
        listContainer.innerHTML = `
            <p class="text-xs text-stone-400 dark:text-stone-500 text-center py-3">
                Chưa có buổi luyện tập nào trong lịch sử. Sau khi bạn bấm <strong>"🏆 Chấm điểm"</strong>, kết quả buổi tập sẽ tự động lưu tại đây để xem lại bất cứ lúc nào.
            </p>
        `;
        return;
    }

    listContainer.innerHTML = histList.map((item, idx) => {
        const dateStr = new Date(item.createdAt || Date.now()).toLocaleString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        const diffLabel = ROLEPLAY_DIFFICULTY_CONFIG[item.difficulty]?.label || '⚖️ Thường';
        const hasMission = item.missionId && item.missionId !== 'none';
        const missionTag = hasMission
            ? item.missionCompleted
                ? `<span class="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold">${escapeHtml(item.missionLabel || 'Nhiệm vụ')} ✅</span>`
                : `<span class="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-bold">${escapeHtml(item.missionLabel || 'Nhiệm vụ')} ⚠️</span>`
            : `<span class="px-1.5 py-0.5 rounded bg-warm-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">🎯 Tự do</span>`;

        return `
            <div class="p-3 rounded-xl bg-white dark:bg-stone-800 border border-warm-200 dark:border-stone-700 flex items-start justify-between gap-2.5 text-xs shadow-2xs">
                <div class="space-y-1 min-w-0 flex-1">
                    <div class="flex flex-wrap items-center gap-1.5 text-[10px] text-stone-500 dark:text-stone-400 font-semibold">
                        <span class="font-extrabold text-stone-800 dark:text-stone-100 text-xs">👧 ${escapeHtml(item.characterName || 'Bạn nữ')} (${item.characterAge || 20}t)</span>
                        <span>• ${escapeHtml(diffLabel)}</span>
                        <span>• ${escapeHtml(dateStr)}</span>
                    </div>
                    <div class="flex flex-wrap items-center gap-1.5 text-[10px]">
                        <span class="px-2 py-0.5 rounded-full bg-gradient-to-r from-warm-500 to-amber-500 text-white font-extrabold">
                            🏆 ${escapeHtml(item.score ?? 8)}/10
                        </span>
                        ${missionTag}
                        <span class="text-stone-500 dark:text-stone-400">💓 Hứng thú cuối: ${item.finalInterest ?? 55}/100</span>
                    </div>
                    <p class="text-[11px] text-stone-600 dark:text-stone-300 truncate">
                        ${escapeHtml(item.summary || item.situation || '')}
                    </p>
                </div>
                <div class="flex items-center gap-1 flex-shrink-0">
                    <button type="button" data-load-rp-hist="${idx}" class="px-2.5 py-1.5 rounded-lg bg-warm-500 hover:bg-warm-600 text-white font-bold text-[11px] transition">
                        👁️ Xem lại
                    </button>
                    <button type="button" data-del-rp-hist="${idx}" class="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-300 font-bold text-xs transition" title="Xoá buổi tập này">
                        ✕
                    </button>
                </div>
            </div>
        `;
    }).join('');

    listContainer.querySelectorAll('button[data-load-rp-hist]').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.getAttribute('data-load-rp-hist'), 10);
            handleLoadRoleplayHistorySession(idx);
        });
    });

    listContainer.querySelectorAll('button[data-del-rp-hist]').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.getAttribute('data-del-rp-hist'), 10);
            if (!Number.isNaN(idx) && appState.roleplayHistory[idx]) {
                appState.roleplayHistory.splice(idx, 1);
                if (typeof saveRoleplayHistoryToStorage === 'function') {
                    saveRoleplayHistoryToStorage();
                }
                renderRoleplayHistoryDrawerUI();
                showToast('Đã xoá buổi luyện tập khỏi lịch sử', '🗑️');
            }
        });
    });
}

/**
 * Mục 5.11: Nạp lại một buổi luyện tập từ Lịch sử để xem lại toàn bộ đoạn chat, nhãn từng tin, biểu đồ SVG & bảng điểm
 */
function handleLoadRoleplayHistorySession(histIdx) {
    const item = appState.roleplayHistory?.[histIdx];
    if (!item) return;

    const rp = appState.roleplay;
    rp.sessionId = item.id;
    rp.personaId = item.personaId || 'extrovert_fun';
    rp.persona = item.persona || '';
    rp.characterCard = item.characterCard ? JSON.parse(JSON.stringify(item.characterCard)) : ROLEPLAY_PRESET_PERSONAS[0].card;
    rp.situationId = item.situationId || 'ig_story_cafe';
    rp.situation = item.situation || '';
    rp.difficulty = item.difficulty || 'normal';
    rp.missionId = item.missionId || 'none';
    rp.missionCompleted = Boolean(item.missionCompleted);
    rp.hintsUsed = item.hintsUsed || 0;
    rp.askedBackCount = item.askedBackCount || 0;
    rp.acceptedHangout = Boolean(item.acceptedHangout);
    rp.interest = typeof item.finalInterest === 'number' ? item.finalInterest : 55;
    rp.mood = item.finalMood || 'bình thường';
    rp.interestCurve = Array.isArray(item.interestCurve) && item.interestCurve.length > 0 ? [...item.interestCurve] : [55];
    rp.history = Array.isArray(item.history) ? JSON.parse(JSON.stringify(item.history)) : [];
    rp.lastEvaluation = item.evaluation ? JSON.parse(JSON.stringify(item.evaluation)) : null;
    rp.isFinished = true;
    rp.isEndedByLowInterest = rp.interest <= 15;

    roleplayUIState.revealInnerThoughts = true;
    roleplayUIState.expandedUserTurnMap = {};
    roleplayUIState.showHistoryDrawer = false;

    saveRoleplayState();
    syncRoleplayUIFromState();
    showToast(`Đã mở lại buổi luyện tập với ${item.characterName} (${item.score}/10đ)!`, '📂');
}

/**
 * Mục 5.1: Hiển thị 8 nút tính cách mẫu + danh sách nhân vật tự tạo + nút "✨ Tự tạo nhân vật"
 */
function renderRoleplayPersonaChipsUI() {
    const container = document.getElementById('personaGroupB');
    const builderBox = document.getElementById('customPersonaBuilderBox');
    if (!container) return;

    const rp = appState.roleplay;
    const customList = Array.isArray(rp.customCharacters) ? rp.customCharacters : [];

    let html = ROLEPLAY_PRESET_PERSONAS.map(p => {
        const isSelected = rp.personaId === p.id && !roleplayUIState.showCustomPersonaForm;
        const btnClass = isSelected
            ? 'chip-btn text-xs py-1.5 px-2.5 rounded-xl border transition bg-warm-500 text-white border-warm-500 font-bold shadow-xs'
            : 'chip-btn text-xs py-1.5 px-2.5 rounded-xl border transition bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-warm-200 dark:border-stone-700 hover:bg-warm-100 dark:hover:bg-stone-700';
        return `<button type="button" data-persona-id="${p.id}" class="${btnClass}">${escapeHtml(p.label)}</button>`;
    }).join('');

    customList.forEach((cust, idx) => {
        const custId = `custom_saved_${idx}`;
        const isSelected = rp.personaId === custId && !roleplayUIState.showCustomPersonaForm;
        const btnClass = isSelected
            ? 'chip-btn text-xs py-1.5 px-2.5 rounded-xl border transition bg-warm-500 text-white border-warm-500 font-bold shadow-xs'
            : 'chip-btn text-xs py-1.5 px-2.5 rounded-xl border transition bg-amber-50 dark:bg-stone-800 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-stone-600 hover:bg-amber-100';
        html += `<button type="button" data-custom-char-idx="${idx}" class="${btnClass}">🌟 ${escapeHtml(cust.name)} (${cust.age}t)</button>`;
    });

    const isCustomOpen = roleplayUIState.showCustomPersonaForm || rp.personaId === 'custom';
    const customBtnClass = isCustomOpen
        ? 'chip-btn text-xs py-1.5 px-2.5 rounded-xl border transition bg-amber-500 text-white border-amber-500 font-bold shadow-xs'
        : 'chip-btn text-xs py-1.5 px-2.5 rounded-xl border border-dashed transition bg-amber-50/80 dark:bg-stone-800 text-amber-800 dark:text-amber-300 border-amber-400 dark:border-amber-700 hover:bg-amber-100 font-bold';
    html += `<button type="button" id="btnOpenCustomPersonaBuilder" class="${customBtnClass}">✨ Tự tạo nhân vật</button>`;

    container.innerHTML = html;

    if (builderBox) {
        builderBox.classList.toggle('hidden', !roleplayUIState.showCustomPersonaForm);
    }

    container.querySelectorAll('button[data-persona-id]').forEach(btn => {
        btn.addEventListener('click', () => {
            const pid = btn.getAttribute('data-persona-id');
            const found = ROLEPLAY_PRESET_PERSONAS.find(item => item.id === pid);
            if (!found) return;

            roleplayUIState.showCustomPersonaForm = false;
            rp.personaId = found.id;
            rp.persona = found.persona;
            rp.characterCard = { ...found.card, _sourcePersona: found.persona };
            resetRoleplaySession(false);
            showToast(`Đã chọn nhân vật: ${found.card.name} (${found.card.age} tuổi)`, '👧');
        });
    });

    container.querySelectorAll('button[data-custom-char-idx]').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.getAttribute('data-custom-char-idx'), 10);
            const cust = customList[idx];
            if (!cust) return;

            roleplayUIState.showCustomPersonaForm = false;
            rp.personaId = `custom_saved_${idx}`;
            rp.persona = `${cust.name} (${cust.age} tuổi) - ${cust.summary}. Sở thích: ${cust.interests}`;
            rp.characterCard = { ...cust, _sourcePersona: rp.persona };
            resetRoleplaySession(false);
            showToast(`Đã chọn nhân vật tự tạo: ${cust.name} (${cust.age} tuổi)`, '🌟');
        });
    });

    document.getElementById('btnOpenCustomPersonaBuilder')?.addEventListener('click', () => {
        roleplayUIState.showCustomPersonaForm = !roleplayUIState.showCustomPersonaForm;
        renderRoleplayPersonaChipsUI();
        if (roleplayUIState.showCustomPersonaForm) {
            const input = document.getElementById('customPersonaDescInput');
            if (input) setTimeout(() => input.focus(), 50);
        }
    });
}

/**
 * Mục 5.1: Gọi Gemini dựng Thẻ nhân vật từ mô tả của người dùng (luôn >= 18 tuổi)
 */
async function handleGenerateCustomCharacterCard() {
    const inputEl = document.getElementById('customPersonaDescInput');
    const rawDesc = inputEl ? inputEl.value.trim() : '';

    if (!rawDesc) {
        showToast('Hãy mô tả vài nét về nhân vật bạn muốn tạo trước nhé!', '✍️');
        if (inputEl) inputEl.focus();
        return;
    }

    const btn = document.getElementById('btnGenerateCharCard');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<span class="animate-spin">⏳</span><span>AI đang dựng thẻ nhân vật...</span>`;
    }

    const userPrompt = `Mô tả nhân vật từ người dùng: "${rawDesc}".
Hãy dựng Thẻ nhân vật bạn nữ trưởng thành (age bắt buộc >= 18) nhất quán, tự nhiên theo đúng Schema.`;

    try {
        const { parsed } = await callGeminiWithSchemaRetry(
            SYSTEM_PROMPT_MODE_B_CHAR_GEN,
            [],
            userPrompt,
            SCHEMA_ROLEPLAY_CHAR_CARD,
            validateRoleplayCharCardJson,
            0.75
        );

        const safeCard = {
            name: String(parsed.name || 'Minh Châu').trim(),
            age: Math.max(18, Math.round(Number(parsed.age) || 20)),
            occupation: String(parsed.occupation || 'Sinh viên đại học').trim(),
            interests: String(parsed.interests || '').trim(),
            messagingStyle: String(parsed.messagingStyle || '').trim(),
            likesDislikes: String(parsed.likesDislikes || '').trim(),
            summary: String(parsed.summary || rawDesc).trim()
        };

        const personaStr = `${safeCard.name} (${safeCard.age} tuổi) - ${safeCard.summary}. Sở thích: ${safeCard.interests}`;
        safeCard._sourcePersona = personaStr;

        if (!Array.isArray(appState.roleplay.customCharacters)) {
            appState.roleplay.customCharacters = [];
        }
        appState.roleplay.customCharacters.unshift(safeCard);
        if (appState.roleplay.customCharacters.length > 6) {
            appState.roleplay.customCharacters = appState.roleplay.customCharacters.slice(0, 6);
        }

        appState.roleplay.personaId = 'custom_saved_0';
        appState.roleplay.persona = personaStr;
        appState.roleplay.characterCard = safeCard;

        roleplayUIState.showCustomPersonaForm = false;
        resetRoleplaySession(false);
        showToast(`Đã dựng thẻ nhân vật "${safeCard.name} (${safeCard.age} tuổi)" thành công!`, '🪪');
    } catch (err) {
        showToast(`Lỗi khi tạo thẻ nhân vật: ${err.message}`, '⚠️');
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = `<span>🪄</span><span>AI dựng Thẻ nhân vật</span>`;
        }
    }
}

/**
 * Mục 5.1: Hiển thị Thẻ nhân vật (Character Card) ngay trên giao diện và cho phép chỉnh sửa nhanh
 */
function renderCharacterCardSummaryUI() {
    const box = document.getElementById('roleplayCharacterCardBox');
    if (!box) return;

    const c = appState.roleplay.characterCard || ROLEPLAY_PRESET_PERSONAS[0].card;
    const safeAge = Math.max(18, parseInt(c.age, 10) || 20);

    if (roleplayUIState.showEditCardForm) {
        box.innerHTML = `
            <div class="p-3 rounded-xl bg-warm-50 dark:bg-stone-900 border border-warm-300 dark:border-stone-700 space-y-2 text-xs animate-pop">
                <div class="flex items-center justify-between">
                    <span class="font-extrabold text-warm-600 dark:text-amber-400">✏️ Chỉnh sửa Thẻ nhân vật (Giữ nhất quán mọi lượt):</span>
                    <button type="button" id="btnCancelEditCharCard" class="text-[11px] text-stone-400 hover:text-stone-600">Huỷ</button>
                </div>
                <div class="grid grid-cols-3 gap-2">
                    <div class="col-span-2">
                        <label class="text-[10px] font-bold text-stone-500">Tên nhân vật:</label>
                        <input id="editCardName" type="text" value="${escapeHtml(c.name)}" class="w-full rounded-lg bg-white dark:bg-stone-800 border border-warm-200 dark:border-stone-700 px-2.5 py-1.5 text-xs">
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-stone-500">Tuổi (>= 18):</label>
                        <input id="editCardAge" type="number" min="18" max="60" value="${safeAge}" class="w-full rounded-lg bg-white dark:bg-stone-800 border border-warm-200 dark:border-stone-700 px-2.5 py-1.5 text-xs">
                    </div>
                </div>
                <div>
                    <label class="text-[10px] font-bold text-stone-500">Học tập / Công việc:</label>
                    <input id="editCardOccupation" type="text" value="${escapeHtml(c.occupation)}" class="w-full rounded-lg bg-white dark:bg-stone-800 border border-warm-200 dark:border-stone-700 px-2.5 py-1.5 text-xs">
                </div>
                <div>
                    <label class="text-[10px] font-bold text-stone-500">Sở thích:</label>
                    <input id="editCardInterests" type="text" value="${escapeHtml(c.interests)}" class="w-full rounded-lg bg-white dark:bg-stone-800 border border-warm-200 dark:border-stone-700 px-2.5 py-1.5 text-xs">
                </div>
                <div>
                    <label class="text-[10px] font-bold text-stone-500">Cách nhắn tin:</label>
                    <input id="editCardStyle" type="text" value="${escapeHtml(c.messagingStyle)}" class="w-full rounded-lg bg-white dark:bg-stone-800 border border-warm-200 dark:border-stone-700 px-2.5 py-1.5 text-xs">
                </div>
                <div>
                    <label class="text-[10px] font-bold text-stone-500">Điều thích & không thích:</label>
                    <input id="editCardLikes" type="text" value="${escapeHtml(c.likesDislikes)}" class="w-full rounded-lg bg-white dark:bg-stone-800 border border-warm-200 dark:border-stone-700 px-2.5 py-1.5 text-xs">
                </div>
                <div class="flex justify-end pt-1">
                    <button type="button" id="btnSaveEditedCharCard" class="px-3.5 py-1.5 rounded-xl bg-warm-500 hover:bg-warm-600 text-white font-bold text-xs shadow-xs transition">
                        💾 Lưu Thẻ nhân vật
                    </button>
                </div>
            </div>
        `;

        document.getElementById('btnCancelEditCharCard')?.addEventListener('click', () => {
            roleplayUIState.showEditCardForm = false;
            renderCharacterCardSummaryUI();
        });

        document.getElementById('btnSaveEditedCharCard')?.addEventListener('click', () => {
            const newName = document.getElementById('editCardName')?.value.trim() || c.name;
            const newAge = Math.max(18, parseInt(document.getElementById('editCardAge')?.value, 10) || 20);
            const newOcc = document.getElementById('editCardOccupation')?.value.trim() || c.occupation;
            const newInt = document.getElementById('editCardInterests')?.value.trim() || c.interests;
            const newStyle = document.getElementById('editCardStyle')?.value.trim() || c.messagingStyle;
            const newLikes = document.getElementById('editCardLikes')?.value.trim() || c.likesDislikes;

            appState.roleplay.characterCard = {
                ...c,
                name: newName,
                age: newAge,
                occupation: newOcc,
                interests: newInt,
                messagingStyle: newStyle,
                likesDislikes: newLikes,
                _sourcePersona: appState.roleplay.persona
            };
            roleplayUIState.showEditCardForm = false;
            saveRoleplayState();
            renderCharacterCardSummaryUI();
            updateRoleplayInterestAndMoodUI();
            showToast(`Đã cập nhật thẻ nhân vật "${newName} (${newAge}t)"!`, '✅');
        });
        return;
    }

    box.innerHTML = `
        <div class="p-3 rounded-xl bg-warm-50/90 dark:bg-stone-900/70 border border-warm-200/90 dark:border-stone-700 text-xs space-y-1.5">
            <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-1.5">
                    <span class="text-sm">🪪</span>
                    <span class="font-extrabold text-stone-800 dark:text-stone-100">
                        Thẻ nhân vật: ${escapeHtml(c.name)} (${safeAge} tuổi)
                    </span>
                    <span class="text-[10px] px-2 py-0.5 rounded-full bg-warm-200/70 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold">
                        Nhất quán mọi lượt
                    </span>
                </div>
                <button type="button" id="btnEditCharCardToggle" class="text-[11px] font-bold text-warm-600 dark:text-amber-400 hover:underline flex-shrink-0">
                    ✏️ Sửa thẻ
                </button>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-stone-600 dark:text-stone-300 leading-snug">
                <div><strong>🎓 Học/Làm:</strong> ${escapeHtml(c.occupation)}</div>
                <div><strong>💖 Sở thích:</strong> ${escapeHtml(c.interests)}</div>
                <div class="sm:col-span-2"><strong>💬 Cách nhắn:</strong> ${escapeHtml(c.messagingStyle)}</div>
                <div class="sm:col-span-2"><strong>⚖️ Thích / Không thích:</strong> ${escapeHtml(c.likesDislikes)}</div>
            </div>
        </div>
    `;

    document.getElementById('btnEditCharCardToggle')?.addEventListener('click', () => {
        roleplayUIState.showEditCardForm = true;
        renderCharacterCardSummaryUI();
    });
}

/**
 * Mục 5.2: Hiển thị 10 nút tình huống + nút "✨ Tự tạo tình huống"
 */
function renderRoleplaySituationChipsUI() {
    const container = document.getElementById('situationGroupB');
    const builderBox = document.getElementById('customSituationBuilderBox');
    const banner = document.getElementById('activeSituationBanner');
    if (!container) return;

    const rp = appState.roleplay;
    const matchedSit = ROLEPLAY_PRESET_SITUATIONS.find(s => s.text === rp.situation || s.id === rp.situationId);

    let html = ROLEPLAY_PRESET_SITUATIONS.map(s => {
        const isSelected = matchedSit && matchedSit.id === s.id && !roleplayUIState.showCustomSituationForm;
        const btnClass = isSelected
            ? 'chip-btn text-xs py-1.5 px-2.5 rounded-xl border transition bg-warm-500 text-white border-warm-500 font-bold shadow-xs'
            : 'chip-btn text-xs py-1.5 px-2.5 rounded-xl border transition bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-warm-200 dark:border-stone-700 hover:bg-warm-100 dark:hover:bg-stone-700';
        return `<button type="button" data-sit-id="${s.id}" class="${btnClass}">${escapeHtml(s.label)}</button>`;
    }).join('');

    const isCustomSit = !matchedSit || roleplayUIState.showCustomSituationForm;
    const customBtnClass = isCustomSit
        ? 'chip-btn text-xs py-1.5 px-2.5 rounded-xl border transition bg-amber-500 text-white border-amber-500 font-bold shadow-xs'
        : 'chip-btn text-xs py-1.5 px-2.5 rounded-xl border border-dashed transition bg-amber-50/80 dark:bg-stone-800 text-amber-800 dark:text-amber-300 border-amber-400 dark:border-amber-700 hover:bg-amber-100 font-bold';
    html += `<button type="button" id="btnOpenCustomSituationBuilder" class="${customBtnClass}">✨ Tự tạo tình huống</button>`;

    container.innerHTML = html;

    if (builderBox) {
        builderBox.classList.toggle('hidden', !roleplayUIState.showCustomSituationForm);
    }

    if (banner) {
        banner.innerHTML = `📌 <strong>Bối cảnh hiện tại:</strong> ${escapeHtml(rp.situation)}`;
    }

    container.querySelectorAll('button[data-sit-id]').forEach(btn => {
        btn.addEventListener('click', () => {
            const sid = btn.getAttribute('data-sit-id');
            const found = ROLEPLAY_PRESET_SITUATIONS.find(item => item.id === sid);
            if (!found) return;

            roleplayUIState.showCustomSituationForm = false;
            rp.situationId = found.id;
            rp.situation = found.text;
            resetRoleplaySession(false);
            showToast(`Đã chọn tình huống: ${found.label}`, '📌');
        });
    });

    document.getElementById('btnOpenCustomSituationBuilder')?.addEventListener('click', () => {
        roleplayUIState.showCustomSituationForm = !roleplayUIState.showCustomSituationForm;
        renderRoleplaySituationChipsUI();
        if (roleplayUIState.showCustomSituationForm) {
            const inp = document.getElementById('customSituationInput');
            if (inp) {
                if (!matchedSit) inp.value = rp.situation;
                setTimeout(() => inp.focus(), 50);
            }
        }
    });
}

/**
 * Mục 5.2: Áp dụng tình huống do người dùng tự nhập
 */
function handleApplyCustomSituation() {
    const inp = document.getElementById('customSituationInput');
    const val = inp ? inp.value.trim() : '';
    if (!val) {
        showToast('Hãy nhập mô tả tình huống bạn muốn luyện tập nhé!', '✍️');
        if (inp) inp.focus();
        return;
    }

    appState.roleplay.situationId = 'custom';
    appState.roleplay.situation = val;
    roleplayUIState.showCustomSituationForm = false;
    resetRoleplaySession(false);
    showToast('Đã áp dụng tình huống tự tạo!', '✅');
}

/**
 * Mục 5.3: Hiển thị trạng thái 3 nút Độ khó (Dễ / Thường / Khó)
 */
function renderRoleplayDifficultyUI() {
    const rp = appState.roleplay;
    const diffKey = ['easy', 'normal', 'hard'].includes(rp.difficulty) ? rp.difficulty : 'normal';
    const diffObj = ROLEPLAY_DIFFICULTY_CONFIG[diffKey];

    document.querySelectorAll('#difficultyGroupB .diff-btn').forEach(btn => {
        const isSelected = btn.getAttribute('data-diff') === diffKey;
        btn.className = isSelected
            ? 'diff-btn py-2 px-2 rounded-xl border text-xs transition bg-warm-500 text-white border-warm-500 font-extrabold shadow-xs'
            : 'diff-btn py-2 px-2 rounded-xl border text-xs transition bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-warm-200 dark:border-stone-700 hover:bg-warm-100 font-semibold';
    });

    const hintEl = document.getElementById('difficultyHintText');
    if (hintEl && diffObj) {
        hintEl.textContent = `💡 ${diffObj.shortHint}`;
    }
}

/**
 * Mục 5.8: Hiển thị các nút chọn Nhiệm vụ buổi tập & Thanh tiến độ hoàn thành
 */
function renderRoleplayMissionUI() {
    const groupEl = document.getElementById('missionGroupB');
    const progBox = document.getElementById('missionProgressBox');
    const statusBadge = document.getElementById('missionStatusBadge');
    if (!groupEl || !progBox) return;

    const rp = appState.roleplay;
    const activeMissionId = ROLEPLAY_MISSIONS.some(m => m.id === rp.missionId) ? rp.missionId : 'none';
    const missionObj = ROLEPLAY_MISSIONS.find(m => m.id === activeMissionId) || ROLEPLAY_MISSIONS[0];
    const progress = checkRoleplayMissionProgress(false);

    groupEl.innerHTML = ROLEPLAY_MISSIONS.map(m => {
        const isSelected = m.id === activeMissionId;
        const btnClass = isSelected
            ? 'chip-btn text-xs py-1.5 px-2.5 rounded-xl border transition bg-warm-500 text-white border-warm-500 font-bold shadow-xs'
            : 'chip-btn text-xs py-1.5 px-2.5 rounded-xl border transition bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-warm-200 dark:border-stone-700 hover:bg-warm-100 dark:hover:bg-stone-700';
        return `<button type="button" data-mission-id="${m.id}" class="${btnClass}">${escapeHtml(m.label)}</button>`;
    }).join('');

    if (statusBadge) {
        if (activeMissionId === 'none') {
            statusBadge.textContent = 'Chế độ tự do';
            statusBadge.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-warm-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300';
        } else if (progress.isCompleted) {
            statusBadge.textContent = '✅ Đã hoàn thành nhiệm vụ!';
            statusBadge.className = 'text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/90 text-emerald-800 dark:text-emerald-300 border border-emerald-300';
        } else {
            statusBadge.textContent = '⏳ Đang thực hiện';
            statusBadge.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300/60';
        }
    }

    if (activeMissionId === 'none') {
        progBox.innerHTML = `
            <div class="text-stone-600 dark:text-stone-300 flex items-center justify-between">
                <span>${escapeHtml(missionObj.desc)}</span>
                <span class="font-mono text-[10px] text-stone-400">${escapeHtml(progress.progressText)}</span>
            </div>
        `;
    } else {
        const barColor = progress.isCompleted ? 'bg-emerald-500' : 'bg-warm-500';
        progBox.innerHTML = `
            <div class="flex items-center justify-between gap-2">
                <span class="font-extrabold text-stone-800 dark:text-stone-100">${escapeHtml(missionObj.title)}</span>
                <span class="font-mono text-[10px] font-bold ${progress.isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-warm-600 dark:text-amber-400'}">
                    ${progress.isCompleted ? '🎉 HOÀN THÀNH' : `${progress.progressPct}%`}
                </span>
            </div>
            <p class="text-stone-500 dark:text-stone-400">${escapeHtml(missionObj.desc)}</p>
            <div class="w-full h-1.5 rounded-full bg-warm-200/70 dark:bg-stone-700 overflow-hidden">
                <div class="h-full rounded-full ${barColor} transition-all duration-300" style="width: ${progress.progressPct}%"></div>
            </div>
            <div class="text-[10px] font-semibold ${progress.isCompleted ? 'text-emerald-700 dark:text-emerald-300' : 'text-stone-600 dark:text-stone-300'}">
                📊 ${escapeHtml(progress.progressText)}
            </div>
        `;
    }

    groupEl.querySelectorAll('button[data-mission-id]').forEach(btn => {
        btn.addEventListener('click', () => {
            const mid = btn.getAttribute('data-mission-id');
            if (!mid) return;
            appState.roleplay.missionId = mid;
            if (mid === 'revive_cold') {
                appState.roleplay.situationId = 'text_after_silence';
                appState.roleplay.situation = 'Cuộc trò chuyện đang bị nguội dần (cô ấy trả lời hơi ngắn và đang hơi chán), bạn nam nhắn tin để khơi lại cảm xúc tự nhiên';
            }
            resetRoleplaySession(false);
            const found = ROLEPLAY_MISSIONS.find(m => m.id === mid);
            showToast(`Đã chọn: ${found ? found.title : mid}`, '🎯');
        });
    });
}

/**
 * Mục 5.6: Hiển thị hộp "💡 Gợi ý hướng đi tiếp" (không viết sẵn cả câu) và cập nhật số lần dùng gợi ý
 */
function renderRoleplayHintBoxUI() {
    const hintBox = document.getElementById('roleplayHintBox');
    const hintBtnLabel = document.getElementById('roleplayHintBtnLabel');
    const rp = appState.roleplay;

    if (hintBtnLabel) {
        const count = rp.hintsUsed || 0;
        hintBtnLabel.textContent = count > 0 ? `Gợi ý (${count})` : 'Gợi ý';
    }

    if (!hintBox) return;
    const h = rp.lastHint;
    if (!h || !h.direction) {
        hintBox.classList.add('hidden');
        hintBox.innerHTML = '';
        return;
    }

    const penaltyPts = ((rp.hintsUsed || 1) * 0.5).toFixed(1);
    hintBox.classList.remove('hidden');
    hintBox.innerHTML = `
        <div class="flex items-start justify-between gap-2">
            <div class="space-y-1 flex-1">
                <div class="flex flex-wrap items-center gap-1.5">
                    <span class="font-extrabold text-amber-800 dark:text-amber-300">💡 Gợi ý hướng đi tiếp (Không viết sẵn câu):</span>
                    <span class="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-200/80 dark:bg-amber-950 text-amber-900 dark:text-amber-200">
                        Đã dùng ${rp.hintsUsed} lần (-${penaltyPts}đ cuối buổi)
                    </span>
                </div>
                <p class="text-stone-800 dark:text-stone-100 leading-snug">
                    🧭 <strong>Hướng triển khai:</strong> ${escapeHtml(h.direction)}
                </p>
                <p class="text-stone-600 dark:text-stone-300 text-[11px] leading-snug">
                    💭 <strong>Ngầm ý của cô ấy:</strong> ${escapeHtml(h.herSubtext)}
                </p>
                <p class="text-red-700 dark:text-red-300 text-[11px] leading-snug">
                    🚫 <strong>Nên tránh:</strong> ${escapeHtml(h.whatToAvoid)}
                </p>
            </div>
            <button type="button" id="btnCloseRoleplayHint" class="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-xs font-bold px-1">
                ✕
            </button>
        </div>
    `;

    document.getElementById('btnCloseRoleplayHint')?.addEventListener('click', () => {
        appState.roleplay.lastHint = null;
        saveRoleplayState();
        renderRoleplayHintBoxUI();
    });
}

/**
 * Mục 5.6: Xử lý khi người dùng bấm nút "💡 Gợi ý"
 */
async function handleRequestRoleplayHint() {
    const rp = appState.roleplay;
    if (rp.isFinished || rp.isEndedByLowInterest) {
        showToast('Buổi tập đã kết thúc. Hãy tạo buổi mới hoặc bấm "Quay lại tin này" để tiếp tục nhé!', 'ℹ️');
        return;
    }

    const btn = document.getElementById('btnRoleplayHint');
    const oldHtml = btn ? btn.innerHTML : '';
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<span class="animate-spin">⏳</span><span>Đang soi...</span>`;
    }

    const c = rp.characterCard || ROLEPLAY_PRESET_PERSONAS[0].card;
    const missionObj = ROLEPLAY_MISSIONS.find(m => m.id === rp.missionId) || ROLEPLAY_MISSIONS[0];
    const recentTurns = (rp.history || [])
        .filter(t => !t.isSystemTrigger)
        .slice(-8)
        .map(t => `${t.role === 'user' ? 'Bạn nam' : c.name}: ${t.parts?.[0]?.text || ''}`)
        .join('\n');

    const promptInput = `Thông tin buổi luyện tập hiện tại:
${formatCharacterCardForPrompt(c)}
- Tình huống: ${rp.situation}
- Nhiệm vụ đang thực hiện: ${missionObj.title} (${missionObj.desc})
- Độ hứng thú hiện tại của ${c.name}: ${rp.interest}/100 (Tâm trạng: ${rp.mood})
- Đoạn hội thoại gần nhất:
${recentTurns || '(Chưa có tin nhắn nào — Bạn nam chuẩn bị nhắn câu mở đầu)'}

Hãy gợi ý HƯỚNG ĐI TIẾP THEO cho bạn nam (tuyệt đối KHÔNG viết sẵn câu trả lời hoàn chỉnh trong ngoặc kép) theo đúng SCHEMA_ROLEPLAY_HINT.`;

    try {
        const { parsed } = await callGeminiWithSchemaRetry(
            SYSTEM_PROMPT_MODE_B_HINT,
            [],
            promptInput,
            SCHEMA_ROLEPLAY_HINT,
            validateRoleplayHintJson,
            0.65
        );

        rp.hintsUsed = (rp.hintsUsed || 0) + 1;
        rp.lastHint = parsed;
        saveRoleplayState();
        renderRoleplayHintBoxUI();
        showToast(`Đã mở gợi ý #${rp.hintsUsed} (Trừ 0.5 điểm ở cuối buổi)`, '💡');
    } catch (err) {
        showToast(`Không thể lấy gợi ý: ${err.message}`, '⚠️');
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = oldHtml;
            renderRoleplayHintBoxUI();
        }
    }
}

/**
 * Mục 5.7 & 5.10: Nút "↩️ Quay lại tin này và nhắn khác" (hoặc "Thử viết lại từ chính tin này")
 * @param {number} historyIdx - Vị trí trong mảng `appState.roleplay.history`
 * @param {string} [prefillOverride] - Văn bản gợi ý muốn điền sẵn vào ô nhập (nếu có)
 */
function handleRewindRoleplayToTurn(historyIdx, prefillOverride = null) {
    if (roleplayUIState.isSimulatingTyping) {
        showToast('Đợi nhân vật gõ xong tin nhắn hiện tại rồi quay lại nhé!', '⏳');
        return;
    }

    const rp = appState.roleplay;
    if (!Array.isArray(rp.history) || historyIdx < 0 || historyIdx >= rp.history.length) return;

    const targetTurn = rp.history[historyIdx];
    if (!targetTurn || targetTurn.role !== 'user' || targetTurn.isSystemTrigger) return;

    const oldUserText = targetTurn.parts?.[0]?.text || '';
    const textToFill = prefillOverride !== null && prefillOverride !== undefined
        ? String(prefillOverride).trim()
        : oldUserText;

    // Cắt lịch sử tới ngay trước lượt user này
    rp.history = rp.history.slice(0, historyIdx);

    // Tính toán lại toàn bộ chỉ số từ các lượt còn lại
    const { initialInterest, initialMood } = getInitialInterestAndMood(rp.difficulty, rp.missionId);
    let currentInt = initialInterest;
    let currentMood = initialMood;
    const curve = [initialInterest];
    let askedBackTotal = 0;
    let hangoutAccepted = false;

    rp.history.forEach(turn => {
        if (turn.role === 'model' && turn.turnMeta) {
            if (typeof turn.turnMeta.interest === 'number') {
                currentInt = turn.turnMeta.interest;
                curve.push(currentInt);
            }
            if (turn.turnMeta.mood) {
                currentMood = turn.turnMeta.mood;
            }
            if (turn.turnMeta.askedBack) {
                askedBackTotal += 1;
            }
            if (turn.turnMeta.acceptedHangout) {
                hangoutAccepted = true;
            }
        }
    });

    rp.interest = currentInt;
    rp.mood = currentMood;
    rp.interestCurve = curve;
    rp.askedBackCount = askedBackTotal;
    rp.acceptedHangout = hangoutAccepted;
    rp.isEndedByLowInterest = false;
    rp.isFinished = false;
    rp.lastEvaluation = null;
    rp.lastHint = null;
    roleplayUIState.lastInterestDelta = 0;
    roleplayUIState.expandedUserTurnMap = {};

    rp.missionCompleted = false;
    checkRoleplayMissionProgress(false);

    saveRoleplayState();

    const evalArea = document.getElementById('roleplayEvaluationArea');
    if (evalArea) evalArea.innerHTML = '';

    syncRoleplayUIFromState();

    const chatCard = document.getElementById('roleplayChatCardContainer');
    if (chatCard) {
        chatCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    const inputEl = document.getElementById('roleplayUserMsg');
    if (inputEl) {
        inputEl.value = textToFill;
        setTimeout(() => {
            inputEl.focus();
            inputEl.setSelectionRange(textToFill.length, textToFill.length);
        }, 120);
    }

    showToast('Đã cắt lịch sử về đúng tin nhắn này! Hãy chỉnh lại và gửi thử nhé.', '↩️');
}

/**
 * Tìm đối tượng đánh giá từng lượt (`turnReview`) khớp với lượt thứ `userTurnNumber` (1-based) của người dùng (Mục 5.10)
 */
function getTurnReviewForUserTurn(userTurnNumber, historyIdx) {
    const rp = appState.roleplay;
    const evalData = rp.lastEvaluation;
    const reviews = Array.isArray(evalData?.turnReviews) ? evalData.turnReviews : [];

    const foundByIndex = reviews.find(r => Number(r.turnIndex) === userTurnNumber) || reviews[userTurnNumber - 1] || null;

    // Lấy suy nghĩ thầm thực tế từ lượt model ngay sau lượt user này (nếu có) để luôn đồng nhất 100%
    const nextTurn = rp.history?.[historyIdx + 1];
    const liveInnerThought = nextTurn && nextTurn.role === 'model' && nextTurn.turnMeta?.innerThought
        ? nextTurn.turnMeta.innerThought
        : '';

    if (!foundByIndex) return null;

    return {
        ...foundByIndex,
        herInnerThought: liveInnerThought || foundByIndex.herInnerThought || ''
    };
}

/**
 * Trả về icon và màu sắc cho từng trạng thái tâm trạng (`mood`) của nhân vật (Mục 5.4)
 */
function getMoodBadgeMeta(moodStr) {
    const m = String(moodStr || 'bình thường').toLowerCase().trim();
    if (m.includes('hào hứng')) {
        return {
            icon: '🤩',
            label: 'Hào hứng',
            cls: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300/70'
        };
    }
    if (m.includes('vui')) {
        return {
            icon: '😊',
            label: 'Vui vẻ',
            cls: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200'
        };
    }
    if (m.includes('ngại')) {
        return {
            icon: '😳',
            label: 'Đang ngại',
            cls: 'bg-pink-100 dark:bg-pink-950/70 text-pink-800 dark:text-pink-300 border-pink-300/70'
        };
    }
    if (m.includes('chán')) {
        return {
            icon: '😐',
            label: 'Hơi chán',
            cls: 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-300/70'
        };
    }
    if (m.includes('khó chịu')) {
        return {
            icon: '😒',
            label: 'Khó chịu',
            cls: 'bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-300 border-red-300/70'
        };
    }
    return {
        icon: '🙂',
        label: 'Bình thường',
        cls: 'bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border-sky-200'
    };
}

/**
 * Mục 5.4: Cập nhật Header nhân vật, Thanh "Độ hứng thú" (0-100) và Icon tâm trạng
 */
function updateRoleplayInterestAndMoodUI() {
    const rp = appState.roleplay;
    const c = rp.characterCard || ROLEPLAY_PRESET_PERSONAS[0].card;
    const safeAge = Math.max(18, parseInt(c.age, 10) || 20);
    const interest = Math.max(0, Math.min(100, Math.round(Number(rp.interest) ?? 55)));
    const diffObj = ROLEPLAY_DIFFICULTY_CONFIG[rp.difficulty] || ROLEPLAY_DIFFICULTY_CONFIG.normal;

    const headerTitle = document.getElementById('roleplayHeaderTitle');
    if (headerTitle) {
        headerTitle.textContent = `${c.name} (${safeAge}t) • ${c.summary || 'Bạn nữ'}`;
    }

    const turnCountEl = document.getElementById('roleplayTurnCount');
    if (turnCountEl) {
        const userTurns = (rp.history || []).filter(t => t.role === 'user' && !t.isSystemTrigger).length;
        const statusText = rp.isEndedByLowInterest
            ? 'Đã rời cuộc trò chuyện'
            : rp.isFinished
            ? 'Đã chấm điểm (Chế độ xem lại)'
            : 'Đang trực tuyến';
        turnCountEl.textContent = `${statusText} • ${userTurns} lượt • ${diffObj.label}`;
    }

    const interestValEl = document.getElementById('roleplayInterestValue');
    const interestBarEl = document.getElementById('roleplayInterestBar');
    const deltaEl = document.getElementById('roleplayInterestDelta');
    const moodBadgeEl = document.getElementById('roleplayMoodBadge');

    if (interestValEl) {
        interestValEl.textContent = `${interest}/100`;
    }

    if (interestBarEl) {
        interestBarEl.style.width = `${interest}%`;
        if (interest >= 65) {
            interestBarEl.className = 'h-full rounded-full bg-emerald-500 transition-all duration-500';
        } else if (interest >= 35) {
            interestBarEl.className = 'h-full rounded-full bg-amber-500 transition-all duration-500';
        } else {
            interestBarEl.className = 'h-full rounded-full bg-red-500 transition-all duration-500';
        }
    }

    if (deltaEl) {
        const d = roleplayUIState.lastInterestDelta;
        if (d !== 0 && rp.history.length > 0) {
            deltaEl.classList.remove('hidden');
            const sign = d > 0 ? `+${d}` : `${d}`;
            deltaEl.textContent = sign;
            deltaEl.className = d > 0
                ? 'text-[10px] font-mono font-extrabold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                : 'text-[10px] font-mono font-extrabold px-1.5 py-0.2 rounded-full bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300';
        } else {
            deltaEl.classList.add('hidden');
        }
    }

    if (moodBadgeEl) {
        const moodMeta = getMoodBadgeMeta(rp.mood);
        moodBadgeEl.className = `inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${moodMeta.cls}`;
        moodBadgeEl.innerHTML = `<span>${moodMeta.icon}</span><span>Tâm trạng: ${escapeHtml(moodMeta.label)}</span>`;
    }

    const hasModelTurns = (rp.history || []).some(t => t.role === 'model');
    const btnToggleThoughts = document.getElementById('btnToggleInnerThoughts');
    if (btnToggleThoughts) {
        btnToggleThoughts.classList.toggle('hidden', !hasModelTurns);
        const isShowing = rp.isFinished || roleplayUIState.revealInnerThoughts;
        btnToggleThoughts.textContent = isShowing ? '🙈 Ẩn suy nghĩ thầm' : '👁️ Xem lại suy nghĩ thầm';
    }
}

/**
 * Mục 5.4, 5.7 & 5.10: Hiển thị danh sách bong bóng tin nhắn
 * - Sau khi chấm điểm (Mục 5.10): gắn nhãn `👍 Tốt` / `⚠️ Cần sửa` ngay trên từng tin của tôi,
 *   bấm vào để xem `innerThought` của nhân vật, nhận xét và nút thử viết lại từ chính tin đó.
 */
function renderRoleplayMessagesUI() {
    const chatWin = document.getElementById('roleplayChatWindow');
    if (!chatWin) return;

    updateRoleplayInterestAndMoodUI();
    renderRoleplayMissionUI();
    renderRoleplayHintBoxUI();

    const rp = appState.roleplay;
    const history = Array.isArray(rp.history) ? rp.history : [];
    const c = rp.characterCard || ROLEPLAY_PRESET_PERSONAS[0].card;
    const canShowInnerThought = Boolean(rp.isFinished || roleplayUIState.revealInnerThoughts);

    if (history.length === 0) {
        chatWin.innerHTML = `
            <div class="text-center py-8 px-4 space-y-2.5">
                <div class="text-2xl">👋</div>
                <div class="text-xs font-bold text-stone-700 dark:text-stone-200">
                    Bắt đầu trò chuyện với ${escapeHtml(c.name)} (${Math.max(18, c.age || 20)} tuổi)
                </div>
                <p class="text-xs text-stone-500 dark:text-stone-400 max-w-xs mx-auto leading-relaxed">
                    Hãy gõ tin nhắn mở lời bên dưới theo đúng bối cảnh, bấm <strong>💡 Gợi ý</strong> nếu bí ý, hoặc để ${escapeHtml(c.name)} nhắn trước.
                </p>
                <button type="button" id="btnHerFirstMsgDynamic" class="mt-1 px-3.5 py-2 rounded-xl bg-warm-200/80 hover:bg-warm-300/80 dark:bg-stone-800 dark:hover:bg-stone-700 text-xs font-bold text-stone-700 dark:text-stone-200 transition shadow-2xs">
                    ✨ Để ${escapeHtml(c.name)} nhắn trước
                </button>
            </div>
        `;
        document.getElementById('btnHerFirstMsgDynamic')?.addEventListener('click', handleHerStartRoleplay);
        return;
    }

    let html = '';
    let userTurnCounter = 0;

    history.forEach((turn, historyIdx) => {
        if (!turn || turn.isSystemTrigger) return;
        const rawText = turn.parts?.[0]?.text || '';

        if (turn.role === 'user') {
            userTurnCounter += 1;
            const currentUserTurnNum = userTurnCounter;
            const lines = rawText.split('\n').map(s => s.trim()).filter(Boolean);
            const reviewObj = getTurnReviewForUserTurn(currentUserTurnNum, historyIdx);
            const isExpanded = Boolean(roleplayUIState.expandedUserTurnMap[historyIdx]);

            html += `<div id="rp_chat_user_turn_${currentUserTurnNum}" class="flex flex-col items-end gap-1 animate-pop">`;
            lines.forEach(line => {
                html += `
                    <div class="max-w-[82%] bg-gradient-to-br from-warm-500 to-amber-600 text-white px-3.5 py-2 rounded-2xl rounded-br-xs text-sm shadow-xs break-words">${escapeHtml(line)}</div>
                `;
            });

            // Thanh công cụ dưới mỗi tin nhắn của tôi: Nhãn đánh giá (5.10) + Nút Quay lại (5.7)
            html += `<div class="flex flex-wrap items-center justify-end gap-1.5 px-1">`;

            if (reviewObj) {
                const isGood = reviewObj.rating === 'good';
                const badgeStyle = isGood
                    ? 'bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950/90 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                    : 'bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/90 text-amber-900 dark:text-amber-300 border-amber-400 dark:border-amber-700';
                const badgeLabel = isGood ? '👍 Tốt (Xem chi tiết)' : '⚠️ Cần sửa (Xem gợi ý)';

                html += `
                    <button type="button" data-toggle-turn-review="${historyIdx}" class="px-2 py-0.5 rounded-full border text-[10px] font-extrabold transition flex items-center gap-1 ${badgeStyle}">
                        <span>${badgeLabel}</span>
                        <span>${isExpanded ? '▴' : '▾'}</span>
                    </button>
                `;
            }

            html += `
                <button type="button" data-rewind-turn="${historyIdx}" class="btn-rewind-turn text-[10px] font-semibold text-stone-400 hover:text-warm-600 dark:hover:text-amber-400 transition flex items-center gap-1" title="Cắt lịch sử tới đây để thử nhắn theo cách khác">
                    <span>↩️</span>
                    <span>Quay lại tin này và nhắn khác</span>
                </button>
            </div>`;

            // Khung chi tiết khi bấm vào nhãn 👍 Tốt / ⚠️ Cần sửa ngay trên khung chat (Mục 5.10)
            if (reviewObj && isExpanded) {
                const isGood = reviewObj.rating === 'good';
                html += `
                    <div class="w-full sm:w-[92%] p-3 rounded-2xl border ${isGood ? 'bg-emerald-50/95 dark:bg-stone-900 border-emerald-300 dark:border-emerald-800' : 'bg-amber-50/95 dark:bg-stone-900 border-amber-300 dark:border-amber-800'} text-xs space-y-2 shadow-xs animate-pop">
                        <div class="flex items-center justify-between">
                            <span class="font-extrabold ${isGood ? 'text-emerald-800 dark:text-emerald-300' : 'text-amber-800 dark:text-amber-300'}">
                                ${isGood ? '👍 Đánh giá lượt #' + currentUserTurnNum + ': Làm tốt' : '⚠️ Đánh giá lượt #' + currentUserTurnNum + ': Cần cải thiện'}
                            </span>
                            <span class="text-[10px] text-stone-400">Lượt #${currentUserTurnNum}</span>
                        </div>
                        ${reviewObj.herInnerThought ? `
                        <div class="p-2 rounded-xl bg-white/90 dark:bg-stone-800 border border-warm-200/70 dark:border-stone-700 text-[11px] text-stone-700 dark:text-stone-200 leading-snug">
                            💭 <strong>Suy nghĩ thầm của ${escapeHtml(c.name)}:</strong> "${escapeHtml(reviewObj.herInnerThought)}"
                        </div>
                        ` : ''}
                        <p class="text-[11px] text-stone-700 dark:text-stone-300 leading-snug">
                            🎓 <strong>Nhận xét HLV:</strong> ${escapeHtml(reviewObj.coachNote || '')}
                        </p>
                        <div class="p-2 rounded-xl bg-emerald-100/60 dark:bg-emerald-950/40 border border-emerald-300/70 dark:border-emerald-800 text-[11px] text-emerald-900 dark:text-emerald-200 leading-snug">
                            ✨ <strong>Gợi ý cách diễn đạt tốt hơn:</strong> "${escapeHtml(reviewObj.betterSuggestion || '')}"
                        </div>
                        <div class="flex flex-wrap items-center justify-end gap-1.5 pt-1">
                            <button type="button" data-rewind-turn="${historyIdx}" class="btn-rewind-turn px-2.5 py-1.5 rounded-xl bg-white hover:bg-warm-100 dark:bg-stone-800 border border-warm-200 dark:border-stone-700 text-stone-700 dark:text-stone-200 font-bold text-[11px] transition">
                                ↩️ Tự viết lại từ tin này
                            </button>
                            <button type="button" data-rewind-with-suggestion="${historyIdx}" data-suggestion-text="${escapeHtml(reviewObj.betterSuggestion || '')}" class="btn-rewind-suggestion px-2.5 py-1.5 rounded-xl bg-warm-500 hover:bg-warm-600 text-white font-bold text-[11px] shadow-2xs transition">
                                ✨ Dùng câu gợi ý & nhắn lại từ đây
                            </button>
                        </div>
                    </div>
                `;
            }

            html += `</div>`;
        } else {
            const meta = turn.turnMeta || null;
            const messagesArr = meta && Array.isArray(meta.messages) && meta.messages.length > 0
                ? meta.messages
                : rawText.split('\n').map(s => s.trim()).filter(Boolean);
            const sendType = meta?.sendType || 'text';
            const turnMood = meta?.mood || '';
            const turnInterest = typeof meta?.interest === 'number' ? meta.interest : null;
            const innerThought = meta?.innerThought || '';
            const askedBack = Boolean(meta?.askedBack);

            if (sendType === 'seen_only') {
                html += `
                    <div class="flex flex-col items-start gap-1 animate-pop my-1">
                        <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-200/70 dark:bg-stone-800/90 border border-stone-300 dark:border-stone-700 text-[11px] font-semibold text-stone-600 dark:text-stone-300 italic">
                            <span>👀</span>
                            <span>${escapeHtml(c.name)} đã xem tin nhắn mà chưa trả lời</span>
                        </div>
                `;
            } else if (sendType === 'sticker_only') {
                const stickerText = messagesArr.join(' ') || '🧸 [Sticker]';
                html += `
                    <div class="flex flex-col items-start gap-1 animate-pop">
                        <div class="flex items-end gap-2 justify-start">
                            <div class="w-6 h-6 rounded-full bg-gradient-to-tr from-pink-500 to-amber-400 flex items-center justify-center text-white text-xs flex-shrink-0">👧</div>
                            <div class="px-4 py-2.5 rounded-2xl rounded-bl-xs bg-amber-50/90 dark:bg-stone-800 border-2 border-dashed border-amber-300 dark:border-amber-700 text-stone-800 dark:text-stone-100 text-sm font-bold shadow-xs">
                                🧸 ${escapeHtml(stickerText)}
                            </div>
                        </div>
                `;
            } else {
                html += `<div class="flex flex-col items-start gap-1.5 animate-pop">`;
                messagesArr.forEach((msgLine, idx) => {
                    const isLastBubble = idx === messagesArr.length - 1;
                    html += `
                        <div class="flex items-end gap-2 justify-start w-full">
                            ${isLastBubble
                                ? `<div class="w-6 h-6 rounded-full bg-gradient-to-tr from-pink-500 to-amber-400 flex items-center justify-center text-white text-xs flex-shrink-0">👧</div>`
                                : `<div class="w-6 flex-shrink-0"></div>`
                            }
                            <div class="max-w-[82%] bg-white dark:bg-stone-800 border border-warm-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 px-3.5 py-2 rounded-2xl rounded-bl-xs text-sm shadow-xs break-words">${escapeHtml(msgLine)}</div>
                        </div>
                    `;
                });
            }

            if (innerThought || turnMood || askedBack) {
                const moodMeta = getMoodBadgeMeta(turnMood);
                html += `
                    <div class="pl-8 max-w-[90%] space-y-1">
                        <div class="flex flex-wrap items-center gap-1.5 text-[10px] text-stone-400 dark:text-stone-500">
                            ${turnMood ? `<span>${moodMeta.icon} ${escapeHtml(moodMeta.label)}</span>` : ''}
                            ${turnInterest !== null ? `<span>• Hứng thú: ${turnInterest}/100</span>` : ''}
                            ${askedBack ? `<span class="text-emerald-600 dark:text-emerald-400 font-bold">• ❓ Đã hỏi ngược</span>` : ''}
                            ${innerThought && !canShowInnerThought
                                ? `<span class="italic text-stone-400 dark:text-stone-500">• 🔒 Suy nghĩ thầm (ẩn)</span>`
                                : ''
                            }
                        </div>
                        ${innerThought && canShowInnerThought
                            ? `<div class="p-2 rounded-xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/70 text-[11px] text-amber-900 dark:text-amber-200 leading-snug">
                                💭 <strong>Suy nghĩ thầm của ${escapeHtml(c.name)}:</strong> "${escapeHtml(innerThought)}"
                               </div>`
                            : ''
                        }
                    </div>
                `;
            }

            html += `</div>`;
        }
    });

    if (rp.isEndedByLowInterest) {
        html += `
            <div class="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-300 dark:border-red-800 text-xs text-red-900 dark:text-red-200 space-y-2 animate-pop my-2">
                <div class="font-extrabold flex items-center gap-1.5 text-red-700 dark:text-red-300">
                    <span>🛑</span>
                    <span>Độ hứng thú xuống quá thấp (${rp.interest}/100) — ${escapeHtml(c.name)} đã lịch sự kết thúc cuộc trò chuyện.</span>
                </div>
                <p class="text-[11px] leading-relaxed">
                    Bạn có thể bấm nút <strong>"↩️ Quay lại tin này và nhắn khác"</strong> ở tin nhắn phía trên để thử cách trả lời khác, hoặc bấm <strong>Chấm điểm</strong>.
                </p>
                <div class="flex flex-wrap gap-2 pt-1">
                    <button type="button" id="btnRevealThoughtsOnEnd" class="px-3 py-1.5 rounded-xl bg-white dark:bg-stone-800 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 font-bold text-[11px] transition">
                        💭 Xem suy nghĩ thầm của ${escapeHtml(c.name)}
                    </button>
                    <button type="button" id="btnScoreOnLowInterestEnd" class="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] transition">
                        🏆 Chấm điểm & Rút kinh nghiệm
                    </button>
                </div>
            </div>
        `;
    }

    chatWin.innerHTML = html;
    chatWin.scrollTop = chatWin.scrollHeight;

    // Sự kiện bật/tắt xem nhận xét & suy nghĩ thầm trên từng tin của tôi (Mục 5.10)
    chatWin.querySelectorAll('button[data-toggle-turn-review]').forEach(btn => {
        btn.addEventListener('click', () => {
            const hIdx = parseInt(btn.getAttribute('data-toggle-turn-review'), 10);
            if (!Number.isNaN(hIdx)) {
                roleplayUIState.expandedUserTurnMap[hIdx] = !roleplayUIState.expandedUserTurnMap[hIdx];
                renderRoleplayMessagesUI();
            }
        });
    });

    // Sự kiện nút "↩️ Quay lại tin này và nhắn khác" (Mục 5.7 & 5.10)
    chatWin.querySelectorAll('.btn-rewind-turn').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.getAttribute('data-rewind-turn'), 10);
            if (!Number.isNaN(idx)) {
                handleRewindRoleplayToTurn(idx, null);
            }
        });
    });

    // Sự kiện nút "✨ Dùng câu gợi ý & nhắn lại từ đây" (Mục 5.10)
    chatWin.querySelectorAll('.btn-rewind-suggestion').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.getAttribute('data-rewind-with-suggestion'), 10);
            const sugText = btn.getAttribute('data-suggestion-text') || '';
            if (!Number.isNaN(idx)) {
                handleRewindRoleplayToTurn(idx, sugText);
            }
        });
    });

    document.getElementById('btnRevealThoughtsOnEnd')?.addEventListener('click', () => {
        roleplayUIState.revealInnerThoughts = true;
        renderRoleplayMessagesUI();
    });
    document.getElementById('btnScoreOnLowInterestEnd')?.addEventListener('click', handleFinishAndScoreRoleplay);
}

/**
 * Hiển thị bong bóng hiệu ứng "đang gõ..." trong cửa sổ chat (Mục 5.5)
 */
function appendTypingBubbleB(labelNote = '') {
    const chatWin = document.getElementById('roleplayChatWindow');
    if (!chatWin) return;
    removeTypingBubbleB();

    const c = appState.roleplay.characterCard || ROLEPLAY_PRESET_PERSONAS[0].card;
    const el = document.createElement('div');
    el.id = 'roleplayTypingIndicator';
    el.className = 'flex items-center gap-2 justify-start animate-pop';
    el.innerHTML = `
        <div class="w-6 h-6 rounded-full bg-gradient-to-tr from-pink-500 to-amber-400 flex items-center justify-center text-white text-xs flex-shrink-0">👧</div>
        <div class="px-3.5 py-2 rounded-2xl rounded-bl-xs bg-white dark:bg-stone-800 border border-warm-200 dark:border-stone-700 inline-flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-stone-400 typing-dot"></span>
            <span class="w-2 h-2 rounded-full bg-stone-400 typing-dot"></span>
            <span class="w-2 h-2 rounded-full bg-stone-400 typing-dot"></span>
            <span class="text-[10px] text-stone-400 ml-1">${escapeHtml(labelNote || `${c.name} đang gõ...`)}</span>
        </div>
    `;
    chatWin.appendChild(el);
    chatWin.scrollTop = chatWin.scrollHeight;
}

function removeTypingBubbleB() {
    const existing = document.getElementById('roleplayTypingIndicator');
    if (existing) existing.remove();
}

/**
 * Mục 5.5: Mô phỏng hiệu ứng "đang gõ..." có độ trễ tỷ lệ thuận với độ dài từng tin nhắn của nhân vật.
 */
async function simulateSequentialTypingB(parsedTurn) {
    const chatWin = document.getElementById('roleplayChatWindow');
    if (!chatWin || !parsedTurn) return;

    const c = appState.roleplay.characterCard || ROLEPLAY_PRESET_PERSONAS[0].card;
    const sendType = parsedTurn.sendType || 'text';
    const messages = Array.isArray(parsedTurn.messages)
        ? parsedTurn.messages.map(m => String(m || '').trim()).filter(Boolean)
        : [];

    roleplayUIState.isSimulatingTyping = true;

    try {
        if (sendType === 'seen_only') {
            appendTypingBubbleB(`${c.name} vừa mở xem...`);
            await new Promise(r => setTimeout(r, 450));
            removeTypingBubbleB();
            return;
        }

        if (sendType === 'sticker_only') {
            appendTypingBubbleB(`${c.name} đang chọn sticker...`);
            await new Promise(r => setTimeout(r, 600));
            removeTypingBubbleB();
            return;
        }

        for (let i = 0; i < messages.length; i++) {
            const msgText = messages[i];
            const charLen = msgText.length;
            const typingDelayMs = Math.min(2100, Math.max(450, Math.round(charLen * 26)));

            appendTypingBubbleB(
                messages.length > 1
                    ? `${c.name} đang gõ tin (${i + 1}/${messages.length})...`
                    : `${c.name} đang gõ...`
            );

            await new Promise(r => setTimeout(r, typingDelayMs));
            removeTypingBubbleB();

            if (i < messages.length - 1) {
                const tempBubble = document.createElement('div');
                tempBubble.className = 'flex items-end gap-2 justify-start w-full animate-pop temp-seq-bubble';
                tempBubble.innerHTML = `
                    <div class="w-6 flex-shrink-0"></div>
                    <div class="max-w-[82%] bg-white dark:bg-stone-800 border border-warm-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 px-3.5 py-2 rounded-2xl rounded-bl-xs text-sm shadow-xs break-words">${escapeHtml(msgText)}</div>
                `;
                chatWin.appendChild(tempBubble);
                chatWin.scrollTop = chatWin.scrollHeight;
            }
        }
    } finally {
        roleplayUIState.isSimulatingTyping = false;
        removeTypingBubbleB();
        chatWin.querySelectorAll('.temp-seq-bubble').forEach(el => el.remove());
    }
}

/**
 * Xử lý dữ liệu lượt phản hồi JSON theo SCHEMA_MODE_B_TURN của nhân vật (Mục 5.4, 5.5, 5.8)
 */
function applyModelTurnResponseToState(parsedTurn, triggerUserPrompt = null) {
    const rp = appState.roleplay;
    const prevInterest = typeof rp.interest === 'number' ? rp.interest : 55;
    const newInterest = Math.max(0, Math.min(100, Math.round(Number(parsedTurn.interest) ?? prevInterest)));

    roleplayUIState.lastInterestDelta = newInterest - prevInterest;
    rp.interest = newInterest;
    rp.mood = parsedTurn.mood || 'bình thường';

    if (!Array.isArray(rp.interestCurve)) {
        rp.interestCurve = [prevInterest];
    }
    rp.interestCurve.push(newInterest);

    if (parsedTurn.askedBack) {
        rp.askedBackCount = (rp.askedBackCount || 0) + 1;
    }
    if (parsedTurn.acceptedHangout) {
        rp.acceptedHangout = true;
    }

    const cleanMessages = Array.isArray(parsedTurn.messages)
        ? parsedTurn.messages.map(m => String(m || '').trim()).filter(Boolean)
        : [];
    if (cleanMessages.length === 0) {
        cleanMessages.push(parsedTurn.sendType === 'seen_only' ? '(Đã xem 👀)' : '...');
    }

    if (triggerUserPrompt) {
        rp.history.push({
            role: 'user',
            parts: [{ text: triggerUserPrompt }],
            isSystemTrigger: true
        });
    }

    rp.history.push({
        role: 'model',
        parts: [{ text: cleanMessages.join('\n') }],
        turnMeta: {
            messages: cleanMessages,
            interest: newInterest,
            mood: rp.mood,
            innerThought: String(parsedTurn.innerThought || '').trim(),
            sendType: ['text', 'sticker_only', 'seen_only'].includes(parsedTurn.sendType) ? parsedTurn.sendType : 'text',
            askedBack: Boolean(parsedTurn.askedBack),
            acceptedHangout: Boolean(parsedTurn.acceptedHangout)
        }
    });

    checkRoleplayMissionProgress(true);

    if (newInterest <= 15) {
        rp.isEndedByLowInterest = true;
        rp.isFinished = true;
        roleplayUIState.revealInnerThoughts = true;
        showToast('Độ hứng thú đã giảm xuống quá thấp. Nhân vật đã lịch sự kết thúc buổi trò chuyện.', '🛑');
    }

    saveRoleplayState();
}

/**
 * Khi người dùng bấm "✨ Để cô ấy nhắn trước"
 */
async function handleHerStartRoleplay() {
    const c = appState.roleplay.characterCard || ROLEPLAY_PRESET_PERSONAS[0].card;
    const triggerPrompt = `(Bắt đầu cuộc trò chuyện: Bạn là ${c.name}, hãy chủ động nhắn tin mở lời tự nhiên đầu tiên cho bạn nam dựa theo đúng tình huống hiện tại và trả về JSON theo đúng SCHEMA_MODE_B_TURN nhé!)`;

    appendTypingBubbleB(`${c.name} đang suy nghĩ...`);
    try {
        const { parsed } = await callGeminiWithSchemaRetry(
            getFormattedRoleplayPrompt(),
            [],
            triggerPrompt,
            SCHEMA_MODE_B_TURN,
            validateModeBTurnJson,
            0.9
        );
        await simulateSequentialTypingB(parsed);
        applyModelTurnResponseToState(parsed, triggerPrompt);
        renderRoleplayMessagesUI();
    } catch (err) {
        removeTypingBubbleB();
        renderErrorCard('roleplayEvaluationArea', err.message);
    }
}

/**
 * Khi người dùng gửi 1 tin nhắn trong Phòng luyện tập (Mục 5.4 & 5.5)
 */
async function handleSendRoleplayMessage(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    if (roleplayUIState.isSimulatingTyping) return;

    const inputEl = document.getElementById('roleplayUserMsg');
    const userText = inputEl ? inputEl.value.trim() : '';
    if (!userText) return;

    if (appState.roleplay.isEndedByLowInterest) {
        showToast('Nhân vật đã lịch sự kết thúc cuộc trò chuyện. Hãy bấm "↩️ Quay lại" hoặc "Tạo buổi mới" nhé!', '🛑');
        return;
    }
    if (appState.roleplay.isFinished) {
        showToast('Buổi tập đã chấm điểm. Hãy bấm "↩️ Quay lại tin này" trên khung chat hoặc "🔄 Tạo buổi mới" nhé!', '🔄');
        return;
    }

    inputEl.value = '';
    appState.roleplay.lastHint = null;
    const evalArea = document.getElementById('roleplayEvaluationArea');
    if (evalArea) evalArea.innerHTML = '';

    const previousHistory = [...appState.roleplay.history];
    appState.roleplay.history.push({
        role: 'user',
        parts: [{ text: userText }]
    });
    renderRoleplayMessagesUI();

    const c = appState.roleplay.characterCard || ROLEPLAY_PRESET_PERSONAS[0].card;
    appendTypingBubbleB(`${c.name} vừa nhận tin...`);

    const btnSend = document.getElementById('btnSendRoleplay');
    const btnHint = document.getElementById('btnRoleplayHint');
    if (btnSend) btnSend.disabled = true;
    if (btnHint) btnHint.disabled = true;

    try {
        const { parsed } = await callGeminiWithSchemaRetry(
            getFormattedRoleplayPrompt(),
            previousHistory,
            userText,
            SCHEMA_MODE_B_TURN,
            validateModeBTurnJson,
            0.9
        );

        await simulateSequentialTypingB(parsed);
        applyModelTurnResponseToState(parsed, null);
        renderRoleplayMessagesUI();
    } catch (err) {
        removeTypingBubbleB();
        appState.roleplay.history.pop();
        renderRoleplayMessagesUI();
        renderErrorCard('roleplayEvaluationArea', err.message);
    } finally {
        if (btnSend) btnSend.disabled = false;
        if (btnHint) btnHint.disabled = false;
        if (inputEl && !appState.roleplay.isFinished) inputEl.focus();
    }
}

/**
 * Mục 5.9: Vẽ biểu đồ đường cong hứng thú cả buổi bằng SVG thuần (không dùng thư viện ngoài)
 */
function renderRoleplayInterestCurveSvg(curveArray) {
    let pts = Array.isArray(curveArray)
        ? curveArray.map(n => Math.max(0, Math.min(100, Math.round(Number(n) || 0))))
        : [];

    if (pts.length === 0) {
        pts = [55];
    }
    if (pts.length === 1) {
        pts = [pts[0], pts[0]];
    }

    const width = 440;
    const height = 175;
    const padLeft = 34;
    const padRight = 20;
    const padTop = 24;
    const padBottom = 30;
    const plotW = width - padLeft - padRight;
    const plotH = height - padTop - padBottom;

    const getX = (idx) => {
        if (pts.length <= 1) return padLeft;
        return Math.round(padLeft + (idx / (pts.length - 1)) * plotW);
    };
    const getY = (val) => {
        return Math.round(padTop + ((100 - val) / 100) * plotH);
    };

    const coords = pts.map((v, idx) => ({ x: getX(idx), y: getY(v), val: v, idx }));
    const polylinePoints = coords.map(c => `${c.x},${c.y}`).join(' ');
    const areaPoints = `${coords[0].x},${padTop + plotH} ${polylinePoints} ${coords[coords.length - 1].x},${padTop + plotH}`;

    const startVal = pts[0];
    const endVal = pts[pts.length - 1];
    const maxVal = Math.max(...pts);
    const totalDiff = endVal - startVal;
    const diffStr = totalDiff > 0 ? `+${totalDiff}` : `${totalDiff}`;

    const lineColor = endVal >= 60 ? '#10b981' : endVal >= 35 ? '#f59e0b' : '#ef4444';
    const y15 = getY(15);

    const gridLevels = [100, 75, 50, 25];
    const gridLinesSvg = gridLevels.map(lv => {
        const y = getY(lv);
        return `
            <line x1="${padLeft}" y1="${y}" x2="${width - padRight}" y2="${y}" stroke="currentColor" class="text-stone-200 dark:text-stone-700" stroke-dasharray="3,3" stroke-width="1" />
            <text x="${padLeft - 6}" y="${y + 3}" text-anchor="end" class="fill-stone-400 text-[9px] font-mono">${lv}</text>
        `;
    }).join('');

    const nodesSvg = coords.map((c, idx) => {
        const label = idx === 0 ? 'Đầu' : `L${idx}`;
        const dotColor = c.val >= 65 ? '#10b981' : c.val >= 35 ? '#f59e0b' : '#ef4444';
        return `
            <g>
                <circle cx="${c.x}" cy="${c.y}" r="4.5" fill="${dotColor}" stroke="#ffffff" stroke-width="1.5" />
                <text x="${c.x}" y="${c.y - 8}" text-anchor="middle" class="fill-stone-700 dark:fill-stone-200 text-[9px] font-bold font-mono">${c.val}</text>
                <text x="${c.x}" y="${height - 8}" text-anchor="middle" class="fill-stone-400 text-[9px] font-mono">${label}</text>
            </g>
        `;
    }).join('');

    return `
        <div class="p-3.5 rounded-2xl bg-warm-50/90 dark:bg-stone-900/80 border border-warm-200 dark:border-stone-700 space-y-2">
            <div class="flex flex-wrap items-center justify-between gap-2">
                <span class="text-xs font-extrabold text-stone-800 dark:text-stone-100 flex items-center gap-1.5">
                    <span>📈</span>
                    <span>Đường cong hứng thú cả buổi</span>
                </span>
                <div class="flex flex-wrap items-center gap-2 text-[10px] font-mono font-bold">
                    <span class="px-2 py-0.5 rounded bg-white dark:bg-stone-800 border border-warm-200 dark:border-stone-700 text-stone-600 dark:text-stone-300">Đầu: ${startVal}</span>
                    <span class="px-2 py-0.5 rounded bg-white dark:bg-stone-800 border border-warm-200 dark:border-stone-700 text-emerald-600 dark:text-emerald-400">Đỉnh: ${maxVal}</span>
                    <span class="px-2 py-0.5 rounded bg-white dark:bg-stone-800 border border-warm-200 dark:border-stone-700 text-stone-800 dark:text-stone-100">Cuối: ${endVal} (${diffStr})</span>
                </div>
            </div>

            <div class="w-full overflow-x-auto">
                <svg viewBox="0 0 ${width} ${height}" class="w-full h-auto overflow-visible">
                    <defs>
                        <linearGradient id="rpInterestGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stop-color="${lineColor}" stop-opacity="0.32" />
                            <stop offset="100%" stop-color="${lineColor}" stop-opacity="0.02" />
                        </linearGradient>
                    </defs>
                    ${gridLinesSvg}
                    <!-- Đường ranh giới đỏ 15/100 (Ngưỡng kết thúc lịch sự) -->
                    <line x1="${padLeft}" y1="${y15}" x2="${width - padRight}" y2="${y15}" stroke="#ef4444" stroke-dasharray="2,2" stroke-width="1" opacity="0.65" />
                    <text x="${width - padRight - 2}" y="${y15 - 3}" text-anchor="end" fill="#ef4444" class="text-[8px] font-semibold">Ngưỡng dừng (15)</text>

                    <polygon points="${areaPoints}" fill="url(#rpInterestGrad)" />
                    <polyline fill="none" stroke="${lineColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" points="${polylinePoints}" />
                    ${nodesSvg}
                </svg>
            </div>
        </div>
    `;
}

/**
 * Mục 5.9, 5.10, 5.11: Chấm điểm nâng cấp 6 tiêu chí, gắn nhãn từng tin nhắn & lưu vào Lịch sử buổi tập
 */
async function handleFinishAndScoreRoleplay() {
    const rp = appState.roleplay;
    const userTurns = (rp.history || []).filter(t => t.role === 'user' && !t.isSystemTrigger);
    if (userTurns.length < 1) {
        showToast('Hãy nhắn ít nhất 1 tin nhắn với cô ấy trước khi chấm điểm nhé!', '💬');
        return;
    }

    const evalArea = document.getElementById('roleplayEvaluationArea');
    const btnScore = document.getElementById('btnFinishAndScore');
    if (btnScore) {
        btnScore.disabled = true;
        btnScore.innerHTML = `<span class="animate-spin">⏳</span><span>Đang chấm...</span>`;
    }

    if (evalArea) {
        evalArea.innerHTML = `
            <div class="bg-white dark:bg-stone-800/90 border border-warm-200 dark:border-stone-700 rounded-2xl p-5 text-center space-y-2.5 animate-pop">
                <div class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-warm-100 dark:bg-stone-700">
                    <span class="w-2.5 h-2.5 rounded-full bg-amber-500 typing-dot"></span>
                    <span class="w-2.5 h-2.5 rounded-full bg-amber-500 typing-dot"></span>
                    <span class="w-2.5 h-2.5 rounded-full bg-amber-500 typing-dot"></span>
                </div>
                <p class="text-xs font-semibold text-stone-600 dark:text-stone-300">
                    Đang chấm điểm 6 tiêu chí, phân tích từng tin nhắn của bạn & dựng biểu đồ hứng thú...
                </p>
            </div>
        `;
    }

    const diffObj = ROLEPLAY_DIFFICULTY_CONFIG[rp.difficulty] || ROLEPLAY_DIFFICULTY_CONFIG.normal;
    const charCardText = formatCharacterCardForPrompt(rp.characterCard);
    const missionObj = ROLEPLAY_MISSIONS.find(m => m.id === rp.missionId) || ROLEPLAY_MISSIONS[0];
    const missionProgress = checkRoleplayMissionProgress(false);

    const evalSystemPrompt = SYSTEM_PROMPT_MODE_B_EVAL
        .replace('{character_card}', charCardText)
        .replace('{persona}', rp.persona || '')
        .replace('{tinh_huong}', rp.situation || '')
        .replace('{difficulty_desc}', diffObj.label)
        .replace('{mission_desc}', `${missionObj.title} (${missionProgress.isCompleted ? 'Đã hoàn thành' : 'Chưa hoàn thành'} - ${missionProgress.progressText})`)
        .replace(/\{hints_used\}/g, String(rp.hintsUsed || 0));

    // Đánh số rõ từng lượt tin nhắn của người dùng (turnIndex: 1, 2, 3...) để AI trả về turnReviews khớp 100%
    let uCounter = 0;
    const transcriptWithThoughts = rp.history
        .filter(t => !t.isSystemTrigger)
        .map((t) => {
            if (t.role === 'user') {
                uCounter += 1;
                return `[LƯỢT CỦA NGƯỜI DÙNG #${uCounter} - turnIndex=${uCounter}]: "${t.parts?.[0]?.text || ''}"`;
            }
            const meta = t.turnMeta || {};
            return `[PHẢN HỒI CỦA CÔ ẤY (${rp.characterCard?.name || 'Bạn nữ'}) - Mood: ${meta.mood || 'bình thường'}, Interest: ${meta.interest ?? rp.interest}/100, Suy nghĩ thầm (innerThought): "${meta.innerThought || ''}"]: "${t.parts?.[0]?.text || ''}"`;
        })
        .join('\n');

    const endCommand = `[KẾT THÚC BUỔI TẬP] Dưới đây là toàn bộ biên bản buổi trò chuyện (có ${uCounter} lượt tin nhắn của người dùng từ turnIndex=1 đến turnIndex=${uCounter}):\n${transcriptWithThoughts}\n\nHãy thoát vai và chấm điểm toàn bộ cuộc trò chuyện trên theo đúng cấu trúc JSON Schema (đảm bảo mảng turnReviews có đủ ${uCounter} phần tử tương ứng từ turnIndex=1 đến ${uCounter}).`;

    try {
        const { parsed } = await callGeminiWithSchemaRetry(
            evalSystemPrompt,
            rp.history,
            endCommand,
            SCHEMA_MODE_B_SCORE,
            validateModeBScoreJson,
            0.72
        );

        // Trừ điểm minh bạch nếu người dùng đã dùng nút Gợi ý (0.5 điểm / lần)
        const rawScore = typeof parsed.score === 'number' ? parsed.score : 8;
        const hintPenalty = (rp.hintsUsed || 0) * 0.5;
        const finalScore = Math.max(0, Math.min(10, Number((rawScore - hintPenalty).toFixed(1))));
        parsed._rawScoreBeforePenalty = rawScore;
        parsed._hintPenalty = hintPenalty;
        parsed.score = finalScore;

        rp.isFinished = true;
        rp.lastEvaluation = parsed;
        roleplayUIState.revealInnerThoughts = true;

        saveRoleplayState();
        // Mục 5.11: Tự động lưu buổi tập vào Lịch sử buổi luyện tập
        saveRoleplaySessionToHistory(parsed);

        renderRoleplayMessagesUI();
        renderRoleplayScoreUI(parsed);

        if (evalArea) {
            setTimeout(() => evalArea.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
        }
    } catch (err) {
        renderErrorCard('roleplayEvaluationArea', err.message);
    } finally {
        if (btnScore) {
            btnScore.disabled = false;
            btnScore.innerHTML = `<span>🏆</span><span>Chấm điểm</span>`;
        }
    }
}

/**
 * Mục 5.9 & 5.10: Hiển thị Bảng chấm điểm nâng cấp (6 tiêu chí + nhiệm vụ + số gợi ý + biểu đồ SVG + Xem lại từng tin của tôi)
 */
function renderRoleplayScoreUI(scoreData) {
    const evalArea = document.getElementById('roleplayEvaluationArea');
    if (!evalArea || !scoreData) return;

    const rp = appState.roleplay;
    const c = rp.characterCard || ROLEPLAY_PRESET_PERSONAS[0].card;
    const missionObj = ROLEPLAY_MISSIONS.find(m => m.id === rp.missionId) || ROLEPLAY_MISSIONS[0];
    const missionProgress = checkRoleplayMissionProgress(false);
    const hintsUsed = rp.hintsUsed || 0;
    const penaltyPts = (hintsUsed * 0.5).toFixed(1);

    // Cấu hình 6 tiêu chí chấm điểm (Mục 5.9)
    const criteriaMeta = [
        { key: 'empathy', icon: '💗', label: '1. Đồng cảm & Phản ứng cảm xúc' },
        { key: 'curiosity', icon: '🔍', label: '2. Tò mò & Câu hỏi mở' },
        { key: 'selfSharing', icon: '🗣️', label: '3. Chia sẻ về bản thân' },
        { key: 'pacingAndLength', icon: '⏱️', label: '4. Độ dài tin & Nhịp độ' },
        { key: 'naturalness', icon: '🌿', label: '5. Tự nhiên / Viết tắt / Emoji' },
        { key: 'subtlety', icon: '✨', label: '6. Tinh tế (Không ép, không sến)' }
    ];

    const criteriaObj = scoreData.criteria || {};
    const criteriaCardsHtml = criteriaMeta.map(item => {
        const cData = criteriaObj[item.key] || { score: 7, comment: '' };
        const sc = Math.max(0, Math.min(10, Number(cData.score) || 0));
        const pct = sc * 10;
        const barColor = sc >= 8 ? 'bg-emerald-500' : sc >= 6 ? 'bg-amber-500' : 'bg-red-500';
        const scoreColor = sc >= 8
            ? 'text-emerald-700 dark:text-emerald-300'
            : sc >= 6
            ? 'text-amber-700 dark:text-amber-300'
            : 'text-red-600 dark:text-red-400';

        return `
            <div class="p-3 rounded-xl bg-warm-50/90 dark:bg-stone-900/80 border border-warm-200/80 dark:border-stone-700 space-y-1.5 text-xs">
                <div class="flex items-center justify-between gap-2">
                    <span class="font-extrabold text-stone-800 dark:text-stone-100">${item.icon} ${escapeHtml(item.label)}</span>
                    <span class="font-mono font-extrabold ${scoreColor}">${sc}/10</span>
                </div>
                <div class="w-full h-1.5 rounded-full bg-warm-200/70 dark:bg-stone-700 overflow-hidden">
                    <div class="h-full rounded-full ${barColor}" style="width: ${pct}%"></div>
                </div>
                <p class="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">${escapeHtml(cData.comment || '')}</p>
            </div>
        `;
    }).join('');

    // Ánh xạ các lượt user trong `rp.history` để dựng danh sách "Xem lại buổi chat" (Mục 5.10)
    const userTurnEntries = [];
    (rp.history || []).forEach((turn, hIdx) => {
        if (turn && turn.role === 'user' && !turn.isSystemTrigger) {
            userTurnEntries.push({
                userTurnNum: userTurnEntries.length + 1,
                historyIdx: hIdx,
                userText: turn.parts?.[0]?.text || ''
            });
        }
    });

    const turnReviewsHtml = userTurnEntries.map(entry => {
        const rev = getTurnReviewForUserTurn(entry.userTurnNum, entry.historyIdx) || {
            turnIndex: entry.userTurnNum,
            userText: entry.userText,
            rating: 'good',
            herInnerThought: '',
            coachNote: 'Tin nhắn phù hợp ngữ cảnh.',
            betterSuggestion: entry.userText
        };
        const isGood = rev.rating === 'good';
        const badgeHtml = isGood
            ? `<span class="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/90 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-[10px] font-extrabold">👍 Tốt</span>`
            : `<span class="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/90 text-amber-900 dark:text-amber-300 border border-amber-400 dark:border-amber-700 text-[10px] font-extrabold">⚠️ Cần sửa</span>`;

        const detailId = `eval_turn_detail_${entry.userTurnNum}`;

        return `
            <div class="rounded-2xl border ${isGood ? 'bg-white dark:bg-stone-900/70 border-warm-200 dark:border-stone-700' : 'bg-amber-50/50 dark:bg-stone-900/90 border-amber-300 dark:border-amber-800'} p-3 space-y-2 text-xs">
                <div class="flex items-start justify-between gap-2">
                    <div class="space-y-1 flex-1 min-w-0">
                        <div class="flex flex-wrap items-center gap-1.5">
                            <span class="font-mono text-[10px] font-bold text-stone-400">Tin của bạn #${entry.userTurnNum}</span>
                            ${badgeHtml}
                        </div>
                        <div class="font-bold text-stone-800 dark:text-stone-100 break-words">
                            "${escapeHtml(entry.userText)}"
                        </div>
                    </div>
                    <button type="button" data-toggle-eval-turn="${detailId}" class="px-2.5 py-1 rounded-lg bg-warm-100 hover:bg-warm-200 dark:bg-stone-800 text-[11px] font-bold text-stone-700 dark:text-stone-200 flex-shrink-0 transition">
                        💭 Suy nghĩ thầm & Gợi ý ▾
                    </button>
                </div>

                <div id="${detailId}" class="${isGood ? 'hidden' : ''} pt-2 border-t border-warm-100 dark:border-stone-700/70 space-y-2">
                    ${rev.herInnerThought ? `
                    <div class="p-2.5 rounded-xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/70 text-[11px] text-amber-900 dark:text-amber-200 leading-snug">
                        💭 <strong>Suy nghĩ thầm của ${escapeHtml(c.name)} lúc đó:</strong> "${escapeHtml(rev.herInnerThought)}"
                    </div>
                    ` : ''}
                    <p class="text-[11px] text-stone-600 dark:text-stone-300 leading-snug">
                        🎓 <strong>Nhận xét HLV:</strong> ${escapeHtml(rev.coachNote || '')}
                    </p>
                    <div class="p-2.5 rounded-xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/70 text-[11px] text-emerald-900 dark:text-emerald-200 flex items-start justify-between gap-2">
                        <div class="leading-snug">
                            ✨ <strong>Gợi ý cách nhắn tự nhiên hơn:</strong> "${escapeHtml(rev.betterSuggestion || '')}"
                        </div>
                        <button type="button" data-copy-suggestion="${escapeHtml(rev.betterSuggestion || '')}" class="btn-copy-eval-sug text-[10px] font-bold px-2 py-1 rounded bg-white dark:bg-stone-800 border border-emerald-300 dark:border-emerald-700 flex-shrink-0">
                            📋 Copy
                        </button>
                    </div>
                    <div class="flex flex-wrap items-center justify-end gap-2 pt-1">
                        <button type="button" data-eval-rewind-idx="${entry.historyIdx}" class="btn-eval-rewind px-3 py-1.5 rounded-xl bg-warm-100 hover:bg-warm-200 dark:bg-stone-800 text-stone-700 dark:text-stone-200 font-bold text-[11px] transition">
                            ↩️ Thử tự viết lại từ chính tin này
                        </button>
                        <button type="button" data-eval-rewind-idx="${entry.historyIdx}" data-eval-rewind-sug="${escapeHtml(rev.betterSuggestion || '')}" class="btn-eval-rewind-sug px-3 py-1.5 rounded-xl bg-warm-500 hover:bg-warm-600 text-white font-bold text-[11px] shadow-2xs transition">
                            ✨ Điền câu gợi ý & nhắn lại từ tin này
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    const goodList = (scoreData.goodPoints || []).map(p => `<li class="flex items-start gap-1.5"><span>✅</span><span>${escapeHtml(p)}</span></li>`).join('');
    const improveList = (scoreData.improvePoints || []).map(p => `<li class="flex items-start gap-1.5"><span>🔧</span><span>${escapeHtml(p)}</span></li>`).join('');
    const rewritesHtml = (scoreData.rewrites || []).map(item => `
        <div class="p-3 rounded-xl bg-warm-50 dark:bg-stone-900 border border-warm-200 dark:border-stone-700 space-y-1.5 text-xs">
            <div class="text-stone-500 dark:text-stone-400">❌ <strong>Bạn đã nhắn:</strong> "${escapeHtml(item.original || '')}"</div>
            <div class="text-emerald-700 dark:text-emerald-400 font-bold">✨ <strong>Gợi ý tự nhiên hơn:</strong> "${escapeHtml(item.better || '')}"</div>
            <div class="text-stone-600 dark:text-stone-300 text-[11px]">💡 ${escapeHtml(item.reason || '')}</div>
        </div>
    `).join('');

    const svgChartHtml = renderRoleplayInterestCurveSvg(rp.interestCurve);

    evalArea.innerHTML = `
        <div class="bg-white dark:bg-stone-800/95 border-2 border-amber-400 dark:border-amber-600 rounded-2xl p-4 shadow-md space-y-4 animate-pop">
            <!-- 1. TỔNG ĐIỂM, KẾT QUẢ NHIỆM VỤ & SỐ LẦN DÙNG GỢI Ý -->
            <div class="flex items-center justify-between border-b border-warm-200 dark:border-stone-700 pb-3 gap-2">
                <div>
                    <span class="text-xs font-extrabold uppercase text-amber-600 dark:text-amber-400">
                        🏆 Kết quả đánh giá chuyên sâu (Đã lưu vào Lịch sử)
                    </span>
                    <h3 class="text-sm font-bold text-stone-800 dark:text-stone-100 mt-0.5">
                        ${escapeHtml(scoreData.summary || 'Đánh giá buổi trò chuyện')}
                    </h3>
                    <div class="flex flex-wrap items-center gap-2 mt-1 text-[11px]">
                        <span class="px-2 py-0.5 rounded-md bg-warm-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300 font-semibold">
                            💡 Dùng gợi ý: <strong>${hintsUsed} lần</strong> ${hintsUsed > 0 ? `(-${penaltyPts}đ)` : '(Không bị trừ điểm)'}
                        </span>
                        <span class="px-2 py-0.5 rounded-md bg-warm-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300 font-semibold">
                            🎯 Nhiệm vụ: <strong>${rp.missionId !== 'none' ? (missionProgress.isCompleted ? 'Hoàn thành ✅' : 'Chưa đạt ⚠️') : 'Tự do'}</strong>
                        </span>
                    </div>
                </div>
                <div class="px-3.5 py-2 rounded-2xl bg-gradient-to-br from-warm-500 to-amber-500 text-white text-center shadow-xs flex-shrink-0">
                    <span class="text-xl font-extrabold">${escapeHtml(scoreData.score ?? 8)}</span>
                    <span class="text-xs opacity-90">/10</span>
                </div>
            </div>

            <!-- Nhận xét Nhiệm vụ -->
            ${rp.missionId && rp.missionId !== 'none' ? `
            <div class="p-3 rounded-xl ${missionProgress.isCompleted ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200' : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'} border text-xs space-y-1">
                <div class="font-extrabold flex items-center justify-between">
                    <span>🎯 ${escapeHtml(missionObj.title)}</span>
                    <span>${missionProgress.isCompleted ? '✅ ĐẠT MỤC TIÊU' : '⚠️ CHƯA ĐẠT'}</span>
                </div>
                <p class="text-[11px] leading-relaxed">${escapeHtml(scoreData.missionFeedback || missionProgress.progressText)}</p>
            </div>
            ` : ''}

            <!-- 2. ĐƯỜNG CONG HỨNG THÚ CẢ BUỔI (SVG - MỤC 5.9) -->
            ${svgChartHtml}

            <!-- 3. BẢNG ĐIỂM 6 TIÊU CHÍ (MỤC 5.9) -->
            <div class="space-y-2">
                <h4 class="text-xs font-extrabold text-stone-800 dark:text-stone-100">📊 Chi tiết 6 tiêu chí giao tiếp (0–10):</h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    ${criteriaCardsHtml}
                </div>
            </div>

            <!-- 4. XEM LẠI TỪNG TIN NHẮN CỦA TÔI (MỤC 5.10) -->
            <div class="space-y-2.5 pt-2 border-t border-warm-200 dark:border-stone-700">
                <div class="flex items-center justify-between">
                    <h4 class="text-xs font-extrabold text-stone-800 dark:text-stone-100">
                        🔍 Xem lại từng tin nhắn của bạn (${userTurnEntries.length} lượt):
                    </h4>
                    <span class="text-[10px] text-stone-500 dark:text-stone-400">Bấm vào từng lượt để xem suy nghĩ thầm & viết lại</span>
                </div>
                <div class="space-y-2">
                    ${turnReviewsHtml}
                </div>
            </div>

            <!-- 5. ĐIỂM LÀM TỐT & ĐIỂM CẦN CẢI THIỆN TỔNG QUAN -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-warm-200 dark:border-stone-700">
                <div class="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-1.5">
                    <h4 class="font-extrabold text-emerald-800 dark:text-emerald-300">🌟 Điểm bạn làm tốt</h4>
                    <ul class="space-y-1 text-stone-700 dark:text-stone-200 leading-relaxed">${goodList}</ul>
                </div>
                <div class="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-1.5">
                    <h4 class="font-extrabold text-amber-800 dark:text-amber-300">🎯 Điểm cần cải thiện</h4>
                    <ul class="space-y-1 text-stone-700 dark:text-stone-200 leading-relaxed">${improveList}</ul>
                </div>
            </div>

            ${rewritesHtml ? `
            <div class="space-y-2">
                <h4 class="text-xs font-extrabold text-stone-800 dark:text-stone-100">💬 Tóm tắt các câu cần lưu ý sửa:</h4>
                ${rewritesHtml}
            </div>
            ` : ''}
        </div>
    `;

    // Gắn sự kiện đóng/mở chi tiết từng lượt trong bảng Xem lại (Mục 5.10)
    evalArea.querySelectorAll('button[data-toggle-eval-turn]').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-toggle-eval-turn');
            const detailEl = document.getElementById(targetId);
            if (detailEl) {
                detailEl.classList.toggle('hidden');
            }
        });
    });

    // Sự kiện Copy câu gợi ý
    evalArea.querySelectorAll('.btn-copy-eval-sug').forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.getAttribute('data-copy-suggestion') || '';
            if (text) copyText(text);
        });
    });

    // Sự kiện nút "↩️ Thử tự viết lại từ chính tin này" (Mục 5.10)
    evalArea.querySelectorAll('.btn-eval-rewind').forEach(btn => {
        btn.addEventListener('click', () => {
            const hIdx = parseInt(btn.getAttribute('data-eval-rewind-idx'), 10);
            if (!Number.isNaN(hIdx)) {
                handleRewindRoleplayToTurn(hIdx, null);
            }
        });
    });

    // Sự kiện nút "✨ Điền câu gợi ý & nhắn lại từ tin này" (Mục 5.10)
    evalArea.querySelectorAll('.btn-eval-rewind-sug').forEach(btn => {
        btn.addEventListener('click', () => {
            const hIdx = parseInt(btn.getAttribute('data-eval-rewind-idx'), 10);
            const sug = btn.getAttribute('data-eval-rewind-sug') || '';
            if (!Number.isNaN(hIdx)) {
                handleRewindRoleplayToTurn(hIdx, sug);
            }
        });
    });
}