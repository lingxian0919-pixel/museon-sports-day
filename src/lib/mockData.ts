import { SportCategory, Match, GradeScore, ClassRanking, Post, RankingItem, SportRankingEntry } from './types';

// 토너먼트 진행 4개 종목
export const TOURNAMENT_SPORT_IDS = ['soccer', 'futsal', 'dodgeball', 'tug_of_war'];
export const isTournamentSport = (sportId: string) => TOURNAMENT_SPORT_IDS.includes(sportId);

// 순위 및 기록 입력형 7개 종목
export const RANKING_SPORT_IDS = [
  'three_legged',
  'jump_rope',
  'relay',
  'ox_quiz',
  'bottle_flip',
  'jegichagi',
  'disc_golf',
];

export const SPORT_CATEGORIES: SportCategory[] = [
  { id: 'three_legged', name: '2인 3각', iconName: 'Users', category: '순위/기록', totalPoints: 160, description: '1등 160pt, 2등 140pt, 3등 120pt, 4등 100pt, 5~7등 80pt' },
  { id: 'soccer', name: '축구', iconName: 'Trophy', category: '토너먼트 (남)', totalPoints: 150, description: '1등 150pt, 2등 130pt, 3등 110pt, 4등 90pt, 5~7등 70pt' },
  { id: 'dodgeball', name: '피구', iconName: 'Flame', category: '토너먼트 (혼성)', totalPoints: 180, description: '1등 180pt, 2등 160pt, 3등 140pt, 4등 120pt, 5~7등 70pt' },
  { id: 'futsal', name: '풋살', iconName: 'Activity', category: '토너먼트 (여)', totalPoints: 150, description: '1등 150pt, 2등 130pt, 3등 110pt, 4등 90pt, 5~7등 70pt' },
  { id: 'jump_rope', name: '단체줄넘기(8자마라톤)', iconName: 'Repeat', category: '순위/기록', totalPoints: 160, description: '1등 160pt, 2등 140pt, 3등 120pt, 4등 100pt, 5~7등 80pt' },
  { id: 'tug_of_war', name: '줄다리기', iconName: 'Users', category: '토너먼트 (혼성)', totalPoints: 200, description: '1등 200pt, 2등 180pt, 3등 160pt, 4등 140pt, 5~7등 120pt' },
  { id: 'relay', name: '이어달리기', iconName: 'Zap', category: '순위/기록', totalPoints: 150, description: '1등 150pt, 2등 130pt, 3등 110pt, 4등 90pt, 5~7등 70pt' },
  { id: 'ox_quiz', name: 'O.X 퀴즈', iconName: 'HelpCircle', category: '순위/기록', totalPoints: 50, description: '1등 50pt, 2등 40pt, 3등 30pt (4~7등 0pt)' },
  { id: 'bottle_flip', name: '물병던지기', iconName: 'Target', category: '순위/기록', totalPoints: 50, description: '1등 50pt, 2등 40pt, 3등 30pt (4~7등 0pt)' },
  { id: 'jegichagi', name: '제기차기', iconName: 'Sparkles', category: '순위/기록', totalPoints: 50, description: '1등 50pt, 2등 40pt, 3등 30pt (4~7등 0pt)' },
  { id: 'disc_golf', name: '디스크 골프', iconName: 'Disc', category: '순위/기록', totalPoints: 50, description: '1등 50pt, 2등 40pt, 3등 30pt (4~7등 0pt)' },
];


// 종목별 코트 및 기본 설정 (사용자 지정 3대 장소: '운동장/트랙', '체육관', '농구장')
export const SPORT_COURTS: Record<string, string> = {
  three_legged: '운동장/트랙',
  soccer: '운동장/트랙',
  dodgeball: '체육관',
  futsal: '농구장',
  jump_rope: '체육관',
  tug_of_war: '운동장/트랙',
  relay: '운동장/트랙',
  ox_quiz: '운동장/트랙',
  bottle_flip: '운동장/트랙',
  jegichagi: '운동장/트랙',
  disc_golf: '운동장/트랙',
};

// 순위제 및 종합 종목별 공식 진행 장소와 시간 정보 반환 함수
export function getSportScheduleInfo(sportId: string, grade?: number): { venue: string; time: string } {
  const venue = SPORT_COURTS[sportId] || '운동장/트랙';

  if (sportId === 'three_legged') {
    return { venue, time: '09:30 ~ 10:00 (전학년)' };
  }
  if (sportId === 'jump_rope') {
    if (grade === 1) return { venue, time: '15:00 ~ 15:30 (1학년)' };
    if (grade === 2) return { venue, time: '11:00 ~ 11:30 (2학년)' };
    if (grade === 3) return { venue, time: '13:30 ~ 14:00 (3학년)' };
    return { venue, time: '학년별 순차 진행 (체육관)' };
  }
  if (sportId === 'relay') {
    return { venue, time: '15:30 ~ 16:00 (폐회 전)' };
  }
  if (sportId === 'ox_quiz') {
    return { venue, time: '12:00 ~ 12:30 (점심 이벤트)' };
  }
  return { venue, time: '체육대회 일정표 기준 진행' };
}

