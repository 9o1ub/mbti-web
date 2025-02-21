import React, { useState } from 'react';

function Test() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <div className="test-container">
      <div className="test-navigation">
        <button 
          className="btn btn-secondary"
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Назад
        </button>
      </div>
    </div>
  );
}

export default Test; 