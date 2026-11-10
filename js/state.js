/**
 * ============================================================================
 * 3. QUẢN LÝ TRẠNG THÁI ỨNG DỤNG, THREADS, HỒ SƠ, SOẠN TIN, LÀM QUEN, PHÂN TÍCH, LUYỆN TẬP & LOCALSTORAGE
 * ============================================================================
 */

// Tạo cấu trúc mặc định cho 1 Cuộc trò chuyện (Thread) ở Chế độ A
function createDefaultThread(name = 'Bạn nữ mới quen 🌸') {
    return {
        id: 'thread_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        name: name,
        where: 'Mới quen qua IG/FB',
        closeness: 'Mới bắt chuyện vài lần',
        goal: 'Đồng cảm & hỏi thăm tự nhiên',
        pronoun: 'mình - bạn',
        abbrevLevel: 2,
        humorLevel: 2,
        lastInput: '',
        lastNote: '',
        messages: [],
        profile: null,
        signalHistory: [],
        apiHistory: [],
        lastResult: null,
        updatedAt: Date.now()
    };
}

/**
 * Quy tắc 6: Chuẩn hoá dữ liệu Thread cũ trong localStorage / file JSON sao lưu
 */
function normalizeThread(rawThread, index = 0) {
    const defaults = createDefaultThread(`Bạn nữ #${index + 1}`);
    if (!rawThread || typeof rawThread !== 'object') {
        return defaults;
    }

    const normalizedMessages = Array.isArray(rawThread.messages)
        ? rawThread.messages
            .filter(m => m && typeof m === 'object' && typeof m.text === 'string' && m.text.trim() !== '')
            .map(m => ({
                sender: ['her', 'me', 'unknown'].includes(m.sender) ? m.sender : 'her',
                text: String(m.text).trim(),
                time: typeof m.time === 'string' ? m.time : '',
                note: typeof m.note === 'string' ? m.note : '',
                source: m.source === 'screenshot' ? 'screenshot' : 'typed'
            }))
        : [];

    const normalizedSignalHistory = Array.isArray(rawThread.signalHistory)
        ? rawThread.signalHistory
            .filter(s => s && typeof s === 'object' && typeof s.interestScore === 'number')
            .map(s => ({
                timestamp: typeof s.timestamp === 'number' ? s.timestamp : Date.now(),
                interestScore: Math.max(0, Math.min(100, Math.round(s.interestScore))),
                trend: typeof s.trend === 'string' ? s.trend : 'ổn định',
                confidence: typeof s.confidence === 'string' ? s.confidence : 'vừa'
            }))
        : [];

    return {
        ...defaults,
        ...rawThread,
        id: typeof rawThread.id === 'string' && rawThread.id ? rawThread.id : defaults.id,
        name: typeof rawThread.name === 'string' && rawThread.name.trim() ? rawThread.name.trim() : defaults.name,
        where: rawThread.where || defaults.where,
        closeness: rawThread.closeness || defaults.closeness,
        goal: rawThread.goal || defaults.goal,
        pronoun: rawThread.pronoun || defaults.pronoun,
        abbrevLevel: Number.isInteger(rawThread.abbrevLevel) ? rawThread.abbrevLevel : defaults.abbrevLevel,
        humorLevel: Number.isInteger(rawThread.humorLevel) ? rawThread.humorLevel : defaults.humorLevel,
        lastInput: typeof rawThread.lastInput === 'string' ? rawThread.lastInput : '',
        lastNote: typeof rawThread.lastNote === 'string' ? rawThread.lastNote : '',
        messages: normalizedMessages,
        profile: rawThread.profile && typeof rawThread.profile === 'object' ? rawThread.profile : null,
        signalHistory: normalizedSignalHistory,
        apiHistory: Array.isArray(rawThread.apiHistory) ? rawThread.apiHistory : [],
        lastResult: rawThread.lastResult && typeof rawThread.lastResult === 'object' ? rawThread.lastResult : null,
        updatedAt: typeof rawThread.updatedAt === 'number' ? rawThread.updatedAt : Date.now()
    };
}

