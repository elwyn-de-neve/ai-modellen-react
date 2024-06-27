import CompletionText from "./components/Completion.jsx";
import CompletionTextStream from "./components/CompletionWithStream.jsx";
import CompletionTextToAudio from "./components/CompletionInAudio.jsx";
import CompletionAudioToText from "./components/CompletionFromAudio.jsx";
import CompletionTextToImage from "./components/CompletionImage.jsx";
import CompletionImageToText from "./components/CompletionImageToText.jsx";

const App = () => {
  return (
    <main>
      <CompletionText />
      <CompletionTextStream />
      <CompletionTextToAudio />
      <CompletionAudioToText />
      <CompletionTextToImage />
      <CompletionImageToText />
    </main>
  );
};

export default App;
