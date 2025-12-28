# プロジェクト構造とアーキテクチャ

## フォルダ階層

```
keyboard_creator/
├── src/                          # ソースコード
│   ├── main.tsx                  # アプリケーションエントリーポイント
│   ├── App.tsx                   # メインアプリケーションコンポーネント
│   ├── App.css                   # アプリケーションスタイル
│   ├── index.css                 # グローバルスタイル
│   │
│   ├── types/                    # TypeScript型定義
│   │   └── keyboard.ts           # キーボード関連の型定義
│   │
│   ├── components/               # Reactコンポーネント
│   │   ├── LayoutEditor/         # レイアウトエディタコンポーネント
│   │   │   ├── LayoutEditor.tsx  # レイアウトエディタのメインコンポーネント
│   │   │   ├── LayoutEditor.css  # レイアウトエディタのスタイル
│   │   │   ├── KeyGridEditor.tsx # キーグリッドエディタコンポーネント
│   │   │   ├── KeyGridEditor.css # グリッドエディタのスタイル
│   │   │   ├── KeySlot.tsx       # キースロットコンポーネント（個別のキー表示）
│   │   │   └── KeySlot.css       # キースロットのスタイル
│   │   │
│   │   ├── Viewer3D/             # 3Dビューアーコンポーネント
│   │   │   ├── Viewer3D.tsx      # 3Dビューアーのメインコンポーネント
│   │   │   ├── Viewer3D.css      # ビューアーのスタイル
│   │   │   └── KeyboardRenderer.tsx # キーボード3Dモデルのレンダリング管理
│   │   │
│   │   ├── ParameterPanel/       # パラメータ調整パネル
│   │   │   ├── ParameterPanel.tsx # パラメータ調整UIコンポーネント
│   │   │   └── ParameterPanel.css # パラメータパネルのスタイル
│   │   │
│   │   └── ExportPanel/          # エクスポートパネル
│   │       ├── ExportPanel.tsx   # エクスポートUIコンポーネント
│   │       └── ExportPanel.css   # エクスポートパネルのスタイル
│   │
│   ├── lib/                      # ライブラリ・ユーティリティ関数
│   │   ├── geometry/             # 3Dジオメトリ生成
│   │   │   ├── keyGeometry.ts    # キー関連のジオメトリ生成（位置計算、サイズ変換）
│   │   │   ├── plateGenerator.ts # プレートの3Dモデル生成
│   │   │   └── caseGenerator.ts  # トップケース・ボトムケースの3Dモデル生成
│   │   │
│   │   ├── export/               # エクスポート機能
│   │   │   └── stlExporter.ts    # STL形式へのエクスポート処理
│   │   │
│   │   └── threejs/              # Three.js関連ユーティリティ
│   │       └── setupScene.ts     # Three.jsシーンの初期化・セットアップ
│   │
│   └── utils/                    # 汎用ユーティリティ関数
│       └── layoutUtils.ts        # レイアウト操作ユーティリティ（キーの追加・削除・更新）
│
├── public/                       # 静的ファイル（現在は使用していない）
├── index.html                    # HTMLエントリーポイント
├── package.json                  # 依存関係とスクリプト定義
├── tsconfig.json                 # TypeScriptコンパイラ設定
├── tsconfig.node.json            # Node.js用TypeScript設定
├── vite.config.ts                # Viteビルドツール設定
├── .eslintrc.cjs                 # ESLint設定
├── .gitignore                    # Git除外設定
└── README.md                     # プロジェクト概要
```

## 各ディレクトリ・ファイルの役割

### エントリーポイント

- **`src/main.tsx`**
  - Reactアプリケーションのエントリーポイント
  - DOMにアプリケーションをマウント
  - React.StrictModeでラップして開発時の警告を有効化

- **`src/App.tsx`**
  - メインアプリケーションコンポーネント
  - レイアウトデータとパラメータの状態管理（useState）
  - サイドバー（レイアウトエディタ、パラメータパネル、エクスポートパネル）と3Dビューアーのレイアウト管理

### 型定義 (`src/types/`)

- **`keyboard.ts`**
  - キーボード関連のTypeScript型定義
  - `KeySize`: キーサイズの型（1U, 1.25U, 1.5Uなど）
  - `KeyPosition`: キーの位置（行・列）
  - `Key`: キー情報（ID、位置、サイズ、回転角度）
  - `KeyboardHalf`: 左右のハーフ（キー配列）
  - `KeyboardLayout`: 分割キーボードのレイアウト全体
  - `KeyboardParameters`: キーボードの各種パラメータ（寸法、角度など）
  - `DEFAULT_PARAMETERS`: デフォルトパラメータ値

### コンポーネント (`src/components/`)

#### LayoutEditor (`src/components/LayoutEditor/`)

- **`LayoutEditor.tsx`**
  - レイアウトエディタのメインコンポーネント
  - 左右のハーフの切り替え
  - レイアウトのクリア機能
  - KeyGridEditorを統合

- **`KeyGridEditor.tsx`**
  - グリッドベースのキー配置エディタ
  - グリッド上でのキーの追加・削除
  - キーサイズの選択
  - クリック/右クリックでの操作

- **`KeySlot.tsx`**
  - 個別のキースロットを表示するコンポーネント
  - キーの配置状態を視覚化
  - クリックイベントの処理

