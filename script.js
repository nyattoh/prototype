// script.js

let defaultItems = []; // 外部ファイルから読み込む

// 既存アイテムデータを読み込む
async function loadDefaultItems() {
    try {
        const response = await fetch('items.json');
        const data = await response.json();
        defaultItems = data.defaultItems;
    } catch (error) {
        console.error('既存アイテムデータの読み込みに失敗:', error);
        defaultItems = []; // フォールバック
    }
}

// YAMLカードを表示するための関数
async function showYAML(yamlFile, isUserContent = false, yamlContent = null) {
    const overlay = document.getElementById('yamlOverlay');
    const content = document.getElementById('yamlContent');

    if (isUserContent && yamlContent) {
        // ユーザー投稿コンテンツの場合
        content.textContent = yamlContent;
    } else {
        // 既存のYAMLファイルを読み込む
        const response = await fetch(yamlFile);
        const yamlText = await response.text();
        content.textContent = yamlText;
    }

    // オーバーレイ表示
    overlay.classList.add('active');
}

// YAMLカードを閉じるための関数
function closeYAML() {
    document.getElementById('yamlOverlay').classList.remove('active');
}

// 投稿フォームを表示
function showPostForm() {
    document.getElementById('postOverlay').classList.add('active');
}

// 投稿フォームを閉じる
function closePostForm() {
    document.getElementById('postOverlay').classList.remove('active');
    // フォームリセット
    document.getElementById('yamlForm').reset();
    // プレビューを非表示
    document.getElementById('imagePreview').style.display = 'none';
}

// 画像プレビュー機能
function setupImagePreview() {
    const fileInput = document.getElementById('itemImage');
    const preview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');

    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        
        if (file) {
            // ファイルサイズチェック（5MB）
            if (file.size > 5 * 1024 * 1024) {
                alert('ファイルサイズが大きすぎます（最大5MB）');
                fileInput.value = '';
                preview.style.display = 'none';
                return;
            }

            // ファイル形式チェック
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                alert('許可されていないファイル形式です。JPEG、PNG、GIF、WebPのみ対応しています。');
                fileInput.value = '';
                preview.style.display = 'none';
                return;
            }

            // プレビュー表示
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImg.src = e.target.result;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            preview.style.display = 'none';
        }
    });
}

// 画像をアップロード（修正版）
async function uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    try {
        // XSERVERのcgi-binディレクトリにアクセス
        const response = await fetch('./cgi-bin/upload.py', {
            method: 'POST',
            body: formData
        });

        // レスポンステキストを確認
        const responseText = await response.text();
        console.log('サーバーレスポンス:', responseText);

        // JSONパース試行
        const result = JSON.parse(responseText);
        
        if (result.success) {
            return result;  // 結果オブジェクト全体を返す
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error('アップロードエラー:', error);
        
        // より詳細なエラー情報を表示
        if (error instanceof SyntaxError) {
            throw new Error('サーバーがJSONを返しませんでした。CGI設定を確認してください。');
        } else {
            throw error;
        }
    }
}

// 全てのアイテムを表示（既存+ユーザー投稿）
async function loadAllItems() {
    const desk = document.getElementById('desk');
    const addButton = document.getElementById('addNewItem');
    
    // 既存のアイテムをすべて削除（addButton以外）
    const existingItems = desk.querySelectorAll('.item:not(.user-add)');
    existingItems.forEach(item => item.remove());
    
    // 既存アイテムデータが読み込まれていない場合は読み込む
    if (defaultItems.length === 0) {
        await loadDefaultItems();
    }
    
    // 既存アイテムを表示
    defaultItems.forEach(item => {
        const element = createDefaultItemElement(item);
        desk.insertBefore(element, addButton);
    });
    
    // ユーザー投稿アイテムを表示
    const userItems = getUserItems();
    userItems.forEach(item => {
        const element = createUserItemElement(item);
        desk.insertBefore(element, addButton);
    });
}

