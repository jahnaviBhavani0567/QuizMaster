import React, { useState } from "react";
import "./App.css";
import { QRCodeSVG } from "qrcode.react";

import CreateQuiz from "./CreateQuiz";
import JoinGame from "./JoinGame";
import QuizGame from "./QuizGame";
import HostGame from "./HostGame";

function App() {
  const [page, setPage] = useState("home");

  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState([]);

  const [gamePin, setGamePin] = useState("");
  const [playerName, setPlayerName] = useState("");

  function generatePin() {
    return String(
      Math.floor(100000 + Math.random() * 900000)
    );
  }

  function startQuiz(title, quizQuestions) {
    setQuizTitle(title);
    setQuestions(quizQuestions);

    const newPin = gamePin || generatePin();

    setGamePin(newPin);
    setPage("quiz");
  }

  function saveQuiz(title, quizQuestions) {
    setQuizTitle(title);
    setQuestions(quizQuestions);
  }

  function joinGame(pin, name) {
    setGamePin(pin);
    setPlayerName(name);

    if (questions.length > 0) {
      setPage("quiz");
    } else {
      alert(
        `Welcome ${name}! No quiz is available yet.`
      );
    }
  }

  function openHostGame() {
    if (!quizTitle || questions.length === 0) {
      alert("Please create a quiz first.");

      setPage("create");

      return;
    }

    if (!gamePin) {
      setGamePin(generatePin());
    }

    setPage("host");
  }

  function startHostedGame() {
    if (!questions.length) {
      alert("Please create a quiz first.");

      setPage("create");

      return;
    }

    setPage("quiz");
  }

  /* =========================
     CREATE PAGE
  ========================= */

  if (page === "create") {
    return (
      <CreateQuiz
        onStartQuiz={startQuiz}
        onBack={() => setPage("home")}
        savedTitle={quizTitle}
        savedQuestions={questions}
        onSaveQuiz={saveQuiz}
      />
    );
  }

  /* =========================
     JOIN PAGE
  ========================= */

  if (page === "join") {
    return (
      <JoinGame
        onBack={() => setPage("home")}
        onJoin={joinGame}
      />
    );
  }

  /* =========================
     HOST PAGE
  ========================= */

  if (page === "host") {
    return (
      <HostGame
        title={quizTitle}
        questions={questions}
        pin={gamePin}
        onBack={() => setPage("home")}
        onStart={startHostedGame}
      />
    );
  }

  /* =========================
     QUIZ PAGE
  ========================= */

  if (page === "quiz") {
    return (
      <QuizGame
        title={quizTitle}
        questions={questions}
        pin={gamePin}
        onHome={() => setPage("home")}
      />
    );
  }

  /* =========================
     HOME PAGE
  ========================= */

  return (
    <div className="app">

      {/* =========================
          NAVBAR
      ========================= */}

      <nav className="navbar">

        <div className="logo">
          QuizMaster!
        </div>

        <div className="nav-left">

          <a href="#home">
            HOME
          </a>

          <button
            onClick={() => setPage("create")}
          >
            Create
          </button>

          <a href="#learn">
            Learning
          </a>

          <a href="#play">
            Play
          </a>

          <a href="#plans">
            Plans & Pricing
          </a>

        </div>

        <div className="nav-right">

          <a href="#explore">
            Explore
          </a>

          <button
            className="login-btn"
            onClick={() => setPage("join")}
          >
            Join
          </button>

          <button
            className="start-btn"
            onClick={() => setPage("create")}
          >
            Start for FREE
          </button>

          <button
            className="login-btn"
            onClick={openHostGame}
          >
            Host
          </button>

          <button className="login-btn">
            Log in
          </button>

          <button className="language">
            🌐 EN
          </button>

        </div>

      </nav>

      {/* =========================
          HERO
      ========================= */}

      <section
        className="hero"
        id="home"
      >

        <div className="hero-content">

          <h1>
            QuizMaster: quiz and
            <br />
            trivia game for everyone
          </h1>

          <p>
            Create quiz games, host trivia nights,
            and learn something new with QuizMaster.
            Make your lessons, presentations or
            gatherings more engaging!
          </p>

          <p>
            QuizMaster+: the best way to learn and play.
          </p>

          <h3>
            Get started for free. Create unlimited
            fun quizzes today.
          </h3>

          <button
            className="green-btn"
            onClick={() => setPage("create")}
          >
            Get started
          </button>

        </div>

        {/* =========================
            REAL QR CODE
        ========================= */}

        <div className="hero-visual">

          <div className="glow yellow"></div>

          <div className="glow green"></div>

          <div className="glow red"></div>

          <div className="qr-card">

            <div className="real-qr">

              <QRCodeSVG
                value="http://localhost:3000"
                size={250}
                bgColor="#ffffff"
                fgColor="#46178f"
                level="H"
                includeMargin={true}
              />

            </div>

          </div>

          <div className="scan-btn">
            ▦ &nbsp; Scan QR
          </div>

        </div>

      </section>

      {/* =========================
          INTRO
      ========================= */}

      <section
        className="intro"
        id="learn"
      >

        <h2>
          One app. Create, host, play, and learn.
        </h2>

        <p>
          Whether you're a teacher building lessons,
          a student turning notes into a study tool,
          or a friend who takes quiz night seriously,
          QuizMaster lets you create, host, play,
          and learn on any device, anywhere.
        </p>

      </section>

      {/* =========================
          CREATE
      ========================= */}

      <section
        className="feature"
        id="create"
      >

        <div className="feature-text">

          <h2>
            Create: Build a quiz on anything
          </h2>

          <p>
            Make your own quiz, trivia game,
            or study set in minutes.
          </p>

          <button
            className="purple-btn"
            onClick={() => setPage("create")}
          >
            Create a quiz
          </button>

        </div>

        <div className="quiz-preview">

          <div className="preview-top">
            QuizMaster! | Enter quiz title...
          </div>

          <div className="question-box">
            What's your next question?
          </div>

          <div className="answers">

            <div className="answer red">
              That's right!
            </div>

            <div className="answer blue">
              Add your answer
            </div>

            <div className="answer yellow">
              Maybe this one
            </div>

            <div className="answer green">
              Correct answer
            </div>

          </div>

        </div>

      </section>

      {/* =========================
          HOST
      ========================= */}

      <section className="feature">

        <div className="feature-text">

          <h2>
            Host: Run a live game
          </h2>

          <p>
            Create a quiz and host it for your friends,
            classmates or students. Share the Game PIN
            with your players.
          </p>

          <button
            className="purple-btn"
            onClick={openHostGame}
          >
            Host a game
          </button>

        </div>

        <div className="quiz-preview">

          <div className="preview-top">
            HOST LIVE GAME
          </div>

          <div className="question-box">

            Game PIN

            <br />

            <strong>
              {gamePin || "815 493"}
            </strong>

          </div>

          <div className="answers">

            <div className="answer red">
              👤 Player 1
            </div>

            <div className="answer blue">
              👤 Player 2
            </div>

            <div className="answer green">
              👤 Player 3
            </div>

          </div>

        </div>

      </section>

      {/* =========================
          PLAY
      ========================= */}

      <section
        className="feature"
        id="play"
      >

        <div className="feature-text">

          <h2>
            Play: Join any game instantly
          </h2>

          <p>
            Got a PIN? You're in.
            Enter the game code and start playing.
          </p>

          <button
            className="purple-btn"
            onClick={() => setPage("join")}
          >
            Join a game
          </button>

        </div>

        <div className="play-visual">

          <div className="phone">

            <div className="phone-header">
              Join
            </div>

            <div className="small-qr">

              {Array.from({ length: 49 }).map(
                (_, i) => (
                  <span key={i}></span>
                )
              )}

            </div>

            <p>
              Game PIN
            </p>

            <strong>
              815 493
            </strong>

          </div>

        </div>

      </section>

      {/* =========================
          LEARN
      ========================= */}

      <section className="feature">

        <div className="feature-text">

          <span className="result-label">
            LEARN
          </span>

          <h2>
            Learn: Turn knowledge into a game
          </h2>

          <p>
            Turn study material into interactive
            quizzes and practice questions.
            Make learning more engaging.
          </p>

          <button
            className="purple-btn"
            onClick={() => setPage("create")}
          >
            Start Learning
          </button>

        </div>

        <div className="quiz-preview">

          <div className="preview-top">
            QuizMaster! | Learning Mode
          </div>

          <div className="question-box">
            What would you like to learn today?
          </div>

          <div className="answers">

            <div className="answer red">
              Practice
            </div>

            <div className="answer blue">
              Flashcards
            </div>

            <div className="answer yellow">
              Quiz
            </div>

            <div className="answer green">
              Test Yourself
            </div>

          </div>

        </div>

      </section>

      {/* =========================
          DOWNLOAD
      ========================= */}

      <section className="download-section">

        <div className="app-icon">
          Q!
        </div>

        <div>

          <h2>
            Download QuizMaster for free
            and play across all your devices!
          </h2>

          <p>
            One app, unlimited fun
          </p>

        </div>

        <div className="store-buttons">

          <button>
             App Store
          </button>

          <button>
            ▶ Google Play
          </button>

          <button>
            🌐 Chromebook
          </button>

        </div>

      </section>

      {/* =========================
          KIDS
      ========================= */}

      <section className="kids-section">

        <div className="kids-icon">
          Q!
        </div>

        <div>

          <h2>
            QuizMaster Kids
          </h2>

          <p>
            Learn and play with fun interactive quizzes.
          </p>

        </div>

        <button
          onClick={() => setPage("create")}
        >
          Explore Kids
        </button>

      </section>

      {/* =========================
          FAQ
      ========================= */}

      <section className="faq">

        <h2>
          Frequently Asked Questions
        </h2>

        <p style={{ textAlign: "center" }}>
          Create quizzes, play games and learn
          with QuizMaster.
        </p>

      </section>

      {/* =========================
          FOOTER
      ========================= */}

      <footer>

        <div className="footer-logo">
          QuizMaster!
        </div>

        <div>

          <h4>
            Product
          </h4>

          <p>
            Create Quiz
          </p>

          <p>
            Play
          </p>

          <p>
            Host
          </p>

        </div>

        <div>

          <h4>
            Resources
          </h4>

          <p>
            Learning
          </p>

          <p>
            Help Center
          </p>

          <p>
            Community
          </p>

        </div>

        <div>

          <h4>
            Company
          </h4>

          <p>
            About
          </p>

          <p>
            Contact
          </p>

          <p>
            Careers
          </p>

        </div>

      </footer>

    </div>
  );
}

export default App;