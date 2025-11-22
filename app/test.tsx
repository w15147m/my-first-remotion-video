import React from "react";

interface TestProps {
  message: string;
}

const Test: React.FC<TestProps> = ({ message }) => {
  return (
    <div style={{ padding: 20 }}>
      <h2>Test Component</h2>
      <p>{message}</p>
    </div>
  );
};

export default Test;
