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
                body: JSON.stringify({ prompt, temperature: 0.8 }),
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
        const prompt = `In ${targetLanguage}, generate a simple sentence between 5 to 10 words. Then, rewrite the same sentence introducing exactly one grammatical error. Make sure the sentence with the error has a clear and obvious grammatical mistake. Avoid using symbols or special characters as errors. Examples:

1. Correct sentence: ¿Dónde está el baño?
2. Sentence with error: ¿Donde está el baño?

1. Correct sentence: Me gustaría visitar España algún día.
2. Sentence with error: Me gustaría visitar España algun día.

1. Correct sentence: Tú tienes tres hermanos.
2. Sentence with error: Tú tener tres hermanos.

1. Correct sentence: El perro está durmiendo en el sofá.
2. Sentence with error: El perro está durmiendo en sofá.

1. Correct sentence: Juan y María están casados.
2. Sentence with error: Juan y María está casados.

1. Correct sentence: Vamos a comer en el restaurante.
2. Sentence with error: Vamos comer en el restaurante.

1. Correct sentence: Me gusta más el té que el café.
2. Sentence with error: Me gusta más el té de el café.

1. Correct sentence: La fiesta es el próximo sábado.
2. Sentence with error: La fiesta es el próximo sabado.

1. Correct sentence: Ha estado lloviendo todo el día.
2. Sentence with error: Ha estado lloviendo todo el día.

1. Correct sentence: Nosotros vamos al parque todos los fines de semana.
2. Sentence with error: Nosotros vamos al parque todo los fines de semana.

1. Correct sentence: Me gusta leer libros de ciencia ficción.
2. Sentence with error: Me gusta leer libros de ciencia ficción.

1. Correct sentence: Este fin de semana, fuimos al cine.
2. Sentence with error: Este fin de semana, fuimos al cines.

1. Correct sentence: La comida estaba deliciosa y abundante.
2. Sentence with error: La comida estaba deliciosa y abundantes.

1. Correct sentence: ¿Puedes ayudarme con la tarea de matemáticas?
2. Sentence with error: ¿Puedes ayudarme con la tarea de matemática?

1. Correct sentence: Tengo que levantarme temprano mañana.
2. Sentence with error: Tengo que levantarme temprano mañanas.

1. Correct sentence: Este es mi último año en la universidad.
2. Sentence with error: Este es mi último año en la universidades.

1. Correct sentence: Mi hermana estudia medicina en otra ciudad.
2. Sentence with error: Mi hermana estudia medicinas en otra ciudad.

1. Correct sentence: Hace mucho calor en verano, pero me gusta.
2. Sentence with error: Hace mucho calor en veranos, pero me gusta.

1. Correct sentence: Estoy aprendiendo a cocinar platos vegetarianos.
2. Sentence with error: Estoy aprendiendo a cocinar platos vegetariano.

1. Correct sentence:
2. Sentence with error: `;


        const response = await callApi(prompt);
        const lines = response.split("\n");
        const correctSentenceLine = lines.find((line) => line.startsWith("1."));
        const sentenceWithErrorLine = lines.find((line) => line.startsWith("2."));

        if (correctSentenceLine && sentenceWithErrorLine && correctSentenceLine !== sentenceWithErrorLine) {
            setGeneratedSentenceWithError(sentenceWithErrorLine.replace("2. Sentence with error:", "").trim().replace(/^2\./, "").trim());
            setGeneratedCorrectSentence(correctSentenceLine.replace("1. Correct sentence:", "").trim().replace(/^1\./, "").trim());
        } else {
            console.error("Unexpected response format:", response);
            // Generate a new sentence if the response is not as expected
            generateSentence();
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
            <p>Can you correct the sentence? Fix grammatical errors such as missing tildes, incorrect verb conjugation, incorrect prepositions, and missing articles</p>
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
