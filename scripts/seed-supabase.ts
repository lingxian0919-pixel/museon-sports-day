import { createClient } from '@supabase/supabase-js';
import { INITIAL_MATCHES, INITIAL_SPORT_RANKINGS } from '../src/lib/mockData';
import { Match, SportRankingEntry } from '../src/lib/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kcjfffzmijvmqkjtmecu.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjamZmZnptaWp2bXFranRtZWN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyNzU1ODMsImV4cCI6MjEwNjg1MTU4M30.Qp3r_HyErs31Ya1mNaUia5S_BDsaD3l2MNM2gs4oL3w';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function matchToDb(m: Match) {
  return {
    id: m.id,
    sport: m.sport,
    round: m.round,
    team_a: m.teamA,
    team_b: m.teamB,
    score_a: m.scoreA,
    score_b: m.scoreB,
    status: m.status,
    winner_team: m.winnerTeam || null,
    time: m.time || '',
    court: m.court || '',
    points_for_winner: m.pointsForWinner || 100,
    grade: m.grade || 1,
    match_number: m.matchNumber || null,
    match_letter: m.matchLetter || null,
    bracket_label: m.bracketLabel || null,
    source_match_a_id: m.sourceMatchAId || null,
    source_match_b_id: m.sourceMatchBId || null,
    updated_at: new Date().toISOString(),
    version: 1,
  };
}

export function sportRankingToDb(r: SportRankingEntry) {
  return {
    id: r.id,
    sport_id: r.sportId,
    grade: r.grade,
    class_num: r.classNum,
    rank: r.rank,
    record: r.record || '',
    points: r.points,
    updated_at: new Date().toISOString(),
    version: 1,
  };
}

async function main() {
  console.log('Seeding matches...');
  const dbMatches = INITIAL_MATCHES.map(matchToDb);
  
  // Upsert matches in chunks of 20
  for (let i = 0; i < dbMatches.length; i += 20) {
    const chunk = dbMatches.slice(i, i + 20);
    const { error } = await supabase.from('matches').upsert(chunk, { onConflict: 'id' });
    if (error) {
      console.error('Error inserting matches chunk:', error);
      process.exit(1);
    }
  }
  console.log(`Successfully seeded ${dbMatches.length} matches.`);

  console.log('Seeding sport rankings...');
  const dbRankings = INITIAL_SPORT_RANKINGS.map(sportRankingToDb);
  for (let i = 0; i < dbRankings.length; i += 20) {
    const chunk = dbRankings.slice(i, i + 20);
    const { error } = await supabase.from('sport_rankings').upsert(chunk, { onConflict: 'id' });
    if (error) {
      console.error('Error inserting sport rankings chunk:', error);
      process.exit(1);
    }
  }
  console.log(`Successfully seeded ${dbRankings.length} sport rankings.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
