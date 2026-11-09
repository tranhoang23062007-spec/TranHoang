/**
 * ============================================================================
 * 10. KHỞI TẠO DOMContentLoaded, TỰ ĐỘNG NẠP MODULE & SELFCHECK (GIAI ĐOẠN 1 -> 5C)
 * ============================================================================
 */

// Hàm tự động nạp js/dating.js nếu trong index.html chưa có thẻ <script src="js/dating.js">
function ensureDatingScriptLoaded() {
    return new Promise((resolve) => {
        if (typeof initDatingTab === 'function') {
            resolve(true);
            return;
        }
        const script = document.createElement('script');
        script.src = 'js/dating.js';
        script.onload = () => resolve(true);
        script.onerror = () => {
            console.error('Không tìm thấy file js/dating.js trong thư mục js/');
            showToast('Hãy kiểm tra đã tạo file js/dating.js trong thư mục js/ chưa nhé!', '⚠️');
            resolve(false);
        };
        document.body.appendChild(script);
    });
}

// Hàm tự động nạp js/analyze.js nếu trong index.html chưa có thẻ <script src="js/analyze.js">
function ensureAnalyzeScriptLoaded() {
    return new Promise((resolve) => {
        if (typeof initAnalyzeTab === 'function') {
            resolve(true);
            return;
        }
        const script = document.createElement('script');
        script.src = 'js/analyze.js';
        script.onload = () => resolve(true);
        script.onerror = () => {
            console.error('Không tìm thấy file js/analyze.js trong thư mục js/');
            showToast('Hãy kiểm tra đã tạo file js/analyze.js trong thư mục js/ chưa nhé!', '⚠️');
            resolve(false);
        };
        document.body.appendChild(script);
    });
}

