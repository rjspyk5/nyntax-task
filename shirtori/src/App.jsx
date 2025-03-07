import { useRef, useState } from "react";
import { useEffect } from "react";

function App() {
  const playerOneRef = useRef(null);
  const playerTwoRef = useRef(null);
  const [playerOneError, setplayerOneError] = useState(null);
  const [playerTwoError, setplayerTwoError] = useState(null);
  const [playerOneWords, setplayerOneWords] = useState([]);
  const [playerTwoWords, setplayerTwoWords] = useState([]);
  const [playerOneLastWord, setplayerOneLastWord] = useState(null);
  const [playerTwoLastWord, setplayerTwoLastWord] = useState(null);
  const [playerOneScore, setplayerOneScore] = useState(0);
  const [playerTwoScore, setplayerTwoScore] = useState(0);
  const words = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
  ];
  const randomIndex = Math.round(Math.random() * (words.length - 1));

  useEffect(() => {
    setplayerTwoLastWord(words[randomIndex]);
  }, []);

  const handleError = (player, msz) => {
    if (player === 1) {
      setplayerOneError(msz);
    } else {
      setplayerTwoError(msz);
    }
  };
  const handleClick = async (e, player = 1) => {
    e.preventDefault();
    setplayerOneError(null);
    setplayerTwoError(null);
    let value;
    // access value
    if (player === 1) {
      value = e.target.playerOneInput.value;
      if (value.at(0) !== playerTwoLastWord) {
        handleError(player, `words must start with ${playerTwoLastWord}`);
        return;
      }
    } else {
      value = e.target.playerTwoInput.value;
      if (!value.at(0) === playerOneLastWord) {
        handleError(player, `words must start with ${playerOneLastWord}`);
        return;
      }
    }
    // check length
    if (value.length < 4) {
      handleError(player, "Give atlest four digit");
      return;
    }
    // check duplicate
    if (playerOneWords.includes(value) || playerTwoWords.includes(value)) {
      handleError(player, "Already declared");
      return;
    }
    // check valid word
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${value}`
    );
    const result = await response.json();
    const isValid = Array.isArray(result);
    if (!isValid) {
      handleError(player, "Not a valid word and you loose a point");
      if (player === 1) {
        setplayerOneScore(playerOneScore - 1);
      } else {
        setplayerTwoScore(playerTwoScore - 1);
      }
      return;
    }
    if (player === 1) {
      e.target.playerOneInput.value = "";
      setplayerOneWords([...playerOneWords, value]);
      setplayerTwoLastWord(null);
      setplayerOneLastWord(value.at(-1));
      setplayerOneScore(playerOneScore + 1);
      playerTwoRef.current.focus();
    } else {
      e.target.playerTwoInput.value = "";
      setplayerTwoWords([...playerTwoWords, value]);
      setplayerOneLastWord(null);
      setplayerTwoLastWord(value.at(-1));
      setplayerTwoScore(playerTwoScore + 1);
      playerOneRef.current.focus();
    }
  };

  return (
    <div>
      <div className="flex min-h-screen justify-center items-center space-x-10">
        {/* player One */}
        <div className="shadow-md p-4 rounded-md">
          <span>{playerOneScore}</span>
          <form onSubmit={(e) => handleClick(e)} action="">
            <input
              ref={playerOneRef}
              autoFocus
              name="playerOneInput"
              placeholder={playerTwoLastWord}
              className="border px-3 py-2 rounded-md "
              type="text"
            />
            <br />
            {playerOneError && <p className="text-red-500">{playerOneError}</p>}
          </form>
          {playerOneWords.length > 0 &&
            playerOneWords.map((word) => <p key={word}>{word}</p>)}
        </div>
        {/* Player Two */}
        <div className="shadow-md p-4 rounded-md">
          <span>{playerTwoScore}</span>
          <form onSubmit={(e) => handleClick(e, 2)} action="">
            <input
              ref={playerTwoRef}
              name="playerTwoInput"
              placeholder={playerOneLastWord}
              className="border px-3 py-2 rounded-md "
              type="text"
            />
            {playerTwoError && <p className="text-red-500">{playerTwoError}</p>}
          </form>
          {playerTwoWords.length > 0 && (
            <div className="max-h-[300px] overflow-y-auto">
              {playerTwoWords.map((word) => (
                <p key={word}>{word}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
