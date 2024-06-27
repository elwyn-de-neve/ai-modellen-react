import { useState } from "react";
import axios from "axios";

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

const Completion = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [audioUrl, setAudioUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponse("");
    setAudioUrl("");
    try {
      const res = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
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
      console.log("test");
      // Now convert the response to speech
      const audioRes = await axios.post(
        "https://api.openai.com/v1/audio/speech",
        {
          model: "tts-1",
          voice: "alloy",
          input: output,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          responseType: "arraybuffer",
        },
      );

      const audioBlob = new Blob([audioRes.data], { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
      console.log("Audio URL:", audioUrl);
    } catch (error) {
      console.error("Error communicating with OpenAI:", error);
    }
    setPrompt("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="prompt">
          Ask a question to OpenAI (text 2 audio):
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
      {audioUrl && (
        <div>
          <audio controls>
            <source src={audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
};

export default Completion;