// Cấu trúc mặc định cho "Hồ sơ của tôi" (Mục 1.8)
function createDefaultMyProfile() {
    return {
        interests: '',
        occupation: '',
        factsToShare: '',
        sampleMessages: '',
        voiceStyle: null,
        birthYear: null,
        city: '',
        personalityTags: [],
        personalityNote: '',
        strengths: '',
        avoidTopics: '',
        goal: ''
    };
}

function normalizeMyProfile(rawProfile) {
    const defaults = createDefaultMyProfile();
    if (!rawProfile || typeof rawProfile !== 'object') return defaults;

    const currentYear = new Date().getFullYear();
    const minYear = 1950;
    const maxYear = currentYear - 10;
    let birthYear = null;
    if (rawProfile.birthYear !== undefined && rawProfile.birthYear !== null && String(rawProfile.birthYear).trim() !== '') {
        const parsedYear = Number(String(rawProfile.birthYear).trim());
        if (Number.isInteger(parsedYear) && parsedYear >= minYear && parsedYear <= maxYear) {
            birthYear = parsedYear;
        }
    }

    const allowedPersonalityTags = [
        'Hướng nội', 'Hướng ngoại', 'Trầm tính', 'Hài hước',
        'Nghiêm túc', 'Dễ ngại', 'Ấm áp', 'Thẳng thắn',
        'Hay lo nghĩ', 'Thích khám phá', 'Lãng mạn', 'Cẩn thận'
    ];
    const personalityTags = Array.isArray(rawProfile.personalityTags)
        ? rawProfile.personalityTags
            .filter(tag => typeof tag === 'string' && allowedPersonalityTags.includes(tag.trim()))
            .map(tag => tag.trim())
            .filter((tag, idx, arr) => arr.indexOf(tag) === idx)
            .slice(0, 5)
        : [];

    const allowedGoals = [
        'Làm quen bạn mới',
        'Tìm hiểu một người cụ thể',
        'Hướng tới hẹn hò nghiêm túc',
        'Chỉ luyện tập nhắn tin'
    ];
    const rawGoal = typeof rawProfile.goal === 'string' ? rawProfile.goal.trim() : '';
    const goal = allowedGoals.includes(rawGoal) ? rawGoal : '';

    return {
        interests: typeof rawProfile.interests === 'string' ? rawProfile.interests : '',
        occupation: typeof rawProfile.occupation === 'string' ? rawProfile.occupation : '',
        factsToShare: typeof rawProfile.factsToShare === 'string' ? rawProfile.factsToShare : '',
        sampleMessages: typeof rawProfile.sampleMessages === 'string' ? rawProfile.sampleMessages : '',
        voiceStyle: rawProfile.voiceStyle && typeof rawProfile.voiceStyle === 'object' ? rawProfile.voiceStyle : null,
        birthYear: birthYear,
        city: typeof rawProfile.city === 'string' ? rawProfile.city : '',
        personalityTags: personalityTags,
        personalityNote: typeof rawProfile.personalityNote === 'string' ? rawProfile.personalityNote : '',
        strengths: typeof rawProfile.strengths === 'string' ? rawProfile.strengths : '',
        avoidTopics: typeof rawProfile.avoidTopics === 'string' ? rawProfile.avoidTopics : '',
        goal: goal
    };
}
// GIAI ĐOẠN 2: Cấu trúc mặc định cho tuỳ chọn Tab ✍️ Soạn tin
function createDefaultComposePrefs() {
    return {
        inputMode: 'draft',
        contextThreadId: 'active',
        goal: 'Đồng cảm & hỏi thăm tự nhiên',
        pronoun: 'mình - bạn',
        abbrevLevel: 2,
        humorLevel: 2,
        lengthLevel: 2,
        emojiLevel: 2
    };
}

