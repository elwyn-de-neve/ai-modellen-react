import { useState } from "react";
import processStream from "../helper/processStream.js";

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

const CompletionWithStream = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setResponse("");

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [{ role: "user", content: prompt }],
          stream: true,
        }),
      });

      await processStream(res.body, setResponse);
    } catch (error) {
      console.error("Error communicating with OpenAI:", error);
    }

    setPrompt("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="prompt">
          Ask a question to OpenAI (stream):
          <input
            id="prompt"
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onSubmit={handleSubmit}
          />
        </label>
      </form>
      {response && (
        <div>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default CompletionWithStream;
