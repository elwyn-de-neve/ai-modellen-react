const processStream = async (responseBody, setResponse) => {
  const reader = responseBody.getReader();
  const decoder = new TextDecoder();
  let done = false;

  while (!done) {
    const { value, done: readerDone } = await reader.read();
    done = readerDone;
    const chunk = decoder.decode(value);
    const lines = chunk.split("\n").filter((line) => line.trim() !== "");

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const data = line.substring(6).trim();
        if (data === "[DONE]") {
          done = true;
          break;
        }

        try {
          const message = JSON.parse(data).choices[0].delta?.content;
          if (message) {
            setResponse((prev) => prev + message);
          }
        } catch (e) {
          console.error("Error parsing JSON:", e);
        }
      }
    }
  }
};

export default processStream;
