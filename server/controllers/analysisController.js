const { GoogleGenerativeAI } = require('@google/generative-ai');

if (!process.env.GEMINI_API_KEY) {
  console.error('FATAL ERROR: GEMINI_API_KEY is not defined in .env file.');
  process.exit(1);
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const fileToGenerativePart = (file) => {
  return {
    inlineData: {
      data: file.buffer.toString('base64'),
      mimeType: file.mimetype,
    },
  };
};

const analyzeImages = async (req, res) => {
  try {
    if (!req.files || !req.files.faceImage || !req.files.tongueImage) {
      return res.status(400).json({ message: 'Please upload both face and tongue images.' });
    }

    const faceImage = req.files.faceImage[0];
    const tongueImage = req.files.tongueImage[0];

    // --------------------------------------------------------------------------------
    // --- FIX: Updated the model name to the correct, publicly available version ---
    // The previous 'gemini-1.5-flash-latest' was causing a 404 Not Found error.
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    // --------------------------------------------------------------------------------

    const prompt = `
      As an Ayurvedic wellness assistant (NOT a medical professional), analyze the provided images...
      not more than 200words , and give information in bulleting points , with proper space , it should not feel like reading para , minimal// Your full, safety-focused prompt goes here...
    `;

    const imageParts = [
      fileToGenerativePart(faceImage),
      fileToGenerativePart(tongueImage),
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const analysisText = response.text();

    res.status(200).json({ analysis: analysisText });

  } catch (error) {
    console.error('Error analyzing images:', error);
    res.status(500).json({ message: 'Server error while analyzing images.' });
  }
};

module.exports = {
  analyzeImages,
};