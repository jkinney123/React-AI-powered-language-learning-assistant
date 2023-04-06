import React, { useState, useEffect } from 'react';
import { get as levenshtein } from "fast-levenshtein";


const TranslationChallenge = ({ sourceLanguage, targetLanguage }) => {
    const [sourceText, setSourceText] = useState('');
    const [userInput, setUserInput] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState(null);
    const [score, setScore] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [generatedSentences, setGeneratedSentences] = useState([]);

    const fetchRandomSentence = () => {
        const apiUrl = "/api/generate";
        fetch(apiUrl, {
            method: "POST",
            body: JSON.stringify({
                generate_sentence: true,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((json) => {
                const newSentence = json.generated_sentence;

                if (generatedSentences.includes(newSentence)) {
                    fetchRandomSentence();
                } else {
                    setGeneratedSentences((prevSentences) => [...prevSentences, newSentence]);
                    setSourceText(newSentence);
                }
            })
            .catch((err) => console.error("Error fetching random sentence:", err));
    };

    useEffect(() => {
        fetchRandomSentence();
    }, []);



    useEffect(() => {
        async function fetchCorrectAnswer() {
            const apiUrl = '/api/generate';
            const res = await fetch(apiUrl, {
                method: 'POST',
                body: JSON.stringify({
                    target_language: targetLanguage,
                    user_input: sourceText,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            }); const json = await res.json();
            setCorrectAnswer(json.reply);
        }

        fetchCorrectAnswer();
    }, [sourceText, targetLanguage]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("User input:", userInput);
        console.log("Correct answer:", correctAnswer);

        if (userInput && correctAnswer) {
            const similarity = compareTranslations(userInput, correctAnswer);
            console.log("Similarity:", similarity);
            const similarityThreshold = 0.8; // Adjust this value to set the required similarity

            if (similarity >= similarityThreshold) {
                setScore(score + 1);
            } else {
                setScore(score - 1);
            }
        }
        setShowAnswer(true);
        setUserInput("");
    };

    const compareTranslations = (userTranslation, correctTranslation) => {
        // Normalize translations by making lowercase and removing punctuation
        const normalize = (str) =>
            str.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");

        const userNormalized = normalize(userTranslation);
        const correctNormalized = normalize(correctTranslation);

        const levenshteinDistance = levenshtein(userNormalized, correctNormalized);

        const maxLength = Math.max(userNormalized.length, correctNormalized.length);
        const similarity = 1 - levenshteinDistance / maxLength;

        return similarity;
    };


    return (
        <div>
            <h2>Translation Challenge</h2>
            <p>Translate the following sentence to {targetLanguage}: "{sourceText}"</p>
            <button onClick={fetchRandomSentence}>Try New Sentence</button>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                />
                <button type="submit">Submit</button>
            </form>
            <p>Score: {score}</p>
            {showAnswer && correctAnswer && <p>Correct translation: {correctAnswer}</p>}
        </div>
    );
};

export default TranslationChallenge;
