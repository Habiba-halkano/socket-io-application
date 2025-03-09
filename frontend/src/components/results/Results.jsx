import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import styles from "./Results.module.css";

const socket = io("http://localhost:5000");

const Results = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    console.log("Connecting to socket...");

    const fetchInitialPolls = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/polls");
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error("Error fetching initial polls:", error);
      }
    };

    fetchInitialPolls();

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("pollResults", (updatedPolls) => {
      console.log("Received updated polls:", updatedPolls);

      setResults(updatedPolls);
    });

    return () => {
      socket.off("pollResults");
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
