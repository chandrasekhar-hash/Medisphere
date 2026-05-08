import foods from "../data/foods.json";
import medicines from "../data/medicines.json";

export interface FoodItem {
  name: string;
  category: string;
  calories: string;
  protein: string;
  carbohydrates: string;
  fats: string;
  fiber: string;
  sugar: string;
  sodium: string;
  healthScore: string | number;
  healthy: boolean;
  benefits: string[];
  risks: string[];
  bestFor: string[];
  avoidFor: string[];
}

export interface MedicineItem {
  name: string;
  category: string;
  uses: string[];
  dosage: string;
  sideEffects: string[];
  expiryWarning: string;
  safetyPrecautions: string[];
  prescriptionRequired: boolean;
}

function levenshtein(a: string, b: string): number {
  const matrix = [] as number[][];
  const alen = a.length;
  const blen = b.length;
  for (let i = 0; i <= alen; i++) matrix[i] = [i];
  for (let j = 0; j <= blen; j++) matrix[0][j] = j;
  for (let i = 1; i <= alen; i++) {
    for (let j = 1; j <= blen; j++) {
      if (a.charAt(i - 1).toLowerCase() === b.charAt(j - 1).toLowerCase()) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + 1
        );
      }
    }
  }
  return matrix[alen][blen];
}

function fuzzyMatch(query: string, target: string): boolean {
  const q = query.toLowerCase().trim();
  const t = target.toLowerCase().trim();
  
  // Exact or contains
  if (t === q || t.includes(q) || q.includes(t)) return true;
  
  // Word by word matching
  const qWords = q.split(/\s+/);
  const tWords = t.split(/\s+/);
  for (const qw of qWords) {
    if (qw.length < 3) continue;
    for (const tw of tWords) {
      if (tw.includes(qw) || qw.includes(tw)) return true;
      if (levenshtein(qw, tw) <= 1) return true;
    }
  }

  // Levenshtein for short strings
  if (q.length > 3 && t.length > 3) {
    const dist = levenshtein(q, t);
    if (dist <= 2) return true;
  }
  
  return false;
}

export function searchFood(label: string): FoodItem | null {
  if (!label) return null;
  const found = (foods as unknown as FoodItem[]).find((item) => fuzzyMatch(label, item.name));
  return found || null;
}

export function searchMedicine(label: string): MedicineItem | null {
  if (!label) return null;
  const found = (medicines as unknown as MedicineItem[]).find((item) => fuzzyMatch(label, item.name));
  return found || null;
}

export function getAllItems(): (FoodItem | MedicineItem)[] {
  return [...(foods as unknown as (FoodItem | MedicineItem)[]), ...(medicines as unknown as (FoodItem | MedicineItem)[])];
}

export async function searchItem(label: string): Promise<FoodItem | MedicineItem | null> {
  const food = searchFood(label);
  if (food) return food;
  const med = searchMedicine(label);
  if (med) return med;
  return null;
}
