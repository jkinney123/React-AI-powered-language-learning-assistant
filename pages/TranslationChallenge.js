import React, { useState, useEffect } from 'react';
const stringSimilarity = require('string-similarity');

const TranslationChallenge = ({ apiKey, sourceText, sourceLanguage, targetLanguage }) => {
    const [userInput, setUserInput] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState(null);
    const [score, setScore] = useState(0);

    useEffect(() => {
        async function fetchCorrectAnswer() {
            const apiUrl = '/api/generate';
            const res = await fetch(apiUrl, {
                method: 'POST',
                body: JSON.stringify({
                    target_language: targetLanguage,
                    user_input: `Translate the following English sentence to ${targetLanguage}: "${sourceText}"`,
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

        console.log('User input:', userInput);
        console.log('Correct answer:', correctAnswer);

        if (userInput && correctAnswer) {
            const similarity = stringSimilarity.compareTwoStrings(userInput, correctAnswer);
            console.log('Similarity:', similarity);
            const similarityThreshold = 0.8; // Adjust this value to set the required similarity

            if (similarity >= similarityThreshold) {
                setScore(score + 1);
            } else {
                setScore(score - 1);
            }
        }

        setUserInput('');
    };

    return (
        <div>
            <h2>Translation Challenge</h2>
            <p>Translate the following sentence to {targetLanguage}: "{sourceText}"</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                />
                <button type="submit">Submit</button>
            </form>
            <p>Score: {score}</p>
            {correctAnswer && <p>Correct translation: {correctAnswer}</p>}
        </div>
    );
};

export default TranslationChallenge;