// 종목별 공식 배점표 (1등 ~ 7등) - 사용자 업로드 기준표 정확 반영
export const SPORT_RANK_POINTS_TABLE: Record<string, number[]> = {
  // [1등, 2등, 3등, 4등, 5등, 6등, 7등]
  three_legged: [160, 140, 120, 100, 80, 80, 80],
  soccer: [150, 130, 110, 90, 70, 70, 70],
  dodgeball: [180, 160, 140, 120, 70, 70, 70],
  futsal: [150, 130, 110, 90, 70, 70, 70],
  jump_rope: [160, 140, 120, 100, 80, 80, 80],
  tug_of_war: [200, 180, 160, 140, 120, 120, 120],
  relay: [150, 130, 110, 90, 70, 70, 70],
  ox_quiz: [50, 40, 30, 0, 0, 0, 0],
  bottle_flip: [50, 40, 30, 0, 0, 0, 0],
  jegichagi: [50, 40, 30, 0, 0, 0, 0],
  disc_golf: [50, 40, 30, 0, 0, 0, 0],
};

// 종목 및 순위(1~7)에 따른 공식 배점 반환 함수
export function getRankPoints(sportId: string, rank: number): number {
  if (rank <= 0) return 0;
  const table = SPORT_RANK_POINTS_TABLE[sportId];
  if (!table) return 0;
  const idx = rank - 1;
  if (idx < table.length) {
    return table[idx];
  }
  return table[table.length - 1]; // 7위 이상은 7위 점수 적용
}

// 토너먼트 라운드별 공식 배점 및 뱃지 라벨 반환
export function getTournamentRoundPoints(
  sportId: string,
  round: string
): { points: number; badgeText: string } {
  const table = SPORT_RANK_POINTS_TABLE[sportId] || [150, 130, 110, 90, 70, 70, 70];
  if (round === '결승') {
    return {
      points: table[0], // 1등 배점
      badgeText: `1등 ${table[0]}pt (준우승 ${table[1]}pt)`,
    };
  }
  if (round === '4강') {
    return {
      points: table[2], // 3등 배점 (4강 진출팀 확보 배점 110~90pt)
      badgeText: `4강 ${table[2]}~${table[3]}pt`,
    };
  }
  // 예선 or 8강
  return {
    points: table[4], // 5~7등 기본 참가 배점
    badgeText: `기본 ${table[4]}pt`,
  };
}

// 기존 인터페이스 호환용 계산 함수
export function calculateRankPoints(sportIdOrPoints: string | number, rank: number): number {
  if (typeof sportIdOrPoints === 'string') {
    return getRankPoints(sportIdOrPoints, rank);
  }
  if (rank <= 0) return 0;
  if (sportIdOrPoints === 160) return [160, 140, 120, 100, 80, 80, 80][rank - 1] ?? 80;
  if (sportIdOrPoints === 180) return [180, 160, 140, 120, 70, 70, 70][rank - 1] ?? 70;
  if (sportIdOrPoints === 200) return [200, 180, 160, 140, 120, 120, 120][rank - 1] ?? 120;
  if (sportIdOrPoints === 50) return [50, 40, 30, 0, 0, 0, 0][rank - 1] ?? 0;
  return [150, 130, 110, 90, 70, 70, 70][rank - 1] ?? 70;
}

// 1학년 5학급 전용 대진표 생성 (사용자 지정 대진표 반영)
function generateGrade1Matches(isClean = false): Match[] {
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
  const tournamentSports = SPORT_CATEGORIES.filter((s) => TOURNAMENT_SPORT_IDS.includes(s.id));
  tournamentSports.forEach((sport, sIdx) => {
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

    if (!isClean) {
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
    }

    // 1학년 경기별 공식 시간표 매핑 (사용자 업로드 표 기준)
    const g1MatchTimes: Record<string, { m1: string; m2: string; m3: string; m4: string }> = {
      // 축구(운동장/트랙): ① 10:00 ~ 10:30, ② 10:30 ~ 11:00, ③ 13:30 ~ 14:00, ④ 09:00 ~ 09:30 (결승)
      soccer: { m1: '10:00 ~ 10:30', m2: '10:30 ~ 11:00', m3: '13:30 ~ 14:00', m4: '09:00 ~ 09:30' },
      // 풋살(농구장): ① 12:30 ~ 13:00, ② 13:00 ~ 13:30, ③ 13:30 ~ 14:00, ④ 09:00 ~ 09:30 (결승)
      futsal: { m1: '12:30 ~ 13:00', m2: '13:00 ~ 13:30', m3: '13:30 ~ 14:00', m4: '09:00 ~ 09:30' },
      // 피구(체육관): ① 14:00 ~ 14:30, ② 14:00 ~ 14:30, ③ 14:30 ~ 15:00, ④ 09:30 ~ 10:00 (결승)
      dodgeball: { m1: '14:00 ~ 14:30', m2: '14:00 ~ 14:30', m3: '14:30 ~ 15:00', m4: '09:30 ~ 10:00' },
      // 줄다리기(운동장/트랙): 트랙 전용 진행
      tug_of_war: { m1: '10:30 ~ 11:00', m2: '11:00 ~ 11:30', m3: '13:30 ~ 14:00', m4: '10:30 ~ 11:00' },
    };
    const times = g1MatchTimes[sport.id] || { m1: '10:00 ~ 10:30', m2: '10:30 ~ 11:00', m3: '13:30 ~ 14:00', m4: '09:00 ~ 09:30' };

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
      time: times.m1,
      court,
      pointsForWinner: getTournamentRoundPoints(sport.id, '예선').points,
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
      time: times.m2,
      court,
      pointsForWinner: getTournamentRoundPoints(sport.id, '4강').points,
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
      time: times.m3,
      court,
      pointsForWinner: getTournamentRoundPoints(sport.id, '4강').points,
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
      time: times.m4,
      court,
      pointsForWinner: getTournamentRoundPoints(sport.id, '결승').points,
      sourceMatchAId: m2Id,
      sourceMatchBId: m3Id,
    });
  });

  return matches;
}

