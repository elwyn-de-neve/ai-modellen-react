import { useState } from "react";

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

const CompletionImageToText = () => {
  const [prompt, setPrompt] = useState("");
  const [imageAnalysis, setImageAnalysis] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setImageAnalysis("");

    const requestBody = {
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: `What’s in this image? ${prompt}`,
        },
      ],
    };

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify(requestBody),
        },
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      const analysis = data.choices[0].message.content;
      setImageAnalysis(analysis);
    } catch (error) {
      console.error("Error analyzing image with OpenAI:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="prompt">
          Ask a question to OpenAI (image to text):
          <input
            id="prompt"
            type="text"
            placeholder="Enter an image URL"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onSubmit={handleSubmit}
          />
        </label>
      </form>
      {imageAnalysis && (
        <div>
          <p>{imageAnalysis}</p>
        </div>
      )}
    </div>
  );
};

export default CompletionImageToText;
