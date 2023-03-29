import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [name, setName] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("");
  const [userInput, setUserInput] = useState("");
  const [response, setResponse] = useState("");

  async function onSubmit(event) {
    event.preventDefault();

    try {
      const apiResponse = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, target_language: targetLanguage, user_input: userInput }),
      });

      const data = await apiResponse.json();
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
        <form onSubmit={onSubmit}>
          <label>
            What's your name?
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          <br />
          <label>
            Which language would you like to learn?
            <input
              type="text"
              value={targetLanguage}
              onChange={(event) => setTargetLanguage(event.target.value)}
            />
          </label>
          <br />
          <label>
            Ask a question or request a translation:
            <input
              type="text"
              value={userInput}
              onChange={(event) => setUserInput(event.target.value)}
            />
          </label>
          <br />
          <input type="submit" value="Submit" />
        </form>
        {response && <p>Assistant: {response}</p>}
      </main>
    </div>
  );
}
