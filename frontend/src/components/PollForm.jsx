import React, { useState } from "react";
import axios from "axios";

const PollForm = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const pollData = { question, options };

    try {
      const response = await axios.post("http://localhost:5000/api/polls", pollData);
      console.log("Poll Created:", response.data);
    } catch (error) {
      console.error("Error creating poll:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create a Poll</h2>
      <input
        type="text"
        placeholder="Poll Question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        required
      />
      {options.map((option, index) => (
        <input
          key={index}
          type="text"
          placeholder={`Option ${index + 1}`}
          value={option}
          onChange={(e) => {
            const newOptions = [...options];
            newOptions[index] = e.target.value;
            setOptions(newOptions);
          }}
          required
        />
      ))}
      <button type="button" onClick={handleAddOption}>
        Add Option
      </button>
      <button type="submit">Create Poll</button>
    </form>
  );
};

export default PollForm;
