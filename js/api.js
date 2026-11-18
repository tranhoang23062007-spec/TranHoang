/**
 * ============================================================================
 * 4. KẾT NỐI GEMINI API VỚI HEADER x-goog-api-key, AUTO-RETRY & EXTRA PARTS
 * ============================================================================
 */

// Giới hạn tổng kích thước request khoảng 15MB (Mục 1.3 & 1.4)
const MAX_GEMINI_REQUEST_BYTES = 15 * 1024 * 1024;

// Hiển thị thanh đếm ngược khi tự động thử lại
async function waitWithCountdown(seconds, attemptNumber, maxRetries, statusCode) {
    const banner = document.getElementById('retryStatusBanner');
    const bannerText = document.getElementById('retryBannerText');
    const badge = document.getElementById('retryAttemptBadge');

    banner.classList.remove('hidden');
    badge.textContent = `Thử lại ${attemptNumber}/${maxRetries}`;

    for (let remaining = seconds; remaining > 0; remaining--) {
        bannerText.textContent = `Hệ thống đang bận (mã ${statusCode}), tự động thử lại sau ${remaining} giây...`;
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    banner.classList.add('hidden');
}

// Dò danh sách Model khả dụng bằng header x-goog-api-key
async function fetchAvailableModels(apiKey) {
    const url = 'https://generativelanguage.googleapis.com/v1beta/models';
    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'x-goog-api-key': apiKey
        }
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        const msg = data?.error?.message || `Lỗi HTTP ${res.status}`;
        throw new Error(`Không thể lấy danh sách Model: ${msg}`);
    }

    const models = (data.models || [])
        .filter(m => Array.isArray(m.supportedGenerationMethods) && m.supportedGenerationMethods.includes('generateContent'))
        .map(m => m.name.replace(/^models\//, ''))
        .filter(name => name.startsWith('gemini-') && !name.includes('embedding') && !name.includes('vision') && !name.includes('imagen') && !name.includes('tts'));

    const priority = [
        'gemini-3-flash-preview',
        'gemini-2.5-flash',
        'gemini-2.5-flash-lite',
        'gemini-flash-latest',
        'gemini-3-pro-preview',
        'gemini-2.5-pro',
        'gemini-2.0-flash'
    ];
    models.sort((a, b) => {
        const idxA = priority.indexOf(a);
        const idxB = priority.indexOf(b);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return a.localeCompare(b);
    });
    return models;
}

/**
 * Mục 1.4: Làm sạch lịch sử hội thoại trước khi lưu vào apiHistory hoặc localStorage.
 * Loại bỏ hoàn toàn mọi part chứa inlineData (base64) để tránh tràn bộ nhớ trình duyệt.
 */
function sanitizeHistoryForStorage(historyArray) {
    if (!Array.isArray(historyArray)) return [];
    return historyArray
        .map(turn => {
            if (!turn || (turn.role !== 'user' && turn.role !== 'model') || !Array.isArray(turn.parts)) {
                return null;
            }
            let removedImageCount = 0;
            const cleanParts = [];
            turn.parts.forEach(part => {
                if (part && part.inlineData) {
                    removedImageCount++;
                } else if (part && typeof part.text === 'string' && part.text.trim() !== '') {
                    cleanParts.push({ text: part.text });
                }
            });
            if (removedImageCount > 0) {
                cleanParts.unshift({
                    text: `[Người dùng đã gửi ${removedImageCount} ảnh chụp màn hình chat]`
                });
            }
            if (cleanParts.length === 0) return null;
            return {
                role: turn.role,
                parts: cleanParts
            };
        })
        .filter(Boolean);
}

/**
 * Hàm callGemini cốt lõi
 */
async function callGemini(systemPrompt, history, userInput, options = {}) {
    const apiKey = (options.overrideApiKey !== undefined ? options.overrideApiKey : getApiKey()).trim();
    let modelName = (options.overrideModel !== undefined ? options.overrideModel : getModelName()).trim();

    if (!apiKey) {
        throw new Error('Bạn chưa nhập Gemini API Key. Hãy bấm nút "⚙️" ở góc trên bên phải để dán khóa nhé!');
    }
    modelName = modelName.replace(/^models\//i, '').trim() || DEFAULT_MODEL;

    const safeHistory = sanitizeHistoryForStorage(history);
    const contents = [];
    safeHistory.forEach(turn => {
        contents.push({
            role: turn.role,
            parts: turn.parts
        });
    });

    const finalUserParts = [];
    if (userInput !== null && userInput !== undefined && String(userInput).trim() !== '') {
        finalUserParts.push({ text: String(userInput) });
    }
    if (Array.isArray(options.extraParts) && options.extraParts.length > 0) {
        options.extraParts.forEach(part => {
            if (!part || typeof part !== 'object') return;
            if (part.inlineData && part.inlineData.data && part.inlineData.mimeType) {
                finalUserParts.push({
                    inlineData: {
                        mimeType: String(part.inlineData.mimeType),
                        data: String(part.inlineData.data)
                    }
                });
            } else if (typeof part.text === 'string' && part.text.trim() !== '') {
                finalUserParts.push({ text: part.text });
            }
        });
    }

    if (finalUserParts.length > 0) {
        contents.push({
            role: 'user',
            parts: finalUserParts
        });
    }

    const generationConfig = {
        temperature: options.temperature !== undefined ? options.temperature : 0.9
    };
    if (options.expectJson) {
        generationConfig.responseMimeType = 'application/json';
        if (options.responseSchema) {
            generationConfig.responseSchema = options.responseSchema;
        }
    }

    const requestBody = {
        systemInstruction: {
            parts: [{ text: systemPrompt }]
        },
        contents: contents,
        generationConfig: generationConfig
    };

    const serializedBody = JSON.stringify(requestBody);
    const requestByteLength = new Blob([serializedBody]).size;
    if (requestByteLength > MAX_GEMINI_REQUEST_BYTES) {
        throw new Error('Tổng dung lượng yêu cầu (kèm ảnh/tệp đính kèm) vượt quá giới hạn 15MB. Vui lòng xoá bớt ảnh rồi thử lại.');
    }

    const maxRetries = 2;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelName)}:generateContent`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        let response;
        try {
            response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': apiKey
                },
                body: serializedBody,
                signal: controller.signal
            });
        } catch (networkErr) {
            clearTimeout(timeoutId);
            if (networkErr.name === 'AbortError') {
                throw new Error('Yêu cầu phản hồi quá 30 giây. Vui lòng kiểm tra lại kết nối mạng.');
            }
            throw new Error('Không thể kết nối tới máy chủ Google. Vui lòng kiểm tra mạng Internet.');
        }
        clearTimeout(timeoutId);

        const responseData = await response.json().catch(() => null);

        if (!response.ok) {
            const status = response.status;
            const googleMsg = responseData?.error?.message || `Lỗi HTTP ${status}`;

            if ((status === 429 || status === 503) && attempt < maxRetries) {
                const waitSeconds = (attempt + 1) * 3;
                await waitWithCountdown(waitSeconds, attempt + 1, maxRetries, status);
                continue;
            }

            const isModelUnavailable =
                status === 404 ||
                googleMsg.toLowerCase().includes('no longer available') ||
                googleMsg.toLowerCase().includes('not found') ||
                googleMsg.toLowerCase().includes('not supported');

            if (isModelUnavailable && !options._hasRetriedModelFallback) {
                try {
                    const availableList = await fetchAvailableModels(apiKey);
                    const nextModel = availableList.find(m => m !== modelName);
                    if (nextModel) {
                        localStorage.setItem(STORAGE_KEYS.MODEL, nextModel);
                        const modelInputEl = document.getElementById('settingModelInput');
                        if (modelInputEl) modelInputEl.value = nextModel;
                        updateTopHeaderBadges();
                        showToast(`Đã tự động chuyển sang model "${nextModel}"`, '✨');
                        return await callGemini(systemPrompt, history, userInput, {
                            ...options,
                            overrideModel: nextModel,
                            _hasRetriedModelFallback: true
                        });
                    }
                } catch (fallbackErr) {
                    console.warn('Không thể tự động dò model thay thế:', fallbackErr);
                }
            }

            if (status === 400 || status === 403) {
                throw new Error(`Không thể xác thực API hoặc Model ("${modelName}"). Chi tiết: ${googleMsg}`);
            }
            if (status === 429) {
                throw new Error(`Hết hạn mức gọi API tạm thời (429) sau khi đã thử lại ${maxRetries} lần. Vui lòng đợi khoảng 1 phút rồi thử lại.`);
            }
            throw new Error(`Lỗi từ máy chủ (${status}): ${googleMsg}`);
        }

        const textOutput = responseData?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!textOutput) {
            const blockReason = responseData?.promptFeedback?.blockReason || responseData?.candidates?.[0]?.finishReason;
            throw new Error(`AI không trả về nội dung (Lý do: ${blockReason || 'Bị bộ lọc an toàn chặn'}).`);
        }
        return textOutput;
    }
}

/**
 * ============================================================================
 * 5. HÀM PARSE JSON, KIỂM TRA SCHEMA & TỰ GỌI LẠI 1 LẦN NẾU LỖI
 * ============================================================================
 */
function parseRawJson(rawString) {
    let cleaned = String(rawString || '').trim();
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    try {
        return JSON.parse(cleaned);
    } catch (e) {
        const start = cleaned.indexOf('{');
        const end = cleaned.lastIndexOf('}');
        if (start !== -1 && end !== -1 && end > start) {
            return JSON.parse(cleaned.substring(start, end + 1));
        }
        throw new Error('Cấu trúc dữ liệu trả về không phải JSON hợp lệ.');
    }
}

// Kiểm tra tính hợp lệ của JSON Chế độ A
function validateModeAJson(parsed) {
    if (!parsed || typeof parsed !== 'object') return false;
    if (!Array.isArray(parsed.options) || parsed.options.length === 0) return false;
    const validOptions = parsed.options.every(o => o && typeof o.level === 'string' && typeof o.text === 'string' && typeof o.why === 'string');
    if (!validOptions) return false;
    if (typeof parsed.signal !== 'string' || typeof parsed.note !== 'string') return false;
    return true;
}

// GIAI ĐOẠN 5 (Mục 5.1): Kiểm tra tính hợp lệ của Thẻ nhân vật tuỳ chỉnh
function validateRoleplayCharCardJson(parsed) {
    if (!parsed || typeof parsed !== 'object') return false;
    return (
        typeof parsed.name === 'string' &&
        typeof parsed.age === 'number' &&
        typeof parsed.occupation === 'string' &&
        typeof parsed.interests === 'string' &&
        typeof parsed.messagingStyle === 'string' &&
        typeof parsed.likesDislikes === 'string' &&
        typeof parsed.summary === 'string'
    );
}

// GIAI ĐOẠN 5 (Mục 5.4): Kiểm tra tính hợp lệ của mỗi lượt phản hồi nhân vật
function validateModeBTurnJson(parsed) {
    if (!parsed || typeof parsed !== 'object') return false;
    if (!Array.isArray(parsed.messages) || parsed.messages.length === 0) return false;
    if (typeof parsed.interest !== 'number' || typeof parsed.mood !== 'string') return false;
    if (typeof parsed.innerThought !== 'string' || typeof parsed.sendType !== 'string') return false;
    return true;
}

// GIAI ĐOẠN 5 (Mục 5.6): Kiểm tra tính hợp lệ của JSON Gợi ý (Hint)
function validateRoleplayHintJson(parsed) {
    if (!parsed || typeof parsed !== 'object') return false;
    return (
        typeof parsed.direction === 'string' &&
        typeof parsed.herSubtext === 'string' &&
        typeof parsed.whatToAvoid === 'string'
    );
}

// GIAI ĐOẠN 5 (Mục 5.9 & 5.10): Kiểm tra tính hợp lệ của JSON Chấm điểm Chế độ B nâng cấp
function validateModeBScoreJson(parsed) {
    if (!parsed || typeof parsed !== 'object') return false;
    if (typeof parsed.score !== 'number') return false;
    if (!Array.isArray(parsed.goodPoints) || !Array.isArray(parsed.improvePoints) || !Array.isArray(parsed.rewrites)) return false;
    if (!parsed.criteria || typeof parsed.criteria !== 'object') return false;
    const reqKeys = ['empathy', 'curiosity', 'selfSharing', 'pacingAndLength', 'naturalness', 'subtlety'];
    for (const k of reqKeys) {
        if (!parsed.criteria[k] || typeof parsed.criteria[k].score !== 'number') return false;
    }
    if (!Array.isArray(parsed.turnReviews)) return false;
    return true;
}

// Mục 1.5: Kiểm tra tính hợp lệ của JSON Trích xuất hội thoại từ ảnh/file chat
function validateExtractChatJson(parsed) {
    if (!parsed || typeof parsed !== 'object') return false;
    if (!Array.isArray(parsed.messages)) return false;
    const validMsgs = parsed.messages.every(
        m => m && ['her', 'me', 'unknown'].includes(m.sender) && typeof m.text === 'string'
    );
    if (!validMsgs) return false;
    if (typeof parsed.platformGuess !== 'string') return false;
    if (!Array.isArray(parsed.uncertain)) return false;
    return true;
}

// Mục 1.8: Kiểm tra tính hợp lệ của JSON Phân tích giọng của tôi
function validateMyVoiceStyleJson(parsed) {
    if (!parsed || typeof parsed !== 'object') return false;
    return (
        typeof parsed.summary === 'string' &&
        typeof parsed.avgLength === 'string' &&
        typeof parsed.commonWords === 'string' &&
        typeof parsed.emojiHabit === 'string' &&
        typeof parsed.toneNotes === 'string'
    );
}

// GIAI ĐOẠN 2 (Mục 2.4): Kiểm tra tính hợp lệ của JSON Tab ✍️ Soạn tin
function validateComposeJson(parsed) {
    if (!parsed || typeof parsed !== 'object') return false;
    const d = parsed.diagnosis;
    if (!d || typeof d !== 'object') return false;
    if (
        typeof d.naturalness !== 'number' ||
        typeof d.cringe !== 'number' ||
        typeof d.pushiness !== 'number' ||
        typeof d.clarity !== 'number' ||
        typeof d.comment !== 'string'
    ) {
        return false;
    }
    if (!Array.isArray(parsed.versions) || parsed.versions.length === 0) return false;
    const validVersions = parsed.versions.every(v => {
        if (!v || typeof v.style !== 'string') return false;
        if (!Array.isArray(v.messages) || v.messages.length === 0) return false;
        if (typeof v.emoji !== 'string' || typeof v.stickerIdea !== 'string') return false;
        if (!Array.isArray(v.changes)) return false;
        return v.changes.every(
            c => c && typeof c.from === 'string' && typeof c.to === 'string' && typeof c.reason === 'string'
        );
    });
    if (!validVersions) return false;
    if (!Array.isArray(parsed.warnings)) return false;
    return true;
}

// GIAI ĐOẠN 3 (Mục 3.2 -> 3.5): Kiểm tra tính hợp lệ của JSON Tab 💘 Làm quen
function validateDatingJson(parsed) {
    if (!parsed || typeof parsed !== 'object') return false;
    if (typeof parsed.profileSummary !== 'string' || typeof parsed.isLowInfo !== 'boolean') return false;
    if (typeof parsed.lowInfoNote !== 'string') return false;
    if (!Array.isArray(parsed.hooks) || parsed.hooks.length === 0) return false;
    const validHooks = parsed.hooks.every(
        h =>
            h &&
            typeof h.title === 'string' &&
            typeof h.observation === 'string' &&
            typeof h.whyEasy === 'string' &&
            typeof h.starterQuestion === 'string'
    );
    if (!validHooks) return false;

    if (!Array.isArray(parsed.openers) || parsed.openers.length === 0) return false;
    const validOpeners = parsed.openers.every(
        o => o && typeof o.style === 'string' && typeof o.hookRef === 'string' && typeof o.text === 'string' && typeof o.why === 'string'
    );
    if (!validOpeners) return false;

    if (!Array.isArray(parsed.roadmap10) || parsed.roadmap10.length === 0) return false;
    const validRoadmap = parsed.roadmap10.every(
        r =>
            r &&
            typeof r.stage === 'string' &&
            typeof r.goal === 'string' &&
            typeof r.goodExample === 'string' &&
            typeof r.avoid === 'string' &&
            typeof r.greenSignal === 'string'
    );
    if (!validRoadmap) return false;

    if (!Array.isArray(parsed.questionBank) || parsed.questionBank.length === 0) return false;
    const validQuestions = parsed.questionBank.every(
        q =>
            q &&
            typeof q.category === 'string' &&
            typeof q.hookRef === 'string' &&
            typeof q.question === 'string' &&
            typeof q.followUp === 'string'
    );
    return validQuestions;
}

// GIAI ĐOẠN 4A (Mục 4A.1): Kiểm tra tính hợp lệ của JSON Đọc tín hiệu cảm xúc chuyên sâu
function validateAnalyzeSignalJson(parsed) {
    if (!parsed || typeof parsed !== 'object') return false;
    const ov = parsed.overall;
    if (!ov || typeof ov.interestScore !== 'number' || typeof ov.trend !== 'string' || typeof ov.confidence !== 'string' || typeof ov.caveat !== 'string') {
        return false;
    }
    if (!Array.isArray(parsed.perMessage) || parsed.perMessage.length === 0) return false;
    const validPerMsg = parsed.perMessage.every(
        m =>
            m &&
            typeof m.sender === 'string' &&
            typeof m.text === 'string' &&
            typeof m.emotion === 'string' &&
            typeof m.energy === 'number' &&
            typeof m.interestAtTurn === 'number' &&
            Array.isArray(m.signals)
    );
    if (!validPerMsg) return false;
    if (!parsed.metrics || typeof parsed.metrics !== 'object') return false;
    if (!Array.isArray(parsed.greenFlags) || !Array.isArray(parsed.redFlags)) return false;
    if (typeof parsed.herStyle !== 'string') return false;
    if (!parsed.recommendation || typeof parsed.recommendation.action !== 'string' || !Array.isArray(parsed.recommendation.reasons)) {
        return false;
    }
    return true;
}

// GIAI ĐOẠN 4B (Mục 4B.1 -> 4B.4): Kiểm tra tính hợp lệ của JSON Cứu cuộc trò chuyện sắp nguội
function validateAnalyzeRescueJson(parsed) {
    if (!parsed || typeof parsed !== 'object') return false;
    if (!Array.isArray(parsed.diagnoses) || parsed.diagnoses.length === 0) return false;
    const dec = parsed.decision;
    if (!dec || typeof dec.shouldRescue !== 'boolean' || typeof dec.verdictTitle !== 'string' || typeof dec.verdictReason !== 'string') {
        return false;
    }
    if (!Array.isArray(dec.politeClosings)) return false;
    if (!Array.isArray(parsed.strategies)) return false;
    const fp = parsed.followUpPlan;
    if (
        !fp ||
        typeof fp.oneShotRuleReminder !== 'string' ||
        typeof fp.step1Send !== 'string' ||
        typeof fp.ifPositive !== 'string' ||
        typeof fp.ifColdOrSilent !== 'string'
    ) {
        return false;
    }
    return true;
}

/**
 * Gọi Gemini yêu cầu JSON kèm cơ chế tự gọi lại 1 lần nếu parse/schema lỗi.
 */
async function callGeminiWithSchemaRetry(
    systemPrompt,
    history,
    userInput,
    schemaObj,
    validatorFn,
    temperatureOrOptions = 0.85,
    extraOptions = {}
) {
    let resolvedTemperature = 0.85;
    let resolvedOptions = { ...extraOptions };

    if (typeof temperatureOrOptions === 'number') {
        resolvedTemperature = temperatureOrOptions;
    } else if (temperatureOrOptions && typeof temperatureOrOptions === 'object') {
        resolvedOptions = { ...temperatureOrOptions, ...extraOptions };
        if (typeof resolvedOptions.temperature === 'number') {
            resolvedTemperature = resolvedOptions.temperature;
        }
    }

    let lastError = null;
    for (let jsonAttempt = 0; jsonAttempt < 2; jsonAttempt++) {
        try {
            const rawText = await callGemini(systemPrompt, history, userInput, {
                ...resolvedOptions,
                expectJson: true,
                responseSchema: schemaObj,
                temperature: resolvedTemperature
            });
            const parsed = parseRawJson(rawText);
            if (validatorFn && !validatorFn(parsed)) {
                throw new Error('JSON thiếu trường bắt buộc theo Schema.');
            }
            return { parsed, rawText };
        } catch (err) {
            lastError = err;
            if (!err.message.includes('JSON')) {
                throw err;
            }
            showToast('Đang chuẩn hoá lại định dạng dữ liệu từ AI (lần 1/1)...', '🔄');
        }
    }
    throw lastError;
}