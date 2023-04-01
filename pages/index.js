import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import TranslationChallenge from "./TranslationChallenge";
import AssistantForm from "./AssistantForm";

export default function Home() {
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [languageSelected, setLanguageSelected] = useState(false);
  const [response, setResponse] = useState("");

  const languages = [
    { code: "Spanish", label: "Spanish" },
    { code: "French", label: "French" },
    { code: "German", label: "German" },
    { code: "Japanese", label: "Japenese" },
    { code: "Korean", label: "Korean" },
    { code: "Russian", label: "Russian" },
    { code: "Italian", label: "Italian" },
    { code: "Chinese", label: "Chinese" },
    { code: "Turkish", label: "Turkish" },
    { code: "Portuguese", label: "Portuguese" },
    { code: "Danish", label: "Danish" },
    { code: "Finnish", label: "Finnish" },
    { code: "Hindi", label: "Hindi" },
    { code: "Norwegian", label: "Norwegian" },
    { code: "Guarani", label: "Guarani" },
    // Add more languages as needed
  ];

  const handleLanguageSelection = (e) => {
    setSelectedLanguage(e.target.value);
    setLanguageSelected(true);
  };

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
  };

  const handleFormSubmit = async (targetLanguage, userInput) => {
    const apiUrl = "/api/generate";
    const res = await fetch(apiUrl, {
      method: "POST",
      body: JSON.stringify({
        target_language: targetLanguage,
        user_input: userInput,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await res.json();
    setResponse(json.reply);
  };

  return (
    <div className={styles.pageBackground}>
      <Head>
        <title>Language Learning Assistant</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.mainDiv}>
          <div className={styles.welcomeMsg}>
            <h1>Welcome to the Language Learning Assistant for English speakers!</h1>
          </div>
          {!languageSelected && (
            <div className={styles.welcomeMsg}>
              <h2>Please Select a language you wish to learn:</h2>
              <select onChange={handleLanguageSelection}>
                <option value="">--Choose a language--</option>
                {languages.map((language) => (
                  <option key={language.code} value={language.code}>
                    {language.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          {languageSelected && (
            <div className={styles.featureDiv}>
              <div className={styles.assistForm}>
                <h2>Language Assistant</h2>
                <AssistantForm onFormSubmit={handleFormSubmit} targetLanguage={selectedLanguage} />
                {response && <p>Assistant: {response}</p>}
              </div>
              <div className={styles.transForm}>
                <TranslationChallenge
                  apiKey={process.env.OPENAI_API_KEY}
                  sourceLanguage="English"
                  targetLanguage={selectedLanguage}
                />
              </div>
            </div>
          )}
          {languageSelected && (
            <div className={styles.welcomeMsg}>
              <h2>Try a different language:</h2>
              <select value={selectedLanguage} onChange={handleLanguageChange}>
                <option value="">--Choose a language--</option>
                {languages.map((language) => (
                  <option key={language.code} value={language.code}>
                    {language.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
