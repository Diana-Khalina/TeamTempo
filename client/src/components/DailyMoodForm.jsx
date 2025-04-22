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

      // Ensure all questions are answered
      const incompleteQuestions = questions.filter(q => !(q.id in answers));
      if (incompleteQuestions.length > 0) {
        setMessage("Please answer all the questions before submitting.");
        return;
      }

      const response = await axios.post("https://teamtempo.onrender.com/mood/addMoodEntry", { //changed to the correct endpoint
        employeeId,
        answers: Object.keys(answers).map((key) => ({
          question: questions.find((q) => q.id === parseInt(key)).text,
          answer: answers[key]
        }))
      });

      setMessage(response.data.message || "Mood entry saved successfully!");

      // Delay closing the form to ensure feedback is shown
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
    <div className="daily-mood-form">
      <h2>Daily Mood Check</h2>
      <form onSubmit={handleSubmit}>
        {questions.map((q) => (
          <div key={q.id} style={{ marginBottom: "2rem" }}>
            <h4>{q.text}</h4>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
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
                    borderRadius: "5px",
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
            <div className="label">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>
        ))}
        <button type="submit" className="btn btn-primary mt-3">
          Submit
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default DailyMoodForm;
