import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function getTranslation(apiKey, sourceText, sourceLanguage, targetLanguage) {
  const configuration = new Configuration({ apiKey });
  const openai = new OpenAIApi(configuration);

  const prompt = `Translate the following sentence from ${sourceLanguage} to ${targetLanguage}: "${sourceText}"`;

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-002",
      prompt,
      temperature: 0.5,
      max_tokens: 50,
      n: 1,
      stop: null,
    });

    return completion.data.choices[0].text.trim();
  } catch (error) {
    console.error(`Error with OpenAI API request: ${error.message}`);
    throw error;
  }
}


export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const name = req.body.name || '';
  const targetLanguage = req.body.target_language || '';
  const userInput = req.body.user_input || '';
  if (targetLanguage.trim().length === 0 || userInput.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid target language and user input",
      },
    });
    return;
  }

  const prompt = `Translate the following English sentence to ${targetLanguage}: "${userInput}"\n\nLanguage Assistant:`;

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-002",
      prompt,
      temperature: 0.5,
      max_tokens: 200,
    });
    res.status(200).json({ reply: completion.data.choices[0].text.trim() });
  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        },
      });
    }
  }
}
