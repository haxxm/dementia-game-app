import { useState } from "react";
import { updateMissionProgress, calculateLevel } from "../utils/missions"; // ⭐ 추가

function GameRPS() {
  const choices = ["✊", "✌️", "🖐️"];
  const [player, setPlayer] = useState(null);
  const [computer, setComputer] = useState(null);
  const [result, setResult] = useState(null);

  const play = (playerChoice) => {
    const computerChoice = choices[Math.floor(Math.random() * choices.length)];
    setPlayer(playerChoice);
    setComputer(computerChoice);

    let resultText = "";
    if (playerChoice === computerChoice) {
      resultText = "무승부!";
    } else if (
      (playerChoice === "✊" && computerChoice === "✌️") ||
      (playerChoice === "✌️" && computerChoice === "🖐️") ||
      (playerChoice === "🖐️" && computerChoice === "✊")
    ) {
      resultText = "승리! 🎉";

      const id = sessionStorage.getItem("loggedInUser");
      const user = JSON.parse(localStorage.getItem("user_" + id));

      // ⭐ 포인트 추가
      let bonus = 100;
      user.point = (user.point || 0) + bonus;
      user.level = calculateLevel(user.point);

      // ⭐ 가위바위보 미션 진행 업데이트
      const updatedUser = updateMissionProgress("rps_win", user);

      localStorage.setItem("user_" + id, JSON.stringify(updatedUser));
    } else {
      resultText = "패배! 😭";
    }

    setResult(resultText);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>✊✌️🖐️ 가위바위보</h2>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => play("✊")}>✊</button>
        <button onClick={() => play("✌️")} style={{ margin: "0 10px" }}>✌️</button>
        <button onClick={() => play("🖐️")}>🖐️</button>
      </div>

      {player && (
        <>
          <p>👤 나: {player}</p>
          <p>💻 컴퓨터: {computer}</p>
          <h3>{result}</h3>
        </>
      )}
    </div>
  );
}

export default GameRPS;
