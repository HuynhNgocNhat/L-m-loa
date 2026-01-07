export enum UsageType {
  KARAOKE = 'karaoke', // Target 47-48Hz
  MUSIC = 'music',     // Target 44-45Hz
}

export interface BoxDimensions {
  w: number; // Width (cm)
  h: number; // Height (cm)
  d: number; // Depth (cm)
}

export interface TrianglePortConfig {
  base: number;   // Canh day (cm)
  height: number; // Chieu cao (cm)
  length: number; // Chieu sau hien tai (cm)
}

export enum SuggestionAction {
  PERFECT = 'perfect',
  ADJUST_LENGTH = 'length',
  IMPOSSIBLE = 'impossible', // Length < 8 or > 35
}

export interface AnalysisResult {
  // Volume
  vRaw: number;
  vNet: number;
  
  // Port specs
  sTotal: number;
  
  // Frequency Analysis
  fbCurrent: number;
  fbTarget: number;
  deltaFb: number;
  
  // Suggestion
  action: SuggestionAction;
  suggestedLength: number;
  lengthDiff: number; // How much to cut or add
  
  // Safety
  warnings: string[];
  magnetClearance: number;
  rearPortClearance: number;
}