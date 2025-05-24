import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";

function Ranking({ gameName = "카드 짝 맞추기", level = "normal", top = 10 }) {
  const [rankings, setRankings] = useState([]);

  useEffect(() => {
    const fetchRanking = async () => {
      const q = query(
        collection(db, "gameRecords"),
        where("name", "==", gameName),
        where("level", "==", level),
        orderBy("score", "desc"),
        limit(top)
      );

      const snapshot = await getDocs(q);
      const results = snapshot.docs.map((doc, index) => ({
        id: doc.id,
        rank: index + 1,
        ...doc.data()
      }));
      setRankings(results);
    };

    fetchRanking();
  }, [gameName, level, top]);

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>🏆 랭킹 - {gameName} ({level})</h2>
      <table style={{ margin: "0 auto", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>순위</th>
            <th>사용자 ID</th>
            <th>점수</th>
            <th>날짜</th>
          </tr>
        </thead>
        <tbody>
          {rankings.map((r) => (
            <tr key={r.id}>
              <td>{r.rank}</td>
              <td>{r.userId}</td>
              <td>{r.score}</td>
              <td>{r.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Ranking;
