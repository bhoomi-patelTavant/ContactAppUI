import axios from "axios";

const API_KEY = "AIzaSyABLYQ1NTENm5yZza7nFsZITxga-Q_Dp8Q";

export const translateText = async (
  text: string,
  targetLanguage: string
): Promise<string> => {
  const response = await axios.post(
    `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`,
    {
      q: text,
      target: targetLanguage,
      format: "text",
    }
  );
  return response.data.data.translations[0].translatedText;
};