// 2학년 7학급 대진표 생성 (사용자 제공 도면 media_1791380819346.png 반영)
// 구조: ⓒ, ⓑ, ⓐ -> ⓔ(ⓒ승자 vs ⓑ승자), ⓓ(ⓐ승자 vs 부전승팀) -> ⓕ(ⓔ승자 vs ⓓ승자)
function generateGrade2Matches(isClean = false): Match[] {
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
  const tournamentSports = SPORT_CATEGORIES.filter((s) => TOURNAMENT_SPORT_IDS.includes(s.id));
  tournamentSports.forEach((sport, sIdx) => {
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

    if (!isClean) {
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
    }

    // 2학년 경기별 공식 시간표 매핑 (사용자 업로드 표 기준)
    const g2MatchTimes: Record<string, { mc: string; mb: string; ma: string; me: string; md: string; mf: string }> = {
      // 축구(운동장/트랙): ⓒ 사전경기, ⓑ 사전경기, ⓐ 사전경기, ⓔ 12:30~13:00, ⓓ 13:00~13:30, ⓕ 10:00~10:30 (결승)
      soccer: {
        mc: '사전경기',
        mb: '사전경기',
        ma: '사전경기',
        me: '12:30 ~ 13:00',
        md: '13:00 ~ 13:30',
        mf: '10:00 ~ 10:30',
      },
      // 풋살(농구장): ⓒ 사전경기, ⓑ 사전경기, ⓐ 사전경기, ⓓ 14:00~14:30, ⓔ 14:30~15:00, ⓕ 10:00~10:30 (결승)
      futsal: {
        mc: '사전경기',
        mb: '사전경기',
        ma: '사전경기',
        me: '14:30 ~ 15:00',
        md: '14:00 ~ 14:30',
        mf: '10:00 ~ 10:30',
      },
      // 피구(체육관): ⓐ, ⓑ 10:00~10:30 / ⓒ, ⓓ 10:30~11:00 / ⓔ 09:00~09:30 / ⓕ 09:30~10:00 (결승)
      dodgeball: {
        mc: '10:30 ~ 11:00',
        mb: '10:00 ~ 10:30',
        ma: '10:00 ~ 10:30',
        me: '09:00 ~ 09:30',
        md: '10:30 ~ 11:00',
        mf: '09:30 ~ 10:00',
      },
      // 줄다리기(운동장/트랙): 트랙 전용 진행
      tug_of_war: {
        mc: '11:00 ~ 11:30',
        mb: '11:30 ~ 12:00',
        ma: '12:30 ~ 13:00',
        me: '13:30 ~ 14:00',
        md: '14:00 ~ 14:30',
        mf: '10:30 ~ 11:00',
      },
    };
    const times = g2MatchTimes[sport.id] || {
      mc: '09:30 ~ 10:00',
      mb: '10:00 ~ 10:30',
      ma: '10:30 ~ 11:00',
      me: '12:30 ~ 13:00',
      md: '13:00 ~ 13:30',
      mf: '10:00 ~ 10:30',
    };

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
      time: times.mc,
      court,
      pointsForWinner: getTournamentRoundPoints(sport.id, '8강').points,
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
      time: times.mb,
      court,
      pointsForWinner: getTournamentRoundPoints(sport.id, '8강').points,
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
      time: times.ma,
      court,
      pointsForWinner: getTournamentRoundPoints(sport.id, '8강').points,
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
      time: times.me,
      court,
      pointsForWinner: getTournamentRoundPoints(sport.id, '4강').points,
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
      time: times.md,
      court,
      pointsForWinner: getTournamentRoundPoints(sport.id, '4강').points,
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
      time: times.mf,
      court,
      pointsForWinner: getTournamentRoundPoints(sport.id, '결승').points,
      sourceMatchAId: meId,
      sourceMatchBId: mdId,
    });
  });

  return matches;
}