// 既存アイテム要素を作成
function createDefaultItemElement(item) {
    const element = document.createElement('div');
    element.className = 'item';
    element.id = item.id;
    element.innerHTML = `
        <img src="${item.imageUrl}" alt="${item.title}">
        <p class="item-label">${item.title}</p>
    `;
    
    // クリックイベントを追加
    element.addEventListener('click', () => {
        showYAML(item.yamlFile);
    });
    
    return element;
}

// ユーザーアイテム要素を作成
function createUserItemElement(item) {
    const element = document.createElement('div');
    element.className = 'item user-item';
    element.id = item.id;
    element.innerHTML = `
        <img src="${item.imageUrl}" alt="${item.title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMTIwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjZjVmNWY1Ii8+Cjx0ZXh0IHg9IjYwIiB5PSI0NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7nlLvlg4E8L3RleHQ+Cjwvc3ZnPgo='">
        <p class="item-label">${item.title}</p>
    `;
    
    // クリックイベントを追加（既存アイテムと同じようにファイルから読み込み）
    element.addEventListener('click', () => {
        showYAML(item.yamlFile);
    });
    
    return element;
}

// 新しいアイテムを机に追加（localStorage保存あり）
async function addItemToDesk(title, imageUrl, yamlFile) {
    // ユニークIDを生成
    const itemId = 'user-item-' + Date.now();
    
    // ローカルストレージに保存
    const userItems = getUserItems();
    userItems.push({
        id: itemId,
        title: title,
        imageUrl: imageUrl,
        yamlFile: yamlFile,  // YAMLファイルパスを保存
        timestamp: Date.now()
    });
    localStorage.setItem('userYamlItems', JSON.stringify(userItems));
    
    // 全アイテムを再描画
    await loadAllItems();
}

// ローカルストレージからユーザーアイテムを取得
function getUserItems() {
    const stored = localStorage.getItem('userYamlItems');
    return stored ? JSON.parse(stored) : [];
}

// フォーム送信の処理
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const submitBtn = document.getElementById('submitPost');
    const originalText = submitBtn.textContent;
    
    try {
        // ボタンを無効化
        submitBtn.disabled = true;
        submitBtn.textContent = 'アップロード中...';
        
        const title = document.getElementById('itemTitle').value.trim();
        const yamlContent = document.getElementById('yamlContentInput').value.trim();
        const fileInput = document.getElementById('itemImage');
        const file = fileInput.files[0];
        
        // バリデーション
        if (!title || !yamlContent || !file) {
            alert('すべての項目を入力してください。');
            return;
        }
        
        // 画像をアップロード
        const result = await uploadImage(file);
        
        // アイテムを追加（YAMLファイルパスを使用）
        await addItemToDesk(title, result.imageUrl, result.yamlFile);
        
        // フォームを閉じる
        closePostForm();
        
        // 成功メッセージ
        alert('✅ 新しいアイテムが机に追加されました！');
        
    } catch (error) {
        alert('❌ エラーが発生しました: ' + error.message);
    } finally {
        // ボタンを元に戻す
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', async () => {
    await loadAllItems();
    setupImagePreview();
    
    // イベントハンドラーを設定（要素の存在確認付き）
    const copyYaml = document.getElementById('copyYaml');
    if (copyYaml) {
        copyYaml.onclick = () => {
            const content = document.getElementById('yamlContent').textContent;
            navigator.clipboard.writeText(content).then(() => {
                alert('✅ YAMLをコピーしました！');
            }).catch(err => {
                alert('コピーに失敗しました: ' + err);
            });
        };
    }
    
    const addNewItem = document.getElementById('addNewItem');
    if (addNewItem) {
        addNewItem.onclick = showPostForm;
    }
    
    const closeYaml = document.getElementById('closeYaml');
    if (closeYaml) {
        closeYaml.onclick = closeYAML;
    }
    
    const closePost = document.getElementById('closePost');
    if (closePost) {
        closePost.onclick = closePostForm;
    }
    
    const cancelPost = document.getElementById('cancelPost');
    if (cancelPost) {
        cancelPost.onclick = closePostForm;
    }
    
    const yamlForm = document.getElementById('yamlForm');
    if (yamlForm) {
        yamlForm.onsubmit = handleFormSubmit;
    }
});
