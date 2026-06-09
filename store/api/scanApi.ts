// // store/api/scanApi.ts
// import { baseApi } from './baseApi';

// // ── Response types ────────────────────────────────────────────────────────────

// export interface IngredientIntelligence {
//   irritation_load: number;
//   exfoliation_load: number;
//   barrier_stress: number;
//   active_intensity: number;
// }

// export interface ScoreProfile {
//   compatibility: number;
//   safety: number;
//   redness: number;
//   effectiveness: number;
//   evenness: number;
// }

// export interface AnalysisItem {
//   score: number;
//   intensity: 'low' | 'medium' | 'high';
//   why: string;
// }

// export interface ProductAnalysis {
//   overall_score: number;
//   score_profile: ScoreProfile;
//   compatibility_analysis: {
//     ingredient_conflict: AnalysisItem;
//     allergy_risk: AnalysisItem;
//   };
//   product_benefits: {
//     high_compatibility: AnalysisItem;
//     ingredient_synergy: AnalysisItem;
//   };
//   what_to_stop: string[];
//   what_to_do: string[];
//   learn_more: string;
// }

// export interface CatalogProduct {
//   id: string;
//   name: string;
//   image_url: string;
//   category: string;
//   tags: string[];
//   concerns: string[];
//   priority: number;
// }

// export interface ProductScanResult {
//   scan_id: string;
//   product: {
//     name: string;
//     brand: string;
//     category: string;
//     id: string;
//     image_url: string;
//   };
//   detected_ingredients: string[];
//   ingredient_conflicts: string[];
//   ingredient_intelligence: IngredientIntelligence;
//   analysis: ProductAnalysis;
//   catalog_product: CatalogProduct | null;
// }

// // ── Request arg types ─────────────────────────────────────────────────────────

// export interface ScanProductByImageArg {
//   imageUri: string;
// }

// export interface ScanProductByBarcodeArg {
//   barcode: string;
//   barcodeType?: string;
// }

// // ── Shared nutrition type (actual API shape) ──────────────────────────────────
// // The API returns non-standard field names with spaces:
// //   "image url"       → the image URL
// //   "how to improves" → the benefit description
// //   "main ingredient" → primary ingredient
// // Both hair and face scans share this shape.
// export interface ApiNutrition {
//   _id?: string;
//   id: string;
//   name: string;
//   'main ingredient'?: string;
//   'how to improves'?: string;
//   'image url'?: string;
//   // Legacy / fallback fields (may not be present)
//   icon_url?: string;
//   benefit?: string;
//   tags?: string[];
//   priority?: number;
//   detected_condition?: string[];
// }

// // ── Shared food type (actual API shape) ───────────────────────────────────────
// // "benefits" is the human-readable description; "tags" are condition tags.
// export interface ApiFood {
//   _id?: string;
//   id: string;
//   name: string;
//   ingredients?: string[];
//   detected_condition?: string[];
//   benefits?: string; // ← use this for description, not tags.join()
//   icon_url: string;
//   tags: string[];
//   score?: number;
// }

// // ── Shared recipe type (actual API shape) ─────────────────────────────────────
// // "tags" arrive as a single-element array with a hashtag string e.g. ["#hydration #glow"]
// // "main_ingredients" replaces the old "ingredients" field.
// // "how_it_improves" replaces the old "description" field.
// export interface ApiRecipe {
//   _id?: string;
//   id: string;
//   name: string;
//   main_ingredients?: string[];
//   detected_condition?: string[];
//   how_it_improves?: string; // ← use as description
//   tags: string[]; // e.g. ["#hydration #glow #vitaminc"]
//   image_url: string;
//   score?: number;
//   // Legacy fields (may be absent)
//   description?: string;
//   meal_type?: string;
// }

// // ── Hair scan types ───────────────────────────────────────────────────────────

