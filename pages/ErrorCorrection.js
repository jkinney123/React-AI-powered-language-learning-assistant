import React, { useState } from "react";
import styles from "./index.module.css";

const ErrorCorrection = ({ targetLanguage }) => {
    const [generatedSentenceWithError, setGeneratedSentenceWithError] = useState("");
    const [generatedCorrectSentence, setGeneratedCorrectSentence] = useState("");
    const [userInput, setUserInput] = useState("");
    const [feedback, setFeedback] = useState("");
    const [showAnswer, setShowAnswer] = useState(false);

    const callApi = async (prompt) => {
        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                body: JSON.stringify({ prompt, temperature: 0.9 }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const json = await response.json();
            return json.reply;
        } catch (error) {
            console.error(`Error with API request: ${error.message}`);
            return null;
        }
    };

    const generateSentence = async () => {
        const languageExamples = {
            Spanish: [
                "1. Correct sentence: ¿Dónde está el baño?\n2. Sentence with error: ¿Donde está el baño?",
                "1. Correct sentence: El perro es grande.\n2. Sentence with error: El perros es grande.",
                "1. Correct sentence: Hoy hace mucho calor.\n2. Sentence with error: Hoy hace mucho calores.",
                "1. Correct sentence: Ella está comiendo una manzana.\n2. Sentence with error: Ella está comiendo un manzana.",
                "1. Correct sentence: Tú tienes tres hermanos.\n2. Sentence with error: Tú tener tres hermanos.",


            ],
            French: [
                "1. Correct sentence: Où est la bibliothèque?\n2. Sentence with error: Où est le bibliothèque?",
                "1. Correct sentence: J'aime les pommes.\n2. Sentence with error: J'aime les pomme.",
                "1. Correct sentence: Ils parlent français.\n2. Sentence with error: Ils parle français.",
                "1. Correct sentence: Nous avons deux chiens.\n2. Sentence with error: Nous avons deux chien.",
                "1. Correct sentence: Elle travaille à l'école.\n2. Sentence with error: Elle travaille à l'ecole.",

                // Add French examples here.
            ],
            German: [
                "1. Correct sentence: Wo ist das Badezimmer?\n2. Sentence with error: Wo ist das Badezimmers?",
                "1. Correct sentence: Sie liest ein Buch.\n2. Sentence with error: Sie lesen ein Buch.",
                "1. Correct sentence: Er hat zwei Hunde.\n2. Sentence with error: Er hat zwei Hunden.",
                "1. Correct sentence: Wir gehen ins Kino.\n2. Sentence with error: Wir gehen im Kino.",
                "1. Correct sentence: Das Wetter ist schön.\n2. Sentence with error: Das Wetter ist schönem.",
            ],
            Japanese: [
                "1. Correct sentence: これはペンです。\n2. Sentence with error: これペンです。",
                "1. Correct sentence: 私はりんごを食べます。\n2. Sentence with error: 私はりんご食べます。",
                "1. Correct sentence: 明日雨が降ります。\n2. Sentence with error: 明日雨降ります。",
                "1. Correct sentence: 彼女は犬が好きです。\n2. Sentence with error: 彼女は犬好きです。",
                "1. Correct sentence: この本は面白いです。\n2. Sentence with error: この本面白いです。",

            ],
            Korean: [
                "1. Correct sentence: 이것은 책입니다.\n2. Sentence with error: 이것 책입니다.",
                "1. Correct sentence: 나는 사과를 먹습니다.\n2. Sentence with error: 나는 사과 먹습니다.",
                "1. Correct sentence: 내일 비가 올 것입니다.\n2. Sentence with error: 내일 비 올 것입니다.",
                "1. Correct sentence: 그녀는 개를 좋아합니다.\n2. Sentence with error: 그녀는 개 좋아합니다.",
                "1. Correct sentence: 이 영화는 재미있습니다.\n2. Sentence with error: 이 영화 재미있습니다.",

            ],
            Russian: [
                "1. Correct sentence: Где ванная комната?\n2. Sentence with error: Где ванная комнаты?",
                "1. Correct sentence: Она читает книгу.\n2. Sentence with error: Она читают книгу.",
                "1. Correct sentence: У него есть две собаки.\n2. Sentence with error: У него есть две собака.",
                "1. Correct sentence: Мы идем в кино.\n2. Sentence with error: Мы идем на кино.",
                "1. Correct sentence: Погода хорошая.\n2. Sentence with error: Погода хорошего.",

            ],
            Italian: [
                "1. Correct sentence: Dov'è il bagno?\n2. Sentence with error: Dove il bagno?",
                "1. Correct sentence: Lei legge un libro.\n2. Sentence with error: Lei leggono un libro.",
                "1. Correct sentence: Ha due cani.\n2. Sentence with error: Ha due cane.",
                "1. Correct sentence: Andiamo al cinema.\n2. Sentence with error: Andiamo a cinema.",
                "1. Correct sentence: Il tempo è bello.\n2. Sentence with error: Il tempo è belloso.",

            ],
            Chinese: [
                "1. Correct sentence: 这是一本书。\n2. Sentence with error: 这一本书。",
                "1. Correct sentence: 我喜欢吃苹果。\n2. Sentence with error: 我喜欢吃苹果的。",
                "1. Correct sentence: 他有两只狗。\n2. Sentence with error: 他有两只狗的。",
                "1. Correct sentence: 她在看电影。\n2. Sentence with error: 她在看的电影。",
                "1. Correct sentence: 天气很好。\n2. Sentence with error: 天气很好的。",

            ],
            Turkish: [
                "1. Correct sentence: Banyo nerede?\n2. Sentence with error: Banyo nerde?",
                "1. Correct sentence: Bir kitap okuyor.\n2. Sentence with error: Bir kitap oku.",
                "1. Correct sentence: İki köpeği var.\n2. Sentence with error: İki köpek var.",
                "1. Correct sentence: Sinemaya gidiyoruz.\n2. Sentence with error: Sinema gidiyoruz.",
                "1. Correct sentence: Hava güzel.\n2. Sentence with error: Hava güzelmiş.",

            ],
            Portuguese: [
                "1. Correct sentence: Onde fica o banheiro?\n2. Sentence with error: Onde fica o banheiros?",
                "1. Correct sentence: Ela está lendo um livro.\n2. Sentence with error: Ela está lendo um livros.",
                "1. Correct sentence: Ele tem dois cachorros.\n2. Sentence with error: Ele tem dois cachorro.",
                "1. Correct sentence: Vamos ao cinema.\n2. Sentence with error: Vamos a cinema.",
                "1. Correct sentence: O tempo está bom.\n2. Sentence with error: O tempo está boms.",

            ],
            Danish: [
                "1. Correct sentence: Hvor er badeværelset?\n2. Sentence with error: Hvor er badeværelses?",
                "1. Correct sentence: Hun læser en bog.\n2. Sentence with error: Hun læse en bog.",
                "1. Correct sentence: Han har to hunde.\n2. Sentence with error: Han har to hund.",
                "1. Correct sentence: Vi går i biografen.\n2. Sentence with error: Vi går til biograf.",
                "1. Correct sentence: Vejret er godt.\n2. Sentence with error: Vejret er god.",


            ],
            Finnish: [
                "1. Correct sentence: Missä on kylpyhuone?\n2. Sentence with error: Missä on kylpyhuonessa?",
                "1. Correct sentence: Hän lukee kirjaa.\n2. Sentence with error: Hän lukee kirjan.",
                "1. Correct sentence: Hänellä on kaksi koiraa.\n2. Sentence with error: Hänellä on kaksi koira.",
                "1. Correct sentence: Menemme elokuviin.\n2. Sentence with error: Menemme elokuva.",
                "1. Correct sentence: Sää on hyvä.\n2. Sentence with error: Sää",

            ]
            // Add other languages similarly.
        };
        const promptExamples = languageExamples[targetLanguage].join("\n");


        const topics = [
            "sports",
            "food",
            "travel",
            "technology",
            "family",
            "weather",
            "hobbies",
            "education",
            "work",
            "nature",
        ];

        const randomTopic = topics[Math.floor(Math.random() * topics.length)];
        const prompt = `In ${targetLanguage}, generate a creative and unique sentence between 5 to 10 words about ${randomTopic}. Avoid using the same sentence as the examples provided. Then, rewrite the same sentence introducing exactly one grammatical error. Make sure the sentence with the error has a clear and obvious grammatical mistake. Avoid using symbols or special characters as errors. Examples:
        ${promptExamples}

            1. Correct sentence:
            2. Sentence with error: `;



        const normalizeSentence = (sentence) => {
            return sentence.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim();
        };
        const response = await callApi(prompt);
        const lines = response.split("\n");
        const correctSentenceLine = lines.find((line) => line.startsWith("1."));
        const sentenceWithErrorLine = lines.find((line) => line.startsWith("2."));

        if (correctSentenceLine && sentenceWithErrorLine) {
            const corrected = correctSentenceLine.replace("1. Correct sentence:", "").trim().replace(/^1\./, "").trim();
            const withError = sentenceWithErrorLine.replace("2. Sentence with error:", "").trim().replace(/^2\./, "").trim();

            if (normalizeSentence(corrected) !== normalizeSentence(withError)) {
                setGeneratedSentenceWithError(withError);
                setGeneratedCorrectSentence(corrected);
            } else {
                console.error("Unexpected response format:", response);
                // Generate a new sentence if the response is not as expected
                generateSentence();
            }
        }

    };




    const checkCorrection = async () => {
        const cleanUserInput = userInput.trim().replace(/[.]+$/, "").toLowerCase();
        const cleanGeneratedCorrectSentence = generatedCorrectSentence.trim().replace(/[.]+$/, "").toLowerCase();

        if (cleanUserInput === cleanGeneratedCorrectSentence) {
            setFeedback("Your correction is accurate!");
        } else {
            setFeedback("There is still an error in your correction.");
        }

    };



    const displayAnswer = () => {
        setShowAnswer(true);
    };

    // Function to handle form submission
    const onSubmit = async (event) => {
        event.preventDefault();
        await checkCorrection();
    };

    return (
        <div className={styles.errorForm}>
            <h2>Error Detection and Correction</h2>
            <p>Can you correct the sentence? Find the grammar error and rewrite the sentence correctly! Look for incorrect verb conjugation, incorrect prepositions, and missing articles</p>
            <button className={styles.featureBtn} onClick={generateSentence}>Generate a sentence</button>
            {generatedSentenceWithError && <p>{generatedSentenceWithError}</p>}
            <form onSubmit={onSubmit}>
                <label>
                    Correct the sentence:
                    <input
                        type="text"
                        value={userInput}
                        onChange={(event) => setUserInput(event.target.value)}
                    />
                </label>
                <input className={styles.featureBtn} type="submit" value="Submit" />
            </form>
            <button className={styles.featureBtn} onClick={displayAnswer}>See the answer</button>
            {showAnswer && generatedCorrectSentence && (
                <p>Corrected sentence: {generatedCorrectSentence}</p>
            )}
            {feedback && <p>Feedback: {feedback}</p>}
        </div>
    );
};

export default ErrorCorrection;
