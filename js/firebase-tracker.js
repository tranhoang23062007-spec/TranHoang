// js/firebase-tracker.js
const FIREBASE_CONFIG = {
    apiKey: "AIzaSyDeRTXITm6w_F6_DYDAr2TFHfv8-ZVg2I",
    authDomain: "tranhoang-8eb3f.firebaseapp.com",
    projectId: "tranhoang-8eb3f",
    storageBucket: "tranhoang-8eb3f.firebasestorage.app",
    messagingSenderId: "624580386520",
    appId: "1:624580386520:web:c7900bb3a45fe0c7b841ad",
    measurementId: "G-3943QFH7QV"
};

const DEVICE_ID_STORAGE_KEY = 'tranhoangspfa_device_id';
let firestoreDb = null;

function getOrCreateAnonymousDeviceId() {
    try {
        let devId = localStorage.getItem(DEVICE_ID_STORAGE_KEY);
        if (!devId) {
            devId = 'user_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
            localStorage.setItem(DEVICE_ID_STORAGE_KEY, devId);
        }
        return devId;
    } catch (e) {
        return 'user_unknown';
    }
}

function initFirebaseTracker() {
    try {
        if (typeof firebase === 'undefined' || !FIREBASE_CONFIG.projectId) {
            return false;
        }
        if (!firebase.apps.length) {
            firebase.initializeApp(FIREBASE_CONFIG);
        }
        firestoreDb = firebase.firestore();
        return true;
    } catch (err) {
        return false;
    }
}

function logUsageEvent(eventName, extraData = {}) {
    try {
        if (!firestoreDb) return;
        const isMobile = window.innerWidth <= 768;
        const payload = {
            event: eventName,
            deviceId: getOrCreateAnonymousDeviceId(),
            deviceType: isMobile ? 'Mobile' : 'Desktop',
            screenSize: `${window.innerWidth}x${window.innerHeight}`,
            currentNav: (typeof appState !== 'undefined' && appState.currentNav) ? appState.currentNav : 'modeA',
            toneLevel: (typeof ToneControl !== 'undefined' && typeof ToneControl.getLevel === 'function') ? ToneControl.getLevel() : 2,
            timeVN: new Date().toLocaleString('vi-VN'),
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            ...extraData
        };
        firestoreDb.collection('usage_logs').add(payload).catch(() => {});
    } catch (e) {}
}

window.addEventListener('DOMContentLoaded', () => {
    if (!initFirebaseTracker()) return;
    logUsageEvent('app_open', { referrer: document.referrer || 'direct' });

    document.querySelectorAll('.bottom-nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            logUsageEvent('switch_tab', { targetTab: btn.getAttribute('data-nav') || '' });
        });
    });

    const btnModeA = document.getElementById('btnSubmitModeA');
    if (btnModeA) {
        btnModeA.addEventListener('click', () => {
            const thread = typeof getActiveThread === 'function' ? getActiveThread() : {};
            logUsageEvent('submit_mode_a', { pronoun: thread.pronoun || '', closeness: thread.closeness || '' });
        });
    }

    const btnCompose = document.getElementById('btnSubmitCompose');
    if (btnCompose) {
        btnCompose.addEventListener('click', () => {
            const prefs = (typeof appState !== 'undefined' && appState.compose?.prefs) ? appState.compose.prefs : {};
            logUsageEvent('submit_compose', { inputMode: prefs.inputMode || 'draft', pronoun: prefs.pronoun || '' });
        });
    }

    document.body.addEventListener('click', (e) => {
        if (e.target.closest('#btnSubmitDating')) logUsageEvent('submit_dating');
        if (e.target.closest('#btnSubmitAnalyze')) logUsageEvent('submit_analyze');
        if (e.target.closest('#btnSendRoleplay')) logUsageEvent('send_roleplay_msg');
    });
});