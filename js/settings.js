/**
 * ============================================================================
 * 9. HỒ SƠ CỦA TÔI (MỤC 1.8), XUẤT/NHẬP DỮ LIỆU & XOÁ DỮ LIỆU (GIAI ĐOẠN 0 -> 5C)
 * ============================================================================
 */

// Đồng bộ dữ liệu "Hồ sơ của tôi" lên giao diện (Mục 1.8)
function syncMyProfileUI() {
    const p = appState.myProfile || createDefaultMyProfile();
    const occEl = document.getElementById('myProfileOccupationInput');
    const intEl = document.getElementById('myProfileInterestsInput');
    const factsEl = document.getElementById('myProfileFactsInput');
    const samplesEl = document.getElementById('myProfileSampleMsgsInput');

    if (occEl) occEl.value = p.occupation || '';
    if (intEl) intEl.value = p.interests || '';
    if (factsEl) factsEl.value = p.factsToShare || '';
    if (samplesEl) samplesEl.value = p.sampleMessages || '';

    renderMyVoiceStyleCard();
}

// Hiển thị thẻ tóm tắt phong cách giọng văn của tôi
function renderMyVoiceStyleCard() {
    const box = document.getElementById('myVoiceStyleResultBox');
    const headerStatus = document.getElementById('myProfileActiveBadge');
    if (!box) return;

    const p = appState.myProfile || createDefaultMyProfile();
    const hasBasic = Boolean(
        (p.occupation && p.occupation.trim()) ||
        (p.interests && p.interests.trim()) ||
        (p.factsToShare && p.factsToShare.trim())
    );
    const v = p.voiceStyle;

    if (headerStatus) {
        if (hasBasic || v) {
            headerStatus.textContent = v ? '🪪 Đã học giọng của bạn' : '🪪 Đã có hồ sơ';
            headerStatus.className = 'text-[11px] font-bold px-2.5 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300/60 transition truncate max-w-[130px]';
        } else {
            headerStatus.textContent = '🪪 Hồ sơ của tôi';
            headerStatus.className = 'text-[11px] font-bold px-2.5 py-1.5 rounded-xl bg-warm-100 hover:bg-warm-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-warm-200 dark:border-stone-700 transition truncate max-w-[130px]';
        }
    }

    if (!v || !v.summary) {
        box.classList.add('hidden');
        box.innerHTML = '';
        return;
    }

    box.classList.remove('hidden');
    box.innerHTML = `
        <div class="rounded-xl bg-warm-50 dark:bg-stone-900 border border-warm-200 dark:border-stone-700 p-3.5 space-y-2 text-xs animate-pop">
            <div class="flex items-center justify-between">
                <span class="font-extrabold text-warm-600 dark:text-amber-400">🎙️ Bản tóm tắt giọng văn của bạn (đang áp dụng toàn app):</span>
                <button type="button" id="btnClearVoiceStyle" class="text-[11px] text-red-500 hover:underline font-semibold">Xoá giọng</button>
            </div>
            <p class="text-stone-700 dark:text-stone-200 leading-relaxed">
                <strong>Tổng quan:</strong> ${escapeHtml(v.summary)}
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                <div class="p-2 rounded-lg bg-white dark:bg-stone-800 border border-warm-100 dark:border-stone-700">
                    <div class="text-[10px] font-bold text-stone-400 uppercase">Độ dài câu</div>
                    <div class="text-stone-800 dark:text-stone-200 mt-0.5">${escapeHtml(v.avgLength)}</div>
                </div>
                <div class="p-2 rounded-lg bg-white dark:bg-stone-800 border border-warm-100 dark:border-stone-700">
                    <div class="text-[10px] font-bold text-stone-400 uppercase">Từ hay dùng</div>
                    <div class="text-stone-800 dark:text-stone-200 mt-0.5">${escapeHtml(v.commonWords)}</div>
                </div>
                <div class="p-2 rounded-lg bg-white dark:bg-stone-800 border border-warm-100 dark:border-stone-700">
                    <div class="text-[10px] font-bold text-stone-400 uppercase">Thói quen Emoji</div>
                    <div class="text-stone-800 dark:text-stone-200 mt-0.5">${escapeHtml(v.emojiHabit)}</div>
                </div>
            </div>
            <p class="text-[11px] text-stone-500 dark:text-stone-400 italic">
                💡 Chỉ dẫn cho AI: ${escapeHtml(v.toneNotes)}
            </p>
        </div>
    `;

    const btnClearVoice = document.getElementById('btnClearVoiceStyle');
    if (btnClearVoice) {
        btnClearVoice.addEventListener('click', () => {
            appState.myProfile.voiceStyle = null;
            saveMyProfileToStorage();
            renderMyVoiceStyleCard();
            showToast('Đã xoá bản phân tích giọng văn!', '🗑️');
        });
    }
}

