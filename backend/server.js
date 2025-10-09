import app from './app.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log(
  "GEMINI_API_KEY:",
  process.env.GEMINI_API_KEY ? "✅ Set" : "❌ Missing"
);
const PORT = process.env.PORT || 8000;


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
