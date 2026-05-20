// store/api/scanApi.ts
import { baseApi } from './baseApi';

// ── Response types ────────────────────────────────────────────────────────────

export interface IngredientIntelligence {
  irritation_load: number;
  exfoliation_load: number;
  barrier_stress: number;
  active_intensity: number;
}

export interface ScoreProfile {
  compatibility: number;
  safety: number;
  redness: number;
  effectiveness: number;
  evenness: number;
}

export interface AnalysisItem {
  score: number;
  intensity: 'low' | 'medium' | 'high';
  why: string;
}

export interface ProductAnalysis {
  overall_score: number;
  score_profile: ScoreProfile;
  compatibility_analysis: {
    ingredient_conflict: AnalysisItem;
    allergy_risk: AnalysisItem;
  };
  product_benefits: {
    high_compatibility: AnalysisItem;
    ingredient_synergy: AnalysisItem;
  };
  what_to_stop: string[];
  what_to_do: string[];
  learn_more: string;
}

export interface CatalogProduct {
  id: string;
  name: string;
  image_url: string;
  category: string;
  tags: string[];
  concerns: string[];
  priority: number;
}

export interface ProductScanResult {
  scan_id: string;
  product: {
    name: string;
    brand: string;
    category: string;
    id: string;
    image_url: string;
  };
  detected_ingredients: string[];
  ingredient_conflicts: string[];
  ingredient_intelligence: IngredientIntelligence;
  analysis: ProductAnalysis;
  catalog_product: CatalogProduct | null;
}

// ── Request arg types ─────────────────────────────────────────────────────────

export interface ScanProductByImageArg {
  imageUri: string;
}

export interface ScanProductByBarcodeArg {
  barcode: string;
  barcodeType?: string;
}

/**
 * Normalizes the ProductScanResult to handle the backend bug where
 * `product_benefits` is sometimes returned at the root level instead
 * of nested inside `analysis`. Remove once the backend is fixed.
 */
const normalizeScanResult = (raw: any): ProductScanResult => {
  const analysis = raw.analysis ?? {};

  // If product_benefits is missing from analysis but exists at root, lift it in
  const productBenefits = analysis.product_benefits ??
    raw.product_benefits ?? {
      high_compatibility: { score: 0, intensity: 'low', why: '' },
      ingredient_synergy: { score: 0, intensity: 'low', why: '' },
    };

  // Same safety net for what_to_stop / what_to_do in case they drift too
  const whatToStop = analysis.what_to_stop ?? raw.what_to_stop ?? [];
  const whatToDo = analysis.what_to_do ?? raw.what_to_do ?? [];
  const learnMore = analysis.learn_more ?? raw.learn_more ?? '';

  return {
    ...raw,
    analysis: {
      ...analysis,
      product_benefits: productBenefits,
      what_to_stop: whatToStop,
      what_to_do: whatToDo,
      learn_more: learnMore,
    },
  };
};

// ── API slice ─────────────────────────────────────────────────────────────────

export const scanApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * POST /scan/product
     * Multipart form-data with a single `image` field.
     * formData: true tells fetchBaseQuery to skip setting Content-Type so the
     * runtime sets the correct multipart boundary automatically.
     */
    scanProductByImage: builder.mutation<ProductScanResult, ScanProductByImageArg>({
      query: ({ imageUri }) => {
        const body = new FormData();
        body.append('image', {
          uri: imageUri,
          name: 'product.jpg',
          type: 'image/jpeg',
        } as any);
        return { url: '/scan/product', method: 'POST', body, formData: true };
      },
      // Normalize before the result reaches any component
      transformResponse: (raw: any) => normalizeScanResult(raw),
    }),

    /**
     * POST /scan/product/barcode  — backend endpoint not live yet.
     * When it ships, nothing in the loading screen needs to change.
     */
    scanProductByBarcode: builder.mutation<ProductScanResult, ScanProductByBarcodeArg>({
      query: ({ barcode, barcodeType }) => ({
        url: '/scan/product/barcode',
        method: 'POST',
        body: { barcode, barcode_type: barcodeType },
      }),
      transformResponse: (raw: any) => normalizeScanResult(raw),
    }),
  }),
  overrideExisting: false,
});

export const { useScanProductByImageMutation, useScanProductByBarcodeMutation } = scanApi;