// Lưu các trường thông tin trong Hồ sơ của tôi (Mục 1.8)
function handleSaveMyProfile(showNotification = true) {
    const occEl = document.getElementById('myProfileOccupationInput');
    const intEl = document.getElementById('myProfileInterestsInput');
    const factsEl = document.getElementById('myProfileFactsInput');
    const samplesEl = document.getElementById('myProfileSampleMsgsInput');

    appState.myProfile.occupation = occEl ? occEl.value.trim() : '';
    appState.myProfile.interests = intEl ? intEl.value.trim() : '';
    appState.myProfile.factsToShare = factsEl ? factsEl.value.trim() : '';
    appState.myProfile.sampleMessages = samplesEl ? samplesEl.value.trim() : '';

    saveMyProfileToStorage();
    renderMyVoiceStyleCard();
    if (showNotification) {
        showToast('Đã lưu "Hồ sơ của tôi"! Các gợi ý sẽ dùng thông tin thật này.', '🪪');
    }
}

// Mục 1.8: Nút "✨ Phân tích giọng của tôi" gọi Gemini tóm tắt phong cách nhắn tin
async function handleAnalyzeMyVoiceStyle() {
    handleSaveMyProfile(false);
    const p = appState.myProfile;
    const samples = (p.sampleMessages || '').trim();

    if (!samples || samples.split(/\n+/).filter(line => line.trim()).length < 2) {
        showToast('Hãy nhập ít nhất vài câu tin nhắn mẫu (mỗi dòng 1 tin) để AI phân tích giọng của bạn nhé!', '✍️');
        const samplesEl = document.getElementById('myProfileSampleMsgsInput');
        if (samplesEl) samplesEl.focus();
        return;
    }

    const btn = document.getElementById('btnAnalyzeMyVoice');
    const box = document.getElementById('myVoiceStyleResultBox');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<span class="animate-spin">⏳</span><span>Đang phân tích giọng...</span>`;
    }
    if (box) {
        box.classList.remove('hidden');
        box.innerHTML = `
            <div class="rounded-xl bg-warm-100 dark:bg-stone-800 p-3 text-xs text-stone-700 dark:text-stone-300 font-semibold">
                ⏳ Đang đọc các tin nhắn mẫu để đúc kết phong cách ngôn ngữ của bạn...
            </div>
        `;
    }

    const promptInput = `Dưới đây là thông tin và các tin nhắn mẫu thực tế của tôi:
- Đang học / làm gì: ${p.occupation || 'Chưa ghi'}
- Sở thích: ${p.interests || 'Chưa ghi'}
- Điều muốn chia sẻ: ${p.factsToShare || 'Chưa ghi'}
- Các tin nhắn mẫu của tôi:
${samples}

Hãy phân tích phong cách giọng văn của tôi (độ dài câu, từ viết tắt/từ hay dùng, thói quen dùng emoji) và trả về JSON theo đúng Schema.`;

    try {
        const { parsed } = await callGeminiWithSchemaRetry(
            SYSTEM_PROMPT_ANALYZE_MY_VOICE,
            [],
            promptInput,
            SCHEMA_MY_VOICE_STYLE,
            validateMyVoiceStyleJson,
            0.4
        );

        appState.myProfile.voiceStyle = {
            ...parsed,
            updatedAt: Date.now()
        };
        saveMyProfileToStorage();
        renderMyVoiceStyleCard();
        showToast('Đã phân tích & lưu giọng văn của bạn thành công!', '🎙️');
    } catch (err) {
        if (box) {
            renderErrorCard('myVoiceStyleResultBox', `Lỗi phân tích giọng văn: ${err.message}`);
        }
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = `<span>✨</span><span>Phân tích giọng của tôi</span>`;
        }
    }
}

// Mục 5.11: Xuất toàn bộ dữ liệu (kèm roleplay & roleplayHistory) ra file JSON
function handleExportData() {
    const exportPayload = {
        appName: 'TranHoangSpFA',
        stage: 'Stage_5C',
        exportedAt: new Date().toISOString(),
        model: getModelName(),
        myProfile: appState.myProfile,
        composePrefs: appState.compose.prefs,
        composeDrafts: appState.composeDrafts,
        dating: appState.dating,
        datingHistory: appState.datingHistory,
        analyze: appState.analyze,
        threads: appState.threads,
        activeThreadId: appState.activeThreadId,
        roleplay: appState.roleplay,
        roleplayHistory: appState.roleplayHistory
    };

    const jsonStr = JSON.stringify(exportPayload, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `TranHoangSpFA_Backup_${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Đã tải xuống file sao lưu (.json) kèm lịch sử luyện tập!', '📥');
}

// Nhập dữ liệu từ file JSON (tự động bổ sung trường mới cho dữ liệu cũ theo Quy tắc 6 & Mục 5.11)
function handleImportDataFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(String(e.target?.result || '{}'));
            if (!data || !Array.isArray(data.threads) || data.threads.length === 0) {
                throw new Error('File JSON không chứa danh sách cuộc trò chuyện hợp lệ.');
            }

            appState.threads = data.threads.map((t, idx) => normalizeThread(t, idx));
            appState.activeThreadId = data.activeThreadId || appState.threads[0].id;
            saveThreadsToStorage();

            if (data.myProfile && typeof data.myProfile === 'object') {
                appState.myProfile = normalizeMyProfile(data.myProfile);
                saveMyProfileToStorage();
            }

            if (data.composePrefs && typeof data.composePrefs === 'object') {
                appState.compose.prefs = normalizeComposePrefs(data.composePrefs);
            }
            if (Array.isArray(data.composeDrafts)) {
                appState.composeDrafts = data.composeDrafts.slice(0, 20);
            }
            saveComposeStateToStorage();

            if (data.dating && typeof data.dating === 'object') {
                appState.dating = normalizeDatingState(data.dating);
            }
            if (Array.isArray(data.datingHistory)) {
                appState.datingHistory = data.datingHistory.slice(0, 15);
            }
            saveDatingStateToStorage();

            if (data.analyze && typeof data.analyze === 'object') {
                appState.analyze = normalizeAnalyzeState(data.analyze);
                saveAnalyzeStateToStorage();
            }

            if (data.roleplay && typeof data.roleplay === 'object') {
                appState.roleplay = typeof normalizeRoleplayState === 'function'
                    ? normalizeRoleplayState(data.roleplay)
                    : data.roleplay;
                saveRoleplayState();
            }
            if (Array.isArray(data.roleplayHistory)) {
                appState.roleplayHistory = data.roleplayHistory.slice(0, 25);
                if (typeof saveRoleplayHistoryToStorage === 'function') {
                    saveRoleplayHistoryToStorage();
                }
            }

            if (data.model && typeof data.model === 'string') {
                localStorage.setItem(STORAGE_KEYS.MODEL, data.model);
                document.getElementById('settingModelInput').value = data.model;
            }

            syncModeAUIFromActiveThread();
            syncMyProfileUI();
            if (typeof syncComposeUIFromState === 'function') {
                syncComposeUIFromState();
            }
            if (typeof syncDatingUIFromState === 'function') {
                syncDatingUIFromState();
            }
            if (typeof syncAnalyzeUIFromState === 'function') {
                syncAnalyzeUIFromState();
            }
            if (typeof syncRoleplayUIFromState === 'function') {
                syncRoleplayUIFromState();
            } else {
                renderRoleplayMessagesUI();
            }
            updateTopHeaderBadges();
            showToast(`Đã khôi phục ${appState.threads.length} cuộc trò chuyện & ${appState.roleplayHistory.length} buổi luyện tập!`, '📤');
        } catch (err) {
            showToast(`Lỗi nhập dữ liệu: ${err.message}`, '⚠️');
        } finally {
            event.target.value = '';
        }
    };
    reader.readAsText(file);
}