// export interface HairScanResponse {
//   scan_id: string;
//   analysis: {
//     overall_score: number;
//     checked_area: Record<string, number>;
//     visible_area: {
//       condition: string;
//       areas: string[];
//       score: number;
//     };
//     scalp_health: number;
//     detected_condition: {
//       name: string;
//       note: string;
//       severity: string;
//     }[];
//     lifestyle_factor: {
//       stress_impact: number;
//       hygiene_score: number;
//       dietary_factor: number;
//     };
//     prognosis_timeline: {
//       seven_days: Record<string, number>;
//       fourteen_days: Record<string, number>;
//     };
//   };
//   nutritions: ApiNutrition[];
//   foods: ApiFood[];
//   recipes: ApiRecipe[];
// }

// export interface HairScanArg {
//   imageUri: string;
// }

// // ── Face scan types ───────────────────────────────────────────────────────────

// export interface FaceScanImageError {
//   image: number; // 1-based index of the failing image
//   filename: string;
//   error: 'no_face' | 'face_too_small' | string;
// }

// export interface FaceScanErrorDetail {
//   code: 'INVALID_FACE_IMAGES' | string;
//   message: string;
//   valid_count: number;
//   errors: FaceScanImageError[];
// }

// export interface FaceScanResponse {
//   scan_id: string;
//   analysis: {
//     overall_score: number;
//     checked_area: Record<string, number>;
//     visible_area: {
//       condition: string;
//       areas: string[];
//       score: number;
//     };
//     hydration: number;
//     detected_condition: {
//       name: string;
//       note: string;
//       severity: string;
//     }[];
//     lifestyle_factor: {
//       stress_score: number;
//       water_intake: number;
//       sleep_quality: number;
//     };
//     prognosis_timeline: {
//       seven_days: Record<string, number>;
//       fourteen_days: Record<string, number>;
//     };
//     hydration_target: number;
//   };
//   nutritions: ApiNutrition[];
//   foods: ApiFood[];
//   recipes: ApiRecipe[];
// }

// export interface FaceScanArg {
//   imageUris: string[]; // exactly 5 image URIs (one per angle)
// }

// // ── Helpers ───────────────────────────────────────────────────────────────────

// /**
//  * Normalise a nutrition record into consistent display fields,
//  * regardless of which API shape variant was returned.
//  */
// export const normaliseNutrition = (n: ApiNutrition) => ({
//   id: n.id,
//   name: n.name,
//   description: n['how to improves'] ?? n.benefit ?? '',
//   imageUrl: n['image url'] ?? n.icon_url ?? '',
// });

// /**
//  * Normalise a food record into consistent display fields.
//  * Uses "benefits" for the description rather than joining tags.
//  */
// export const normaliseFood = (f: ApiFood) => ({
//   id: f.id,
//   name: f.name,
//   description: f.benefits ?? f.tags.join(', '),
//   imageUrl: f.icon_url,
// });

// /**
//  * Normalise a recipe record into consistent display fields.
//  *
//  * The API returns tags as a single-element array containing a
//  * space-separated hashtag string, e.g. ["#hydration #glow #vitaminc"].
//  * This helper splits and cleans them into individual tag labels.
//  */
// export const normaliseRecipe = (r: ApiRecipe) => {
//   // Split "#hydration #glow #vitaminc" → ["Hydration", "Glow", "Vitaminc"]
//   const cleanTags = r.tags
//     .flatMap((t) => t.split(/\s+/))
//     .filter(Boolean)
//     .map((t) => t.replace(/^#/, '').replace(/\b\w/g, (c) => c.toUpperCase()));

//   return {
//     id: r.id,
//     title: r.name,
//     description: r.how_it_improves ?? r.description ?? '',
//     imageUrl: r.image_url,
//     tags: cleanTags,
//   };
// };

// const normalizeScanResult = (raw: any): ProductScanResult => {
//   const analysis = raw.analysis ?? {};

//   const productBenefits = analysis.product_benefits ??
//     raw.product_benefits ?? {
//       high_compatibility: { score: 0, intensity: 'low', why: '' },
//       ingredient_synergy: { score: 0, intensity: 'low', why: '' },
//     };