function normalizeComposePrefs(rawPrefs) {
    const defaults = createDefaultComposePrefs();
    if (!rawPrefs || typeof rawPrefs !== 'object') return defaults;
    return {
        inputMode: rawPrefs.inputMode === 'idea' ? 'idea' : 'draft',
        contextThreadId: typeof rawPrefs.contextThreadId === 'string' ? rawPrefs.contextThreadId : 'active',
        goal: typeof rawPrefs.goal === 'string' && rawPrefs.goal ? rawPrefs.goal : defaults.goal,
        pronoun: typeof rawPrefs.pronoun === 'string' && rawPrefs.pronoun ? rawPrefs.pronoun : defaults.pronoun,
        abbrevLevel: Number.isInteger(rawPrefs.abbrevLevel) ? rawPrefs.abbrevLevel : defaults.abbrevLevel,
        humorLevel: Number.isInteger(rawPrefs.humorLevel) ? rawPrefs.humorLevel : defaults.humorLevel,
        lengthLevel: Number.isInteger(rawPrefs.lengthLevel) ? rawPrefs.lengthLevel : defaults.lengthLevel,
        emojiLevel: Number.isInteger(rawPrefs.emojiLevel) ? rawPrefs.emojiLevel : defaults.emojiLevel
    };
}

// GIAI ĐOẠN 3: Cấu trúc mặc định cho Tab 💘 Làm quen
function createDefaultDatingState() {
    return {
        matchName: '',
        appName: 'Tinder',
        goal: 'Làm quen / Bạn bè trước',
        bioText: '',
        pronoun: 'mình - bạn',
        abbrevLevel: 2,
        humorLevel: 2,
        activeQuestionCategory: 'ALL',
        lastResult: null
    };
}

function normalizeDatingState(rawDating) {
    const defaults = createDefaultDatingState();
    if (!rawDating || typeof rawDating !== 'object') return defaults;
    return {
        matchName: typeof rawDating.matchName === 'string' ? rawDating.matchName : '',
        appName: typeof rawDating.appName === 'string' && rawDating.appName ? rawDating.appName : defaults.appName,
        goal: typeof rawDating.goal === 'string' && rawDating.goal ? rawDating.goal : defaults.goal,
        bioText: typeof rawDating.bioText === 'string' ? rawDating.bioText : '',
        pronoun: typeof rawDating.pronoun === 'string' && rawDating.pronoun ? rawDating.pronoun : defaults.pronoun,
        abbrevLevel: Number.isInteger(rawDating.abbrevLevel) ? rawDating.abbrevLevel : defaults.abbrevLevel,
        humorLevel: Number.isInteger(rawDating.humorLevel) ? rawDating.humorLevel : defaults.humorLevel,
        activeQuestionCategory: typeof rawDating.activeQuestionCategory === 'string' ? rawDating.activeQuestionCategory : 'ALL',
        lastResult: rawDating.lastResult && typeof rawDating.lastResult === 'object' ? rawDating.lastResult : null
    };
}

// GIAI ĐOẠN 4: Cấu trúc mặc định cho Tab 📡 Phân tích
function createDefaultAnalyzeState() {
    return {
        subMode: 'signal',
        threadId: 'active',
        chatTextInput: '',
        quickSituation: '',
        quickSituationNote: '',
        pronoun: 'mình - bạn',
        abbrevLevel: 2,
        humorLevel: 2,
        selectedBubbleIdx: 0,
        lastSignalResult: null,
        lastRescueResult: null
    };
}

function normalizeAnalyzeState(rawAnalyze) {
    const defaults = createDefaultAnalyzeState();
    if (!rawAnalyze || typeof rawAnalyze !== 'object') return defaults;
    return {
        subMode: rawAnalyze.subMode === 'rescue' ? 'rescue' : 'signal',
        threadId: typeof rawAnalyze.threadId === 'string' ? rawAnalyze.threadId : 'active',
        chatTextInput: typeof rawAnalyze.chatTextInput === 'string' ? rawAnalyze.chatTextInput : '',
        quickSituation: typeof rawAnalyze.quickSituation === 'string' ? rawAnalyze.quickSituation : '',
        quickSituationNote: typeof rawAnalyze.quickSituationNote === 'string' ? rawAnalyze.quickSituationNote : '',
        pronoun: typeof rawAnalyze.pronoun === 'string' && rawAnalyze.pronoun ? rawAnalyze.pronoun : defaults.pronoun,
        abbrevLevel: Number.isInteger(rawAnalyze.abbrevLevel) ? rawAnalyze.abbrevLevel : defaults.abbrevLevel,
        humorLevel: Number.isInteger(rawAnalyze.humorLevel) ? rawAnalyze.humorLevel : defaults.humorLevel,
        selectedBubbleIdx: Number.isInteger(rawAnalyze.selectedBubbleIdx) ? rawAnalyze.selectedBubbleIdx : 0,
        lastSignalResult: rawAnalyze.lastSignalResult && typeof rawAnalyze.lastSignalResult === 'object' ? rawAnalyze.lastSignalResult : null,
        lastRescueResult: rawAnalyze.lastRescueResult && typeof rawAnalyze.lastRescueResult === 'object' ? rawAnalyze.lastRescueResult : null
    };
}

