/**
 * Image processing utilities for plant and soil analysis
 */

export async function preprocessImage(imageSrc: string): Promise<{
  processedDataUrl: string;
  stats: { brightness: number; contrast: number };
}> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      // Resize to standard 224x224 for CNN input
      canvas.width = 224;
      canvas.height = 224;
      
      ctx.drawImage(img, 0, 0, 224, 224);
      
      const imageData = ctx.getImageData(0, 0, 224, 224);
      const data = imageData.data;
      
      let totalBrightness = 0;
      
      // Simple Histogram Equalization / Contrast Enhancement
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Calculate brightness
        const brightness = (r + g + b) / 3;
        totalBrightness += brightness;
        
        // Enhance contrast (simple linear stretch for demo)
        data[i] = Math.min(255, r * 1.1);
        data[i + 1] = Math.min(255, g * 1.1);
        data[i + 2] = Math.min(255, b * 1.1);
      }
      
      ctx.putImageData(imageData, 0, 0);
      
      resolve({
        processedDataUrl: canvas.toDataURL('image/jpeg'),
        stats: {
          brightness: totalBrightness / (224 * 224),
          contrast: 1.1
        }
      });
    };
    img.src = imageSrc;
  });
}

export function extractSoilFeatures(imageSrc: string): Promise<{
  moisture: string;
  texture: string;
  nutrientEstimate: string;
  organicMatter: string;
  mineralContent: string;
  pH: number;
}> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      canvas.width = 100;
      canvas.height = 100;
      ctx.drawImage(img, 0, 0, 100, 100);
      
      const data = ctx.getImageData(0, 0, 100, 100).data;
      let rSum = 0, gSum = 0, bSum = 0;
      
      for (let i = 0; i < data.length; i += 4) {
        rSum += data[i];
        gSum += data[i + 1];
        bSum += data[i + 2];
      }
      
      const avgR = rSum / (100 * 100);
      const avgG = gSum / (100 * 100);
      const avgB = bSum / (100 * 100);
      const brightness = (avgR + avgG + avgB) / 3;
      
      // Heuristic logic for soil analysis
      let moisture = "Moderate";
      if (brightness < 80) moisture = "High (Wet)";
      else if (brightness > 150) moisture = "Low (Dry)";
      
      let texture = "Loamy";
      if (avgR > 180 && avgG > 150) texture = "Sandy";
      else if (avgR < 100 && avgG < 100) texture = "Clayey";

      // Organic Matter: Darker soil usually has more organic matter
      let organicMatter = "Moderate";
      if (brightness < 60) organicMatter = "High";
      else if (brightness > 160) organicMatter = "Low";

      // Mineral Content: Reddish tones often indicate iron/minerals
      let mineralContent = "Balanced";
      if (avgR > avgG * 1.2 && avgR > avgB * 1.2) mineralContent = "High (Iron Rich)";
      else if (avgG > avgR * 1.1) mineralContent = "High (Nitrogen/Potassium)";

      // pH Estimation: Reddish/Light tones -> Higher pH (Alkaline), Darker/Brown -> Lower pH (Acidic)
      // This is a very rough heuristic for demo purposes
      let pH = 7.0;
      if (avgR > 150 && avgG < 150) pH = 8.2; // Alkaline/Reddish
      else if (brightness < 70) pH = 5.8; // Acidic/Dark
      else if (avgR > 120 && avgG > 120 && avgB < 100) pH = 7.5; // Slightly Alkaline

      resolve({
        moisture,
        texture,
        nutrientEstimate: avgG > avgR ? "Nitrogen Rich" : "Nitrogen Deficient",
        organicMatter,
        mineralContent,
        pH
      });
    };
    img.src = imageSrc;
  });
}
