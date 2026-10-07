import { SportCategory, Match, GradeScore, ClassRanking, Post, RankingItem } from './types';

export const SPORT_CATEGORIES: SportCategory[] = [
  { id: 'three_legged', name: '2인 3각', iconName: 'Users', category: '민속/단체', totalPoints: 100, description: '호흡을 맞춰 달리는 50m 반환점 2인 3각 릴레이' },
  { id: 'soccer', name: '축구', iconName: 'Trophy', category: '구기종목', totalPoints: 150, description: '전/후반 각 20분 11인제 정규 축구 토너먼트' },
  { id: 'dodgeball', name: '피구', iconName: 'Flame', category: '구기종목', totalPoints: 100, description: '남녀 혼성 15인 피구 서바이벌 매치' },
  { id: 'futsal', name: '풋살', iconName: 'Activity', category: '구기종목', totalPoints: 120, description: '5인제 빠른 공수전환 실내 풋살 코트전' },
  { id: 'jump_rope', name: '단체 줄넘기', iconName: 'Repeat', category: '민속/단체', totalPoints: 120, description: '10인 이상 단체 연속 줄넘기 기록 대결' },
  { id: 'tug_of_war', name: '줄다리기', iconName: 'Users', category: '민속/단체', totalPoints: 150, description: '30인 단체 3판 2선승제 파워 매치' },
  { id: 'relay', name: '이어달리기', iconName: 'Zap', category: '육상', totalPoints: 200, description: '4x100m 학급 대표 계주 결승전' },
  { id: 'ox_quiz', name: 'OX퀴즈', iconName: 'HelpCircle', category: '특별종목', totalPoints: 80, description: '전교생 상식 및 학교 역사 퀴즈 서바이벌' },
  { id: 'bottle_flip', name: '물병던지기', iconName: 'Target', category: '특별종목', totalPoints: 80, description: '학급 대표 물병 세우기 릴레이 챌린지' },
  { id: 'jegichagi', name: '제기차기', iconName: 'Sparkles', category: '민속/단체', totalPoints: 80, description: '학급 대표 제기차기 연속 횟수 합산전' },
  { id: 'disc_golf', name: '디스크 골프', iconName: 'Disc', category: '구기/레저', totalPoints: 100, description: '타깃 바스켓 플라잉디스크 퍼팅 매치' },
];

// 종목별 코트 및 기본 설정
const SPORT_COURTS: Record<string, string> = {
  three_legged: '대운동장 트랙 잔디구역',
  soccer: '중앙 대운동장 A코트',
  dodgeball: '보조 체육관 B구역',
  futsal: '풋살 전용구장',
  jump_rope: '실내 체육관 메인홀',
  tug_of_war: '운동장 특설무대 앞',
  relay: '중앙 400m 정규 트랙',
  ox_quiz: '대강당 특설무대',
  bottle_flip: '이벤트존 1구역',
  jegichagi: '본관 앞 중앙광장',
  disc_golf: '디스크골프 잔디존',
};

