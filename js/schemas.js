/**
 * ============================================================================
 * 2. ĐỊNH NGHĨA RESPONSE SCHEMA KIỂM SOÁT JSON CHẶT CHẼ (GIAI ĐOẠN 0 -> 5)
 * ============================================================================
 */
const SCHEMA_MODE_A = {
    type: "OBJECT",
    properties: {
        options: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    level: { type: "STRING" },
                    text: { type: "STRING" },
                    why: { type: "STRING" }
                },
                required: ["level", "text", "why"]
            }
        },
        signal: { type: "STRING" },
        note: { type: "STRING" }
    },
    required: ["options", "signal", "note"]
};

// GIAI ĐOẠN 5 (Mục 5.1): Schema dựng Thẻ nhân vật tuỳ chỉnh (Character Card)
const SCHEMA_ROLEPLAY_CHAR_CARD = {
    type: "OBJECT",
    properties: {
        name: { type: "STRING" },
        age: { type: "NUMBER" },
        occupation: { type: "STRING" },
        interests: { type: "STRING" },
        messagingStyle: { type: "STRING" },
        likesDislikes: { type: "STRING" },
        summary: { type: "STRING" }
    },
    required: ["name", "age", "occupation", "interests", "messagingStyle", "likesDislikes", "summary"]
};

// GIAI ĐOẠN 5 (Mục 5.4 & 5.5): Schema phản hồi mỗi lượt của nhân vật trong Phòng luyện tập
const SCHEMA_MODE_B_TURN = {
    type: "OBJECT",
    properties: {
        messages: {
            type: "ARRAY",
            items: { type: "STRING" }
        },
        interest: { type: "NUMBER" },
        mood: {
            type: "STRING",
            enum: ["vui", "hào hứng", "bình thường", "hơi chán", "ngại", "khó chịu"]
        },
        innerThought: { type: "STRING" },
        sendType: {
            type: "STRING",
            enum: ["text", "sticker_only", "seen_only"]
        },
        askedBack: { type: "BOOLEAN" },
        acceptedHangout: { type: "BOOLEAN" }
    },
    required: ["messages", "interest", "mood", "innerThought", "sendType", "askedBack", "acceptedHangout"]
};

// GIAI ĐOẠN 5 (Mục 5.6): Schema Nút "💡 Gợi ý" (Không viết sẵn cả câu)
const SCHEMA_ROLEPLAY_HINT = {
    type: "OBJECT",
    properties: {
        direction: { type: "STRING" },
        herSubtext: { type: "STRING" },
        whatToAvoid: { type: "STRING" }
    },
    required: ["direction", "herSubtext", "whatToAvoid"]
};

// GIAI ĐOẠN 5 (Mục 5.9 & 5.10): Mở rộng SCHEMA_MODE_B_SCORE với 6 tiêu chí & đánh giá từng lượt tin
const SCHEMA_MODE_B_SCORE = {
    type: "OBJECT",
    properties: {
        score: { type: "NUMBER" },
        summary: { type: "STRING" },
        missionFeedback: { type: "STRING" },
        criteria: {
            type: "OBJECT",
            properties: {
                empathy: {
                    type: "OBJECT",
                    properties: { score: { type: "NUMBER" }, comment: { type: "STRING" } },
                    required: ["score", "comment"]
                },
                curiosity: {
                    type: "OBJECT",
                    properties: { score: { type: "NUMBER" }, comment: { type: "STRING" } },
                    required: ["score", "comment"]
                },
                selfSharing: {
                    type: "OBJECT",
                    properties: { score: { type: "NUMBER" }, comment: { type: "STRING" } },
                    required: ["score", "comment"]
                },
                pacingAndLength: {
                    type: "OBJECT",
                    properties: { score: { type: "NUMBER" }, comment: { type: "STRING" } },
                    required: ["score", "comment"]
                },
                naturalness: {
                    type: "OBJECT",
                    properties: { score: { type: "NUMBER" }, comment: { type: "STRING" } },
                    required: ["score", "comment"]
                },
                subtlety: {
                    type: "OBJECT",
                    properties: { score: { type: "NUMBER" }, comment: { type: "STRING" } },
                    required: ["score", "comment"]
                }
            },
            required: ["empathy", "curiosity", "selfSharing", "pacingAndLength", "naturalness", "subtlety"]
        },
        goodPoints: {
            type: "ARRAY",
            items: { type: "STRING" }
        },
        improvePoints: {
            type: "ARRAY",
            items: { type: "STRING" }
        },
        rewrites: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    original: { type: "STRING" },
                    better: { type: "STRING" },
                    reason: { type: "STRING" }
                },
                required: ["original", "better", "reason"]
            }
        },
        turnReviews: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    turnIndex: { type: "NUMBER" },
                    userText: { type: "STRING" },
                    rating: {
                        type: "STRING",
                        enum: ["good", "needs_work"]
                    },
                    herInnerThought: { type: "STRING" },
                    coachNote: { type: "STRING" },
                    betterSuggestion: { type: "STRING" }
                },
                required: ["turnIndex", "userText", "rating", "herInnerThought", "coachNote", "betterSuggestion"]
            }
        }
    },
    required: [
        "score",
        "summary",
        "missionFeedback",
        "criteria",
        "goodPoints",
        "improvePoints",
        "rewrites",
        "turnReviews"
    ]
};

