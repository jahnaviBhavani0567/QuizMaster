import { useState } from "react";

function CreateQuiz({
  onStartQuiz,
  onBack,
  savedTitle,
  savedQuestions,
  onSaveQuiz,
}) {
  const [title, setTitle] = useState(savedTitle || "");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(0);

  const [questions, setQuestions] = useState(
    savedQuestions || []
  );

  function updateOption(index, value) {
    const copy = [...options];
    copy[index] = value;
    setOptions(copy);
  }

  function addQuestion() {
    if (
      !question.trim() ||
      options.some((option) => !option.trim())
    ) {
      alert("Please fill all fields.");
      return;
    }

    const updatedQuestions = [
      ...questions,
      {
        question: question,
        options: [...options],
        correctAnswer: correctAnswer,
      },
    ];

    setQuestions(updatedQuestions);

    onSaveQuiz(title, updatedQuestions);

    setQuestion("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer(0);
  }

  function deleteQuestion(index) {
    const updatedQuestions = questions.filter(
      (_, i) => i !== index
    );

    setQuestions(updatedQuestions);

    onSaveQuiz(title, updatedQuestions);
  }

  function startQuiz() {
    if (!title.trim()) {
      alert("Please enter a quiz title.");
      return;
    }

    if (questions.length === 0) {
      alert("Please add at least one question.");
      return;
    }

    onSaveQuiz(title, questions);
    onStartQuiz(title, questions);
  }

  function goBack() {
    onSaveQuiz(title, questions);
    onBack();
  }

  return (
    <div className="page colorful-page">
      <div className="create-container">

        <button
          className="back-button"
          onClick={goBack}
        >
          ← Back
        </button>

        <div className="page-title">
          <span>CREATE QUIZ</span>

          <h1>Build your quiz.</h1>

          <p>Add questions and make it fun.</p>
        </div>

        <div className="create-card">

          <label>Quiz title</label>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Example: General Knowledge"
          />

          <div className="separator"></div>

          <label>Question</label>

          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your question..."
          />

          <label>Answer choices</label>

          <div className="answer-inputs">

            {options.map((option, index) => (
              <div
                className={`answer-input answer-${index}`}
                key={index}
              >
                <span>
                  {String.fromCharCode(65 + index)}
                </span>

                <input
                  value={option}
                  onChange={(e) =>
                    updateOption(index, e.target.value)
                  }
                  placeholder={`Answer ${index + 1}`}
                />
              </div>
            ))}

          </div>

          <label>Correct answer</label>

          <select
            value={correctAnswer}
            onChange={(e) =>
              setCorrectAnswer(Number(e.target.value))
            }
          >
            <option value={0}>Answer 1</option>
            <option value={1}>Answer 2</option>
            <option value={2}>Answer 3</option>
            <option value={3}>Answer 4</option>
          </select>

          <button
            className="add-question"
            onClick={addQuestion}
          >
            + Add Question
          </button>

        </div>

        {questions.length > 0 && (
          <div className="question-list">

            <div className="list-heading">
              <h2>Your Questions</h2>
              <span>{questions.length}</span>
            </div>

            {questions.map((item, index) => (
              <div
                className="question-item"
                key={index}
              >

                <div>
                  <small>
                    QUESTION {index + 1}
                  </small>

                  <h3>
                    {item.question}
                  </h3>

                  <p>
                    Correct answer:{" "}
                    <strong>
                      {item.options[item.correctAnswer]}
                    </strong>
                  </p>
                </div>

                <button
                  className="delete-question"
                  onClick={() => deleteQuestion(index)}
                >
                  Delete
                </button>

              </div>
            ))}

            <button
              className="start-quiz"
              onClick={startQuiz}
            >
              Start Quiz 🚀
            </button>

          </div>
        )}

      </div>
    </div>
  );
}

export default CreateQuiz;