// 1학년 5학급 전용 대진표 생성 (사용자 지정 대진표 반영)
function generateGrade1Matches(): Match[] {
  // 사용자 제공 이미지(media_1791379320127.png)의 1학년 5개반 정확한 대진표
  const customG1Seeds: Record<string, { m1A: number; m1B: number; m2A: number; m2B: number; m3B: number }> = {
    soccer: { m1A: 1, m1B: 5, m2A: 4, m2B: 3, m3B: 2 }, // 축구(남): ① 1 vs 5, ② 4 vs 3, ③ ①승자 vs 2, ④ ②승자 vs ③승자
    futsal: { m1A: 4, m1B: 1, m2A: 5, m2B: 3, m3B: 2 }, // 풋살(여): ① 4 vs 1, ② 5 vs 3, ③ ①승자 vs 2, ④ ②승자 vs ③승자
    dodgeball: { m1A: 4, m1B: 5, m2A: 1, m2B: 2, m3B: 3 }, // 피구(혼성): ① 4 vs 5, ② 1 vs 2, ③ ①승자 vs 3, ④ ②승자 vs ③승자
    tug_of_war: { m1A: 5, m1B: 2, m2A: 1, m2B: 4, m3B: 3 }, // 줄다리기(혼성): ① 5 vs 2, ② 1 vs 4, ③ ①승자 vs 3, ④ ②승자 vs ③승자
  };

  // 나머지 종목의 1학년 균형 대진표
  const defaultSeeds = [
    { m1A: 2, m1B: 3, m2A: 1, m2B: 4, m3B: 5 },
    { m1A: 3, m1B: 4, m2A: 2, m2B: 5, m3B: 1 },
    { m1A: 1, m1B: 2, m2A: 3, m2B: 4, m3B: 5 },
    { m1A: 2, m1B: 5, m2A: 1, m2B: 3, m3B: 4 },
    { m1A: 1, m1B: 3, m2A: 2, m2B: 4, m3B: 5 },
    { m1A: 4, m1B: 5, m2A: 2, m2B: 3, m3B: 1 },
    { m1A: 1, m1B: 5, m2A: 2, m2B: 3, m3B: 4 },
  ];

  const matches: Match[] = [];
  SPORT_CATEGORIES.forEach((sport, sIdx) => {
    const seed = customG1Seeds[sport.id] || defaultSeeds[sIdx % defaultSeeds.length];
    const court = SPORT_COURTS[sport.id] || '체육관';
    const pts = sport.totalPoints;

    const m1Id = `${sport.id}-g1-m1`;
    const m2Id = `${sport.id}-g1-m2`;
    const m3Id = `${sport.id}-g1-m3`;
    const m4Id = `${sport.id}-g1-m4`;

    // 종목별 실감나는 초기 진행 상태 및 점수
    let m1Status: Match['status'] = 'scheduled';
    let m1ScoreA = 0, m1ScoreB = 0;
    let m1Winner: Match['winnerTeam'] = undefined;

    let m2Status: Match['status'] = 'scheduled';
    let m2ScoreA = 0, m2ScoreB = 0;
    let m2Winner: Match['winnerTeam'] = undefined;

    let m3Status: Match['status'] = 'scheduled';
    let m3ScoreA = 0, m3ScoreB = 0;
    let m3TeamA = { name: '① 예선 승자', grade: 1, classNum: 0 };

    let m4Status: Match['status'] = 'scheduled';
    let m4ScoreA = 0, m4ScoreB = 0;
    let m4TeamA = { name: '② 4강 1경기 승자', grade: 1, classNum: 0 };
    let m4TeamB = { name: '③ 4강 2경기 승자', grade: 1, classNum: 0 };

    if (sport.id === 'soccer') {
      // 축구: ① 예선 종료(1반 승), ② 4강 진행중(4반 vs 3반 1:1), ③ 4강 진행중(1반 vs 2반 1:0)
      m1Status = 'completed';
      m1ScoreA = 2; m1ScoreB = 1;
      m1Winner = 'teamA';
      m2Status = 'in_progress';
      m2ScoreA = 1; m2ScoreB = 1;
      m3Status = 'in_progress';
      m3TeamA = { name: `1학년 ${seed.m1A}반`, grade: 1, classNum: seed.m1A };
      m3ScoreA = 1; m3ScoreB = 0;
    } else if (sport.id === 'futsal') {
      // 풋살: ① 예선 종료(4반 승), ② 4강 진행중(5반 vs 3반 3:2), ③ 4강 예정(4반 vs 2반)
      m1Status = 'completed';
      m1ScoreA = 3; m1ScoreB = 2;
      m1Winner = 'teamA';
      m2Status = 'in_progress';
      m2ScoreA = 3; m2ScoreB = 2;
      m3TeamA = { name: `1학년 ${seed.m1A}반`, grade: 1, classNum: seed.m1A };
    } else if (sport.id === 'dodgeball') {
      // 피구: ① 예선 진행중(4반 vs 5반 14:12), ② 4강 종료(1반 승 15:8)
      m1Status = 'in_progress';
      m1ScoreA = 14; m1ScoreB = 12;
      m2Status = 'completed';
      m2ScoreA = 15; m2ScoreB = 8;
      m2Winner = 'teamA';
      m4TeamA = { name: `1학년 ${seed.m2A}반`, grade: 1, classNum: seed.m2A };
    } else if (sport.id === 'tug_of_war') {
      // 줄다리기: ① 예선 진행중(5반 vs 2반 1:0)
      m1Status = 'in_progress';
      m1ScoreA = 1; m1ScoreB = 0;
    }

    // ① 예선
    matches.push({
      id: m1Id,
      sport: sport.id,
      grade: 1,
      matchNumber: 1,
      bracketLabel: '① 예선',
      round: '예선',
      teamA: { name: `1학년 ${seed.m1A}반`, grade: 1, classNum: seed.m1A },
      teamB: { name: `1학년 ${seed.m1B}반`, grade: 1, classNum: seed.m1B },
      scoreA: m1ScoreA,
      scoreB: m1ScoreB,
      status: m1Status,
      winnerTeam: m1Winner,
      time: '10:00',
      court,
      pointsForWinner: Math.round(pts * 0.3),
    });

    // ② 4강 1경기
    matches.push({
      id: m2Id,
      sport: sport.id,
      grade: 1,
      matchNumber: 2,
      bracketLabel: '② 4강 1경기',
      round: '4강',
      teamA: { name: `1학년 ${seed.m2A}반`, grade: 1, classNum: seed.m2A },
      teamB: { name: `1학년 ${seed.m2B}반`, grade: 1, classNum: seed.m2B },
      scoreA: m2ScoreA,
      scoreB: m2ScoreB,
      status: m2Status,
      winnerTeam: m2Winner,
      time: '11:00',
      court,
      pointsForWinner: Math.round(pts * 0.5),
    });

    // ③ 4강 2경기: ① 예선 승자 vs m3B
    matches.push({
      id: m3Id,
      sport: sport.id,
      grade: 1,
      matchNumber: 3,
      bracketLabel: '③ 4강 2경기',
      round: '4강',
      teamA: m3TeamA,
      teamB: { name: `1학년 ${seed.m3B}반`, grade: 1, classNum: seed.m3B },
      scoreA: m3ScoreA,
      scoreB: m3ScoreB,
      status: m3Status,
      time: '11:40',
      court,
      pointsForWinner: Math.round(pts * 0.5),
      sourceMatchAId: m1Id,
    });

    // ④ 결승전: ② 승자 vs ③ 승자
    matches.push({
      id: m4Id,
      sport: sport.id,
      grade: 1,
      matchNumber: 4,
      bracketLabel: '④ 결승전 (FINAL)',
      round: '결승',
      teamA: m4TeamA,
      teamB: m4TeamB,
      scoreA: m4ScoreA,
      scoreB: m4ScoreB,
      status: m4Status,
      time: '14:30',
      court,
      pointsForWinner: pts,
      sourceMatchAId: m2Id,
      sourceMatchBId: m3Id,
    });
  });

  return matches;
}