// GIAI ĐOẠN 5: Cấu trúc mặc định cho Tab 🎭 Luyện tập nâng cấp (Mục 5.1 -> 5.12)
function createDefaultRoleplayState() {
    return {
        personaId: 'extrovert_fun',
        persona: 'Một bạn nữ 20 tuổi hướng ngoại, vui tính, hay đùa, thích trà sữa và chụp ảnh dạo',
        characterCard: {
            name: 'Khánh Linh',
            age: 20,
            occupation: 'Sinh viên năm 2 ngành Truyền thông đa phương tiện',
            interests: 'Uống trà sữa ô long, chụp ảnh film dạo phố, xem vlog du lịch, nghe nhạc US-UK',
            messagingStyle: 'Nhắn nhanh, hay tách 2 tin ngắn, dùng từ "haha", "trời ơi", kéo dài chữ và dùng emoji 😆✨',
            likesDislikes: 'Thích người nói chuyện tự nhiên, hài hước, biết chia sẻ; không thích câu thính văn mẫu hoặc hỏi cung',
            summary: 'Hướng ngoại, vui tính, hay đùa'
        },
        customCharacters: [],
        situationId: 'ig_story_cafe',
        situation: 'Mới follow nhau trên Instagram, bạn nam vừa rep story ảnh đi uống cafe cuối tuần của bạn',
        difficulty: 'normal', // 'easy' | 'normal' | 'hard'
        missionId: 'none',    // 'none' | 'sustain_10' | 'ask_back_3' | 'invite_cafe' | 'revive_cold'
        missionCompleted: false,
        rehearsalThreadId: '',
        interest: 55,
        mood: 'vui',
        interestCurve: [55],
        hintsUsed: 0,
        lastHint: null,
        askedBackCount: 0,
        acceptedHangout: false,
        isEndedByLowInterest: false,
        history: [],          // Mảng các lượt hội thoại (lưu kèm meta: {role, parts, turnMeta, isSystemTrigger})
        lastEvaluation: null, // Kết quả chấm điểm 6 tiêu chí & turnReviews[]
        isFinished: false
    };
}

function normalizeRoleplayState(rawRp) {
    const defaults = createDefaultRoleplayState();
    if (!rawRp || typeof rawRp !== 'object') return defaults;
    return {
        ...defaults,
        ...rawRp,
        personaId: typeof rawRp.personaId === 'string' ? rawRp.personaId : defaults.personaId,
        persona: typeof rawRp.persona === 'string' && rawRp.persona ? rawRp.persona : defaults.persona,
        characterCard: rawRp.characterCard && typeof rawRp.characterCard === 'object' ? { ...defaults.characterCard, ...rawRp.characterCard } : defaults.characterCard,
        customCharacters: Array.isArray(rawRp.customCharacters) ? rawRp.customCharacters : [],
        situationId: typeof rawRp.situationId === 'string' ? rawRp.situationId : defaults.situationId,
        situation: typeof rawRp.situation === 'string' && rawRp.situation ? rawRp.situation : defaults.situation,
        difficulty: ['easy', 'normal', 'hard'].includes(rawRp.difficulty) ? rawRp.difficulty : 'normal',
        missionId: typeof rawRp.missionId === 'string' ? rawRp.missionId : 'none',
        missionCompleted: Boolean(rawRp.missionCompleted),
        rehearsalThreadId: typeof rawRp.rehearsalThreadId === 'string' ? rawRp.rehearsalThreadId : '',
        interest: typeof rawRp.interest === 'number' ? Math.max(0, Math.min(100, Math.round(rawRp.interest))) : 55,
        mood: typeof rawRp.mood === 'string' ? rawRp.mood : 'bình thường',
        interestCurve: Array.isArray(rawRp.interestCurve) && rawRp.interestCurve.length > 0 ? rawRp.interestCurve : [55],
        hintsUsed: Number.isInteger(rawRp.hintsUsed) ? rawRp.hintsUsed : 0,
        lastHint: rawRp.lastHint && typeof rawRp.lastHint === 'object' ? rawRp.lastHint : null,
        askedBackCount: Number.isInteger(rawRp.askedBackCount) ? rawRp.askedBackCount : 0,
        acceptedHangout: Boolean(rawRp.acceptedHangout),
        isEndedByLowInterest: Boolean(rawRp.isEndedByLowInterest),
        history: Array.isArray(rawRp.history) ? rawRp.history : [],
        lastEvaluation: rawRp.lastEvaluation && typeof rawRp.lastEvaluation === 'object' ? rawRp.lastEvaluation : null,
        isFinished: Boolean(rawRp.isFinished)
    };
}

