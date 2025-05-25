#!/usr/bin/python3.6
# -*- coding: utf-8 -*-

import cgi
import cgitb
import os
import sys
import json
import hashlib
import time
import io
from pathlib import Path

# 環境変数でエンコーディングを設定
os.environ['PYTHONIOENCODING'] = 'utf-8'

# 標準出力をUTF-8に設定（Python3.6互換）
if hasattr(sys.stdout, 'buffer'):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# CGIエラーを表示するための設定（デバッグ用）
cgitb.enable()

# Content-Typeヘッダーを設定
print("Content-Type: application/json; charset=utf-8")
print()  # 空行が必要

def safe_filename(filename):
    """ファイル名を安全なASCII文字のみに変換"""
    import re
    # 拡張子を保持
    name, ext = os.path.splitext(filename)
    # 非ASCII文字を削除してタイムスタンプで代替
    safe_name = re.sub(r'[^\x00-\x7F]+', '', name)
    if not safe_name:
        safe_name = "upload"
    return safe_name + ext

def main():
    try:
        # POSTメソッドかチェック
        if os.environ.get('REQUEST_METHOD') != 'POST':
            raise Exception('POST method only')

        # フォームデータを取得
        form = cgi.FieldStorage()
        
        # 画像ファイルを取得
        if 'image' not in form:
            raise Exception('No image file selected')
        
        file_item = form['image']
        
        # ファイルが実際にアップロードされているかチェック
        if not file_item.filename:
            raise Exception('No file selected')
        
        # YAMLコンテンツを取得
        if 'yamlContent' not in form:
            raise Exception('No YAML content provided')
        
        yaml_content = form['yamlContent'].value
        if not yaml_content.strip():
            raise Exception('YAML content is empty')
        
        # ファイル名を安全に処理
        original_filename = safe_filename(file_item.filename)
        
        # ファイル拡張子をチェック
        allowed_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
        file_ext = Path(original_filename).suffix.lower()
        if file_ext not in allowed_extensions:
            raise Exception('Invalid file format. Only jpg, jpeg, png, gif, webp are supported')
        
        # アップロードディレクトリのパス（ディレクトリ作成は行わない）
        upload_dir = Path('../assets/images/uploads')
        yaml_dir = Path('../yaml')
        
        # ディレクトリが存在するかチェック
        if not upload_dir.exists():
            raise Exception('Upload directory does not exist')
        
        if not yaml_dir.exists():
            raise Exception('YAML directory does not exist')
        
        # ユニークなファイル名を生成（完全にASCII安全）
        timestamp = str(int(time.time()))
        hash_suffix = hashlib.md5(timestamp.encode('ascii')).hexdigest()[:8]
        new_filename = f"upload-{timestamp}-{hash_suffix}{file_ext}"
        yaml_filename = f"user-{timestamp}-{hash_suffix}.yaml"
        
        # ファイルパス
        file_path = upload_dir / new_filename
        yaml_path = yaml_dir / yaml_filename
        
        # ファイルサイズチェック（5MB制限）
        max_size = 5 * 1024 * 1024  # 5MB
        file_data = file_item.file.read()
        if len(file_data) > max_size:
            raise Exception('File size too large (max 5MB)')
        
        # 画像ファイルを保存
        with open(file_path, 'wb') as f:
            f.write(file_data)
        
        # YAMLファイルを保存
        with open(yaml_path, 'w', encoding='utf-8') as f:
            f.write(yaml_content)
        
        # ファイル権限を設定（必要に応じて）
        os.chmod(file_path, 0o644)
        os.chmod(yaml_path, 0o644)
        
        # 成功レスポンス（ASCII安全）
        response = {
            'success': True,
            'message': 'Upload completed successfully',
            'imageUrl': f'./assets/images/uploads/{new_filename}',
            'yamlFile': f'./yaml/{yaml_filename}',
            'originalName': original_filename,
            'size': len(file_data)
        }
        
        # JSON出力（ensure_ascii=Trueで安全に）
        json_output = json.dumps(response, ensure_ascii=True)
        print(json_output)
        
    except Exception as e:
        # エラーレスポンス（ASCII安全）
        error_response = {
            'success': False,
            'message': str(e).encode('ascii', 'ignore').decode('ascii')
        }
        json_output = json.dumps(error_response, ensure_ascii=True)
        print(json_output)

if __name__ == '__main__':
    main() 