// 3학년 6학급 대진표 생성 (사용자 제공 도면 media_1791381767024.png 반영)
// ㉢: 좌측 4강 1경기 (승자가 결승 ㉤ 직행)
// ㉡: 우측 8강 1경기, ㉠: 우측 8강 2경기 -> ㉣: 우측 4강 2경기 (㉡승자 vs ㉠승자)
// ㉤: 결승전 (㉢승자 vs ㉣승자)
function generateGrade3Matches(isClean = false): Match[] {
  const customG3Seeds: Record<
    string,
    { mcA: number; mcB: number; mbA: number; mbB: number; maA: number; maB: number }
  > = {
    // 축구(남): ㉢ 4 vs 2, ㉡ 1 vs 3, ㉠ 6 vs 5
    soccer: { mcA: 4, mcB: 2, mbA: 1, mbB: 3, maA: 6, maB: 5 },
    // 풋살(여): ㉢ 6 vs 2, ㉡ 4 vs 3, ㉠ 1 vs 5
    futsal: { mcA: 6, mcB: 2, mbA: 4, mbB: 3, maA: 1, maB: 5 },
    // 피구(혼성): ㉢ 4 vs 5, ㉡ 6 vs 2, ㉠ 3 vs 1
    dodgeball: { mcA: 4, mcB: 5, mbA: 6, mbB: 2, maA: 3, maB: 1 },
    // 줄다리기(혼성): ㉢ 4 vs 2, ㉡ 3 vs 6, ㉠ 5 vs 1
    tug_of_war: { mcA: 4, mcB: 2, mbA: 3, mbB: 6, maA: 5, maB: 1 },
  };

  const defaultG3Seeds = [
    { mcA: 1, mcB: 6, mbA: 2, mbB: 5, maA: 3, maB: 4 },
    { mcA: 2, mcB: 5, mbA: 1, mbB: 4, maA: 3, maB: 6 },
    { mcA: 1, mcB: 2, mbA: 3, mbB: 4, maA: 5, maB: 6 },
    { mcA: 3, mcB: 5, mbA: 1, mbB: 6, maA: 2, maB: 4 },
    { mcA: 2, mcB: 6, mbA: 1, mbB: 3, maA: 4, maB: 5 },
    { mcA: 1, mcB: 5, mbA: 2, mbB: 4, maA: 3, maB: 6 },
    { mcA: 3, mcB: 6, mbA: 1, mbB: 5, maA: 2, maB: 4 },
  ];

  const matches: Match[] = [];
  const tournamentSports = SPORT_CATEGORIES.filter((s) => TOURNAMENT_SPORT_IDS.includes(s.id));
  tournamentSports.forEach((sport, sIdx) => {
    const seed = customG3Seeds[sport.id] || defaultG3Seeds[sIdx % defaultG3Seeds.length];
    const court = SPORT_COURTS[sport.id] || '체육관';
    const pts = sport.totalPoints;
    const base = `${sport.id}-g3`;

    const mbId = `${base}-mb`;
    const maId = `${base}-ma`;
    const mcId = `${base}-mc`;
    const mdId = `${base}-md`;
    const meId = `${base}-me`;

    // 기본 초기 진행 상태 및 점수 설정
    let mbStatus: Match['status'] = 'scheduled';
    let mbScoreA = 0, mbScoreB = 0;
    let mbWinner: Match['winnerTeam'] = undefined;

    let maStatus: Match['status'] = 'scheduled';
    let maScoreA = 0, maScoreB = 0;
    let maWinner: Match['winnerTeam'] = undefined;

    let mcStatus: Match['status'] = 'scheduled';
    let mcScoreA = 0, mcScoreB = 0;
    let mcWinner: Match['winnerTeam'] = undefined;

    let mdStatus: Match['status'] = 'scheduled';
    let mdScoreA = 0, mdScoreB = 0;
    let mdTeamA = { name: '㉡ 8강 1경기 승자', grade: 3, classNum: 0 };
    let mdTeamB = { name: '㉠ 8강 2경기 승자', grade: 3, classNum: 0 };

    let meStatus: Match['status'] = 'scheduled';
    let meScoreA = 0, meScoreB = 0;
    let meTeamA = { name: '㉢ 4강 1경기 승자', grade: 3, classNum: 0 };
    let meTeamB = { name: '㉣ 4강 2경기 승자', grade: 3, classNum: 0 };

    if (!isClean) {
      if (sport.id === 'soccer') {
        // 축구: ㉢ 진행중(4반 vs 2반 2:1), ㉡ 종료(1반 승), ㉠ 종료(6반 승), ㉣ 진행중(1반 vs 6반 1:0)
        mcStatus = 'in_progress';
        mcScoreA = 2; mcScoreB = 1;

        mbStatus = 'completed';
        mbScoreA = 3; mbScoreB = 1;
        mbWinner = 'teamA';
        mdTeamA = { name: `3학년 ${seed.mbA}반`, grade: 3, classNum: seed.mbA };

        maStatus = 'completed';
        maScoreA = 2; maScoreB = 1;
        maWinner = 'teamA';
        mdTeamB = { name: `3학년 ${seed.maA}반`, grade: 3, classNum: seed.maA };

        mdStatus = 'in_progress';
        mdScoreA = 1; mdScoreB = 0;
      } else if (sport.id === 'futsal') {
        // 풋살: ㉢ 종료(6반 승), ㉡ 진행중(4반 vs 3반 2:2), ㉠ 종료(1반 승)
        mcStatus = 'completed';
        mcScoreA = 3; mcScoreB = 1;
        mcWinner = 'teamA';
        meTeamA = { name: `3학년 ${seed.mcA}반`, grade: 3, classNum: seed.mcA };

        mbStatus = 'in_progress';
        mbScoreA = 2; mbScoreB = 2;

        maStatus = 'completed';
        maScoreA = 4; maScoreB = 2;
        maWinner = 'teamA';
        mdTeamB = { name: `3학년 ${seed.maA}반`, grade: 3, classNum: seed.maA };
      } else if (sport.id === 'dodgeball') {
        // 피구: ㉢ 종료(4반 승), ㉡ 종료(6반 승), ㉠ 진행중(3반 vs 1반 11:10)
        mcStatus = 'completed';
        mcScoreA = 15; mcScoreB = 12;
        mcWinner = 'teamA';
        meTeamA = { name: `3학년 ${seed.mcA}반`, grade: 3, classNum: seed.mcA };

        mbStatus = 'completed';
        mbScoreA = 14; mbScoreB = 10;
        mbWinner = 'teamA';
        mdTeamA = { name: `3학년 ${seed.mbA}반`, grade: 3, classNum: seed.mbA };

        maStatus = 'in_progress';
        maScoreA = 11; maScoreB = 10;
        mdStatus = 'in_progress';
      } else if (sport.id === 'tug_of_war') {
        // 줄다리기: ㉢ 진행중(4반 vs 2반 1:0)
        mcStatus = 'in_progress';
        mcScoreA = 1; mcScoreB = 0;
      }
    }

    // 3학년 경기별 공식 시간표 매핑 (사용자 업로드 표 기준)
    const g3MatchTimes: Record<string, { mb: string; ma: string; mc: string; md: string; me: string }> = {
      // 축구(운동장/트랙): ㉡ 11:00~11:30, ㉠ 14:00~14:30, ㉢ 14:30~15:00, ㉣ 15:00~15:30, ㉤ 09:30~10:00 (결승)
      soccer: {
        mb: '11:00 ~ 11:30',
        ma: '14:00 ~ 14:30',
        mc: '14:30 ~ 15:00',
        md: '15:00 ~ 15:30',
        me: '09:30 ~ 10:00',
      },
      // 풋살(농구장): ㉠ 10:00~10:30, ㉡ 10:30~11:00, ㉢ 11:00~11:30, ㉣ 15:00~15:30, ㉤ 09:30~10:00 (결승)
      futsal: {
        mb: '10:30 ~ 11:00',
        ma: '10:00 ~ 10:30',
        mc: '11:00 ~ 11:30',
        md: '15:00 ~ 15:30',
        me: '09:30 ~ 10:00',
      },
      // 피구(체육관): ㉠, ㉡ 12:30~13:00 / ㉢ 13:00~13:30 / ㉣ 09:00~09:30 / ㉤ 10:00~10:30 (결승)
      dodgeball: {
        mb: '12:30 ~ 13:00',
        ma: '12:30 ~ 13:00',
        mc: '13:00 ~ 13:30',
        md: '09:00 ~ 09:30',
        me: '10:00 ~ 10:30',
      },
      // 줄다리기(운동장/트랙): 트랙 전용 진행
      tug_of_war: {
        mb: '11:00 ~ 11:30',
        ma: '11:30 ~ 12:00',
        mc: '13:00 ~ 13:30',
        md: '13:30 ~ 14:00',
        me: '10:30 ~ 11:00',
      },
    };
    const times = g3MatchTimes[sport.id] || {
      mb: '11:00 ~ 11:30',
      ma: '14:00 ~ 14:30',
      mc: '14:30 ~ 15:00',
      md: '15:00 ~ 15:30',
      me: '09:30 ~ 10:00',
    };

    // ㉡ 8강 1경기 (mb)
    matches.push({
      id: mbId,
      sport: sport.id,
      grade: 3,
      matchNumber: 1,
      matchLetter: 'ㄴ',
      bracketLabel: '㉡ 8강 1경기',
      round: '8강',
      teamA: { name: `3학년 ${seed.mbA}반`, grade: 3, classNum: seed.mbA },
      teamB: { name: `3학년 ${seed.mbB}반`, grade: 3, classNum: seed.mbB },
      scoreA: mbScoreA,
      scoreB: mbScoreB,
      status: mbStatus,
      winnerTeam: mbWinner,
      time: times.mb,
      court,
      pointsForWinner: getTournamentRoundPoints(sport.id, '8강').points,
    });

    // ㉠ 8강 2경기 (ma)
    matches.push({
      id: maId,
      sport: sport.id,
      grade: 3,
      matchNumber: 2,
      matchLetter: 'ㄱ',
      bracketLabel: '㉠ 8강 2경기',
      round: '8강',
      teamA: { name: `3학년 ${seed.maA}반`, grade: 3, classNum: seed.maA },
      teamB: { name: `3학년 ${seed.maB}반`, grade: 3, classNum: seed.maB },
      scoreA: maScoreA,
      scoreB: maScoreB,
      status: maStatus,
      winnerTeam: maWinner,
      time: times.ma,
      court,
      pointsForWinner: getTournamentRoundPoints(sport.id, '8강').points,
    });

    // ㉢ 4강 1경기 (mc): 좌측 준결승 (승자가 결승 ㉤ 직행)
    matches.push({
      id: mcId,
      sport: sport.id,
      grade: 3,
      matchNumber: 3,
      matchLetter: 'ㄷ',
      bracketLabel: '㉢ 4강 1경기',
      round: '4강',
      teamA: { name: `3학년 ${seed.mcA}반`, grade: 3, classNum: seed.mcA },
      teamB: { name: `3학년 ${seed.mcB}반`, grade: 3, classNum: seed.mcB },
      scoreA: mcScoreA,
      scoreB: mcScoreB,
      status: mcStatus,
      winnerTeam: mcWinner,
      time: times.mc,
      court,
      pointsForWinner: getTournamentRoundPoints(sport.id, '4강').points,
    });

    // ㉣ 4강 2경기 (md): ㉡ 승자 vs ㉠ 승자
    matches.push({
      id: mdId,
      sport: sport.id,
      grade: 3,
      matchNumber: 4,
      matchLetter: 'ㄹ',
      bracketLabel: '㉣ 4강 2경기',
      round: '4강',
      teamA: mdTeamA,
      teamB: mdTeamB,
      scoreA: mdScoreA,
      scoreB: mdScoreB,
      status: mdStatus,
      time: times.md,
      court,
      pointsForWinner: getTournamentRoundPoints(sport.id, '4강').points,
      sourceMatchAId: mbId,
      sourceMatchBId: maId,
    });

    // ㉤ 결승전 (me): ㉢ 승자 vs ㉣ 승자
    matches.push({
      id: meId,
      sport: sport.id,
      grade: 3,
      matchNumber: 5,
      matchLetter: 'ㅁ',
      bracketLabel: '㉤ 결승전 (FINAL)',
      round: '결승',
      teamA: meTeamA,
      teamB: meTeamB,
      scoreA: meScoreA,
      scoreB: meScoreB,
      status: meStatus,
      time: times.me,
      court,
      pointsForWinner: getTournamentRoundPoints(sport.id, '결승').points,
      sourceMatchAId: mcId,
      sourceMatchBId: mdId,
    });
  });

  return matches;
}