const appState = {
    currentNav: 'modeA',
    threads: [],
    activeThreadId: null,
    myProfile: createDefaultMyProfile(),
    compose: {
        prefs: createDefaultComposePrefs(),
        draftInput: '',
        herContextMsg: '',
        selectedVersionIndex: 1,
        sessionHistory: [],
        refinementCount: 0,
        lastResult: null
    },
    composeDrafts: [],
    dating: createDefaultDatingState(),
    datingHistory: [],
    analyze: createDefaultAnalyzeState(),
    roleplay: createDefaultRoleplayState(),
    roleplayHistory: [] // Mục 5.11: Lịch sử các buổi luyện tập đã hoàn thành
};

// Đọc và lưu API Key / Model
function getApiKey() {
    return (localStorage.getItem(STORAGE_KEYS.API_KEY) || '').trim();
}
function getModelName() {
    return (localStorage.getItem(STORAGE_KEYS.MODEL) || DEFAULT_MODEL).trim() || DEFAULT_MODEL;
}

// Lưu danh sách Threads vào localStorage
function saveThreadsToStorage() {
    try {
        if (typeof sanitizeHistoryForStorage === 'function') {
            appState.threads.forEach(t => {
                if (Array.isArray(t.apiHistory)) {
                    t.apiHistory = sanitizeHistoryForStorage(t.apiHistory);
                }
            });
        }
        localStorage.setItem(STORAGE_KEYS.THREADS_A, JSON.stringify(appState.threads));
        if (appState.activeThreadId) {
            localStorage.setItem(STORAGE_KEYS.ACTIVE_THREAD_ID, appState.activeThreadId);
        }
    } catch (e) {
        console.error('Không thể lưu Threads vào localStorage:', e);
    }
}

function loadThreadsFromStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.THREADS_A);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) {
                appState.threads = parsed.map((t, idx) => normalizeThread(t, idx));
            }
        }
    } catch (e) {
        appState.threads = [];
    }

    if (appState.threads.length === 0) {
        const initialThread = createDefaultThread('Bạn nữ mới quen 🌸');
        appState.threads = [initialThread];
        appState.activeThreadId = initialThread.id;
        saveThreadsToStorage();
    } else {
        const savedActiveId = localStorage.getItem(STORAGE_KEYS.ACTIVE_THREAD_ID);
        const exists = appState.threads.some(t => t.id === savedActiveId);
        appState.activeThreadId = exists ? savedActiveId : appState.threads[0].id;
        saveThreadsToStorage();
    }
}

function getActiveThread() {
    let thread = appState.threads.find(t => t.id === appState.activeThreadId);
    if (!thread) {
        thread = appState.threads[0];
        appState.activeThreadId = thread.id;
    }
    if (!Array.isArray(thread.messages)) {
        thread.messages = [];
    }
    if (!Array.isArray(thread.signalHistory)) {
        thread.signalHistory = [];
    }
    return thread;
}

// Lưu & tải "Hồ sơ của tôi"
function saveMyProfileToStorage() {
    try {
        localStorage.setItem(STORAGE_KEYS.MY_PROFILE, JSON.stringify(appState.myProfile));
    } catch (e) {
        console.error('Không thể lưu Hồ sơ của tôi:', e);
    }
}

function loadMyProfileFromStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.MY_PROFILE);
        if (raw) {
            appState.myProfile = normalizeMyProfile(JSON.parse(raw));
        } else {
            appState.myProfile = createDefaultMyProfile();
        }
    } catch (e) {
        appState.myProfile = createDefaultMyProfile();
    }
}

function buildThreadProfilePromptContext(threadObj) {
    const t = threadObj || getActiveThread();
    if (!t || !t.profile || typeof t.profile !== 'object') return '';

    const prof = t.profile;
    const lines = [`- HỒ SƠ CÔ ẤY TỪ APP HẸN HÒ (${prof.appName || 'App hẹn hò'} - Mục tiêu: ${prof.goal || 'Làm quen'}):`];
    if (prof.profileSummary) {
        lines.push(`  + Tóm tắt hồ sơ cô ấy: ${prof.profileSummary}`);
    }
    if (prof.bioText) {
        lines.push(`  + Nội dung Bio/Prompt gốc: "${prof.bioText}"`);
    }
    if (Array.isArray(prof.hooks) && prof.hooks.length > 0) {
        lines.push(`  + Các điểm bắt chuyện (Hooks) đã biết về cô ấy:`);
        prof.hooks.forEach((h, idx) => {
            lines.push(`    * Hook ${idx + 1} (${h.title}): ${h.observation} -> Gợi mở: ${h.starterQuestion}`);
        });
    }
    return lines.join('\n');
}

