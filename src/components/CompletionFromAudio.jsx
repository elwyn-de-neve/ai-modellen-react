import { useRef, useState } from "react";
import axios from "axios";
import { MicIcon, MicOffIcon } from "lucide-react";

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

const Completion = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = () => {
    setRecording(true);
    audioChunksRef.current = [];
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.start();
    });
  };

  const stopRecording = () => {
    setRecording(false);
    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/mp3" });
      const audioFile = new File([audioBlob], "audio.mp3", {
        type: "audio/mp3",
      });

      const formData = new FormData();
      formData.append("file", audioFile);
      formData.append("model", "whisper-1");

      try {
        const transcriptionRes = await axios.post(
          "https://api.openai.com/v1/audio/transcriptions", // Replace with actual transcription endpoint
          formData,
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );

        const transcription = transcriptionRes.data.text;
        setPrompt(transcription);
        handleSubmit(null, transcription);
      } catch (error) {
        console.error("Error transcribing audio:", error);
      }
    };
  };

  const handleSubmit = async (e, text) => {
    if (e) e.preventDefault();
    setResponse("");
    setAudioUrl("");
    try {
      const res = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: [{ role: "user", content: text || prompt }],
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
      <div className="flex">
        <form onSubmit={handleSubmit}>
          <label htmlFor="prompt">
            Ask a question to OpenAI (audio 2 text):
            <input
              id="prompt"
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onSubmit={handleSubmit}
            />
          </label>
        </form>
        <button
          className="btn"
          onClick={recording ? stopRecording : startRecording}
        >
          {recording ? <MicOffIcon size={16} /> : <MicIcon size={16} />}
        </button>
      </div>
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