#### Viewer3D (`src/components/Viewer3D/`)

- **`Viewer3D.tsx`**
  - Three.jsを使用した3Dビューアーのメインコンポーネント
  - シーンの初期化とカメラコントロール（OrbitControls）
  - レイアウト変更時の自動更新
  - アニメーションループの管理

- **`KeyboardRenderer.tsx`**
  - キーボード3Dモデルのレンダリングを管理するクラス
  - プレート、ケースのメッシュの生成と削除
  - シーンへの追加・削除の管理
  - メモリリソースのクリーンアップ

#### ParameterPanel (`src/components/ParameterPanel/`)

- **`ParameterPanel.tsx`**
  - キーボードパラメータを調整するUIコンポーネント
  - 基本設定（キーサイズ、キー間隔）
  - プレート設定（厚み、スイッチホールサイズ）
  - ケース設定（壁厚、高さ、クリアランス）
  - キーボード全体設定（分割距離、テント角度）

#### ExportPanel (`src/components/ExportPanel/`)

- **`ExportPanel.tsx`**
  - STL形式でのエクスポートUIコンポーネント
  - 左右のハーフそれぞれのプレート・ケースのエクスポート
  - エクスポートボタンの管理
  - キーが配置されていない場合の無効化

### ライブラリ (`src/lib/`)

#### ジオメトリ生成 (`src/lib/geometry/`)

- **`keyGeometry.ts`**
  - キー関連のジオメトリ計算
  - `createSwitchHoleGeometry`: スイッチホールのジオメトリ生成
  - `keyPositionTo3D`: キー位置を3D座標に変換
  - `keySizeToWidth`: キーサイズ（U単位）を幅（mm）に変換

- **`plateGenerator.ts`**
  - プレートの3Dモデル生成
  - `generatePlateGeometry`: プレートのジオメトリ生成（矩形プレート）
  - `createPlateMesh`: プレートメッシュの作成
  - `createKeyHoles`: キーホールの視覚化メッシュ生成（円柱で表示）

- **`caseGenerator.ts`**
  - トップケース・ボトムケースの3Dモデル生成
  - `generateTopCaseGeometry`: トップケースのジオメトリ生成（フレーム形状）
  - `generateBottomCaseGeometry`: ボトムケースのジオメトリ生成（ボックス形状）
  - `createTopCaseMesh`: トップケースメッシュの作成
  - `createBottomCaseMesh`: ボトムケースメッシュの作成

#### エクスポート (`src/lib/export/`)

- **`stlExporter.ts`**
  - STL形式へのエクスポート機能
  - `exportSTL`: Three.jsジオメトリをSTL形式（ASCII）に変換
  - `exportMeshAsSTL`: メッシュからSTLをエクスポート
  - ファイルダウンロード処理

#### Three.jsユーティリティ (`src/lib/threejs/`)

- **`setupScene.ts`**
  - Three.jsシーンの初期化
  - `setupScene`: シーン、カメラ、レンダラーの作成
  - ライト設定（環境光、指向性ライト）
  - ヘルパー（グリッド、軸）の追加
  - `handleResize`: ウィンドウリサイズ時の処理

### ユーティリティ (`src/utils/`)

- **`layoutUtils.ts`**
  - レイアウト操作のユーティリティ関数
  - `generateKeyId`: キーIDの生成
  - `createKey`: 新しいキーの作成
  - `addKey`: キーの追加
  - `removeKey`: キーの削除
  - `updateKey`: キーの更新
  - `createEmptyLayout`: 空のレイアウトの作成
  - `hasKeyAtPosition`: 位置にキーが存在するかチェック

## データフロー

```
[ユーザー操作]
    ↓
[LayoutEditor/ParameterPanel] → [App.tsx] → [状態更新]
    ↓
[Viewer3D] → [KeyboardRenderer] → [geometry generators] → [Three.js Scene]
    ↓
[ExportPanel] → [stlExporter] → [ファイルダウンロード]
```

## 技術スタック

- **React 18**: UIライブラリ
- **TypeScript**: 型安全性
- **Three.js**: 3Dレンダリング
- **Vite**: ビルドツール・開発サーバー
- **ESLint**: コード品質チェック

## 主要な処理の流れ

### レイアウト編集の流れ

1. ユーザーがKeyGridEditorでグリッドをクリック
2. KeySlotコンポーネントがクリックイベントを処理
3. KeyGridEditorがlayoutUtilsを使用してレイアウトを更新
4. LayoutEditorがApp.tsxにレイアウト変更を通知
5. App.tsxが状態を更新
6. Viewer3Dが新しいレイアウトを受け取り、KeyboardRendererに通知
7. KeyboardRendererが新しい3Dモデルを生成してシーンに追加

### 3D表示の流れ

1. Viewer3Dがマウント時にThree.jsシーンを初期化
2. KeyboardRendererがレイアウトとパラメータから3Dモデルを生成
3. プレート、ケース、キーホールのメッシュを作成
4. Three.jsシーンに追加
5. アニメーションループでレンダリング

### エクスポートの流れ

1. ユーザーがExportPanelでエクスポートボタンをクリック
2. 対応するパーツ（プレート/ケース）のメッシュを生成
3. stlExporterがメッシュのジオメトリをSTL形式に変換
4. ブラウザのダウンロードAPIでファイルとして保存

