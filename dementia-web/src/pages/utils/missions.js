// utils/missions.js

// 오늘의 미션 생성 함수
export const createTodayMissions = () => {
    const missions = [
      {
        id: "card_game_success",
        title: "🃏 카드게임 2회 클리어",
        target: 2,
        progress: 0,
        done: false,
        reward: 300,
      },
      {
        id: "diagnosis_complete",
        title: "🧠 오늘 자가진단 완료하기",
        target: 1,
        progress: 0,
        done: false,
        reward: 200,
      },
      {
        id: "ox_quiz_success",
        title: "⭕❌ OX퀴즈 5회 정답 맞히기",
        target: 5,
        progress: 0,
        done: false,
        reward: 400,
      },
      {
        id: "rps_win",
        title: "✊ 가위바위보 3회 승리하기",
        target: 3,
        progress: 0,
        done: false,
        reward: 300,
      },
      {
        id: "word_game_success",
        title: "🔤 단어 찾기 3회 성공하기",
        target: 3,
        progress: 0,
        done: false,
        reward: 300,
      },
      {
        id: "sequence_game_success",
        title: "🧠 단어 이어말하기 5회 성공",
        target: 5,
        progress: 0,
        done: false,
        reward: 400,
      }
      
    ];
  
    const shuffled = missions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 2);
  };
  
  // ✅ 미션 진행 체크 함수
  export const updateMissionProgress = (missionId, user) => {
    if (!user.missions) return user;
  
    let updated = false;
  
    user.missions = user.missions.map((mission) => {
      if (mission.id === missionId && !mission.done) {
        const newProgress = mission.progress + 1;
        if (newProgress >= mission.target) {
          mission.done = true;
          mission.progress = mission.target;
          user.point = (user.point || 0) + mission.reward;
          alert(`🎉 '${mission.title}' 미션 완료! 보상 ${mission.reward}포인트 획득!`);
        } else {
          mission.progress = newProgress;
        }
        updated = true;
      }
      return mission;
    });
  
    if (updated) {
      // 포인트가 늘었으면 레벨도 다시 계산
      user.level = calculateLevel(user.point);
    }
  
    return user;
  };
  
  // ✅ 레벨 계산 함수
  export const calculateLevel = (point) => {
    if (point >= 5000) return 4;
    if (point >= 3000) return 3;
    if (point >= 1000) return 2;
    return 1;
  };
  