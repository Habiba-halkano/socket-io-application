import React, { useState } from "react";
import axios from "axios";
import styles from "./PollForm.module.css";

const PollForm = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([{ option: "", votes: 0 }, { option: "", votes: 0 }]);
  const [message, setMessage] = useState("");

  const handleAddOption = () => {
    setOptions([...options, { option: "", votes: 0 }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!question.trim() || options.some(opt => !opt.option.trim())) {
      setMessage("Question and options cannot be empty.");
      return;
    }

    const pollData = {
      question,
      options: options.map(opt => ({ option: opt.option.trim(), votes: 0 })),
    };

    try {
      const response = await axios.post("http://localhost:5000/api/polls", pollData);
      console.log("Poll Created:", response.data);
      setMessage("Poll created successfully!");
      setQuestion("");
      setOptions([{ option: "", votes: 0 }, { option: "", votes: 0 }])
    } catch (error) {
      console.error("Error creating poll:", error);
      setMessage("Error creating poll. Try again.");
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>Create a Poll</h2>
      {message && <p className={styles.message}>{message}</p>}
      <input
        className={styles.input}
        type="text"
        placeholder="Poll Question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        required
      />
      {options.map((option, index) => (
        <input
          key={index}
          className={styles.input}
          type="text"
          placeholder={`Option ${index + 1}`}
          value={option.option}
          onChange={(e) => {
            const newOptions = [...options];
            newOptions[index].option = e.target.value;
            setOptions(newOptions);
          }}
          required
        />
      ))}
      <button type="button" className={styles.button} onClick={handleAddOption}>
        Add Option
      </button>
      <button type="submit" className={styles.button}>
        Create Poll
      </button>
    </form>
  );
};

export default PollForm;
