import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { diagnosisQuestions } from "../data/diagnosisQuestions";
import { db } from "../firebase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";

function Diagnosis() {
  const [answers, setAnswers] = useState(Array(diagnosisQuestions.length).fill(null));
  const navigate = useNavigate();

  const handleSaveDiagnosis = async (score, total) => {
    const today = new Date().toISOString().split("T")[0];
    const id = sessionStorage.getItem("loggedInUser");

    if (!id) {
      alert("로그인이 필요합니다!");
      navigate("/login");
      return;
    }

    const diagnosisRef = collection(db, "diagnosisRecords");
    const q = query(diagnosisRef, where("userId", "==", id), where("date", "==", today));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      alert("오늘은 이미 진단을 완료했습니다. 내일 다시 검사해주세요.");
      return;
    }

    let recommendation = "";
    if (score >= 8) {
      recommendation = "병원 정밀진단 권장";
    } else if (score >= 6) {
      recommendation = "주의";
    } else {
      recommendation = "정상";
    }

    await addDoc(diagnosisRef, {
      userId: id,
      score,
      total,
      date: today,
      recommendation,
    });

    alert(score >= 6
      ? "치매 가능성이 있습니다. 병원에서 정밀 진단을 받아보세요."
      : "정상 범위입니다.");
    navigate("/mypage");
  };

  const handleChange = (idx, value) => {
    const updated = [...answers];
    updated[idx] = value === "yes";
    setAnswers(updated);
  };

  const handleSubmit = () => {
    if (answers.includes(null)) {
      alert("모든 질문에 답해주세요.");
      return;
    }

    const score = answers.filter(Boolean).length;
    handleSaveDiagnosis(score, answers.length);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>자가진단</h2>
      {diagnosisQuestions.map((q, i) => (
        <div key={i} style={{ margin: "15px 0" }}>
          <p>{i + 1}. {q}</p>
          <label>
            <input
              type="radio"
              name={`q${i}`}
              value="yes"
              onChange={(e) => handleChange(i, e.target.value)}
            />{" "}
            예
          </label>
          <label style={{ marginLeft: "20px" }}>
            <input
              type="radio"
              name={`q${i}`}
              value="no"
              onChange={(e) => handleChange(i, e.target.value)}
            />{" "}
            아니오
          </label>
        </div>
      ))}
      <button onClick={handleSubmit} style={{ marginTop: "20px" }}>
        제출하기
      </button>
    </div>
  );
}

export default Diagnosis;