export function generateCleanMatches(): Match[] {
  return [
    ...generateGrade1Matches(true),
    ...generateGrade2Matches(true),
    ...generateGrade3Matches(true),
  ];
}

export const INITIAL_MATCHES: Match[] = [
  ...generateGrade1Matches(),
  ...generateGrade2Matches(),
  ...generateGrade3Matches(),
];




// 순위형 7개 종목 초기 학급별 순위 및 기록 데이터 생성
export function generateInitialSportRankings(): SportRankingEntry[] {
  const rankings: SportRankingEntry[] = [];
  const grades = [
    { grade: 1, classCount: 5 },
    { grade: 2, classCount: 7 },
    { grade: 3, classCount: 6 },
  ];

  // 종목별 실감나는 초기 기록 및 순위 프리셋
  const presetRecords: Record<string, Record<string, { rank: number; record: string }>> = {
    relay: {
      'g1-c3': { rank: 1, record: '56.2초' },
      'g1-c1': { rank: 2, record: '58.1초' },
      'g1-c5': { rank: 3, record: '59.4초' },
      'g1-c2': { rank: 4, record: '1분 02초' },
      'g1-c4': { rank: 5, record: '1분 05초' },
      'g2-c2': { rank: 1, record: '50.8초' },
      'g2-c7': { rank: 2, record: '51.5초' },
      'g2-c5': { rank: 3, record: '53.0초' },
      'g3-c1': { rank: 1, record: '48.3초' },
      'g3-c4': { rank: 2, record: '49.1초' },
      'g3-c6': { rank: 3, record: '50.5초' },
    },
    jump_rope: {
      'g1-c2': { rank: 1, record: '95회' },
      'g1-c5': { rank: 2, record: '82회' },
      'g1-c3': { rank: 3, record: '70회' },
      'g2-c3': { rank: 1, record: '112회' },
      'g2-c5': { rank: 2, record: '98회' },
      'g3-c1': { rank: 1, record: '124회' },
      'g3-c2': { rank: 2, record: '115회' },
    },
    three_legged: {
      'g1-c4': { rank: 1, record: '32.1초' },
      'g1-c2': { rank: 2, record: '34.8초' },
      'g2-c2': { rank: 1, record: '28.4초' },
      'g3-c1': { rank: 1, record: '26.9초' },
    },
    ox_quiz: {
      'g1-c3': { rank: 1, record: '생존 3명' },
      'g2-c1': { rank: 1, record: '생존 4명' },
      'g3-c3': { rank: 1, record: '생존 5명' },
    },
    bottle_flip: {
      'g1-c5': { rank: 1, record: '14개 성공' },
      'g2-c6': { rank: 1, record: '18개 성공' },
      'g3-c5': { rank: 1, record: '21개 성공' },
    },
    jegichagi: {
      'g1-c3': { rank: 1, record: '합산 48회' },
      'g2-c5': { rank: 1, record: '합산 62회' },
      'g3-c6': { rank: 1, record: '합산 75회' },
    },
    disc_golf: {
      'g1-c1': { rank: 1, record: '12홀 24타' },
      'g2-c4': { rank: 1, record: '12홀 21타' },
      'g3-c2': { rank: 1, record: '12홀 19타' },
    },
  };

  RANKING_SPORT_IDS.forEach((sportId) => {
    const sport = SPORT_CATEGORIES.find((s) => s.id === sportId);
    const totalPts = sport?.totalPoints || 100;
    const presets = presetRecords[sportId] || {};

    grades.forEach(({ grade, classCount }) => {
      for (let c = 1; c <= classCount; c++) {
        const key = `g${grade}-c${c}`;
        const preset = presets[key];
        const rank = preset ? preset.rank : 0;
        const record = preset ? preset.record : '';
        const points = getRankPoints(sportId, rank);

        rankings.push({
          id: `${sportId}-g${grade}-c${c}`,
          sportId,
          grade,
          classNum: c,
          rank,
          record,
          points,
        });
      }
    });
  });

  return rankings;
}

