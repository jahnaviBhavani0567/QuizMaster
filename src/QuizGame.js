import { useEffect, useState } from "react";

function QuizGame({
  title,
  questions,
  pin,
  onHome,
}) {
  const QUESTION_TIME = 15;

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [finished, setFinished] = useState(false);
  const [answerHistory, setAnswerHistory] = useState([]);

  const question = questions[current];

  /*
   * TIMER
   */
  useEffect(() => {
    if (finished || selected !== null) {
      return;
    }

    if (timeLeft <= 0) {
      handleTimeUp();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((oldTime) => oldTime - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, selected, finished]);

  /*
   * ANSWER SELECTION
   */
  function selectAnswer(index) {
    if (selected !== null) return;

    setSelected(index);

    const isCorrect =
      index === question.correctAnswer;

    if (isCorrect) {
      setCorrectCount(
        (oldCount) => oldCount + 1
      );

      /*
       * Faster answers receive more points.
       * Maximum = 1000
       */
      const points = Math.max(
        100,
        Math.round(
          500 + (timeLeft / QUESTION_TIME) * 500
        )
      );

      setScore(
        (oldScore) => oldScore + points
      );

      setAnswerHistory((oldHistory) => [
        ...oldHistory,
        {
          question: question.question,
          selectedAnswer: question.options[index],
          correctAnswer:
            question.options[question.correctAnswer],
          correct: true,
          points,
        },
      ]);
    } else {
      setAnswerHistory((oldHistory) => [
        ...oldHistory,
        {
          question: question.question,
          selectedAnswer: question.options[index],
          correctAnswer:
            question.options[question.correctAnswer],
          correct: false,
          points: 0,
        },
      ]);
    }
  }

  /*
   * WHEN TIMER REACHES ZERO
   */
  function handleTimeUp() {
    if (selected !== null) return;

    setSelected(-1);

    setAnswerHistory((oldHistory) => [
      ...oldHistory,
      {
        question: question.question,
        selectedAnswer: "Time's up!",
        correctAnswer:
          question.options[question.correctAnswer],
        correct: false,
        points: 0,
      },
    ]);
  }

  /*
   * NEXT QUESTION
   */
  function nextQuestion() {
    if (current === questions.length - 1) {
      setFinished(true);
      return;
    }

    setCurrent((oldCurrent) => oldCurrent + 1);
    setSelected(null);
    setTimeLeft(QUESTION_TIME);
  }

  /*
   * SAFETY CHECK
   */
  if (!questions || questions.length === 0) {
    return (
      <div className="game-page result-page">
        <div className="result-card">
          <h1>No quiz available</h1>

          <button
            className="start-quiz"
            onClick={onHome}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  /*
   * FINAL RESULT
   */
  if (finished) {
    const accuracy = Math.round(
      (correctCount / questions.length) * 100
    );

    return (
      <div className="game-page result-page">

        <div className="result-card">

          <div className="trophy">
            🏆
          </div>

          <span className="result-label">
            QUIZ COMPLETE
          </span>

          <h1>Great job!</h1>

          <p className="result-title">
            {title}
          </p>

          <div className="final-score">
            {score}
            <small> pts</small>
          </div>

          <p>Your final score</p>

          <div className="result-stats">

            <div>
              <strong>
                {correctCount}
              </strong>

              <span>
                Correct
              </span>
            </div>

            <div>
              <strong>
                {questions.length -
                  correctCount}
              </strong>

              <span>
                Incorrect
              </span>
            </div>

            <div>
              <strong>
                {accuracy}%
              </strong>

              <span>
                Accuracy
              </span>
            </div>

          </div>

          <div className="answer-review">

            <h2>
              Answer Review
            </h2>

            {answerHistory.map(
              (answer, index) => (
                <div
                  className={`review-item ${
                    answer.correct
                      ? "review-correct"
                      : "review-wrong"
                  }`}
                  key={index}
                >

                  <div>
                    <strong>
                      {index + 1}.{" "}
                      {answer.question}
                    </strong>

                    <p>
                      Your answer:{" "}
                      {answer.selectedAnswer}
                    </p>

                    {!answer.correct && (
                      <p>
                        Correct answer:{" "}
                        {answer.correctAnswer}
                      </p>
                    )}
                  </div>

                  <span>
                    {answer.correct
                      ? `+${answer.points}`
                      : "0"}
                  </span>

                </div>
              )
            )}

          </div>

          <button
            className="start-quiz"
            onClick={onHome}
          >
            Back to Home
          </button>

        </div>
      </div>
    );
  }

  /*
   * QUIZ SCREEN
   */
  return (
    <div className="game-page">

      {/* GAME NAVBAR */}

      <div className="game-navbar">

        <button
          className="back-button white-back"
          onClick={onHome}
        >
          ← Exit
        </button>

        <div className="game-pin">
          GAME PIN:
          <strong>
            {pin}
          </strong>
        </div>

      </div>

      {/* GAME CONTENT */}

      <div className="game-content">

        {/* QUESTION INFO */}

        <div className="game-info">

          <span>
            QUESTION {current + 1} OF{" "}
            {questions.length}
          </span>

          <h1>
            {title}
          </h1>

          {/* PROGRESS */}

          <div className="progress-bar">
            <div
              style={{
                width: `${
                  ((current + 1) /
                    questions.length) *
                  100
                }%`,
              }}
            />
          </div>

        </div>

        {/* TIMER */}

        <div
          className={`quiz-timer ${
            timeLeft <= 5
              ? "timer-danger"
              : ""
          }`}
        >
          ⏱ {timeLeft}
        </div>

        {/* QUESTION */}

        <div className="question-display">

          <h2>
            {question.question}
          </h2>

        </div>

        {/* ANSWERS */}

        <div className="game-answers">

          {question.options.map(
            (option, index) => {

              let answerClass = "";

              if (selected !== null) {

                if (
                  index ===
                  question.correctAnswer
                ) {
                  answerClass =
                    "correct";
                } else if (
                  index === selected
                ) {
                  answerClass =
                    "wrong";
                }
              }

              return (
                <button
                  key={index}
                  className={`game-answer answer-color-${index} ${answerClass}`}
                  onClick={() =>
                    selectAnswer(index)
                  }
                  disabled={
                    selected !== null
                  }
                >

                  <span className="answer-letter">
                    {String.fromCharCode(
                      65 + index
                    )}
                  </span>

                  {option}

                </button>
              );
            }
          )}

        </div>

        {/* ANSWER FEEDBACK */}

        {selected !== null && (
          <div className="answer-feedback">

            {selected ===
            question.correctAnswer ? (
              <>
                <strong>
                  🎉 Correct!
                </strong>

                <span>
                  Great answer!
                </span>
              </>
            ) : (
              <>
                <strong>
                  ❌ Not quite!
                </strong>

                <span>
                  Correct answer:{" "}
                  {
                    question.options[
                      question.correctAnswer
                    ]
                  }
                </span>
              </>
            )}

          </div>
        )}

        {/* NEXT */}

        {selected !== null && (
          <button
            className="next-question"
            onClick={nextQuestion}
          >
            {current ===
            questions.length - 1
              ? "Finish Quiz 🏆"
              : "Next Question →"}
          </button>
        )}

      </div>
    </div>
  );
}

export default QuizGame;