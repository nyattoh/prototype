// Test fixtures for YAML content analysis
const yamlFixtures = {
  book: {
    title: 'Recipe Book',
    content: `
title: そばの作り方
recipe:
  steps:
    - 小麦粉を準備する
    - 水と混ぜる
    - 生地をこねる
  instructions: "手順に従って作ってください"
category: book
type: recipe
    `
  },
  
  music: {
    title: 'Music Box',
    content: `
title: オルゴール
music:
  melody: "きらきら星"
  sound: "metallic chime"
  audio: "music/twinkle.mp3"
type: music
category: sound
    `
  },
  
  art: {
    title: 'Crystal Sculpture',
    content: `
title: 水晶の彫刻
crystal:
  material: "透明水晶"
  decoration: "光の反射"
  art: "sculpture"
category: art
type: decoration
    `
  },
  
  toy: {
    title: 'Character Figure',
    content: `
title: キャラクターフィギュア
character:
  name: "にゃんこ"
  figure: "可愛い猫"
  toy: "collectible"
category: toy
type: character
    `
  },
  
  digital: {
    title: 'Digital Display',
    content: `
title: デジタル画面
screen:
  display: "LCD monitor"
  digital: "interface"
  app: "dashboard"
category: digital
type: screen
    `
  },
  
  misc: {
    title: 'Unknown Object',
    content: `
title: 謎のオブジェクト
description: "詳細不明"
material: "unknown"
    `
  }
};

const placementExpectations = {
  book: {
    hasTransform: true,
    hasRotation: true,
    position: 'left'
  },
  music: {
    hasScale: true,
    position: 'right'
  },
  art: {
    hasCenter: true,
    hasScale: true
  },
  toy: {
    hasBottom: true,
    hasScale: true
  },
  digital: {
    hasCenter: true,
    hasTranslate: true
  },
  misc: {
    hasCenter: true,
    isDefault: true
  }
};

module.exports = { yamlFixtures, placementExpectations };