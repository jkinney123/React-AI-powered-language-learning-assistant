import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import TranslationChallenge from "./TranslationChallenge";
import AssistantForm from "./AssistantForm";


export default function Home() {
  const [response, setResponse] = useState("");

  async function onFormSubmit(name, targetLanguage, userInput) {
    try {
      const apiResponse = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, target_language: targetLanguage, user_input: userInput }),
      });

      const data = await apiResponse.json();
      console.log("API response data:", data);

      if (apiResponse.status !== 200) {
        throw data.error || new Error(`Request failed with status ${apiResponse.status}`);
      }

      setResponse(data.reply);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }



  return (
    <div>
      <Head>
        <title>Language Learning Assistant</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>Welcome to the Personalized Language Learning Assistant!</h1>
        <AssistantForm onFormSubmit={onFormSubmit} />
        {response && <p>Assistant: {response}</p>}
        <TranslationChallenge
          apiKey={process.env.OPENAI_API_KEY}
          sourceText="The cat is on the table."
          sourceLanguage="English"
          targetLanguage="Spanish"
        />
      </main>
    </div>
  );
}
