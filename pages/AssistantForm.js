import React, { useState } from "react";

const AssistantForm = ({ onFormSubmit }) => {
    const [name, setName] = useState("");
    const [targetLanguage, setTargetLanguage] = useState("");
    const [userInput, setUserInput] = useState("");

    async function onSubmit(event) {
        event.preventDefault();
        onFormSubmit(name, targetLanguage, userInput);
    }

    return (
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
    );
};

export default AssistantForm;
