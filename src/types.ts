export interface AnalysisResult {
  id: string;
  timestamp: number;
  leafImage: string;
  soilImage: string;
  disease: string;
  confidence: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  soilHealth: string;
  soilDetails?: {
    organicMatter: string;
    mineralContent: string;
    pH: number;
  };
  recommendation: string;
  prevention: string[];
  homeMadeSolutions: string[];
  bestPractices: string[];
  isPlantRelated: boolean;
  rawReasoning?: string;
  language?: 'en' | 'ta';
  location?: {
    lat: number;
    lng: number;
  };
}

export type AppState = 'dashboard' | 'capture-leaf' | 'capture-soil' | 'analyzing' | 'result' | 'history';

export interface PreprocessingStats {
  originalBrightness: number;
  enhancedBrightness: number;
  noiseLevel: string;
}
