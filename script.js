// script.js

// YAMLカードを表示するための関数
async function showYAML(yamlFile) {
    const overlay = document.getElementById('yamlOverlay');
    const content = document.getElementById('yamlContent');

    // YAMLを読み込む
    const response = await fetch(yamlFile);
    const yamlText = await response.text();

    // YAMLをカードに表示
    content.textContent = yamlText;

    // オーバーレイ表示
    overlay.classList.add('active');
}

// YAMLカードを閉じるための関数
function closeYAML() {
    document.getElementById('yamlOverlay').classList.remove('active');
}

// アイテムクリックイベントを設定
document.getElementById('item-character').onclick = () => showYAML('yaml/character.yaml');
document.getElementById('item-diorama').onclick = () => showYAML('yaml/diorama.yaml');
document.getElementById('item-crystal').onclick = () => showYAML('yaml/crystal.yaml');
document.getElementById('item-soba').onclick = () => showYAML('yaml/soba.yaml');

// 閉じるボタンのイベント
document.getElementById('closeYaml').onclick = closeYAML;
