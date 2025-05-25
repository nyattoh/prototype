// コンテンツタイプの定義
const CONTENT_TYPES = {
    BOOK: 'book',
    MUSIC: 'music',
    ART: 'art',
    TOY: 'toy',
    DIGITAL: 'digital',
    MISC: 'misc'
};

// キーワード定義
const KEYWORDS = {
    [CONTENT_TYPES.BOOK]: ['recipe', 'book', '本', 'レシピ', 'steps', 'instructions', '手順', '説明'],
    [CONTENT_TYPES.MUSIC]: ['music', 'sound', '音楽', 'audio', 'song', 'melody', '曲', '音'],
    [CONTENT_TYPES.ART]: ['crystal', 'sculpture', '装飾', 'art', 'decoration', 'アート', '彫刻'],
    [CONTENT_TYPES.TOY]: ['character', 'figure', 'toy', 'キャラクター', 'フィギュア', 'おもちゃ'],
    [CONTENT_TYPES.DIGITAL]: ['screen', 'monitor', 'digital', 'app', 'website', '画面', 'デジタル']
};

// コンテンツタイプを判定する関数
function analyzeContent(yamlContent, title) {
    const text = (yamlContent + title).toLowerCase();
    
    // 各タイプのキーワードでスコアを計算
    const scores = {};
    for (const [type, words] of Object.entries(KEYWORDS)) {
        scores[type] = words.reduce((score, word) => {
            return score + (text.includes(word) ? 1 : 0);
        }, 0);
    }
    
    // 最も高いスコアのタイプを返す
    const maxScore = Math.max(...Object.values(scores));
    if (maxScore === 0) return CONTENT_TYPES.MISC;
    
    return Object.entries(scores).find(([_, score]) => score === maxScore)[0];
}

// 配置スタイルを取得する関数
function getPlacementStyle(contentType, index = 0) {
    const placements = {
        [CONTENT_TYPES.BOOK]: [
            { top: '10%', left: '15%', transform: 'perspective(300px) rotateY(15deg)' },
            { top: '25%', left: '12%', transform: 'perspective(300px) rotateY(20deg)' },
            { top: '40%', left: '18%', transform: 'perspective(300px) rotateY(10deg)' }
        ],
        [CONTENT_TYPES.MUSIC]: [
            { top: '20%', right: '10%', transform: 'scale(0.8)' },
            { top: '35%', right: '15%', transform: 'scale(0.7)' },
            { top: '50%', right: '12%', transform: 'scale(0.9)' }
        ],
        [CONTENT_TYPES.ART]: [
            { top: '15%', left: '50%', transform: 'translateX(-50%) scale(0.8)' },
            { top: '30%', left: '45%', transform: 'translateX(-50%) scale(0.7)' },
            { top: '45%', left: '55%', transform: 'translateX(-50%) scale(0.9)' }
        ],
        [CONTENT_TYPES.TOY]: [
            { bottom: '30%', left: '40%', transform: 'scale(0.9)' },
            { bottom: '25%', left: '55%', transform: 'scale(0.8)' },
            { bottom: '35%', left: '45%', transform: 'scale(0.7)' }
        ],
        [CONTENT_TYPES.DIGITAL]: [
            { top: '50%', left: '50%', transform: 'translate(-50%, -50%) scale(0.9)' },
            { top: '40%', left: '45%', transform: 'translate(-50%, -50%) scale(0.8)' },
            { top: '60%', left: '55%', transform: 'translate(-50%, -50%) scale(0.7)' }
        ],
        [CONTENT_TYPES.MISC]: [
            { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
        ]
    };
    
    const typePlacements = placements[contentType] || placements[CONTENT_TYPES.MISC];
    return typePlacements[index % typePlacements.length];
}

// スタイルを適用する関数
function applyPlacementStyle(element, contentType, index) {
    const style = getPlacementStyle(contentType, index);
    Object.assign(element.style, style);
    
    // コンテンツタイプに応じた追加クラスを設定
    element.classList.add(`content-type-${contentType}`);
}

// エクスポート
window.ContentAnalyzer = {
    analyzeContent,
    getPlacementStyle,
    applyPlacementStyle,
    CONTENT_TYPES
}; 