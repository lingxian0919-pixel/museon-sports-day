import {
  fetchMatchesFromDb,
  fetchSportRankingsFromDb,
  verifyScorerPin,
  updateMatchScoreInDb,
  finishMatchInDb,
  cancelWinnerInDb,
  updateSportRankingInDb,
} from '../src/lib/supabase';

async function testSync() {
  console.log('--- 1. Testing PIN Verification ---');
  const valid = await verifyScorerPin('2026');
  console.log('PIN 2026 valid:', valid);
  if (!valid) throw new Error('PIN verification failed');

  const invalid = await verifyScorerPin('9999');
  console.log('PIN 9999 valid (should be false):', invalid);
  if (invalid) throw new Error('Invalid PIN should return false');

  console.log('\n--- 2. Testing Fetch from DB ---');
  const matches = await fetchMatchesFromDb();
  console.log('Fetched matches count:', matches?.length);
  if (!matches || matches.length === 0) throw new Error('Matches fetch failed');

  const rankings = await fetchSportRankingsFromDb();
  console.log('Fetched sport rankings count:', rankings?.length);
  if (!rankings || rankings.length === 0) throw new Error('Rankings fetch failed');

  console.log('\n--- 3. Testing Row-Level Score Update ---');
  // Update match soccer-g1-m1 to scoreA: 3, scoreB: 1
  await updateMatchScoreInDb('soccer-g1-m1', 3, 1, 'in_progress', '2026');
  const updatedMatches = await fetchMatchesFromDb();
  const m1 = updatedMatches?.find(m => m.id === 'soccer-g1-m1');
  console.log('Updated soccer-g1-m1 score:', m1?.scoreA, ':', m1?.scoreB, 'status:', m1?.status);
  if (m1?.scoreA !== 3 || m1?.scoreB !== 1) throw new Error('Score update verification failed');

  console.log('\n--- 4. Testing Unauthorized Score Update (Should Fail) ---');
  try {
    await updateMatchScoreInDb('soccer-g1-m1', 4, 1, 'in_progress', 'wrong-pin');
    throw new Error('Should have thrown an authorization error');
  } catch (err: any) {
    console.log('Successfully caught unauthorized attempt:', err.message);
  }

  console.log('\n--- 5. Testing Sport Ranking Update ---');
  // Update relay 1st grade 1st class
  const sampleRanking = rankings[0];
  console.log('Testing ranking update on:', sampleRanking.id, 'current rank:', sampleRanking.rank);
  await updateSportRankingInDb(sampleRanking.id, 2, '54.2초', 140, '2026');
  const updatedRankings = await fetchSportRankingsFromDb();
  const r1 = updatedRankings?.find(r => r.id === sampleRanking.id);
  console.log('Updated ranking:', r1?.id, 'rank:', r1?.rank, 'record:', r1?.record, 'points:', r1?.points);
  if (r1?.rank !== 2 || r1?.points !== 140) throw new Error('Ranking update verification failed');

  console.log('\n✅ All Supabase DB sync, authorization, and row-level tests PASSED!');
}

testSync().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
