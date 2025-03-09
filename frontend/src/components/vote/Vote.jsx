import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Vote.module.css";

const Vote = () => {
  const [polls, setPolls] = useState([]);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/polls")
      .then((response) => {
        setPolls(response.data);
      })
      .catch((error) => console.error("Error fetching polls:", error));
  }, []);

  const handleVote = async () => {
    if (!selectedPoll || !selectedOption) return;

    try {
      await axios.post(`http://localhost:5000/api/polls/${selectedPoll}/vote`, { option: selectedOption });
      console.log("Vote submitted!");
    } catch (error) {
      console.error("Error submitting vote:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Vote on a Poll</h2>

      <select className={styles.select} onChange={(e) => setSelectedPoll(e.target.value)} defaultValue="">
        <option value="" disabled>Select a Poll</option>
        {polls.map((poll) => (
          <option key={poll._id} value={poll._id}>{poll.question}</option>
        ))}
      </select>

      {selectedPoll && (
        <div className={styles.options}>
          {polls.find(p => p._id === selectedPoll)?.options.map((option, index) => (
            <label key={index}>
              <input
                type="radio"
                name="pollOption"
                value={option.option}
                onChange={(e) => setSelectedOption(e.target.value)}
              />
              {option.option}
            </label>
          ))}
          <button className={styles.button} onClick={handleVote} disabled={!selectedOption}>
            Submit Vote
          </button>
        </div>
      )}
    </div>
  );
};

export default Vote;
