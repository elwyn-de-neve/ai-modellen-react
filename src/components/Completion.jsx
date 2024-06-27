import { useState } from "react";
import axios from "axios";

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

const Completion = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponse("");
    try {
      const res = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o",
          messages: [{ role: "user", content: prompt }],
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        },
      );

      const output = res.data.choices[0].message.content;
      setResponse(output);
    } catch (error) {
      console.error("Error communicating with OpenAI:", error);
    }
    setPrompt("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="prompt">
          Ask a question to OpenAI:
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

export default Completion;
