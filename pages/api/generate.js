import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const targetLanguage = req.body.target_language;
  const userInput = req.body.user_input;
  const generateSentence = req.body.generate_sentence;
  const prompt = req.body.prompt;

  if (generateSentence) {
    const prompt = "Generate a random English sentence with no more than 10 words:";
    try {
      const completion = await openai.createCompletion({
        model: "text-davinci-002",
        prompt,
        temperature: 0.7,
        max_tokens: 30,
        n: 1,
        stop: null,
      });

      res.status(200).json({ generated_sentence: completion.data.choices[0].text.trim() });
    } catch (error) {
      handleError(res, error);
    }
  } else if (targetLanguage && userInput) {
    const prompt = `Translate the following English word or sentence to ${targetLanguage}: "${userInput}"\n\nLanguage Assistant: If the word or sentence is not in English, translate ${userInput} to English. `;

    try {
      const completion = await openai.createCompletion({
        model: "text-davinci-002",
        prompt,
        temperature: 0.5,
        max_tokens: 200,
        n: 1,
        stop: null,
      });

      res.status(200).json({ reply: completion.data.choices[0].text.trim() });
    } catch (error) {
      handleError(res, error);
    }
  } else if (prompt) {
    try {
      const completion = await openai.createCompletion({
        model: "text-davinci-002",
        prompt,
        temperature: 0.6,
        max_tokens: 100,
        n: 1,
        stop: null,
      });

      res.status(200).json({ reply: completion.data.choices[0].text.trim() });
    } catch (error) {
      handleError(res, error);
    }
  } else {
    res.status(400).json({
      error: {
        message: "Invalid request. Please provide target_language and user_input, set generate_sentence to true, or provide a prompt.",
      },
    });
  }
}

function handleError(res, error) {
  if (error.response) {
    console.error(error.response.status, error.response.data);
    res.status(error.response.status).json(error.response.data);
  } else {
    console.error(`Error with OpenAI API request: ${error.message}`);
    res.status(500).json({
      error: {
        message: "An error occurred during your request.",
      },
    });
  }
}
