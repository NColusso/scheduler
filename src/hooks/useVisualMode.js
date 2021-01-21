import React, { useState } from "react";

export default function useVisualMode(initial) {
  const [history, setHistory] = useState([initial]);

  const transition = function (newMode, replace = false) {
    if (replace) {
      back();
    }
    setHistory((prev) => [...prev, newMode]);
  };

  const back = function () {
    if (history.length < 2) {
      return;
    }

    setHistory((prev) => [...prev.slice(0, prev.length - 1)]);
  };

  const mode = history[history.length - 1];

  return { mode, transition, back };
}