//   const whatToStop = analysis.what_to_stop ?? raw.what_to_stop ?? [];
//   const whatToDo = analysis.what_to_do ?? raw.what_to_do ?? [];
//   const learnMore = analysis.learn_more ?? raw.learn_more ?? '';

//   return {
//     ...raw,
//     product: {
//       ...raw.product,
//       image_url: raw.product?.image_url || null, // null, not ''
//       id: raw.product?.id || null, // null, not ''
//     },
//     analysis: {
//       ...analysis,
//       product_benefits: productBenefits,
//       what_to_stop: whatToStop,
//       what_to_do: whatToDo,
//       learn_more: learnMore,
//     },
//   };
// };

// // ── API slice ─────────────────────────────────────────────────────────

// export const scanApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     /**
//      * POST /scan/product
//      * Multipart form-data with a single `image` field.
//      */
//     scanProductByImage: builder.mutation<ProductScanResult, ScanProductByImageArg>({
//       query: ({ imageUri }) => {
//         const body = new FormData();
//         body.append('image', {
//           uri: imageUri,
//           name: 'product.jpg',
//           type: 'image/jpeg',
//         } as any);
//         return { url: '/scan/product', method: 'POST', body, formData: true };
//       },
//       transformResponse: (raw: any) => normalizeScanResult(raw),
//     }),

//     /**
//      * POST /scan/code
//      */
//     scanProductByBarcode: builder.mutation<ProductScanResult, ScanProductByBarcodeArg>({
//       query: ({ barcode }) => ({
//         url: '/scan/code',
//         method: 'POST',
//         body: { code: barcode },
//       }),
//       transformResponse: (raw: any) => normalizeScanResult(raw),
//     }),

//     /**
//      * POST /scan/scalp_hair
//      * Multipart form-data with a single `file` field.
//      */
//     scanHairScalp: builder.mutation<HairScanResponse, HairScanArg>({
//       query: ({ imageUri }) => {
//         const formData = new FormData();
//         formData.append('file', {
//           uri: imageUri,
//           type: 'image/jpeg',
//           name: 'hair_scan.jpg',
//         } as any);
//         return {
//           url: '/scan/scalp_hair',
//           method: 'POST',
//           body: formData,
//           formData: true,
//         };
//       },
//     }),

//     /**
//      * POST /scan/face
//      * Multipart form-data with exactly 5 `images` fields (one per angle).
//      * Error shapes:
//      *   - Plain string: "Exactly 5 images required"
//      *   - Structured:   { code: "INVALID_FACE_IMAGES", message, valid_count, errors[] }
//      */
//     scanFace: builder.mutation<FaceScanResponse, FaceScanArg>({
//       query: ({ imageUris }) => {
//         const formData = new FormData();
//         imageUris.forEach((uri, idx) => {
//           formData.append('images', {
//             uri,
//             type: 'image/jpeg',
//             name: `face_${idx + 1}.jpg`,
//           } as any);
//         });
//         return {
//           url: '/scan/face',
//           method: 'POST',
//           body: formData,
//           formData: true,
//         };
//       },
//     }),
//   }),
//   overrideExisting: false,
// });

// export const {
//   useScanProductByImageMutation,
//   useScanProductByBarcodeMutation,
//   useScanHairScalpMutation,
//   useScanFaceMutation,
// } = scanApi;

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

// ── Shared nutrition type (actual API shape) ──────────────────────────────────
// The API returns non-standard field names with spaces:
//   "image url"       → the image URL
//   "how to improves" → the benefit description
//   "main ingredient" → primary ingredient
// Both hair and face scans share this shape.
export interface ApiNutrition {
  _id?: string;
  id: string;
  name: string;
  'main ingredient'?: string;
  'how to improves'?: string;
  'image url'?: string;
  // Legacy / fallback fields (may not be present)
  icon_url?: string;
  benefit?: string;
  tags?: string[];
  priority?: number;
  detected_condition?: string[];
}

// ── Shared food type (actual API shape) ───────────────────────────────────────
// "benefits" is the human-readable description; "tags" are condition tags.
export interface ApiFood {
  _id?: string;
  id: string;
  name: string;
  ingredients?: string[];
  detected_condition?: string[];
  benefits?: string; // ← use this for description, not tags.join()
  icon_url: string;
  tags: string[];
  score?: number;
}

