// キーのサイズ単位（U = unit、標準キー幅は1U = 19.05mm）
export type KeySize = 1 | 1.25 | 1.5 | 1.75 | 2 | 2.25 | 2.5 | 2.75 | 3 | 4 | 4.5 | 5.5 | 6 | 6.25 | 6.5 | 7;

// キーの位置（グリッド座標）
export interface KeyPosition {
  row: number;
  col: number;
}

// キー情報
export interface Key {
  id: string;
  position: KeyPosition;
  size: KeySize;
  rotation?: number; // 回転角度（度）
}

// レイアウト（左右のハーフ）
export interface KeyboardHalf {
  keys: Key[];
}

// 分割キーボードのレイアウト
export interface KeyboardLayout {
  left: KeyboardHalf;
  right: KeyboardHalf;
}

// キーボードパラメータ
export interface KeyboardParameters {
  // 基本設定
  keyUnit: number; // 1Uのサイズ（mm、通常19.05）
  keySpacing: number; // キー間隔（mm）
  
  // プレート設定
  plateThickness: number; // プレートの厚み（mm）
  switchHoleSize: number; // スイッチホールサイズ（mm、通常14x14）
  
  // ケース設定
  caseWallThickness: number; // ケースの壁の厚み（mm）
  caseBottomThickness: number; // ボトムケースの底の厚み（mm）
  caseHeight: number; // ケースの高さ（mm）
  caseClearance: number; // プレートとケースのクリアランス（mm）
  
  // キーボード全体の設定
  splitDistance: number; // 左右の距離（mm）
  tentAngle: number; // テント角度（度）
}

// デフォルトパラメータ
export const DEFAULT_PARAMETERS: KeyboardParameters = {
  keyUnit: 19.05,
  keySpacing: 19.05,
  plateThickness: 1.5,
  switchHoleSize: 14.0,
  caseWallThickness: 3.0,
  caseBottomThickness: 3.0,
  caseHeight: 20.0,
  caseClearance: 2.0,
  splitDistance: 100.0,
  tentAngle: 0,
};