// Mục 1.5: Schema trích xuất hội thoại từ ảnh chụp màn hình / file chat
const SCHEMA_EXTRACT_CHAT = {
    type: "OBJECT",
    properties: {
        messages: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    sender: {
                        type: "STRING",
                        enum: ["her", "me", "unknown"]
                    },
                    text: { type: "STRING" },
                    time: { type: "STRING" },
                    note: { type: "STRING" }
                },
                required: ["sender", "text", "time", "note"]
            }
        },
        platformGuess: { type: "STRING" },
        uncertain: {
            type: "ARRAY",
            items: { type: "STRING" }
        }
    },
    required: ["messages", "platformGuess", "uncertain"]
};

// Mục 1.8: Schema phân tích giọng văn của tôi
const SCHEMA_MY_VOICE_STYLE = {
    type: "OBJECT",
    properties: {
        summary: { type: "STRING" },
        avgLength: { type: "STRING" },
        commonWords: { type: "STRING" },
        emojiHabit: { type: "STRING" },
        toneNotes: { type: "STRING" }
    },
    required: ["summary", "avgLength", "commonWords", "emojiHabit", "toneNotes"]
};

// GIAI ĐOẠN 2 (Mục 2.4): Schema kết quả cho Tab ✍️ Soạn tin (Tôi viết, AI sửa)
const SCHEMA_COMPOSE = {
    type: "OBJECT",
    properties: {
        diagnosis: {
            type: "OBJECT",
            properties: {
                naturalness: { type: "NUMBER" },
                cringe: { type: "NUMBER" },
                pushiness: { type: "NUMBER" },
                clarity: { type: "NUMBER" },
                comment: { type: "STRING" }
            },
            required: ["naturalness", "cringe", "pushiness", "clarity", "comment"]
        },
        versions: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    style: { type: "STRING" },
                    messages: {
                        type: "ARRAY",
                        items: { type: "STRING" }
                    },
                    emoji: { type: "STRING" },
                    stickerIdea: { type: "STRING" },
                    changes: {
                        type: "ARRAY",
                        items: {
                            type: "OBJECT",
                            properties: {
                                from: { type: "STRING" },
                                to: { type: "STRING" },
                                reason: { type: "STRING" }
                            },
                            required: ["from", "to", "reason"]
                        }
                    }
                },
                required: ["style", "messages", "emoji", "stickerIdea", "changes"]
            }
        },
        warnings: {
            type: "ARRAY",
            items: { type: "STRING" }
        }
    },
    required: ["diagnosis", "versions", "warnings"]
};

// GIAI ĐOẠN 3 (Mục 3.2 -> 3.5): Schema kết quả cho Tab 💘 Làm quen (Mới Match App hẹn hò)
const SCHEMA_DATING = {
    type: "OBJECT",
    properties: {
        profileSummary: { type: "STRING" },
        isLowInfo: { type: "BOOLEAN" },
        lowInfoNote: { type: "STRING" },
        hooks: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    id: { type: "STRING" },
                    title: { type: "STRING" },
                    observation: { type: "STRING" },
                    whyEasy: { type: "STRING" },
                    starterQuestion: { type: "STRING" }
                },
                required: ["id", "title", "observation", "whyEasy", "starterQuestion"]
            }
        },
        openers: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    style: { type: "STRING" },
                    hookRef: { type: "STRING" },
                    text: { type: "STRING" },
                    why: { type: "STRING" }
                },
                required: ["style", "hookRef", "text", "why"]
            }
        },
        roadmap10: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    stage: { type: "STRING" },
                    goal: { type: "STRING" },
                    goodExample: { type: "STRING" },
                    avoid: { type: "STRING" },
                    greenSignal: { type: "STRING" }
                },
                required: ["stage", "goal", "goodExample", "avoid", "greenSignal"]
            }
        },
        questionBank: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    category: { type: "STRING" },
                    hookRef: { type: "STRING" },
                    question: { type: "STRING" },
                    followUp: { type: "STRING" }
                },
                required: ["category", "hookRef", "question", "followUp"]
            }
        }
    },
    required: ["profileSummary", "isLowInfo", "lowInfoNote", "hooks", "openers", "roadmap10", "questionBank"]
};

