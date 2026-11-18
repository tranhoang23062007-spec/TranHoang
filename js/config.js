/**
 * ============================================================================
 * CẤU HÌNH CHUNG & KHOÁ LƯU TRỮ LOCALSTORAGE (GIAI ĐOẠN 0 -> GIAI ĐOẠN 5)
 * ============================================================================
 */
const STORAGE_KEYS = {
    API_KEY: 'tranhoangspfa_api_key',
    MODEL: 'tranhoangspfa_model',
    THEME: 'tranhoangspfa_theme',
    THREADS_A: 'tranhoangspfa_threads_a',
    ACTIVE_THREAD_ID: 'tranhoangspfa_active_thread_id',
    ROLEPLAY_STATE: 'tranhoangspfa_roleplay_state',
    ROLEPLAY_HISTORY: 'tranhoangspfa_roleplay_history',
    PRIVACY_NOTICE_SEEN: 'tranhoangspfa_privacy_notice_seen',
    MY_PROFILE: 'tranhoangspfa_my_profile',
    COMPOSE_PREFS: 'tranhoangspfa_compose_prefs',
    COMPOSE_DRAFTS: 'tranhoangspfa_compose_drafts',
    DATING_STATE: 'tranhoangspfa_dating_state',
    DATING_HISTORY: 'tranhoangspfa_dating_history',
    ANALYZE_STATE: 'tranhoangspfa_analyze_state'
};

const DEFAULT_MODEL = 'gemini-2.5-flash';