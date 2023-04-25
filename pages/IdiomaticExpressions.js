import React, { useState, useEffect } from "react";

const IdiomaticExpressions = ({ targetLanguage }) => {
    const [expression, setExpression] = useState("");
    const [meaning, setMeaning] = useState("");
    const [example, setExample] = useState("");
    const [translatedExample, setTranslatedExample] = useState("");
    const [usedExpressions, setUsedExpressions] = useState(new Set());

    const normalizeText = (text) => {
        return text
            .toLowerCase()
            .replace(/[^\w\s]|_/g, "")
            .replace(/\s+/g, " ")
            .trim();
    };
    const jaccardSimilarity = (text1, text2) => {
        const set1 = new Set(normalizeText(text1).split(" "));
        const set2 = new Set(normalizeText(text2).split(" "));

        const intersection = new Set([...set1].filter((word) => set2.has(word)));
        const union = new Set([...set1, ...set2]);

        return intersection.size / union.size;
    };

    useEffect(() => {
        fetchIdiomaticExpression();
    }, [targetLanguage]);



    const fetchIdiomaticExpression = async () => {
        let unique = false;
        let selectedExpression;

        while (!unique) {
            const prompt = `Generate an idiomatic expression or proverb in ${targetLanguage} along with its detailed meaning and an example of how it's used. Use the following format:\n\nExpression: <expression>\nMeaning: <meaning>\nExample: <example>\n\nTranslate the example back to English:\n\nExample Translated: <example_translated>`;
            const apiUrl = "/api/generate";
            const res = await fetch(apiUrl, {
                method: "POST",
                body: JSON.stringify({
                    prompt,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const json = await res.json();
            const responseText = json.reply.split("\n");

            const normalizedMeaning = normalizeText(responseText[1]);
            let tooSimilar = false;

            usedExpressions.forEach((existingMeaning) => {
                if (jaccardSimilarity(existingMeaning, normalizedMeaning) > 0.5) {
                    tooSimilar = true;
                }
            });

            if (
                responseText.length === 4 &&
                !usedExpressions.has(normalizedMeaning) &&
                !tooSimilar &&
                responseText[0].startsWith("Expression:") &&
                responseText[1].startsWith("Meaning:") &&
                responseText[2].startsWith("Example:") &&
                responseText[3].startsWith("Example Translated:")
            ) {
                unique = true;
                selectedExpression = responseText;
                setUsedExpressions((prevUsed) => {
                    const newUsed = new Set(prevUsed);
                    newUsed.add(normalizedMeaning);
                    return newUsed;
                });
            }
        }

        setExpression(selectedExpression[0].replace("Expression: ", ""));
        setMeaning(selectedExpression[1].replace("Meaning: ", ""));
        setExample(selectedExpression[2].replace("Example: ", ""));
        setTranslatedExample(selectedExpression[3].replace("Example Translated: ", ""));
    };



    return (
        <div>
            <h2>Idiomatic Expressions Practice</h2>
            <button onClick={fetchIdiomaticExpression}>Get New Expression</button>
            <div>
                <p><strong>Expression:</strong> {expression}</p>
                <p><strong>Meaning:</strong> {meaning}</p>
                <p><strong>Example:</strong> {example}</p>
                <p><strong>Example Translated:</strong> {translatedExample}</p>
            </div>
        </div>
    );
};

export default IdiomaticExpressions;