// 2학년 7학급 대진표 생성 (사용자 제공 도면 media_1791380819346.png 반영)
// 구조: ⓒ, ⓑ, ⓐ -> ⓔ(ⓒ승자 vs ⓑ승자), ⓓ(ⓐ승자 vs 부전승팀) -> ⓕ(ⓔ승자 vs ⓓ승자)
function generateGrade2Matches(): Match[] {
  const customG2Seeds: Record<
    string,
    { mcA: number; mcB: number; mbA: number; mbB: number; maA: number; maB: number; bye: number }
  > = {
    // 축구(남): ⓒ 7 vs 1, ⓑ 4 vs 2, ⓐ 3 vs 6, ⓓ 부전승 5반
    soccer: { mcA: 7, mcB: 1, mbA: 4, mbB: 2, maA: 3, maB: 6, bye: 5 },
    // 풋살(여): ⓒ 6 vs 7, ⓑ 3 vs 2, ⓐ 1 vs 4, ⓓ 부전승 5반
    futsal: { mcA: 6, mcB: 7, mbA: 3, mbB: 2, maA: 1, maB: 4, bye: 5 },
    // 피구(혼성): ⓒ 1 vs 4, ⓑ 5 vs 7, ⓐ 2 vs 3, ⓓ 부전승 6반
    dodgeball: { mcA: 1, mcB: 4, mbA: 5, mbB: 7, maA: 2, maB: 3, bye: 6 },
    // 줄다리기(혼성): ⓒ 2 vs 4, ⓑ 5 vs 3, ⓐ 7 vs 1, ⓓ 부전승 6반
    tug_of_war: { mcA: 2, mcB: 4, mbA: 5, mbB: 3, maA: 7, maB: 1, bye: 6 },
  };

  const defaultG2Seeds = [
    { mcA: 1, mcB: 2, mbA: 3, mbB: 4, maA: 5, maB: 6, bye: 7 },
    { mcA: 2, mcB: 3, mbA: 4, mbB: 5, maA: 6, maB: 7, bye: 1 },
    { mcA: 1, mcB: 7, mbA: 2, mbB: 6, maA: 3, maB: 5, bye: 4 },
    { mcA: 4, mcB: 6, mbA: 2, mbB: 7, maA: 1, maB: 3, bye: 5 },
    { mcA: 3, mcB: 5, mbA: 1, mbB: 6, maA: 2, maB: 4, bye: 7 },
    { mcA: 5, mcB: 7, mbA: 2, mbB: 3, maA: 4, maB: 6, bye: 1 },
    { mcA: 1, mcB: 5, mbA: 4, mbB: 7, maA: 2, maB: 6, bye: 3 },
  ];

  const matches: Match[] = [];
  SPORT_CATEGORIES.forEach((sport, sIdx) => {
    const seed = customG2Seeds[sport.id] || defaultG2Seeds[sIdx % defaultG2Seeds.length];
    const court = SPORT_COURTS[sport.id] || '체육관';
    const pts = sport.totalPoints;
    const base = `${sport.id}-g2`;

    const mcId = `${base}-mc`;
    const mbId = `${base}-mb`;
    const maId = `${base}-ma`;
    const meId = `${base}-me`;
    const mdId = `${base}-md`;
    const mfId = `${base}-mf`;

    // 기본 초기 진행 상태 및 점수 설정
    let mcStatus: Match['status'] = 'scheduled';
    let mcScoreA = 0, mcScoreB = 0;
    let mcWinner: Match['winnerTeam'] = undefined;

    let mbStatus: Match['status'] = 'scheduled';
    let mbScoreA = 0, mbScoreB = 0;
    let mbWinner: Match['winnerTeam'] = undefined;

    let maStatus: Match['status'] = 'scheduled';
    let maScoreA = 0, maScoreB = 0;
    let maWinner: Match['winnerTeam'] = undefined;

    let meStatus: Match['status'] = 'scheduled';
    let meScoreA = 0, meScoreB = 0;
    let meWinner: Match['winnerTeam'] = undefined;
    let meTeamA = { name: 'ⓒ 8강 승자', grade: 2, classNum: 0 };
    let meTeamB = { name: 'ⓑ 8강 승자', grade: 2, classNum: 0 };

    let mdStatus: Match['status'] = 'scheduled';
    let mdScoreA = 0, mdScoreB = 0;
    let mdTeamA = { name: 'ⓐ 8강 승자', grade: 2, classNum: 0 };

    let mfStatus: Match['status'] = 'scheduled';
    let mfScoreA = 0, mfScoreB = 0;
    let mfTeamA = { name: 'ⓔ 4강 1경기 승자', grade: 2, classNum: 0 };
    let mfTeamB = { name: 'ⓓ 4강 2경기 승자', grade: 2, classNum: 0 };

    if (sport.id === 'soccer') {
      // 축구: ⓒ 종료(1반 승), ⓑ 진행중(4반 vs 2반), ⓐ 종료(3반 승), ⓓ 진행중(3반 vs 5반)
      mcStatus = 'completed';
      mcScoreA = 1; mcScoreB = 2;
      mcWinner = 'teamB';
      meTeamA = { name: `2학년 ${seed.mcB}반`, grade: 2, classNum: seed.mcB };

      mbStatus = 'in_progress';
      mbScoreA = 2; mbScoreB = 1;

      maStatus = 'completed';
      maScoreA = 3; maScoreB = 1;
      maWinner = 'teamA';
      mdTeamA = { name: `2학년 ${seed.maA}반`, grade: 2, classNum: seed.maA };

      meStatus = 'in_progress';

      mdStatus = 'in_progress';
      mdScoreA = 1; mdScoreB = 0;
    } else if (sport.id === 'futsal') {
      // 풋살: ⓒ 종료(6반 승), ⓑ 종료(2반 승), ⓐ 진행중(1반 vs 4반), ⓔ 진행중(6반 vs 2반)
      mcStatus = 'completed';
      mcScoreA = 3; mcScoreB = 2;
      mcWinner = 'teamA';
      meTeamA = { name: `2학년 ${seed.mcA}반`, grade: 2, classNum: seed.mcA };

      mbStatus = 'completed';
      mbScoreA = 1; mbScoreB = 2;
      mbWinner = 'teamB';
      meTeamB = { name: `2학년 ${seed.mbB}반`, grade: 2, classNum: seed.mbB };

      maStatus = 'in_progress';
      maScoreA = 2; maScoreB = 2;

      meStatus = 'in_progress';
      meScoreA = 1; meScoreB = 1;
    } else if (sport.id === 'dodgeball') {
      // 피구: ⓒ 종료(1반 승), ⓑ 진행중(5반 vs 7반), ⓐ 종료(2반 승), ⓓ 진행중(2반 vs 6반)
      mcStatus = 'completed';
      mcScoreA = 12; mcScoreB = 10;
      mcWinner = 'teamA';
      meTeamA = { name: `2학년 ${seed.mcA}반`, grade: 2, classNum: seed.mcA };

      mbStatus = 'in_progress';
      mbScoreA = 11; mbScoreB = 11;

      maStatus = 'completed';
      maScoreA = 15; maScoreB = 11;
      maWinner = 'teamA';
      mdTeamA = { name: `2학년 ${seed.maA}반`, grade: 2, classNum: seed.maA };

      meStatus = 'in_progress';

      mdStatus = 'in_progress';
      mdScoreA = 14; mdScoreB = 10;
    } else if (sport.id === 'tug_of_war') {
      // 줄다리기: ⓒ 진행중(2반 vs 4반 1:0)
      mcStatus = 'in_progress';
      mcScoreA = 1; mcScoreB = 0;
    }

    // ⓒ 8강 1경기 (mc)
    matches.push({
      id: mcId,
      sport: sport.id,
      grade: 2,
      matchNumber: 1,
      matchLetter: 'c',
      bracketLabel: 'ⓒ 8강 1경기',
      round: '8강',
      teamA: { name: `2학년 ${seed.mcA}반`, grade: 2, classNum: seed.mcA },
      teamB: { name: `2학년 ${seed.mcB}반`, grade: 2, classNum: seed.mcB },
      scoreA: mcScoreA,
      scoreB: mcScoreB,
      status: mcStatus,
      winnerTeam: mcWinner,
      time: '09:30',
      court,
      pointsForWinner: Math.round(pts * 0.3),
    });

    // ⓑ 8강 2경기 (mb)
    matches.push({
      id: mbId,
      sport: sport.id,
      grade: 2,
      matchNumber: 2,
      matchLetter: 'b',
      bracketLabel: 'ⓑ 8강 2경기',
      round: '8강',
      teamA: { name: `2학년 ${seed.mbA}반`, grade: 2, classNum: seed.mbA },
      teamB: { name: `2학년 ${seed.mbB}반`, grade: 2, classNum: seed.mbB },
      scoreA: mbScoreA,
      scoreB: mbScoreB,
      status: mbStatus,
      winnerTeam: mbWinner,
      time: '10:00',
      court,
      pointsForWinner: Math.round(pts * 0.3),
    });

    // ⓐ 8강 3경기 (ma)
    matches.push({
      id: maId,
      sport: sport.id,
      grade: 2,
      matchNumber: 3,
      matchLetter: 'a',
      bracketLabel: 'ⓐ 8강 3경기',
      round: '8강',
      teamA: { name: `2학년 ${seed.maA}반`, grade: 2, classNum: seed.maA },
      teamB: { name: `2학년 ${seed.maB}반`, grade: 2, classNum: seed.maB },
      scoreA: maScoreA,
      scoreB: maScoreB,
      status: maStatus,
      winnerTeam: maWinner,
      time: '10:30',
      court,
      pointsForWinner: Math.round(pts * 0.3),
    });

    // ⓔ 4강 1경기 (me): ⓒ 승자 vs ⓑ 승자
    matches.push({
      id: meId,
      sport: sport.id,
      grade: 2,
      matchNumber: 4,
      matchLetter: 'e',
      bracketLabel: 'ⓔ 4강 1경기',
      round: '4강',
      teamA: meTeamA,
      teamB: meTeamB,
      scoreA: meScoreA,
      scoreB: meScoreB,
      status: meStatus,
      winnerTeam: meWinner,
      time: '13:00',
      court,
      pointsForWinner: Math.round(pts * 0.5),
      sourceMatchAId: mcId,
      sourceMatchBId: mbId,
    });

    // ⓓ 4강 2경기 (md): ⓐ 승자 vs seed.bye (부전승)
    matches.push({
      id: mdId,
      sport: sport.id,
      grade: 2,
      matchNumber: 5,
      matchLetter: 'd',
      bracketLabel: 'ⓓ 4강 2경기',
      round: '4강',
      teamA: mdTeamA,
      teamB: { name: `2학년 ${seed.bye}반 (부전승)`, grade: 2, classNum: seed.bye },
      scoreA: mdScoreA,
      scoreB: mdScoreB,
      status: mdStatus,
      time: '13:30',
      court,
      pointsForWinner: Math.round(pts * 0.5),
      sourceMatchAId: maId,
    });

    // ⓕ 결승전 (mf): ⓔ 승자 vs ⓓ 승자
    matches.push({
      id: mfId,
      sport: sport.id,
      grade: 2,
      matchNumber: 6,
      matchLetter: 'f',
      bracketLabel: 'ⓕ 결승전 (FINAL)',
      round: '결승',
      teamA: mfTeamA,
      teamB: mfTeamB,
      scoreA: mfScoreA,
      scoreB: mfScoreB,
      status: mfStatus,
      time: '15:10',
      court,
      pointsForWinner: pts,
      sourceMatchAId: meId,
      sourceMatchBId: mdId,
    });
  });

  return matches;
}

