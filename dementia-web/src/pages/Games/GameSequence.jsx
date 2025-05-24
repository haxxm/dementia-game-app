import { useState } from "react";
import { updateMissionProgress, calculateLevel } from "../utils/missions"; // ⭐ 추가

function GameSequence() {
  const [wordList] = useState(["사과", "고양이", "이불", "룰렛", "트럭", "컴퓨터", "러시아", "아이스크림"]);
  const [currentWord, setCurrentWord] = useState("사과");
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleSubmit = () => {
    if (finished || input.length === 0) return;

    const lastChar = currentWord[currentWord.length - 1];
    const firstChar = input[0];

    if (lastChar === firstChar) {
      setScore(score + 1);
      setCurrentWord(input);
      setInput("");
    } else {
      handleFinish(); // 틀리면 게임 종료 + 포인트 처리
    }
  };

  const handleFinish = () => {
    setFinished(true);

    const id = sessionStorage.getItem("loggedInUser");
    if (!id) return;

    const user = JSON.parse(localStorage.getItem("user_" + id));

    // ⭐ 점수 기반 포인트 추가
    let bonus = score * 50; // 예: 단어 하나당 50포인트
    user.point = (user.point || 0) + bonus;
    user.level = calculateLevel(user.point);

    // ⭐ 단어 이어 말하기 미션 업데이트
    const updatedUser = updateMissionProgress("sequence_game_success", user);

    localStorage.setItem("user_" + id, JSON.stringify(updatedUser));

    alert(`게임 종료! ${score}점 획득. 보너스 ${bonus}포인트 지급!`);
  };

  const handleRestart = () => {
    setCurrentWord("사과");
    setInput("");
    setScore(0);
    setFinished(false);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>🧠 단어 이어 말하기</h2>
      <p>현재 단어: <strong>{currentWord}</strong></p>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="단어 입력"
        disabled={finished}
      />
      <button onClick={handleSubmit} disabled={finished} style={{ marginLeft: "10px" }}>
        제출
      </button>

      <p>점수: {score}</p>

      {finished && (
        <div>
          <p style={{ color: "red" }}>틀렸습니다! 게임 종료 🛑</p>
          <button onClick={handleRestart}>다시 시작</button>
        </div>
      )}
    </div>
  );
}

export default GameSequence;