// ── Shared recipe type (actual API shape) ─────────────────────────────────────
// "tags" arrive as a single-element array with a hashtag string e.g. ["#hydration #glow"]
// "main_ingredients" replaces the old "ingredients" field.
// "how_it_improves" replaces the old "description" field.
export interface ApiRecipe {
  _id?: string;
  id: string;
  name: string;
  main_ingredients?: string[];
  detected_condition?: string[];
  how_it_improves?: string; // ← use as description
  tags: string[]; // e.g. ["#hydration #glow #vitaminc"]
  image_url: string;
  score?: number;
  // Legacy fields (may be absent)
  description?: string;
  meal_type?: string;
}

// ── Hair scan types ───────────────────────────────────────────────────────────

export interface HairScanResponse {
  scan_id: string;
  analysis: {
    overall_score: number;
    checked_area: Record<string, number>;
    visible_area: {
      condition: string;
      areas: string[];
      score: number;
    };
    scalp_health: number;
    detected_condition: {
      name: string;
      note: string;
      severity: string;
    }[];
    lifestyle_factor: {
      stress_impact: number;
      hygiene_score: number;
      dietary_factor: number;
    };
    prognosis_timeline: {
      seven_days: Record<string, number>;
      fourteen_days: Record<string, number>;
    };
  };
  nutritions: ApiNutrition[];
  foods: ApiFood[];
  recipes: ApiRecipe[];
}

export interface HairScanArg {
  imageUri: string;
}

// ── Face scan types ───────────────────────────────────────────────────────────

// ── Region overlay type ───────────────────────────────────────────────────────
// Normalised coordinates (0–1) relative to the image dimensions.
export interface ScanRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FaceDetectedCondition {
  name: string;
  severity: string;
  note: string;
  phase?: string;
  regions?: ScanRegion[]; // overlay bounding boxes on the condition image
  image_url?: string; // per-condition overlay image from S3
}

// ── Updated visible area type ─────────────────────────────────────────────────
export interface FaceVisibleArea {
  condition: string;
  areas: string[];
  score: number;
  regions?: ScanRegion[];
  image_url?: string; // overlay image for the primary visible condition
}

export interface FaceScanImageError {
  image: number; // 1-based index of the failing image
  filename: string;
  error: 'no_face' | 'face_too_small' | string;
}

export interface FaceScanErrorDetail {
  code: 'INVALID_FACE_IMAGES' | string;
  message: string;
  valid_count: number;
  errors: FaceScanImageError[];
}

export interface FaceScanResponse {
  scan_id: string;
  analysis: {
    overall_score: number;
    checked_area: Record<string, number>;
    visible_area: FaceVisibleArea;
    hydration: number;
    detected_condition: FaceDetectedCondition[];
    lifestyle_factor: {
      stress_score: number;
      water_intake: number;
      sleep_quality: number;
    };
    prognosis_timeline: {
      seven_days: Record<string, number>;
      fourteen_days: Record<string, number>;
    };
    hydration_target: number;
    // Extra fields present in newer responses
    score_breakdown?: {
      baseline: number;
      deductions: { condition: string; severity: string; penalty: number }[];
      final_score: number;
    };
    model_scores?: Record<string, number>;
  };
  nutritions: ApiNutrition[];
  foods: ApiFood[];
  recipes: ApiRecipe[];
}