function buildMyProfilePromptContext() {
    const p = normalizeMyProfile(appState.myProfile || createDefaultMyProfile());
    const hasBasicInfo = Boolean(
        p.birthYear ||
        (p.city && p.city.trim()) ||
        (p.interests && p.interests.trim()) ||
        (p.occupation && p.occupation.trim()) ||
        (p.factsToShare && p.factsToShare.trim()) ||
        (Array.isArray(p.personalityTags) && p.personalityTags.length > 0) ||
        (p.personalityNote && p.personalityNote.trim()) ||
        (p.strengths && p.strengths.trim()) ||
        (p.avoidTopics && p.avoidTopics.trim()) ||
        (p.goal && p.goal.trim())
    );
    const hasVoice = Boolean(p.voiceStyle && p.voiceStyle.summary);

    const lines = [];
    if (!hasBasicInfo && !hasVoice) {
        lines.push(`- Hồ sơ cá nhân của tôi: Chưa điền. Khi cần lồng ghép thông tin/sở thích cá nhân của tôi, BẮT BUỘC để trong ngoặc vuông kiểu [món bạn thích], [bộ phim bạn đang xem] để tôi tự điền, không tự bịa.`);
    } else {
        lines.push(`- HỒ SƠ THẬT CỦA TÔI (Hãy dùng đúng các thông tin này khi phù hợp, phần nào chưa có mới dùng ngoặc vuông [...]):`);
        if (p.birthYear) {
            const currentYear = new Date().getFullYear();
            const age = currentYear - p.birthYear;
            lines.push(`  + Năm sinh: ${p.birthYear} (khoảng ${age} tuổi)`);
            if (age < 18) {
                lines.push(`  + LƯU Ý ĐỘ TUỔI: người dùng dưới 18 tuổi: chỉ gợi ý nhắn tin kết bạn thân thiện, phù hợp lứa tuổi, không tán tỉnh hay hẹn hò.`);
            }
        }
        if (p.city && p.city.trim()) {
            lines.push(`  + Nơi đang ở / Quê: ${p.city.trim()}`);
        }
        if (p.occupation && p.occupation.trim()) {
            lines.push(`  + Công việc / Học tập: ${p.occupation.trim()}`);
        }
        if (p.interests && p.interests.trim()) {
            lines.push(`  + Sở thích thật: ${p.interests.trim()}`);
        }
        const tagsPart = Array.isArray(p.personalityTags) && p.personalityTags.length > 0
            ? p.personalityTags.join(', ')
            : '';
        const notePart = p.personalityNote && p.personalityNote.trim()
            ? p.personalityNote.trim()
            : '';
        if (tagsPart || notePart) {
            const combinedPersonality = tagsPart && notePart
                ? `${tagsPart} (${notePart})`
                : (tagsPart || notePart);
            lines.push(`  + Tính cách: ${combinedPersonality}`);
        }
        if (p.strengths && p.strengths.trim()) {
            lines.push(`  + Điều tôi tự tin / Điểm đáng yêu: ${p.strengths.trim()}`);
        }
        if (p.factsToShare && p.factsToShare.trim()) {
            lines.push(`  + Điều thật muốn chia sẻ: ${p.factsToShare.trim()}`);
        }
        if (p.goal && p.goal.trim()) {
            lines.push(`  + Mục tiêu của tôi: ${p.goal.trim()}`);
        }
        if (p.avoidTopics && p.avoidTopics.trim()) {
            lines.push(`  + Điều tôi muốn tránh: ${p.avoidTopics.trim()} — CHỈ DẪN BẮT BUỘC: TUYỆT ĐỐI không đưa chủ đề trong avoidTopics (${p.avoidTopics.trim()}) vào bất kỳ gợi ý hay câu hỏi nào.`);
        }
        if (hasVoice) {
            const v = p.voiceStyle;
            lines.push(`- PHONG CÁCH GIỌNG VĂN CỦA TÔI (Hãy viết theo giọng này):`);
            lines.push(`  + Tổng quan: ${v.summary}`);
            lines.push(`  + Độ dài & nhịp câu: ${v.avgLength}`);
            lines.push(`  + Từ hay dùng / viết tắt: ${v.commonWords}`);
            lines.push(`  + Thói quen dùng emoji: ${v.emojiHabit}`);
            lines.push(`  + Lưu ý giọng văn: ${v.toneNotes}`);
        }
    }

    const activeThread = appState.threads.find(t => t.id === appState.activeThreadId);
    if (activeThread && activeThread.profile) {
        const matchCtx = buildThreadProfilePromptContext(activeThread);
        if (matchCtx) {
            lines.push(matchCtx);
        }
    }

    return lines.join('\n');
}
// GIAI ĐOẠN 2: Lưu & tải trạng thái Soạn tin
function saveComposeStateToStorage() {
    try {
        localStorage.setItem(STORAGE_KEYS.COMPOSE_PREFS, JSON.stringify(appState.compose.prefs));
        localStorage.setItem(STORAGE_KEYS.COMPOSE_DRAFTS, JSON.stringify(appState.composeDrafts.slice(0, 20)));
    } catch (e) {
        console.error('Không thể lưu dữ liệu Soạn tin vào localStorage:', e);
    }
}

function loadComposeStateFromStorage() {
    try {
        const rawPrefs = localStorage.getItem(STORAGE_KEYS.COMPOSE_PREFS);
        if (rawPrefs) {
            appState.compose.prefs = normalizeComposePrefs(JSON.parse(rawPrefs));
        } else {
            appState.compose.prefs = createDefaultComposePrefs();
        }
    } catch (e) {
        appState.compose.prefs = createDefaultComposePrefs();
    }

    try {
        const rawDrafts = localStorage.getItem(STORAGE_KEYS.COMPOSE_DRAFTS);
        if (rawDrafts) {
            const parsed = JSON.parse(rawDrafts);
            if (Array.isArray(parsed)) {
                appState.composeDrafts = parsed
                    .filter(item => item && typeof item === 'object' && typeof item.originalInput === 'string' && item.result)
                    .slice(0, 20);
            }
        }
    } catch (e) {
        appState.composeDrafts = [];
    }
}

function saveComposeDraftEntry({ inputMode, originalInput, herContextMsg, goal, pronoun, prefs, result }) {
    const cleanInput = String(originalInput || '').trim();
    if (!cleanInput || !result) return;

    const entry = {
        id: 'draft_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
        createdAt: Date.now(),
        inputMode: inputMode === 'idea' ? 'idea' : 'draft',
        originalInput: cleanInput,
        herContextMsg: String(herContextMsg || '').trim(),
        goal: goal || '',
        pronoun: pronoun || 'mình - bạn',
        prefs: { ...prefs },
        result: result
    };

    if (appState.composeDrafts.length > 0 && appState.composeDrafts[0].originalInput === cleanInput) {
        appState.composeDrafts[0] = entry;
    } else {
        appState.composeDrafts.unshift(entry);
    }

    if (appState.composeDrafts.length > 20) {
        appState.composeDrafts = appState.composeDrafts.slice(0, 20);
    }
    saveComposeStateToStorage();
}