// 3학년 6학급 대진표 생성 (8강 2경기 -> 4강 2경기 -> 결승전)
function generateGrade3Matches(): Match[] {
  const matches: Match[] = [];
  SPORT_CATEGORIES.forEach((sport) => {
    const court = SPORT_COURTS[sport.id] || '체육관';
    const pts = sport.totalPoints;
    const base = `${sport.id}-g3`;

    const m1Id = `${base}-m1`;
    const m2Id = `${base}-m2`;
    const m3Id = `${base}-m3`;
    const m4Id = `${base}-m4`;
    const m5Id = `${base}-m5`;

    // 8강 1경기 (1반 vs 6반)
    matches.push({
      id: m1Id,
      sport: sport.id,
      grade: 3,
      matchNumber: 1,
      bracketLabel: '① 8강 1경기',
      round: '8강',
      teamA: { name: '3학년 1반', grade: 3, classNum: 1 },
      teamB: { name: '3학년 6반', grade: 3, classNum: 6 },
      scoreA: 3,
      scoreB: 1,
      status: 'completed',
      winnerTeam: 'teamA',
      time: '09:40',
      court,
      pointsForWinner: Math.round(pts * 0.3),
    });

    // 8강 2경기 (2반 vs 5반)
    matches.push({
      id: m2Id,
      sport: sport.id,
      grade: 3,
      matchNumber: 2,
      bracketLabel: '② 8강 2경기',
      round: '8강',
      teamA: { name: '3학년 2반', grade: 3, classNum: 2 },
      teamB: { name: '3학년 5반', grade: 3, classNum: 5 },
      scoreA: 2,
      scoreB: 0,
      status: 'completed',
      winnerTeam: 'teamA',
      time: '10:10',
      court,
      pointsForWinner: Math.round(pts * 0.3),
    });

    // 4강 1경기 (Winner ① 1반 vs 3반 [부전승 배정])
    matches.push({
      id: m3Id,
      sport: sport.id,
      grade: 3,
      matchNumber: 3,
      bracketLabel: '③ 4강 1경기',
      round: '4강',
      teamA: { name: '3학년 1반', grade: 3, classNum: 1 },
      teamB: { name: '3학년 3반 (부전승)', grade: 3, classNum: 3 },
      scoreA: 2,
      scoreB: 1,
      status: 'in_progress',
      time: '13:20',
      court,
      pointsForWinner: Math.round(pts * 0.5),
      sourceMatchAId: m1Id,
    });

    // 4강 2경기 (Winner ② 2반 vs 4반 [부전승 배정])
    matches.push({
      id: m4Id,
      sport: sport.id,
      grade: 3,
      matchNumber: 4,
      bracketLabel: '④ 4강 2경기',
      round: '4강',
      teamA: { name: '3학년 2반', grade: 3, classNum: 2 },
      teamB: { name: '3학년 4반 (부전승)', grade: 3, classNum: 4 },
      scoreA: 1,
      scoreB: 2,
      status: 'in_progress',
      time: '13:50',
      court,
      pointsForWinner: Math.round(pts * 0.5),
      sourceMatchAId: m2Id,
    });

    // 결승전 (③ 승자 vs ④ 승자)
    matches.push({
      id: m5Id,
      sport: sport.id,
      grade: 3,
      matchNumber: 5,
      bracketLabel: '⑤ 결승전 (FINAL)',
      round: '결승',
      teamA: { name: '③ 4강 1경기 승자', grade: 3, classNum: 0 },
      teamB: { name: '④ 4강 2경기 승자', grade: 3, classNum: 0 },
      scoreA: 0,
      scoreB: 0,
      status: 'scheduled',
      time: '15:30',
      court,
      pointsForWinner: pts,
      sourceMatchAId: m3Id,
      sourceMatchBId: m4Id,
    });
  });

  return matches;
}