export interface FaceScanArg {
  imageUris: string[]; // exactly 5 image URIs (one per angle)
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Normalise a nutrition record into consistent display fields,
 * regardless of which API shape variant was returned.
 */
export const normaliseNutrition = (n: ApiNutrition) => ({
  id: n.id,
  name: n.name,
  description: n['how to improves'] ?? n.benefit ?? '',
  imageUrl: n['image url'] ?? n.icon_url ?? '',
});

/**
 * Normalise a food record into consistent display fields.
 * Uses "benefits" for the description rather than joining tags.
 */
export const normaliseFood = (f: ApiFood) => ({
  id: f.id,
  name: f.name,
  description: f.benefits ?? f.tags.join(', '),
  imageUrl: f.icon_url,
});

/**
 * Normalise a recipe record into consistent display fields.
 *
 * The API returns tags as a single-element array containing a
 * space-separated hashtag string, e.g. ["#hydration #glow #vitaminc"].
 * This helper splits and cleans them into individual tag labels.
 */
export const normaliseRecipe = (r: ApiRecipe) => {
  // Split "#hydration #glow #vitaminc" → ["Hydration", "Glow", "Vitaminc"]
  const cleanTags = r.tags
    .flatMap((t) => t.split(/\s+/))
    .filter(Boolean)
    .map((t) => t.replace(/^#/, '').replace(/\b\w/g, (c) => c.toUpperCase()));

  return {
    id: r.id,
    title: r.name,
    description: r.how_it_improves ?? r.description ?? '',
    imageUrl: r.image_url,
    tags: cleanTags,
  };
};

const normalizeScanResult = (raw: any): ProductScanResult => {
  const analysis = raw.analysis ?? {};

  const productBenefits = analysis.product_benefits ??
    raw.product_benefits ?? {
      high_compatibility: { score: 0, intensity: 'low', why: '' },
      ingredient_synergy: { score: 0, intensity: 'low', why: '' },
    };

  const whatToStop = analysis.what_to_stop ?? raw.what_to_stop ?? [];
  const whatToDo = analysis.what_to_do ?? raw.what_to_do ?? [];
  const learnMore = analysis.learn_more ?? raw.learn_more ?? '';

  return {
    ...raw,
    product: {
      ...raw.product,
      image_url: raw.product?.image_url || null, // null, not ''
      id: raw.product?.id || null, // null, not ''
    },
    analysis: {
      ...analysis,
      product_benefits: productBenefits,
      what_to_stop: whatToStop,
      what_to_do: whatToDo,
      learn_more: learnMore,
    },
  };
};

// ── API slice ─────────────────────────────────────────────────────────

export const scanApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * POST /scan/product
     * Multipart form-data with a single `image` field.
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
      transformResponse: (raw: any) => normalizeScanResult(raw),
    }),

    /**
     * POST /scan/code
     */
    scanProductByBarcode: builder.mutation<ProductScanResult, ScanProductByBarcodeArg>({
      query: ({ barcode }) => ({
        url: '/scan/code',
        method: 'POST',
        body: { code: barcode },
      }),
      transformResponse: (raw: any) => normalizeScanResult(raw),
    }),

    /**
     * POST /scan/scalp_hair
     * Multipart form-data with a single `file` field.
     */
    scanHairScalp: builder.mutation<HairScanResponse, HairScanArg>({
      query: ({ imageUri }) => {
        const formData = new FormData();
        formData.append('file', {
          uri: imageUri,
          type: 'image/jpeg',
          name: 'hair_scan.jpg',
        } as any);
        return {
          url: '/scan/scalp_hair',
          method: 'POST',
          body: formData,
          formData: true,
        };
      },
    }),

    /**
     * POST /scan/face
     * Multipart form-data with exactly 5 `images` fields (one per angle).
     * Error shapes:
     *   - Plain string: "Exactly 5 images required"
     *   - Structured:   { code: "INVALID_FACE_IMAGES", message, valid_count, errors[] }
     */
    scanFace: builder.mutation<FaceScanResponse, FaceScanArg>({
      query: ({ imageUris }) => {
        const formData = new FormData();
        imageUris.forEach((uri, idx) => {
          formData.append('images', {
            uri,
            type: 'image/jpeg',
            name: `face_${idx + 1}.jpg`,
          } as any);
        });
        return {
          url: '/scan/face',
          method: 'POST',
          body: formData,
          formData: true,
        };
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useScanProductByImageMutation,
  useScanProductByBarcodeMutation,
  useScanHairScalpMutation,
  useScanFaceMutation,
} = scanApi;
