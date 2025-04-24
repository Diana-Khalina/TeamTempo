import React, { useState } from "react";
import axios from "axios";
import questions from "../data/questions";

function DailyMoodForm({ onClose }) {
  const [answers, setAnswers] = useState({});
  const [message, setMessage] = useState("");

  const handleChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const employeeId = localStorage.getItem("userId");

      const incompleteQuestions = questions.filter(q => !(q.id in answers));
      if (incompleteQuestions.length > 0) {
        setMessage("Please answer all the questions before submitting.");
        return;
      }

      const response = await axios.post("http://localhost:4000/mood/addMoodEntry", {
        employeeId,
        answers: Object.keys(answers).map((key) => ({
          question: questions.find((q) => q.id === parseInt(key)).text,
          answer: answers[key]
        }))
      });

      setMessage(response.data.message || "Mood entry saved successfully!");

      setTimeout(() => onClose(), 3000);
    } catch (error) {
      if (error.response?.data?.message === "You have already submitted your mood for today.") {
        setMessage("You have already completed your daily mood check.");
      } else {
        setMessage("Failed to submit your answers. Please try again.");
      }
    }
  };

  const getColor = (value) => {
    const colors = ["#ff0000", "#ff6666", "#ffcc00", "#99cc00", "#00cc00"];
    return colors[value - 1];
  };

  return (
    <div className="daily-mood-form container text-center mt-5"> {/* Збільшено верхній відступ */}
      <h2 className="text-center text-success mb-4">Daily Mood Check</h2> {/* Центрування + більший відступ */}
      <form onSubmit={handleSubmit}>
        {questions.map((q) => (
          <div key={q.id} className="mb-3"> {/* Відступ між питаннями */}
            <h4>{q.text}</h4>
            <div className="d-flex justify-content-between mb-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleChange(q.id, value)}
                  className="rating-button"
                  style={{
                    backgroundColor: answers[q.id] === value ? getColor(value) : "#f0f0f0",
                    color: answers[q.id] === value ? "#fff" : "#333",
                    border: "1px solid #ccc",
                    borderRadius: "50%",
                                        width: "40px",
                    height: "40px",
                    fontSize: "16px",
                    cursor: "pointer"
                  }}
                >
                  {value}
                </button>
              ))}
            </div>
            <div className="d-flex justify-content-between">
              <span className="text-danger">Low</span>
              <span className="text-success">High</span>
            </div>
          </div>
        ))}
        <button type="submit" className="btn btn-lg btn-primary mt-3"> {/* Збільшений розмір кнопки */}
          Submit
        </button>
      </form>
      {message && <p className="message mt-3">{message}</p>} {/* Додано відступ до повідомлення */}
    </div>
  );
}

export default DailyMoodForm;