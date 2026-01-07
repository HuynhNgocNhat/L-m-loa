import { AnalysisResult, BoxDimensions, SuggestionAction, TrianglePortConfig, UsageType } from '../types';

// Constants defined in specs
const DRIVER_DISPLACEMENT = 3.0; // Liters
const BRACING_DISPLACEMENT = 1.0; // Liters
const TOTAL_STATIC_DISPLACEMENT = DRIVER_DISPLACEMENT + BRACING_DISPLACEMENT; // 4.0L
const DRIVER_DEPTH = 13.0; // cm
const PORT_COUNT = 2;

// Constraints
const MIN_VB = 50;
const MAX_VB = 70;
const MIN_S_TOTAL = 150;
const MIN_L_NEW = 8;
const MAX_L_NEW = 35;

export const analyzeBox = (
  box: BoxDimensions,
  port: TrianglePortConfig,
  usage: UsageType
): AnalysisResult => {
  const warnings: string[] = [];

  // --- STEP 1: CALCULATE PORT AREA ---
  // S1 = (base * height) / 2
  // S_total = 2 * S1 = base * height
  const sOne = (port.base * port.height) / 2;
  const sTotal = sOne * PORT_COUNT;

  // --- STEP 2: CALCULATE VOLUMES ---
  const vRaw = (box.w * box.h * box.d) / 1000;
  
  // Port volume (approximate material thickness included factor 1.15 is removed for strict logic, 
  // relying on prompt: V_port = (S * L) / 1000)
  const vPort = (sTotal * port.length) / 1000;
  
  const vNet = vRaw - TOTAL_STATIC_DISPLACEMENT - vPort;

  // --- STEP 3: CALCULATE CURRENT Fb ---
  // Helmholtz: Fb = sqrt( (23562.5 * S) / ( (L + 0.732*sqrt(S)) * Vb ) )
  const k = 23562.5;
  const endCorrection = 0.732 * Math.sqrt(sTotal);
  
  let fbCurrent = 0;
  if (vNet > 0 && sTotal > 0 && port.length > 0) {
    const effectiveLength = port.length + endCorrection;
    fbCurrent = Math.sqrt((k * sTotal) / (effectiveLength * vNet));
  }

  // --- STEP 4: DETERMINE TARGET Fb ---
  // Karaoke: 47-48 -> 47.5
  // Music: 44-45 -> 44.5
  const fbTarget = usage === UsageType.KARAOKE ? 47.5 : 44.5;
  const deltaFb = fbCurrent - fbTarget;

  // --- STEP 5: SUGGESTION LOGIC ---
  let action = SuggestionAction.PERFECT;
  let suggestedLength = port.length;

  // Helper to calculate required Length for a target frequency
  // L = (23562.5 * S) / (Fb^2 * Vb) - 0.732 * sqrt(S)
  // Note: Vb changes slightly when L changes (recursive). 
  // We use 2 iterations for accuracy.
  const calculateL = (targetF: number, currentVb: number) => {
      // 1st pass
      let reqL = (k * sTotal) / (Math.pow(targetF, 2) * currentVb) - endCorrection;
      
      // 2nd pass (adjust Vb based on new L)
      const newVPort = (sTotal * reqL) / 1000;
      const refinedVb = vRaw - TOTAL_STATIC_DISPLACEMENT - newVPort;
      reqL = (k * sTotal) / (Math.pow(targetF, 2) * refinedVb) - endCorrection;
      
      return reqL;
  }

  if (Math.abs(deltaFb) <= 1.0) {
    // Case 1: Match
    action = SuggestionAction.PERFECT;
  } else {
    // Case 2 & 3: Calculate new length
    const lNew = calculateL(fbTarget, vNet);
    
    // Case 4: Check feasibility
    if (lNew < MIN_L_NEW || lNew > MAX_L_NEW) {
        action = SuggestionAction.IMPOSSIBLE;
        suggestedLength = lNew; // Still return it for display
    } else {
        action = SuggestionAction.ADJUST_LENGTH;
        suggestedLength = lNew;
    }
  }

  // --- STEP 6: SAFETY CHECKS ---
  if (sTotal < MIN_S_TOTAL) {
      warnings.push(`Tổng diện tích lỗ hơi ${sTotal}cm² < 150cm² (Nguy cơ ù gió lớn).`);
  }
  if (vNet < MIN_VB) {
      warnings.push(`Thể tích thùng thực ${vNet.toFixed(1)}L < 50L (Bass thiếu lực).`);
  } else if (vNet > MAX_VB) {
      warnings.push(`Thể tích thùng thực ${vNet.toFixed(1)}L > 70L (Bass mất kiểm soát).`);
  }

  const magnetClearance = box.d - DRIVER_DEPTH;
  if (magnetClearance < 5) {
      warnings.push(`Khoảng cách nam châm tới hậu ${magnetClearance.toFixed(1)}cm < 5cm (Bí hơi).`);
  }

  const rearPortClearance = box.d - port.length;
  if (rearPortClearance < 5) {
      warnings.push(`Đuôi ống hơi cách hậu ${rearPortClearance.toFixed(1)}cm < 5cm (Nghẹt hơi).`);
  }
  
  if (port.length >= box.d) {
      warnings.push(`Lỗi: Chiều sâu ống hơi (${port.length}cm) lớn hơn chiều sâu thùng (${box.d}cm).`);
  }

  return {
    vRaw,
    vNet,
    sTotal,
    fbCurrent,
    fbTarget,
    deltaFb,
    action,
    suggestedLength,
    lengthDiff: suggestedLength - port.length,
    warnings,
    magnetClearance,
    rearPortClearance
  };
};