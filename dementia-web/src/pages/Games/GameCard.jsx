import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { updateMissionProgress, calculateLevel } from "../utils/missions"; // ⭐ 추가
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

function GameCard() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [timeLimit, setTimeLimit] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const navigate = useNavigate();
  const level = new URLSearchParams(useLocation().search).get("level") || "normal";

  useEffect(() => {
    const baseEmojis = ["🍎", "🍌", "🍇", "🍓", "🍉", "🥝", "🍍", "🥑", "🥕", "🍆", "🌽", "🥒", "🍔", "🍕", "🍞", "🥨", "🍗", "🍣", "🍪", "🍩", "🍰", "🍫", "🍿", "🥜", "🧀", "🍖", "🥓", "🍛", "🥗", "🍜"];
    let pairCount = 0;
    let limit = 0;

    if (level === "easy") {
      pairCount = 12; // 24장
      limit = 5 * 60; // 5분
    } else if (level === "normal") {
      pairCount = 24; // 48장
      limit = 15 * 60; // 15분
    } else if (level === "hard") {
      pairCount = 30; // 60장
      limit = 30 * 60; // 30분
    }

    const selected = baseEmojis.slice(0, pairCount);
    const fullSet = [...selected, ...selected].sort(() => Math.random() - 0.5);
    setCards(fullSet);
    setTimeLimit(limit);
    setStartTime(Date.now());
  }, [level]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (startTime) {
        const now = Date.now();
        const diff = Math.floor((now - startTime) / 1000);
        setElapsed(diff);

        if (diff >= timeLimit) {
          alert("시간 초과! 게임이 종료됩니다.");
          navigate("/mypage");
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime, timeLimit]);

  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      const endTime = Date.now();
      const elapsedSeconds = Math.floor((endTime - startTime) / 1000);

      setTimeout(() => {
        saveResult("카드 짝 맞추기", level, matched.length / 2);
        alert(`게임 완료! ${elapsedSeconds}초 소요. 결과가 저장되었습니다.`);
        navigate("/mypage");
      }, 500);
    }
  }, [matched]);

  const handleClick = (idx) => {
    if (flipped.length === 2 || flipped.includes(idx)) return;
    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (cards[first] === cards[second]) {
        setMatched([...matched, first, second]);
      }
      setTimeout(() => setFlipped([]), 800);
    }
  };

const saveResult = async (name, level, score) => {
  const id = sessionStorage.getItem("loggedInUser");
  if (!id) return;

  // 🔹 1. 게임 결과 저장
  const result = {
    userId: id,
    name,
    level,
    score,
    date: new Date().toISOString().split("T")[0],
  };
  await addDoc(collection(db, "gameRecords"), result);

  // 🔹 2. 포인트 계산
  let bonus = 0;
  if (level === "easy") bonus = 100;
  else if (level === "normal") bonus = 200;
  else if (level === "hard") bonus = 300;

  // 🔹 3. 유저 데이터 로드
  const userRef = doc(db, "users", id);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return;
  const user = snap.data();

  const newPoint = (user.point || 0) + bonus;
  const newLevel = calculateLevel(newPoint);
  const updatedUser = updateMissionProgress("card_game_success", {
    ...user,
    point: newPoint,
    level: newLevel,
  });

  // 🔹 4. 업데이트 저장
  await updateDoc(userRef, {
    point: updatedUser.point,
    level: updatedUser.level,
    missions: updatedUser.missions || {},
  });
};

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h2>🃏 카드 짝 맞추기</h2>
      <p>난이도: {level} | 남은 시간: {formatTime(Math.max(0, timeLimit - elapsed))}</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 80px)", gap: "10px", justifyContent: "center" }}>
        {cards.map((card, i) => (
          <div
            key={i}
            onClick={() => handleClick(i)}
            style={{
              width: "80px",
              height: "80px",
              fontSize: "2rem",
              backgroundColor: matched.includes(i) || flipped.includes(i) ? "#fff" : "#ccc",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              border: "1px solid #999",
            }}
          >
            {matched.includes(i) || flipped.includes(i) ? card : "❓"}
          </div>
        ))}
      </div>
    </div>
  );
}

export default GameCard;
