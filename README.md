🌱 AI CropCare — Your Personal AI Agronomist

An AI-powered agricultural platform designed to help farmers and growers in Pakistan manage their crops from planting to harvesting.

🔗 Project Links

Live Deployment: [https://ai-cropcare-production.up.railway.app/]  might have some issues in live due to Gemini keys free version.

Demo Video: [https://drive.google.com/file/d/1a6z6Zw_q5P6fFsbhDRGrPMCzh3GGH61k/view?usp=sharing]

Presentation Deck: [https://drive.google.com/file/d/1sXqWghWJIU25F3zCsgiHOoYLZfBXI7Pr/view?usp=sharing]

🌾 The Problem

Pakistani farmers switching from traditional crops (wheat/rice) to high-value horticulture (strawberries, broccoli, dragon fruit) face high failure rates. They often rely on generic, conflicting, or delayed advice from distant nurseries or internet searches. Traditional knowledge doesn't always apply, leading to crop loss and financial strain.

💡 The Solution

AI CropCare acts as a personal AI agronomist that stays with the farmer throughout the entire crop lifecycle. Instead of just providing generic text, it tells the farmer exactly what to do, when to do it, and why, perfectly tailored to their specific soil, location, and irrigation setup.

Developed as part of the Bno kabil project, this solution focuses on empathy, accessibility, and real-world agricultural impact.

✨ Key Features

📅 Smart Farming Care Plan: Generates a dynamic, stage-wise lifecycle care timeline based on specific farm parameters (Crop, Location, Soil Type, Irrigation Method, and Planting Date).

🩺 Visual Crop Doctor: Farmers can upload photos of leaves or soil. Powered by Gemini Vision, the app scans for diseases/pests, determines severity, and generates immediate actionable precautions.

🗣️ Voice-First Multilingual Assistant: Built specifically for low-literacy users in rural areas. Farmers can tap the massive "Hold to Speak" button to ask questions in native Urdu, Punjabi, or English, and the AI responds in the exact same language.

🔊 Native Text-to-Speech (TTS): The app reads out care plans, disease diagnoses, and chat responses aloud in localized dialects so farmers do not have to read long text blocks.

🛡️ Resilient Offline Fallback: Designed with poor rural connectivity in mind. If the API fails or the API key is exhausted, the app seamlessly intercepts the error and provides hardcoded, realistic localized agronomy data so the app never crashes.

🎨 Visual & Icon-Driven UI: Highly visual interface with color-coded severity alerts and image-based soil selectors rather than complex text dropdown menus.

🛠️ Technology Stack

Frontend: HTML5, Vanilla JavaScript, CSS3 (Custom Responsive Design)

Backend: Node.js, Express.js, CORS

AI Integration: Google Gen AI SDK (gemini-3.6-flash / gemini-3.1-pro-preview)

Native Browser APIs: Web Speech API (SpeechRecognition & SpeechSynthesis)

🚀 How to Run Locally

1. Clone the Repository

git clone https://github.com/yourusername/ai-cropcare.git
cd ai-cropcare


2. Install Dependencies

npm install express cors dotenv @google/genai


3. Set Up Environment Variables

Create a .env file in the root directory and add your Google Gemini API key. (Note: You can copy the structure from .env.example)

GEMINI_API_KEY=your_actual_api_key_here
PORT=3000


4. Start the Server

npm start
# or 
node server.js


5. Access the App

Open your web browser and navigate to:

http://localhost:3000


🔒 Note to Evaluators / Judges

To ensure testing is seamless, this public repository contains no active API keys. A robust Offline Mock Fallback Mode is implemented in server.js. If you run the application without providing a Gemini API key, the system will automatically serve highly realistic, localized mock data for all three modules (Care Plan, Image Diagnosis, and Chat). This allows you to experience the full UI, logic, and workflow without any advanced setup.
