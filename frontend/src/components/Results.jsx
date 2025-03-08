import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const Results = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    socket.on("pollResults", (updatedResults) => {
      setResults(updatedResults);
    });

    return () => socket.off("pollResults");
  }, []);

  return (
    <div>
      <h2>Live Results</h2>
      {results.map((poll) => (
        <div key={poll._id}>
          <h3>{poll.question}</h3>
          {poll.options.map((option, index) => (
            <p key={index}>
              {option}: {poll.votes[option]} votes
            </p>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Results;
