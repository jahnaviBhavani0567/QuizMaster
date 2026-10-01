import { useState } from "react";

function HostGame({
  title,
  questions,
  pin,
  onBack,
  onStart,
}) {
  const [players, setPlayers] = useState([
    "Alex",
    "Sam",
    "Priya",
  ]);

  const [copied, setCopied] = useState(false);

  function copyPin() {
    navigator.clipboard.writeText(pin);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  function addDemoPlayer() {
    const names = [
      "Rahul",
      "Anu",
      "John",
      "Meena",
      "David",
      "Sneha",
      "Arjun",
      "Kiran",
    ];

    const availableName = names.find(
      (name) => !players.includes(name)
    );

    if (availableName) {
      setPlayers((oldPlayers) => [
        ...oldPlayers,
        availableName,
      ]);
    }
  }

  function removePlayer(name) {
    setPlayers((oldPlayers) =>
      oldPlayers.filter(
        (player) => player !== name
      )
    );
  }

  return (
    <div className="host-page">

      {/* NAVBAR */}

      <div className="game-navbar">

        <button
          className="back-button white-back"
          onClick={onBack}
        >
          ← Back
        </button>

        <div className="host-logo">
          QuizMaster!
        </div>

        <div className="game-pin">
          GAME PIN:
          <strong>{pin}</strong>
        </div>

      </div>

      {/* MAIN */}

      <div className="host-container">

        {/* HEADER */}

        <div className="host-header">

          <span className="result-label">
            LIVE GAME
          </span>

          <h1>
            {title}
          </h1>

          <p>
            Get your players ready!
          </p>

        </div>

        {/* PIN SECTION */}

        <div className="pin-section">

          <div className="pin-content">

            <span>
              GAME PIN
            </span>

            <h2>
              {pin}
            </h2>

            <p>
              Go to QuizMaster and enter this
              code to join the game.
            </p>

            <button
              className="copy-pin"
              onClick={copyPin}
            >
              {copied
                ? "✓ PIN Copied!"
                : "📋 Copy Game PIN"}
            </button>

          </div>

          {/* QR PLACEHOLDER */}

          <div className="qr-wrapper">

            <div className="fake-qr host-qr">

              {Array.from({
                length: 144,
              }).map((_, index) => (
                <span key={index}></span>
              ))}

            </div>

            <p>
              Scan to join
            </p>

          </div>

        </div>

        {/* PLAYERS */}

        <div className="players-section">

          <div className="players-heading">

            <div>
              <span className="result-label">
                PLAYERS
              </span>

              <h2>
                {players.length}
              </h2>
            </div>

            <div className="waiting-status">
              ● Waiting for players...
            </div>

          </div>

          <div className="players-grid">

            {players.map(
              (player, index) => (
                <div
                  className="player-card"
                  key={player}
                >

                  <div className="player-avatar">
                    {player
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <span>
                    {player}
                  </span>

                  <button
                    className="remove-player"
                    onClick={() =>
                      removePlayer(player)
                    }
                  >
                    ×
                  </button>

                </div>
              )
            )}

          </div>

          {/* DEMO BUTTON */}

          <button
            className="demo-player-button"
            onClick={addDemoPlayer}
          >
            + Add Demo Player
          </button>

        </div>

        {/* START */}

        <div className="host-actions">

          <p>
            {players.length === 0
              ? "Waiting for players..."
              : `${players.length} players are ready`}
          </p>

          <button
            className="start-game-button"
            onClick={onStart}
            disabled={
              !questions ||
              questions.length === 0
            }
          >
            Start Game 🚀
          </button>

        </div>

      </div>

    </div>
  );
}

export default HostGame;