export const INITIAL_MATCHES: Match[] = [
  ...generateGrade1Matches(),
  ...generateGrade2Matches(),
  ...generateGrade3Matches(),
];


// 학년별 총점 (1학년 5팀, 2학년 7팀, 3학년 6팀)
export const INITIAL_GRADE_SCORES: GradeScore[] = [
  { grade: 1, totalScore: 970, goldMedals: 2, silverMedals: 2, bronzeMedals: 1, classesCount: 5 },
  { grade: 2, totalScore: 1470, goldMedals: 3, silverMedals: 3, bronzeMedals: 3, classesCount: 7 },
  { grade: 3, totalScore: 1430, goldMedals: 4, silverMedals: 3, bronzeMedals: 2, classesCount: 6 },
];

// 총 18개 학급 종합 순위표 (1학년 1~5반, 2학년 1~7반, 3학년 1~6반)
export const INITIAL_CLASS_RANKINGS: ClassRanking[] = [
  { rank: 1, grade: 3, classNum: 1, score: 380, wins: 4, losses: 0 },
  { rank: 2, grade: 2, classNum: 2, score: 350, wins: 3, losses: 1 },
  { rank: 3, grade: 3, classNum: 4, score: 320, wins: 3, losses: 1 },
  { rank: 4, grade: 1, classNum: 3, score: 290, wins: 3, losses: 1 },
  { rank: 5, grade: 2, classNum: 7, score: 270, wins: 2, losses: 1 },
  { rank: 6, grade: 3, classNum: 6, score: 250, wins: 2, losses: 1 },
  { rank: 7, grade: 1, classNum: 5, score: 240, wins: 2, losses: 1 },
  { rank: 8, grade: 2, classNum: 5, score: 220, wins: 2, losses: 2 },
  { rank: 9, grade: 2, classNum: 1, score: 200, wins: 2, losses: 1 },
  { rank: 10, grade: 3, classNum: 2, score: 190, wins: 1, losses: 2 },
  { rank: 11, grade: 1, classNum: 1, score: 180, wins: 1, losses: 2 },
  { rank: 12, grade: 2, classNum: 4, score: 170, wins: 1, losses: 2 },
  { rank: 13, grade: 3, classNum: 3, score: 160, wins: 1, losses: 2 },
  { rank: 14, grade: 1, classNum: 2, score: 150, wins: 1, losses: 2 },
  { rank: 15, grade: 2, classNum: 3, score: 140, wins: 1, losses: 2 },
  { rank: 16, grade: 3, classNum: 5, score: 130, wins: 1, losses: 3 },
  { rank: 17, grade: 2, classNum: 6, score: 120, wins: 0, losses: 3 },
  { rank: 18, grade: 1, classNum: 4, score: 110, wins: 0, losses: 3 },
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'p-1',
    title: '3학년 1반 축구 결승 골 장면 다시 봐도 소름!!',
    content: '1반 골키퍼 선방쇼에 4반 중거리슛까지.. 양팀 다 멋진 경기 보여줘서 고맙습니다!',
    author: '3학년 학생',
    created_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    likes: 38,
  },
  {
    id: 'p-2',
    title: '2학년 2반 vs 2학년 7반 농구 결승전 역대급 명경기!',
    content: '마지막 2점 차이 승부 실화냐 ㄷㄷ 양팀 모두 끝까지 최선을 다했습니다.',
    author: '2학년 체육부',
    created_at: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    likes: 31,
  },
  {
    id: 'p-3',
    title: '오후 학급 대표 계주 출전 선수 집합 공지 (본부석)',
    content: '오후 3시 40분까지 각 반 계주 주자들은 본부석 앞으로 집합하여 번호표를 수령하세요.',
    author: '체육교사',
    created_at: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
    likes: 47,
  },
  {
    id: 'p-4',
    title: '현재 종합 1위 3학년 1반, 2위 2학년 2반 바짝 추격 중 🔥',
    content: '점수 차이가 30점밖에 안 나네요. 남은 계주와 줄다리기에서 종합 우승이 결정됩니다!',
    author: '무선중 방송반',
    created_at: new Date(Date.now() - 1000 * 60 * 80).toISOString(),
    likes: 54,
  },
];

export const INITIAL_RANKINGS: RankingItem[] = [
  { id: 'r-1', nickname: '3학년 1반', score: 380, played_at: new Date().toISOString() },
  { id: 'r-2', nickname: '2학년 2반', score: 350, played_at: new Date().toISOString() },
  { id: 'r-3', nickname: '3학년 4반', score: 320, played_at: new Date().toISOString() },
  { id: 'r-4', nickname: '1학년 3반', score: 290, played_at: new Date().toISOString() },
  { id: 'r-5', nickname: '2학년 7반', score: 270, played_at: new Date().toISOString() },
  { id: 'r-6', nickname: '3학년 6반', score: 250, played_at: new Date().toISOString() },
  { id: 'r-7', nickname: '1학년 5반', score: 240, played_at: new Date().toISOString() },
  { id: 'r-8', nickname: '2학년 5반', score: 220, played_at: new Date().toISOString() },
];