// GIAI ĐOẠN 4A (Mục 4A.1): Schema Đọc tín hiệu cảm xúc chuyên sâu
const SCHEMA_ANALYZE_SIGNAL = {
    type: "OBJECT",
    properties: {
        overall: {
            type: "OBJECT",
            properties: {
                interestScore: { type: "NUMBER" },
                trend: { type: "STRING" },
                confidence: { type: "STRING" },
                caveat: { type: "STRING" }
            },
            required: ["interestScore", "trend", "confidence", "caveat"]
        },
        perMessage: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    sender: {
                        type: "STRING",
                        enum: ["her", "me"]
                    },
                    text: { type: "STRING" },
                    emotion: { type: "STRING" },
                    energy: { type: "NUMBER" },
                    interestAtTurn: { type: "NUMBER" },
                    signals: {
                        type: "ARRAY",
                        items: {
                            type: "OBJECT",
                            properties: {
                                signal: { type: "STRING" },
                                evidence: { type: "STRING" }
                            },
                            required: ["signal", "evidence"]
                        }
                    }
                },
                required: ["sender", "text", "emotion", "energy", "interestAtTurn", "signals"]
            }
        },
        metrics: {
            type: "OBJECT",
            properties: {
                avgLengthComparison: { type: "STRING" },
                herQuestionsCount: { type: "STRING" },
                herInitiationsCount: { type: "STRING" },
                emojiHahaUsage: { type: "STRING" },
                talkRatio: { type: "STRING" },
                responseTimeEstimate: { type: "STRING" }
            },
            required: [
                "avgLengthComparison",
                "herQuestionsCount",
                "herInitiationsCount",
                "emojiHahaUsage",
                "talkRatio",
                "responseTimeEstimate"
            ]
        },
        greenFlags: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    flag: { type: "STRING" },
                    evidence: { type: "STRING" }
                },
                required: ["flag", "evidence"]
            }
        },
        redFlags: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    flag: { type: "STRING" },
                    evidence: { type: "STRING" }
                },
                required: ["flag", "evidence"]
            }
        },
        herStyle: { type: "STRING" },
        recommendation: {
            type: "OBJECT",
            properties: {
                action: { type: "STRING" },
                reasons: {
                    type: "ARRAY",
                    items: { type: "STRING" }
                }
            },
            required: ["action", "reasons"]
        }
    },
    required: [
        "overall",
        "perMessage",
        "metrics",
        "greenFlags",
        "redFlags",
        "herStyle",
        "recommendation"
    ]
};

// GIAI ĐOẠN 4B (Mục 4B.1 -> 4B.4): Schema Cứu cuộc trò chuyện sắp nguội
const SCHEMA_ANALYZE_RESCUE = {
    type: "OBJECT",
    properties: {
        diagnoses: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    cause: { type: "STRING" },
                    evidence: { type: "STRING" },
                    impact: { type: "STRING" }
                },
                required: ["cause", "evidence", "impact"]
            }
        },
        decision: {
            type: "OBJECT",
            properties: {
                shouldRescue: { type: "BOOLEAN" },
                verdictTitle: { type: "STRING" },
                verdictReason: { type: "STRING" },
                politeClosings: {
                    type: "ARRAY",
                    items: {
                        type: "OBJECT",
                        properties: {
                            text: { type: "STRING" },
                            why: { type: "STRING" }
                        },
                        required: ["text", "why"]
                    }
                }
            },
            required: ["shouldRescue", "verdictTitle", "verdictReason", "politeClosings"]
        },
        strategies: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    name: { type: "STRING" },
                    messages: {
                        type: "ARRAY",
                        items: { type: "STRING" }
                    },
                    timing: { type: "STRING" },
                    risk: { type: "STRING" },
                    why: { type: "STRING" }
                },
                required: ["name", "messages", "timing", "risk", "why"]
            }
        },
        followUpPlan: {
            type: "OBJECT",
            properties: {
                oneShotRuleReminder: { type: "STRING" },
                step1Send: { type: "STRING" },
                ifPositive: { type: "STRING" },
                ifColdOrSilent: { type: "STRING" }
            },
            required: ["oneShotRuleReminder", "step1Send", "ifPositive", "ifColdOrSilent"]
        }
    },
    required: ["diagnoses", "decision", "strategies", "followUpPlan"]
};