export function generateCleanSportRankings(): SportRankingEntry[] {
  const rankings: SportRankingEntry[] = [];
  const grades = [
    { grade: 1, classCount: 5 },
    { grade: 2, classCount: 7 },
    { grade: 3, classCount: 6 },
  ];

  RANKING_SPORT_IDS.forEach((sportId) => {
    grades.forEach(({ grade, classCount }) => {
      for (let c = 1; c <= classCount; c++) {
        rankings.push({
          id: `${sportId}-g${grade}-c${c}`,
          sportId,
          grade,
          classNum: c,
          rank: 0,
          record: '',
          points: 0,
        });
      }
    });
  });

  return rankings;
}

export const INITIAL_SPORT_RANKINGS: SportRankingEntry[] = generateInitialSportRankings();

export function generateCleanGradeScores(): GradeScore[] {
  return [
    { grade: 1, totalScore: 0, goldMedals: 0, silverMedals: 0, bronzeMedals: 0, classesCount: 5 },
    { grade: 2, totalScore: 0, goldMedals: 0, silverMedals: 0, bronzeMedals: 0, classesCount: 7 },
    { grade: 3, totalScore: 0, goldMedals: 0, silverMedals: 0, bronzeMedals: 0, classesCount: 6 },
  ];
}

// 학년별 총점 (1학년 5팀, 2학년 7팀, 3학년 6팀)
export const INITIAL_GRADE_SCORES: GradeScore[] = [
  { grade: 1, totalScore: 970, goldMedals: 2, silverMedals: 2, bronzeMedals: 1, classesCount: 5 },
  { grade: 2, totalScore: 1470, goldMedals: 3, silverMedals: 3, bronzeMedals: 3, classesCount: 7 },
  { grade: 3, totalScore: 1430, goldMedals: 4, silverMedals: 3, bronzeMedals: 2, classesCount: 6 },
];

