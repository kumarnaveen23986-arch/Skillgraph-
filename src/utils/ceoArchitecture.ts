// ==========================================
// CEO ARCHITECTURE & PERMANENT GEMINI 3.8 FLASH MODIFIER
// Exclusively for Founder & CEO Ansh Kumar
// Protected by "hii" -> "hello" 100-token Zero-Knowledge Gateway
// (Gateway code is strictly concealed even from CEO and users)
// ==========================================

export interface CeoCustomPatch {
  id: string;
  title: string;
  category: 'feature' | 'course' | 'tool' | 'subscription' | 'system';
  directive: string;
  architecturalSummary?: string;
  codeSnippet: string;
  liveConfig: {
    key: string;
    enabled: boolean;
    title?: string;
    description?: string;
    metadata?: Record<string, any>;
    [key: string]: any;
  };
  enabled: boolean;
  createdAt: string;
  appliedBy: string;
  gatewayMask: string;
}

const STORAGE_KEY = 'sg_ceo_custom_features';

// Generate 100-character zero-knowledge security mask
// STRICT RULE: Plaintext code is never displayed anywhere (not even to CEO or user)
export function getMaskedGateway100(): string {
  return '•'.repeat(100);
}

export function getCeoCustomPatches(): CeoCustomPatch[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultPatches();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : getDefaultPatches();
  } catch (err) {
    console.warn('Failed to parse CEO custom features:', err);
    return getDefaultPatches();
  }
}

export function saveCeoCustomPatches(patches: CeoCustomPatch[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(patches));
    window.dispatchEvent(new CustomEvent('ceo-patches-updated', { detail: patches }));
  } catch (err) {
    console.error('Failed to save CEO custom features:', err);
  }
}

export function addCeoCustomPatch(patch: Omit<CeoCustomPatch, 'id' | 'createdAt' | 'appliedBy' | 'gatewayMask'>): CeoCustomPatch {
  const current = getCeoCustomPatches();
  const newPatch: CeoCustomPatch = {
    ...patch,
    id: `ceo-patch-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
    appliedBy: 'Founder & CEO Ansh Kumar',
    gatewayMask: getMaskedGateway100(),
  };

  const updated = [newPatch, ...current];
  saveCeoCustomPatches(updated);
  return newPatch;
}

export function toggleCeoPatch(id: string, enabled: boolean): void {
  const current = getCeoCustomPatches();
  const updated = current.map((p) => (p.id === id ? { ...p, enabled } : p));
  saveCeoCustomPatches(updated);
}

export function deleteCeoPatch(id: string): void {
  const current = getCeoCustomPatches();
  const updated = current.filter((p) => p.id !== id);
  saveCeoCustomPatches(updated);
}

function getDefaultPatches(): CeoCustomPatch[] {
  return [
    {
      id: 'ceo-patch-default-1',
      title: 'Indian Creators Masterclass: System Design by Kunal Kushwaha & Chai aur Code',
      category: 'course',
      directive: 'Add top recommended Indian creator tutorials with ProofLoop hands-on code labs',
      architecturalSummary: 'Curates highest-rated free Indian tech masterclasses and maps them into interactive ProofLoop verification exercises.',
      codeSnippet: `// Permanent CEO Course Injection
export const indianCreatorCourses = [
  { id: 'chai-aur-code-js', creator: 'Hitesh Choudhary', title: 'JavaScript Hindi In-Depth', proOnly: false },
  { id: 'kunal-dsa', creator: 'Kunal Kushwaha', title: 'Complete DSA & Java Bootcamp', proOnly: false },
  { id: 'codewithharry-py', creator: 'CodeWithHarry', title: '100 Days of Python Mastery', proOnly: false },
];`,
      liveConfig: {
        key: 'indian_creator_integration',
        enabled: true,
        title: 'Indian Creator Hub Active',
        description: 'Chai aur Code, Kunal Kushwaha, CodeWithHarry modules verified',
      },
      enabled: true,
      createdAt: new Date().toISOString(),
      appliedBy: 'Founder & CEO Ansh Kumar',
      gatewayMask: getMaskedGateway100(),
    },
    {
      id: 'ceo-patch-default-2',
      title: 'Pro vs Advanced Plan Granular XP Calibration',
      category: 'subscription',
      directive: 'Enforce 100 XP initial bonus for free learners, unlock unlimited XP and Flow AI 10s video for ₹99 Pro and ₹299 Advanced',
      architecturalSummary: 'Locks excessive token consumption on free tier while granting full Gemini 3.8 Flash & Flow AI access on Pro tiers.',
      codeSnippet: `// Subscription Limits Policy
export const planCalibration = {
  free: { loginBonusXp: 100, maxDailyQuestions: 15, aiDoctor: 'Standard' },
  pro99: { priceInr: 99, loginBonusXp: 1500, maxDailyQuestions: 200, aiDoctor: 'Priority', flowAiAccess: true },
  advanced299: { priceInr: 299, loginBonusXp: 10000, maxDailyQuestions: 'Unlimited', aiDoctor: 'Instant Real-Time', flowAiAccess: true, grokUnhinged: true }
};`,
      liveConfig: {
        key: 'subscription_calibration_v2',
        enabled: true,
        title: 'Calibrated Plan Tiering',
        description: '₹99 Pro & ₹299 Advanced with customized XP and AI Doctor limits',
      },
      enabled: true,
      createdAt: new Date().toISOString(),
      appliedBy: 'Founder & CEO Ansh Kumar',
      gatewayMask: getMaskedGateway100(),
    },
  ];
}
