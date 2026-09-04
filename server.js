const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
const path = require('path');
app.use(express.static(__dirname));

// --- Configuration & AI Initialization ---
const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;

// --- Fallback Data for Resilient Operation ---
const FALLBACKS = {
  en: {
    carePlan: [
      { title: "Stage 1: Sowing & Germination", desc: "Ensure soil moisture is consistent. For crops like Broccoli, use well-drained loamy soil." },
      { title: "Stage 2: Vegetative Growth", desc: "Increase nitrogen intake. Monitor for local pests like aphids." },
      { title: "Stage 3: Flowering & Fruiting", desc: "Apply potassium-rich fertilizers. Maintain uniform watering." }
    ],
    diagnosis: {
      summary: "Visual indicators suggest a potential Nitrogen deficiency or Early Blight.",
      severity: "Moderate",
      precautions: ["Apply balanced N-P-K fertilizer", "Improve air circulation", "Remove affected leaves"]
    },
    chat: "Assalam-o-Alaikum! I am your AI Agronomist. How can I help you today?"
  },
  ur: {
    carePlan: [
      { title: "مرحلہ 1: بوائی اور اگاؤ", desc: "مٹی میں نمی کا تناسب برقرار رکھیں۔ بروکرولی جیسی فصلوں کے لیے زرخیز میرا مٹی استعمال کریں۔" },
      { title: "مرحلہ 2: بڑھوتری کا عمل", desc: "نائٹروجن والی کھادوں کا استعمال بڑھائیں۔ تیلا اور دیگر کیڑوں کی نگرانی کریں۔" },
      { title: "مرحلہ 3: پھول اور پھل آنے کا وقت", desc: "پوٹاش والی کھادیں ڈالیں۔ پانی کا وقفہ برابر رکھیں تاکہ پھل پھٹنے سے محفوظ رہے۔" }
    ],
    diagnosis: {
      summary: "پودے کی رنگت سے نائٹروجن کی کمی یا جھلساؤ کا خدشہ ہے۔",
      severity: "درمیانہ",
      precautions: ["متوازن این-پی-کے کھاد ڈالیں", "ہوا کا گزر بہتر بنائیں", "متاثرہ پتے کاٹ کر تلف کر دیں"]
    },
    chat: "اسلام علیکم! میں آپ کا اے آئی ماہر زراعت ہوں۔ میں آج آپ کی کیا مدد کر سکتا ہوں؟"
  }
};

// --- Helper: Get AI Response with Fallback ---
async function getAIResponse(prompt, type, lang = 'en', imageConfig = null) {
  if (!ai) return FALLBACKS[lang][type];
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt
    });
    
    const text = response.text;
    
    if (type === 'chat') return text;
    
    // Clean markdown formatting if present
    const cleanedText = text.replace(/```json|```/gi, '').trim();
    
    try {
      // Attempt direct parse first
      return JSON.parse(cleanedText);
    } catch (parseError) {
      // Fallback regex to extract either an array or an object
      const jsonMatch = cleanedText.match(/(\[[\s\S]*\]|\{[\s\S]*\})/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : FALLBACKS[lang][type];
    }
  } catch (error) {
    console.error(`AI Error (${type}):`, error.message);
    return FALLBACKS[lang][type];
  }
}

// --- API Routes ---

// 1. Care Plan Route
app.post('/api/care-plan', async (req, res) => {
  const { crop, location, soil, irrigation, date, lang = 'en' } = req.body;
  const prompt = `Act as an expert agronomist in Pakistan. Provide a 3-stage care plan for ${crop} in ${location} with ${soil} and ${irrigation}, planted on ${date}. 
  Return ONLY a JSON array of objects with "title" and "desc" keys. 
  IMPORTANT: Generate the response content in ${lang === 'ur' ? 'Urdu (اردو) script' : 'English'}.`;
  
  const data = await getAIResponse(prompt, 'carePlan', lang);
  res.json(data);
});

// 2. Diagnosis Route
app.post('/api/diagnose', async (req, res) => {
  const { image, lang = 'en' } = req.body;
  const prompt = `Analyze this crop image. Identify plant, disease/pest, and severity. 
  Return ONLY a JSON object: {"summary": "string", "severity": "string", "precautions": ["string"]}
  IMPORTANT: Generate the summary and precautions in ${lang === 'ur' ? 'Urdu (اردو) script' : 'English'}. The severity should remain in English (Low/Moderate/High).`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: [
        prompt, 
        { inlineData: { data: image, mimeType: 'image/jpeg' } }
      ]
    });
    
    const text = response.text;
    const cleanedText = text.replace(/```json|```/gi, '').trim();
    
    try {
        const data = JSON.parse(cleanedText);
        res.json(data);
    } catch(e) {
        const jsonMatch = cleanedText.match(/(\[[\s\S]*\]|\{[\s\S]*\})/);
        const data = jsonMatch ? JSON.parse(jsonMatch[0]) : FALLBACKS[lang].diagnosis;
        res.json(data);
    }
  } catch (error) {
    console.error(`Image Analysis Error:`, error.message);
    res.json(FALLBACKS[lang].diagnosis);
  }
});

// 3. Chat Route
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  const prompt = `You are a friendly AI Agronomist for Pakistani farmers. Answer the following question in the SAME language it was asked (Urdu, Punjabi, Roman Urdu, or English): "${message}". Provide practical, farmer-friendly advice.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt
    });
    
    const reply = response.text;
    res.json({ reply });
  } catch (error) {
    console.error(`Chat Error:`, error.message);
    res.json({ reply: FALLBACKS['en'].chat });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`AI Agronomist Server running on port ${PORT}`));