export function generateCleanClassRankings(): ClassRanking[] {
  const rankings: ClassRanking[] = [];
  const grades = [
    { grade: 1, count: 5 },
    { grade: 2, count: 7 },
    { grade: 3, count: 6 },
  ];
  let rank = 1;
  grades.forEach(({ grade, count }) => {
    for (let c = 1; c <= count; c++) {
      rankings.push({
        rank,
        grade,
        classNum: c,
        score: 0,
        wins: 0,
        losses: 0,
      });
      rank++;
    }
  });
  return rankings;
}

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

// ==========================================
// 종목별 각 반별 포인트 계산 함수군 (실시간 연동)
// ==========================================

export function calcTournamentPoints(
  sportId: string,
  grade: number,
  classNum: number,
  matches: Match[]
): number {
  const table = SPORT_RANK_POINTS_TABLE[sportId] || [150, 130, 110, 90, 70, 70, 70];
  const gradeMatches = matches.filter((m) => m.sport === sportId && m.grade === grade);
  const finalMatch = gradeMatches.find((m) => m.round === '결승');

  // 1. 결승전 완료된 경우
  if (finalMatch && finalMatch.status === 'completed') {
    if (
      (finalMatch.winnerTeam === 'teamA' && finalMatch.teamA.classNum === classNum) ||
      (finalMatch.winnerTeam === 'teamB' && finalMatch.teamB.classNum === classNum)
    ) {
      return table[0]; // 1등 (우승)
    }
    if (
      (finalMatch.winnerTeam === 'teamA' && finalMatch.teamB.classNum === classNum) ||
      (finalMatch.winnerTeam === 'teamB' && finalMatch.teamA.classNum === classNum)
    ) {
      return table[1]; // 2등 (준우승)
    }
  }

  // 2. 결승전 진출팀 (결승 아직 진행중 또는 예정)
  if (
    finalMatch &&
    (finalMatch.teamA.classNum === classNum || finalMatch.teamB.classNum === classNum)
  ) {
    return table[1]; // 최소 2등 준우승 배점 확보
  }

  // 3. 4강전에서 탈락한 팀 확인
  const semiMatches = gradeMatches.filter((m) => m.round === '4강');
  const lostSemi = semiMatches.find(
    (m) =>
      m.status === 'completed' &&
      ((m.winnerTeam === 'teamA' && m.teamB.classNum === classNum) ||
        (m.winnerTeam === 'teamB' && m.teamA.classNum === classNum))
  );

  if (lostSemi) {
    // 4강 탈락팀들 간의 3등 vs 4등 배점 산정
    const completedSemiLosers = semiMatches
      .filter((m) => m.status === 'completed')
      .map((m) => {
        const isA = m.winnerTeam === 'teamA';
        const loserClass = isA ? m.teamB.classNum : m.teamA.classNum;
        const loserScore = isA ? m.scoreB : m.scoreA;
        const winnerScore = isA ? m.scoreA : m.scoreB;
        return {
          classNum: loserClass,
          diff: loserScore - winnerScore,
          score: loserScore,
        };
      })
      .sort((a, b) => (b.diff !== a.diff ? b.diff - a.diff : b.score - a.score));

    const loserIndex = completedSemiLosers.findIndex((l) => l.classNum === classNum);
    if (loserIndex === 0) {
      return table[2]; // 3위 배점
    } else if (loserIndex === 1) {
      return table[3]; // 4위 배점
    }
    return table[2];
  }

  // 4강 승리팀 (아직 결승 카드에 반영되기 전이라도 최소 2위 확보)
  const wonSemi = semiMatches.find(
    (m) =>
      m.status === 'completed' &&
      ((m.winnerTeam === 'teamA' && m.teamA.classNum === classNum) ||
        (m.winnerTeam === 'teamB' && m.teamB.classNum === classNum))
  );
  if (wonSemi) {
    return table[1];
  }

  // 4. 8강/예선 탈락팀 확인
  const earlyMatches = gradeMatches.filter((m) => m.round === '8강' || m.round === '예선');
  const lostEarly = earlyMatches.find(
    (m) =>
      m.status === 'completed' &&
      ((m.winnerTeam === 'teamA' && m.teamB.classNum === classNum) ||
        (m.winnerTeam === 'teamB' && m.teamA.classNum === classNum))
  );

  if (lostEarly) {
    return table[4]; // 5~7등 기본 참가 배점
  }

  // 8강/예선 승리팀 (최소 4강 확보)
  const wonEarly = earlyMatches.find(
    (m) =>
      m.status === 'completed' &&
      ((m.winnerTeam === 'teamA' && m.teamA.classNum === classNum) ||
        (m.winnerTeam === 'teamB' && m.teamB.classNum === classNum))
  );
  if (wonEarly) {
    return table[3];
  }

  return 0; // 아직 경기 미진행 또는 대기중
}

export function calcRankingSportPoints(
  sportId: string,
  grade: number,
  classNum: number,
  sportRankings: SportRankingEntry[]
): number {
  const entry = sportRankings.find(
    (r) => r.sportId === sportId && r.grade === grade && r.classNum === classNum
  );
  if (!entry || entry.rank <= 0) return 0;
  return entry.points;
}

export function calcClassSportScore(
  sportId: string,
  grade: number,
  classNum: number,
  matches: Match[],
  sportRankings: SportRankingEntry[]
): number {
  if (isTournamentSport(sportId)) {
    return calcTournamentPoints(sportId, grade, classNum, matches);
  }
  return calcRankingSportPoints(sportId, grade, classNum, sportRankings);
}