// GIAI ĐOẠN 3: Lưu & tải trạng thái Làm quen
function saveDatingStateToStorage() {
    try {
        localStorage.setItem(STORAGE_KEYS.DATING_STATE, JSON.stringify(appState.dating));
        localStorage.setItem(STORAGE_KEYS.DATING_HISTORY, JSON.stringify((appState.datingHistory || []).slice(0, 15)));
    } catch (e) {
        console.error('Không thể lưu dữ liệu Làm quen vào localStorage:', e);
    }
}

function loadDatingStateFromStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.DATING_STATE);
        if (raw) {
            appState.dating = normalizeDatingState(JSON.parse(raw));
        } else {
            appState.dating = createDefaultDatingState();
        }
    } catch (e) {
        appState.dating = createDefaultDatingState();
    }

    try {
        const rawHist = localStorage.getItem(STORAGE_KEYS.DATING_HISTORY);
        if (rawHist) {
            const parsed = JSON.parse(rawHist);
            if (Array.isArray(parsed)) {
                appState.datingHistory = parsed.slice(0, 15);
            }
        }
    } catch (e) {
        appState.datingHistory = [];
    }
}

function saveDatingHistoryEntry({ matchName, appName, goal, bioText, result }) {
    if (!result) return;
    const entry = {
        id: 'match_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
        createdAt: Date.now(),
        matchName: String(matchName || '').trim() || `Match ${appName || 'Tinder'}`,
        appName: appName || 'Tinder',
        goal: goal || 'Làm quen / Bạn bè trước',
        bioText: String(bioText || '').trim(),
        result: result
    };
    appState.datingHistory.unshift(entry);
    if (appState.datingHistory.length > 15) {
        appState.datingHistory = appState.datingHistory.slice(0, 15);
    }
    saveDatingStateToStorage();
}

// GIAI ĐOẠN 4: Lưu & tải trạng thái Phân tích
function saveAnalyzeStateToStorage() {
    try {
        localStorage.setItem(STORAGE_KEYS.ANALYZE_STATE, JSON.stringify(appState.analyze));
    } catch (e) {
        console.error('Không thể lưu dữ liệu Phân tích vào localStorage:', e);
    }
}

function loadAnalyzeStateFromStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.ANALYZE_STATE);
        if (raw) {
            appState.analyze = normalizeAnalyzeState(JSON.parse(raw));
        } else {
            appState.analyze = createDefaultAnalyzeState();
        }
    } catch (e) {
        appState.analyze = createDefaultAnalyzeState();
    }
}

// GIAI ĐOẠN 5: Lưu & tải trạng thái Luyện tập (Chế độ B) + Lịch sử các buổi tập (Mục 5.11)
function saveRoleplayState() {
    try {
        localStorage.setItem(STORAGE_KEYS.ROLEPLAY_STATE, JSON.stringify(appState.roleplay));
    } catch (e) {}
}

function loadRoleplayState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.ROLEPLAY_STATE);
        if (raw) {
            appState.roleplay = normalizeRoleplayState(JSON.parse(raw));
        } else {
            appState.roleplay = createDefaultRoleplayState();
        }
    } catch (e) {
        appState.roleplay = createDefaultRoleplayState();
    }
}

function saveRoleplayHistoryToStorage() {
    try {
        localStorage.setItem(STORAGE_KEYS.ROLEPLAY_HISTORY, JSON.stringify((appState.roleplayHistory || []).slice(0, 25)));
    } catch (e) {
        console.error('Không thể lưu lịch sử luyện tập:', e);
    }
}

function loadRoleplayHistoryFromStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.ROLEPLAY_HISTORY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
                appState.roleplayHistory = parsed.slice(0, 25);
            }
        }
    } catch (e) {
        appState.roleplayHistory = [];
    }
}