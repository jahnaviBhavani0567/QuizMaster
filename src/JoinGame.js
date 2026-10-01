import { useState } from "react";

function JoinGame({ onBack, onJoin }) {
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");

  function joinGame() {
    if (!name.trim() || !pin.trim()) {
      alert("Please enter your name and Game PIN.");
      return;
    }

    onJoin(pin, name);
  }

  return (
    <div className="game-page join-page">

      <button
        className="back-button white-back"
        onClick={onBack}
      >
        ← Back
      </button>

      <div className="join-box">

        <div className="join-icon">🎮</div>

        <span className="result-label">
          JOIN A GAME
        </span>

        <h1>Ready to play?</h1>

        <p>
          Enter the Game PIN and your nickname.
        </p>

        <label>Nickname</label>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />

        <label>Game PIN</label>

        <input
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="123456"
          maxLength="6"
        />

        <button
          className="join-submit"
          onClick={joinGame}
        >
          Join Game →
        </button>
      </div>
    </div>
  );
}

export default JoinGame;