export function calcClassSportScoreDetail(
  sportId: string,
  grade: number,
  classNum: number,
  matches: Match[],
  sportRankings: SportRankingEntry[]
): { score: number; detail: string; badge?: string } {
  if (isTournamentSport(sportId)) {
    const score = calcTournamentPoints(sportId, grade, classNum, matches);
    const table = SPORT_RANK_POINTS_TABLE[sportId] || [150, 130, 110, 90, 70, 70, 70];
    if (score === table[0] && score > 0) {
      return { score, detail: `🥇 1위 우승 (${score}pt)`, badge: '우승' };
    }
    if (score === table[1]) {
      return { score, detail: `🥈 2위 준우승 (${score}pt)`, badge: '준우승' };
    }
    if (score === table[2]) {
      return { score, detail: `🥉 3위 (${score}pt)`, badge: '3위' };
    }
    if (score === table[3]) {
      return { score, detail: `4위 (${score}pt)`, badge: '4위' };
    }
    if (score === table[4]) {
      return { score, detail: `예선/8강 참가 (${score}pt)`, badge: '참가' };
    }
    return { score: 0, detail: '경기 대기중 (0pt)' };
  } else {
    const entry = sportRankings.find(
      (r) => r.sportId === sportId && r.grade === grade && r.classNum === classNum
    );
    if (!entry || entry.rank <= 0) {
      return { score: 0, detail: '순위 대기중 (0pt)' };
    }
    const badges: Record<number, string> = { 1: '🥇 1위', 2: '🥈 2위', 3: '🥉 3위' };
    const badge = badges[entry.rank] || `${entry.rank}위`;
    return {
      score: entry.points,
      detail: `${badge} (${entry.points}pt)${entry.record ? ` - ${entry.record}` : ''}`,
      badge,
    };
  }
}

// 18개 학급 및 3개 학년 종합 점수/순위 일괄 재계산 함수
export function recalculateAllScores(
  matches: Match[],
  sportRankings: SportRankingEntry[]
): { classRankings: ClassRanking[]; gradeScores: GradeScore[] } {
  const ALL_CLASSES = [
    { grade: 1, classes: [1, 2, 3, 4, 5] },
    { grade: 2, classes: [1, 2, 3, 4, 5, 6, 7] },
    { grade: 3, classes: [1, 2, 3, 4, 5, 6] },
  ];

  const classRankings: ClassRanking[] = [];
  const gradeTotals: Record<number, { totalScore: number; gold: number; silver: number; bronze: number }> = {
    1: { totalScore: 0, gold: 0, silver: 0, bronze: 0 },
    2: { totalScore: 0, gold: 0, silver: 0, bronze: 0 },
    3: { totalScore: 0, gold: 0, silver: 0, bronze: 0 },
  };

  ALL_CLASSES.forEach(({ grade, classes }) => {
    classes.forEach((cNum) => {
      let totalScore = 0;
      let wins = 0;
      let losses = 0;

      SPORT_CATEGORIES.forEach((sport) => {
        const score = calcClassSportScore(sport.id, grade, cNum, matches, sportRankings);
        totalScore += score;
      });

      // 토너먼트 경기 승패 집계
      matches.forEach((m) => {
        if (m.grade === grade && m.status === 'completed') {
          if (m.winnerTeam === 'teamA') {
            if (m.teamA.classNum === cNum) wins++;
            if (m.teamB.classNum === cNum) losses++;
          } else if (m.winnerTeam === 'teamB') {
            if (m.teamB.classNum === cNum) wins++;
            if (m.teamA.classNum === cNum) losses++;
          }
        }
      });

      // 순위제 종목 1위 우승 집계
      sportRankings.forEach((r) => {
        if (r.grade === grade && r.classNum === cNum && r.rank === 1) {
          wins++;
        }
      });

      classRankings.push({
        rank: 1,
        grade,
        classNum: cNum,
        score: totalScore,
        wins,
        losses,
      });

      gradeTotals[grade].totalScore += totalScore;
    });
  });

  // 점수 내림차순, 승수 내림차순 정렬 후 순위 부여
  classRankings.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.wins - a.wins;
  });
  classRankings.forEach((cr, idx) => {
    cr.rank = idx + 1;
  });

  // 메달 개수 집계
  SPORT_CATEGORIES.forEach((sport) => {
    if (isTournamentSport(sport.id)) {
      [1, 2, 3].forEach((g) => {
        const gMatches = matches.filter((m) => m.sport === sport.id && m.grade === g);
        const finalMatch = gMatches.find((m) => m.round === '결승');
        if (finalMatch && finalMatch.status === 'completed') {
          gradeTotals[g].gold++;
          gradeTotals[g].silver++;
        }
      });
    } else {
      sportRankings.forEach((r) => {
        if (r.sportId === sport.id) {
          if (r.rank === 1) gradeTotals[r.grade].gold++;
          if (r.rank === 2) gradeTotals[r.grade].silver++;
          if (r.rank === 3) gradeTotals[r.grade].bronze++;
        }
      });
    }
  });

  const gradeScores: GradeScore[] = [
    { grade: 1, totalScore: gradeTotals[1].totalScore, goldMedals: gradeTotals[1].gold, silverMedals: gradeTotals[1].silver, bronzeMedals: gradeTotals[1].bronze, classesCount: 5 },
    { grade: 2, totalScore: gradeTotals[2].totalScore, goldMedals: gradeTotals[2].gold, silverMedals: gradeTotals[2].silver, bronzeMedals: gradeTotals[2].bronze, classesCount: 7 },
    { grade: 3, totalScore: gradeTotals[3].totalScore, goldMedals: gradeTotals[3].gold, silverMedals: gradeTotals[3].silver, bronzeMedals: gradeTotals[3].bronze, classesCount: 6 },
  ];

  return { classRankings, gradeScores };
}


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