function handleWipeAllData() {
    openCustomModal({
        title: '🗑️ Xoá toàn bộ dữ liệu ứng dụng?',
        description: 'Toàn bộ các cuộc trò chuyện, bản nháp soạn tin, hồ sơ Match, lịch sử phân tích tín hiệu, hồ sơ cá nhân, lịch sử luyện tập và cài đặt trên trình duyệt này sẽ bị xoá sạch và không thể khôi phục.',
        confirmText: 'Xoá sạch dữ liệu',
        isDanger: true,
        onConfirm: () => {
            Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
            const freshThread = createDefaultThread('Bạn nữ mới quen 🌸');
            appState.threads = [freshThread];
            appState.activeThreadId = freshThread.id;
            appState.myProfile = createDefaultMyProfile();
            appState.compose.prefs = createDefaultComposePrefs();
            appState.compose.draftInput = '';
            appState.compose.herContextMsg = '';
            appState.compose.sessionHistory = [];
            appState.compose.lastResult = null;
            appState.composeDrafts = [];
            appState.dating = createDefaultDatingState();
            appState.datingHistory = [];
            appState.analyze = createDefaultAnalyzeState();
            appState.roleplay = typeof createDefaultRoleplayState === 'function'
                ? createDefaultRoleplayState()
                : { persona: '', situation: '', history: [], isFinished: false };
            appState.roleplayHistory = [];

            saveThreadsToStorage();
            saveMyProfileToStorage();
            saveComposeStateToStorage();
            saveDatingStateToStorage();
            saveAnalyzeStateToStorage();
            saveRoleplayState();
            if (typeof saveRoleplayHistoryToStorage === 'function') {
                saveRoleplayHistoryToStorage();
            }

            document.getElementById('settingApiKeyInput').value = '';
            document.getElementById('settingModelInput').value = DEFAULT_MODEL;
            document.getElementById('connectionTestResultBox').classList.add('hidden');
            const evalArea = document.getElementById('roleplayEvaluationArea');
            if (evalArea) evalArea.innerHTML = '';
            const composeRes = document.getElementById('composeResultArea');
            if (composeRes) composeRes.innerHTML = '';
            const datingRes = document.getElementById('datingResultArea');
            if (datingRes) datingRes.innerHTML = '';
            const analyzeRes = document.getElementById('analyzeResultArea');
            if (analyzeRes) analyzeRes.innerHTML = '';

            syncModeAUIFromActiveThread();
            syncMyProfileUI();
            if (typeof syncComposeUIFromState === 'function') {
                syncComposeUIFromState();
            }
            if (typeof syncDatingUIFromState === 'function') {
                syncDatingUIFromState();
            }
            if (typeof syncAnalyzeUIFromState === 'function') {
                syncAnalyzeUIFromState();
            }
            if (typeof syncRoleplayUIFromState === 'function') {
                syncRoleplayUIFromState();
            } else {
                renderRoleplayMessagesUI();
            }
            updateTopHeaderBadges();
            showToast('Đã xoá toàn bộ dữ liệu và đưa ứng dụng về mặc định!', '🗑️');
        }
    });
}