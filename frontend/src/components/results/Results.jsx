import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import styles from "./Results.module.css";

const socket = io("http://localhost:5000");

const Results = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    console.log("Connecting to socket..."); // Debug log
    socket.on("pollResults", (updatedResults) => {
      console.log("Received updated results:", updatedResults); // Debug log
      setResults(updatedResults); // Update the state with the new poll results
    });

    return () => {
      socket.off("pollResults"); // Clean up on unmount
    };
  }, []);

  return (
    <div className={styles.resultsContainer}>
      <h2>Live Results</h2>
      {results.length === 0 ? (
        <p>No results to display yet.</p>
      ) : (
        results.map((poll) => (
          <div key={poll._id} className={styles.poll}>
            <h3>{poll.question}</h3>
            {poll.options.map((option, index) => (
              <p key={index} className={styles.option}>
                {option.option}: {option.votes} votes
              </p>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default Results;
