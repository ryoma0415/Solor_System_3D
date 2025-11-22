# Solar System Explorer 3D

React + Vite + TypeScript で作られた太陽系インタラクティブ可視化アプリです。React Three Fiber を使って公転・自転を簡略表示し、各天体の物理・軌道データをパネルで確認できます。

## 主な機能
- 太陽系の主要天体と準惑星（全14天体）の3D表示
- 軌道ライン、時間スケール変更、再生/一時停止
- 惑星クリックで詳細パネル表示
- カメラ操作: OrbitControls、選択天体への自動移動
- テクスチャ対応（`public/textures/` 配下の PNG を貼り付け）

## セットアップ
1. Node.js (推奨: 18 以上) をインストール  
2. 依存関係をインストール  
   ```bash
   npm install
   ```
3. テクスチャ画像を配置  
   - `public/textures/` に以下のファイル名で PNG を置いてください（`data.ts` の `textureMap` と一致させる必要があります）。  
     ```
     sun.png
     mercury.png
     venus.png
     earth.png
     mars.png
     jupiter.png
     saturn.png
     uranus.png
     neptune.png
     ceres.png
     pluto.png
     haumea.png
     makemake.png
     eris.png
     ```
   - equirectangular (2:1) の表面テクスチャが最適です。
4. 環境変数（必要な場合のみ）  
   - `.env.local` に `GEMINI_API_KEY=...` などを設定。未使用なら空で構いません。

## 実行
- 開発サーバー  
  ```bash
  npm run dev -- --port 3000
  ```
  ブラウザで `http://localhost:3000/` を開く。
- 本番ビルド  
  ```bash
  npm run build
  ```
  `dist/` が生成されます。
- ビルド成果物のプレビュー  
  ```bash
  npm run preview
  ```

## デプロイ (Vercel の例)
1. リポジトリを GitHub にプッシュ。  
2. Vercel で「Add New Project」→ GitHub リポジトリを選択。  
3. 設定: Framework = Vite, Build Command = `npm run build`, Output = `dist`。  
4. 必要な環境変数（例: `GEMINI_API_KEY`）を Vercel の Environment Variables に登録。  
5. Deploy を実行すると本番 URL が発行されます。

## 技術スタック
- React 19 / TypeScript / Vite
- @react-three/fiber, @react-three/drei, three

## トラブルシューティング
- テクスチャが表示されない: ファイル名と `data.ts` の `textureMap` が一致しているか、`public/textures/` に置いたかを確認してください。
- ポート衝突: `npm run dev -- --port 5173` のようにポートを指定してください。
