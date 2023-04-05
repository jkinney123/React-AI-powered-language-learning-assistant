import React, { useState } from "react";

const AssistantForm = ({ onFormSubmit, targetLanguage }) => {
    const [userInput, setUserInput] = useState("");

    async function onSubmit(event) {
        event.preventDefault();
        onFormSubmit(targetLanguage, userInput);
    }

    return (
        <form onSubmit={onSubmit}>
            <label>
                Enter a word or sentence for translation:
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
