// toast
import { toast } from "react-hot-toast";
import { useReducer } from "react";
import Result from "../components/Result";

// Dastlabki holat
const initialState = {
  answeredQuestions: 1,
  correctAnswerCount: 0,
  questionIndex: 0,
  selectedAnswer: null,
  answerStatus: null,
  statusDisabled: false,
  showNextButton: false,
};

// Reducer funksiyasi
const testReducer = (state, action) => {
  switch (action.type) {
    case "SELECT_ANSWER":
      return { ...state, selectedAnswer: action.payload };

    case "SUBMIT_ANSWER":
      const correctAnswer = action.payload[state.questionIndex].answer;
      const isCorrect = state.selectedAnswer === correctAnswer;
      return {
        ...state,
        answerStatus: isCorrect ? "correct" : "incorrect",
        correctAnswerCount: isCorrect
          ? state.correctAnswerCount + 1
          : state.correctAnswerCount,
        showNextButton: true,
        statusDisabled: true,
      };

    case "NEXT_QUESTION":
      return {
        ...state,
        questionIndex: state.questionIndex + 1,
        answeredQuestions: state.answeredQuestions + 1,
        selectedAnswer: null,
        showNextButton: false,
        answerStatus: null,
        statusDisabled: false,
      };

    default:
      return state;
  }
};

function Test({ questions: { questions, title, color, icon } }) {
  const [state, dispatch] = useReducer(testReducer, initialState);

  const {
    answeredQuestions,
    correctAnswerCount,
    questionIndex,
    selectedAnswer,
    answerStatus,
    statusDisabled,
    showNextButton,
  } = state;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedAnswer === null) {
      return toast.error("Please select an answer");
    }
    dispatch({ type: "SUBMIT_ANSWER", payload: questions });
  };

  const handleNextQuestion = () => {
    dispatch({ type: "NEXT_QUESTION" });
  };

  if (questionIndex === questions.length) {
    toast.success("Congratulations", {
      icon: "🎉",
    });
    return (
      <Result
        title={title}
        color={color}
        icon={icon}
        correctAnswerCount={correctAnswerCount}
        questionsLenght={questions.length}
      />
    );
  }

  return (
    <div className="test-container">
      <div className="test-content">
        <p className="test-description">
          Question {answeredQuestions} of {questions.length}
        </p>
        <h2 className="test-title">{questions[questionIndex].question}</h2>

        <div className="test-proccess-container">
          <div
            className="test-proccess"
            style={{
              width: (answeredQuestions / questions.length) * 100 + "%",
            }}
          ></div>
        </div>
      </div>
      <div className="test-questions">
        <form onSubmit={handleSubmit}>
          <ul className="test-list">
            {questions[questionIndex].options.map((option, index) => {
              const alphabet = String.fromCharCode(index + 65);
              let className = "";
              if (answerStatus === "correct" && option === selectedAnswer) {
                className = "correct";
              } else if (answerStatus === "incorrect") {
                if (option === selectedAnswer) {
                  className = "incorrect";
                }
                if (option === questions[questionIndex].answer) {
                  className = "correct";
                }
              }

              return (
                <li key={option}>
                  <label className={`test-label ${className}`}>
                    <span className="test-letter">{alphabet}</span>
                    <input
                      onChange={() =>
                        dispatch({ type: "SELECT_ANSWER", payload: option })
                      }
                      type="radio"
                      name="option"
                      disabled={statusDisabled}
                    />
                    <span className="test-text">{option}</span>

                    {/* icon */}
                    <img
                      className="test-icon-correct"
                      src="../assets/icon-correct.svg"
                      alt="icon"
                      width={40}
                      height={40}
                    />
                    <img
                      className="test-icon-incorrect"
                      src="../assets/icon-incorrect.svg"
                      alt="icon"
                      width={40}
                      height={40}
                    />
                  </label>
                </li>
              );
            })}
          </ul>
          {!showNextButton && (
            <button className="btn test-btn">Submit Question</button>
          )}
          {showNextButton && (
            <button onClick={handleNextQuestion} className="btn test-btn">
              {questions.length === questionIndex + 1
                ? "Finish"
                : "Next Question"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default Test;
