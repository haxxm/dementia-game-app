import { useState } from "react";
import { updateMissionProgress, calculateLevel } from "../utils/missions"; // ⭐ 추가

function GameWord() {
  const words = ["바나나", "사과", "고양이", "자동차"];
  const [answer] = useState(words[Math.floor(Math.random() * words.length)]);
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);

  const check = () => {
    setResult(input === answer);

    if (input === answer) {
      const id = sessionStorage.getItem("loggedInUser");
      const user = JSON.parse(localStorage.getItem("user_" + id));

      // ⭐ 포인트 추가
      let bonus = 100;
      user.point = (user.point || 0) + bonus;
      user.level = calculateLevel(user.point);

      // ⭐ 단어 찾기 미션 진행 업데이트
      const updatedUser = updateMissionProgress("word_game_success", user);

      localStorage.setItem("user_" + id, JSON.stringify(updatedUser));
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h2>🔤 단어 찾기</h2>
      <p>힌트: {answer[0]} _ _</p>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={check}>제출</button>
      {result !== null && (
        <p style={{ color: result ? "green" : "red" }}>
          {result ? "정답입니다!" : "틀렸어요! 정답은 " + answer}
        </p>
      )}
    </div>
  );
}

export default GameWord;
