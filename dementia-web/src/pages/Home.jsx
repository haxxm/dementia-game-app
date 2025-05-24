import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>🧠 치매 예방 게임에 오신 걸 환영합니다!</h1>
      <p>아래 메뉴에서 원하는 기능을 선택하세요</p>
      <div style={{ marginTop: "40px", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
        <button onClick={() => navigate("/diagnosis")} style={buttonStyle}>
          🩺 자가진단
        </button>
        <button onClick={() => navigate("/game")} style={buttonStyle}>
          🎮 게임하러 가기
        </button>
        <button onClick={() => navigate("/mypage")} style={buttonStyle}>
          📊 마이페이지
        </button>
        <button onClick={() => navigate("/ranking")} style={buttonStyle}>
          🏆 랭킹 보기
        </button>
      </div>
    </div>
  );
}

const buttonStyle = {
  padding: "15px 30px",
  fontSize: "1.2rem",
  borderRadius: "8px",
  border: "1px solid #ccc",
  cursor: "pointer",
  backgroundColor: "#f0f0f0",
};

export default Home;