// Hàm Self-Check kiểm tra sự tồn tại của các hàm/hằng số cốt lõi sau khi tải trang
function selfCheck() {
    const requiredFunctions = [
        'callGemini',
        'callGeminiWithSchemaRetry',
        'sanitizeHistoryForStorage',
        'createAttachmentWidget',
        'preprocessImageWithCanvas',
        'handleExtractChatFromAttachments',
        'handleGenerateModeA',
        'handleGenerateCompose',
        'handleRefineCompose',
        'validateComposeJson',
        'initDatingTab',
        'handleAnalyzeDatingProfile',
        'handleCreateThreadFromMatch',
        'handlePracticeMatchInRoleplay',
        'validateDatingJson',
        'initAnalyzeTab',
        'handleRunAnalyze',
        'validateAnalyzeSignalJson',
        'validateAnalyzeRescueJson',
        'handleSaveMyProfile',
        'handleAnalyzeMyVoiceStyle',
        'initRoleplayTab',
        'handleGenerateCustomCharacterCard',
        'handleRequestRoleplayHint',
        'handleRewindRoleplayToTurn',
        'checkRoleplayMissionProgress',
        'simulateSequentialTypingB',
        'renderRoleplayInterestCurveSvg',
        'saveRoleplaySessionToHistory',
        'renderRoleplayHistoryDrawerUI',
        'handleLoadRoleplayHistorySession',
        'validateRoleplayCharCardJson',
        'validateModeBTurnJson',
        'validateRoleplayHintJson',
        'validateModeBScoreJson',
        'handleSendRoleplayMessage',
        'handleFinishAndScoreRoleplay',
        'handleExportData',
        'switchNavigation'
    ];

    const missing = requiredFunctions.filter(
        fnName => typeof window[fnName] !== 'function' && typeof eval(`typeof ${fnName}`) !== 'function'
    );
    if (missing.length > 0) {
        console.error('SelfCheck cảnh báo: Thiếu các hàm cốt lõi sau:', missing);
        showToast(`Cảnh báo hệ thống: Thiếu hàm ${missing[0]}`, '⚠️');
    } else {
        console.log('SelfCheck OK: Toàn bộ cấu trúc các module JavaScript (Giai đoạn 1 -> 5C) đã nạp thành công.');
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    // 1. Khôi phục giao diện Sáng / Tối
    if (localStorage.getItem(STORAGE_KEYS.THEME) === 'dark') {
        document.documentElement.classList.add('dark');
        document.getElementById('themeIcon').textContent = '☀️';
    }
    document.getElementById('btnToggleTheme').addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem(STORAGE_KEYS.THEME, isDark ? 'dark' : 'light');
        document.getElementById('themeIcon').textContent = isDark ? '☀️' : '🌙';
    });

    // 2. Tự động nạp js/dating.js và js/analyze.js nếu index.html chưa thêm thẻ <script>
    await ensureDatingScriptLoaded();
    await ensureAnalyzeScriptLoaded();

    // 3. Tải dữ liệu Threads, Hồ sơ của tôi, Soạn tin, Làm quen, Phân tích & Roleplay từ localStorage
    loadThreadsFromStorage();
    loadMyProfileFromStorage();
    loadComposeStateFromStorage();
    if (typeof loadDatingStateFromStorage === 'function') {
        loadDatingStateFromStorage();
    }
    if (typeof loadAnalyzeStateFromStorage === 'function') {
        loadAnalyzeStateFromStorage();
    }
    loadRoleplayState();
    if (typeof loadRoleplayHistoryFromStorage === 'function') {
        loadRoleplayHistoryFromStorage();
    }

    // 4. Khôi phục cài đặt API Key, Model & Hồ sơ của tôi
    document.getElementById('settingApiKeyInput').value = getApiKey();
    document.getElementById('settingModelInput').value = getModelName();
    updateTopHeaderBadges();
    syncMyProfileUI();

    // 5. Khởi tạo Tab 💘 Làm quen (Giai đoạn 3), Tab 📡 Phân tích (Giai đoạn 4) & Tab 🎭 Luyện tập (Bước 5A + 5B + 5C)
    if (typeof initDatingTab === 'function') {
        initDatingTab();
    }
    if (typeof initAnalyzeTab === 'function') {
        initAnalyzeTab();
    }
    if (typeof initRoleplayTab === 'function') {
        initRoleplayTab();
    }

    // 6. Gắn sự kiện Thanh điều hướng 5 tab dưới đáy & nút ⚙️ / 🪪 trên Header
    document.querySelectorAll('.bottom-nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-nav');
            switchNavigation(target);
            if (target === 'compose') {
                renderComposeThreadSelectUI();
            }
            if (target === 'analyze' && typeof renderAnalyzeThreadSelectUI === 'function') {
                renderAnalyzeThreadSelectUI();
            }
            if (target === 'modeB' && typeof syncRoleplayUIFromState === 'function') {
                syncRoleplayUIFromState();
            }
        });
    });
    document.getElementById('btnQuickModelBadge').addEventListener('click', () => switchNavigation('settings'));
    const btnHeaderSettings = document.getElementById('btnHeaderSettings');
    if (btnHeaderSettings) {
        btnHeaderSettings.addEventListener('click', () => switchNavigation('settings'));
    }
    const myProfileBadgeBtn = document.getElementById('myProfileActiveBadge');
    if (myProfileBadgeBtn) {
        myProfileBadgeBtn.addEventListener('click', () => {
            switchNavigation('settings');
            const profileCard = document.getElementById('myProfileSectionCard');
            if (profileCard) {
                setTimeout(() => profileCard.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
            }
        });
    }

    // 7. Khởi tạo Component Đính kèm ảnh/file chat tại Chế độ A & Tab Soạn tin
    window.modeAAttachments = createAttachmentWidget({
        containerId: 'modeAAttachmentRoot',
        label: '📎 Đính kèm ảnh/file chat',
        allowTxt: true,
        showExtractBtn: true,
        onExtractChat: (widgetApi, btnEl) => handleExtractChatFromAttachments(widgetApi, btnEl)
    });

    window.composeAttachments = createAttachmentWidget({
        containerId: 'composeAttachmentRoot',
        label: '📎 Đính kèm ảnh tin cô ấy vừa nhắn (tuỳ chọn)',
        allowTxt: true,
        showExtractBtn: false
    });

    // 8. Gắn sự kiện Quản lý Threads (Tạo mới, Đổi tên, Xoá, Xem lịch sử tin, Làm mới mạch chuyện)
    document.getElementById('btnNewThread').addEventListener('click', () => {
        openCustomModal({
            title: '➕ Tạo cuộc trò chuyện mới',
            description: 'Đặt tên gợi nhớ cho người bạn đang nhắn (ví dụ: Linh cùng CLB, Mai IG...):',
            showInput: true,
            defaultValue: '',
            placeholder: 'Nhập tên hoặc biệt danh...',
            confirmText: 'Tạo mới',
            onConfirm: (nameVal) => {
                const cleanName = nameVal || `Bạn nữ #${appState.threads.length + 1}`;
                const newThread = createDefaultThread(cleanName);
                appState.threads.unshift(newThread);
                appState.activeThreadId = newThread.id;
                saveThreadsToStorage();
                syncModeAUIFromActiveThread();
                renderComposeThreadSelectUI();
                if (typeof renderAnalyzeThreadSelectUI === 'function') renderAnalyzeThreadSelectUI();
                showToast(`Đã tạo cuộc trò chuyện "${cleanName}"!`, '🌸');
            }
        });
    });

    document.getElementById('btnRenameThread').addEventListener('click', () => {
        const activeThread = getActiveThread();
        openCustomModal({
            title: '✏️ Đổi tên cuộc trò chuyện',
            description: 'Nhập tên mới cho cuộc trò chuyện hiện tại:',
            showInput: true,
            defaultValue: activeThread.name,
            confirmText: 'Lưu tên mới',
            onConfirm: (newName) => {
                if (!newName) return;
                activeThread.name = newName;
                saveThreadsToStorage();
                renderThreadsBarUI();
                renderComposeThreadSelectUI();
                if (typeof renderAnalyzeThreadSelectUI === 'function') renderAnalyzeThreadSelectUI();
                showToast('Đã cập nhật tên cuộc trò chuyện!', '✅');
            }
        });
    });

    document.getElementById('btnDeleteThread').addEventListener('click', () => {
        const activeThread = getActiveThread();
        openCustomModal({
            title: `🗑️ Xoá "${activeThread.name}"?`,
            description: 'Lịch sử ngữ cảnh và các gợi ý của riêng cuộc trò chuyện này sẽ bị xoá.',
            confirmText: 'Xoá cuộc trò chuyện',
            isDanger: true,
            onConfirm: () => {
                appState.threads = appState.threads.filter(t => t.id !== activeThread.id);
                if (appState.threads.length === 0) {
                    appState.threads.push(createDefaultThread('Bạn nữ mới quen 🌸'));
                }
                appState.activeThreadId = appState.threads[0].id;
                saveThreadsToStorage();
                syncModeAUIFromActiveThread();
                renderComposeThreadSelectUI();
                if (typeof renderAnalyzeThreadSelectUI === 'function') renderAnalyzeThreadSelectUI();
                showToast('Đã xoá cuộc trò chuyện!', '🗑️');
            }
        });
    });

    const btnToggleMsgPanel = document.getElementById('btnToggleThreadMessagesPanel');
    if (btnToggleMsgPanel) {
        btnToggleMsgPanel.addEventListener('click', () => {
            const drawer = document.getElementById('threadMessagesDrawer');
            if (!drawer) return;
            const isHidden = drawer.classList.toggle('hidden');
            btnToggleMsgPanel.textContent = isHidden ? '💬 Xem lịch sử tin' : '🔼 Ẩn lịch sử tin';
            if (!isHidden) {
                renderThreadStructuredMessagesUI();
            }
        });
    }

    document.getElementById('btnClearThreadMemory').addEventListener('click', () => {
        const activeThread = getActiveThread();
        activeThread.apiHistory = [];
        activeThread.messages = [];
        activeThread.lastResult = null;
        saveThreadsToStorage();
        syncModeAUIFromActiveThread();
        showToast(`Đã làm mới toàn bộ mạch chuyện của "${activeThread.name}"`, '🧹');
    });

    // 9. Gắn sự kiện cho các nút chọn Ngữ cảnh & Thanh trượt trong Chế độ A
    bindChipGroup('ctxWhereGroup', () => getActiveThread().where, val => {
        getActiveThread().where = val;
        saveThreadsToStorage();
    });
    bindChipGroup('ctxClosenessGroup', () => getActiveThread().closeness, val => {
        getActiveThread().closeness = val;
        saveThreadsToStorage();
    });
    bindChipGroup('ctxGoalGroup', () => getActiveThread().goal, val => {
        getActiveThread().goal = val;
        saveThreadsToStorage();
    });
    bindChipGroup('pronounGroupA', () => getActiveThread().pronoun, val => {
        getActiveThread().pronoun = val;
        saveThreadsToStorage();
    });

    document.getElementById('abbrevSliderA').addEventListener('input', e => {
        getActiveThread().abbrevLevel = parseInt(e.target.value, 10);
        updateSlidersLabelModeA();
        saveThreadsToStorage();
    });
    document.getElementById('humorSliderA').addEventListener('input', e => {
        getActiveThread().humorLevel = parseInt(e.target.value, 10);
        updateSlidersLabelModeA();
        saveThreadsToStorage();
    });

    document.getElementById('btnClearInputA').addEventListener('click', () => {
        document.getElementById('herMessageInput').value = '';
        document.getElementById('extraContextInput').value = '';
        getActiveThread().lastInput = '';
        getActiveThread().lastNote = '';
        saveThreadsToStorage();
        document.getElementById('herMessageInput').focus();
    });

    document.getElementById('btnSubmitModeA').addEventListener('click', handleGenerateModeA);

    // Đồng bộ lần đầu cho Chế độ A
    syncModeAUIFromActiveThread();

    // 10. Gắn sự kiện cho GIAI ĐOẠN 2: TAB ✍️ SOẠN TIN (Mục 2.1 đến 2.7)
    const btnComposeModeDraft = document.getElementById('btnComposeModeDraft');
    const btnComposeModeIdea = document.getElementById('btnComposeModeIdea');
    if (btnComposeModeDraft && btnComposeModeIdea) {
        btnComposeModeDraft.addEventListener('click', () => {
            appState.compose.prefs.inputMode = 'draft';
            saveComposeStateToStorage();
            updateComposeInputModeUI();
        });
        btnComposeModeIdea.addEventListener('click', () => {
            appState.compose.prefs.inputMode = 'idea';
            saveComposeStateToStorage();
            updateComposeInputModeUI();
        });
    }

    const btnToggleDraftsDrawer = document.getElementById('btnToggleComposeDraftsDrawer');
    if (btnToggleDraftsDrawer) {
        btnToggleDraftsDrawer.addEventListener('click', () => {
            const drawer = document.getElementById('composeDraftsDrawer');
            if (drawer) {
                drawer.classList.toggle('hidden');
                renderComposeSavedDraftsUI();
            }
        });
    }

    const btnClearAllComposeDrafts = document.getElementById('btnClearAllComposeDrafts');
    if (btnClearAllComposeDrafts) {
        btnClearAllComposeDrafts.addEventListener('click', () => {
            openCustomModal({
                title: '🗑️ Xoá toàn bộ 20 bản nháp?',
                description: 'Danh sách các bản nháp đã lưu trong mục Soạn tin sẽ bị xoá.',
                confirmText: 'Xoá lịch sử nháp',
                isDanger: true,
                onConfirm: () => {
                    appState.composeDrafts = [];
                    saveComposeStateToStorage();
                    renderComposeSavedDraftsUI();
                    showToast('Đã xoá toàn bộ lịch sử bản nháp!', '🗑️');
                }
            });
        });
    }

    const btnClearComposeInput = document.getElementById('btnClearComposeInput');
    if (btnClearComposeInput) {
        btnClearComposeInput.addEventListener('click', () => {
            document.getElementById('composeUserInput').value = '';
            document.getElementById('composeHerMsgInput').value = '';
            appState.compose.draftInput = '';
            appState.compose.herContextMsg = '';
            document.getElementById('composeUserInput').focus();
        });
    }

    const composeThreadSelect = document.getElementById('composeThreadSelect');
    if (composeThreadSelect) {
        composeThreadSelect.addEventListener('change', (e) => {
            appState.compose.prefs.contextThreadId = e.target.value;
            saveComposeStateToStorage();
        });
    }

    const btnSyncStyle = document.getElementById('btnSyncStyleFromThread');
    if (btnSyncStyle) {
        btnSyncStyle.addEventListener('click', syncComposeStyleFromThread);
    }

    bindChipGroup('composeGoalGroup', () => appState.compose.prefs.goal, val => {
        appState.compose.prefs.goal = val;
        saveComposeStateToStorage();
    });
    bindChipGroup('pronounGroupCompose', () => appState.compose.prefs.pronoun, val => {
        appState.compose.prefs.pronoun = val;
        saveComposeStateToStorage();
    });

    document.getElementById('abbrevSliderCompose').addEventListener('input', e => {
        appState.compose.prefs.abbrevLevel = parseInt(e.target.value, 10);
        updateSlidersLabelCompose();
        saveComposeStateToStorage();
    });
    document.getElementById('humorSliderCompose').addEventListener('input', e => {
        appState.compose.prefs.humorLevel = parseInt(e.target.value, 10);
        updateSlidersLabelCompose();
        saveComposeStateToStorage();
    });
    document.getElementById('lengthSliderCompose').addEventListener('input', e => {
        appState.compose.prefs.lengthLevel = parseInt(e.target.value, 10);
        updateSlidersLabelCompose();
        saveComposeStateToStorage();
    });
    document.getElementById('emojiSliderCompose').addEventListener('input', e => {
        appState.compose.prefs.emojiLevel = parseInt(e.target.value, 10);
        updateSlidersLabelCompose();
        saveComposeStateToStorage();
    });

    document.getElementById('btnSubmitCompose').addEventListener('click', handleGenerateCompose);

    // Đồng bộ lần đầu cho Tab Soạn tin
    syncComposeUIFromState();

    // 11. Gắn sự kiện cho "Hồ sơ của tôi & Phân tích giọng văn" (Mục 1.8)
    const btnSaveMyProfile = document.getElementById('btnSaveMyProfile');
    if (btnSaveMyProfile) {
        btnSaveMyProfile.addEventListener('click', () => handleSaveMyProfile(true));
    }
    const btnAnalyzeMyVoice = document.getElementById('btnAnalyzeMyVoice');
    if (btnAnalyzeMyVoice) {
        btnAnalyzeMyVoice.addEventListener('click', handleAnalyzeMyVoiceStyle);
    }

    // 12. Gắn sự kiện cho Trang Cài đặt (API Key, Dò Model, Kiểm tra kết nối, Sao lưu/Khôi phục)
    document.getElementById('btnToggleKeyVisibility').addEventListener('click', (e) => {
        const input = document.getElementById('settingApiKeyInput');
        const isPwd = input.type === 'password';
        input.type = isPwd ? 'text' : 'password';
        e.target.textContent = isPwd ? 'Ẩn' : 'Hiện';
    });

    document.querySelectorAll('.quick-model-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('settingModelInput').value = btn.getAttribute('data-model');
        });
    });

    document.getElementById('btnDetectModels').addEventListener('click', async () => {
        const key = document.getElementById('settingApiKeyInput').value.trim();
        const testBox = document.getElementById('connectionTestResultBox');
        const detectBox = document.getElementById('detectedModelsBox');
        const selectEl = document.getElementById('detectedModelsSelect');

        if (!key) {
            showToast('Hãy dán API Key vào ô số 1 trước khi dò Model nhé!', '⚠️');
            return;
        }

        testBox.classList.remove('hidden');
        testBox.className = 'rounded-xl p-3 text-xs border bg-warm-100 dark:bg-stone-800 border-warm-200 dark:border-stone-700 text-stone-700 dark:text-stone-300';
        testBox.textContent = '🔍 Đang truy vấn danh sách Model khả dụng...';

        try {
            const models = await fetchAvailableModels(key);
            if (models.length === 0) throw new Error('Không tìm thấy model phù hợp cho khóa này.');

            selectEl.innerHTML = models.map(m => `<option value="${escapeHtml(m)}">${escapeHtml(m)}</option>`).join('');
            detectBox.classList.remove('hidden');

            const bestModel = models[0];
            document.getElementById('settingModelInput').value = bestModel;
            localStorage.setItem(STORAGE_KEYS.API_KEY, key);
            localStorage.setItem(STORAGE_KEYS.MODEL, bestModel);
            updateTopHeaderBadges();

            testBox.className = 'rounded-xl p-3 text-xs border bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200';
            testBox.innerHTML = `✅ <strong>Đã tìm thấy ${models.length} model!</strong> Đã tự động chọn và lưu <code>${escapeHtml(bestModel)}</code>.`;
            showToast(`Đã chọn model: ${bestModel}`, '🎉');
        } catch (err) {
            testBox.className = 'rounded-xl p-3 text-xs border bg-red-50 dark:bg-red-950/50 border-red-300 dark:border-red-800 text-red-900 dark:text-red-200';
            testBox.innerHTML = `❌ <strong>Lỗi khi dò Model:</strong> ${escapeHtml(err.message)}`;
        }
    });

    document.getElementById('detectedModelsSelect').addEventListener('change', (e) => {
        const chosen = e.target.value;
        if (chosen) {
            document.getElementById('settingModelInput').value = chosen;
            localStorage.setItem(STORAGE_KEYS.MODEL, chosen);
            updateTopHeaderBadges();
            showToast(`Đã đổi sang model: ${chosen}`, '✨');
        }
    });

    document.getElementById('btnSaveSettings').addEventListener('click', () => {
        const key = document.getElementById('settingApiKeyInput').value.trim();
        const model = document.getElementById('settingModelInput').value.trim() || DEFAULT_MODEL;
        if (key) localStorage.setItem(STORAGE_KEYS.API_KEY, key);
        else localStorage.removeItem(STORAGE_KEYS.API_KEY);
        localStorage.setItem(STORAGE_KEYS.MODEL, model);
        updateTopHeaderBadges();
        showToast('Đã lưu cài đặt thành công!', '💾');
    });

    document.getElementById('btnClearSettingsKey').addEventListener('click', () => {
        localStorage.removeItem(STORAGE_KEYS.API_KEY);
        document.getElementById('settingApiKeyInput').value = '';
        updateTopHeaderBadges();
        showToast('Đã xoá API Key khỏi trình duyệt', '🗑️');
    });

    document.getElementById('btnTestConnection').addEventListener('click', async () => {
        const key = document.getElementById('settingApiKeyInput').value.trim();
        const model = document.getElementById('settingModelInput').value.trim() || DEFAULT_MODEL;
        const testBox = document.getElementById('connectionTestResultBox');
        const btnTest = document.getElementById('btnTestConnection');

        testBox.classList.remove('hidden');
        testBox.className = 'rounded-xl p-3 text-xs border bg-warm-100 dark:bg-stone-800 border-warm-200 dark:border-stone-700 text-stone-700 dark:text-stone-300';
        testBox.textContent = `⏳ Đang kiểm tra kết nối tới model "${model}"...`;
        btnTest.disabled = true;

        try {
            const reply = await callGemini(
                'Bạn là trợ lý kết nối của TranHoangSpFA. Hãy trả lời 1 câu tiếng Việt ngắn gọn xác nhận kết nối thành công.',
                [],
                'Kiểm tra kết nối.',
                { overrideApiKey: key, overrideModel: model, expectJson: false, temperature: 0.5 }
            );
            const activeModelAfterCall = document.getElementById('settingModelInput').value.trim() || model;
            localStorage.setItem(STORAGE_KEYS.API_KEY, key);
            localStorage.setItem(STORAGE_KEYS.MODEL, activeModelAfterCall);
            updateTopHeaderBadges();

            testBox.className = 'rounded-xl p-3 text-xs border bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 space-y-1';
            testBox.innerHTML = `
                <div class="font-extrabold">✅ Kết nối thành công (Model: ${escapeHtml(activeModelAfterCall)})!</div>
                <div>💬 <strong>Phản hồi:</strong> "${escapeHtml(reply.trim())}"</div>
            `;
            showToast('Kết nối thành công!', '🎉');
        } catch (err) {
            testBox.className = 'rounded-xl p-3 text-xs border bg-red-50 dark:bg-red-950/50 border-red-300 dark:border-red-800 text-red-900 dark:text-red-200 space-y-1';
            testBox.innerHTML = `
                <div class="font-extrabold">❌ Kết nối thất bại</div>
                <div>${escapeHtml(err.message)}</div>
            `;
        } finally {
            btnTest.disabled = false;
        }
    });

    // Sự kiện Sao lưu, Khôi phục & Xoá dữ liệu
    document.getElementById('btnExportData').addEventListener('click', handleExportData);
    document.getElementById('importDataFileInput').addEventListener('change', handleImportDataFile);
    document.getElementById('btnWipeAllData').addEventListener('click', handleWipeAllData);

    // Chạy hàm kiểm tra selfCheck tự động sau khi đã nạp xong các module
    selfCheck();
});