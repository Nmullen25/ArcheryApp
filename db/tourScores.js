const client = require('./client');

const createTourScore = async ({ userId, tournamentId, round1Ends, round1Score, round2Ends, round2Score, totalScore }) => {
  try {
    const { rows: [tourScore] } = await client.query(`
      INSERT INTO tour_scores ("userId", "tournamentId", "round1Ends", "round1Score", "round2Ends", "round2Score", "totalScore")
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `, [userId, tournamentId, round1Ends, round1Score, round2Ends, round2Score, totalScore]);
    return tourScore;
  } catch (error) {
    throw error
  };
};

const updateTourScore = async ({user, tournamentId, roundNumber, endNumber, endScore}) => {

  const updateString = `"round${ roundNumber }Ends" = jsonb_set("round${ roundNumber }Ends", '{end${ endNumber }}', '[${ endScore }]'::jsonb, false)`

// "roundOneEnds" = jsonb_set("roundOneEnds", '{end10}', '[10,9,9]'::jsonb, false)

  try {
    const { rows: [tourScore] } = await client.query(`
      UPDATE tour_scores
      SET ${ updateString }
      WHERE "userId"=$1 AND "tournamentId"=$2
      RETURNING *;
    `, [user, tournamentId]);
    
    return tourScore;
  } catch (error) {
    console.error ("Problem updating score info", error);
  }
};

const getTourScoresByUser = async ({userId}) => {
  try {
    const {rows: tourScores } = await client.query(`
      SELECT *
      FROM tour_scores
      WHERE "userId"=$1;
    `, [userId]);

    const {rows: [user] } = await client.query(`
      SELECT *
      FROM users
      WHERE id=$1;
    `, [userId]);

    const {rows: tournaments } = await client.query(`
      SELECT *
      FROM tournaments
      JOIN tour_scores ON tour_scores."tournamentId"=tournaments.id
    ;`);

    console.log('users50', tourScores);
    console.log('tournaments51', tournaments);

    tourScores.forEach((tourScore) => {
      user.tournament = tournaments.filter(tournament => tournament.id === tourScore.tournamentId && user.id === tourScore.userId)
      user.tourScores = tourScores.filter(tourScore => tourScore.userId === user.id);
    });
    
    return user;
  } catch (error) {
    console.error ("Problem getting user info", error);
  }
};

const getScoresByTour = async (id) => {
  try {
    const { rows: [tournament] } = await client.query(`
       SELECT * FROM tournaments
       WHERE id=$1;
      `,[id]);

    const {rows: tourScores} = await client.query(`
      SELECT * FROM tour_scores
      JOIN tournaments ON tour_scores."tournamentId"=tournaments.id
    `);
    console.log('tournament', tournament);
    tournament.tourScores = tourScores.filter((score) => score.tournamentId === tournament.id);
    console.log('tournament w/ scores', tournament);
    return tournament;
  } catch (error) {
    throw error;
  }
};

const getAllScores = async () => {
  try {
    const { rows: tournaments } = await client.query(`
      SELECT * FROM tournaments;
      `);
      
    const {rows: tourScores} = await client.query(`
      SELECT * FROM tour_scores
      JOIN tournaments ON tour_scores."tournamentId"=tournaments.id
    `);

    tournaments.forEach((tournament) => {
      tournament.scores = tourScores.filter((score) => score.tournamentId == tournament.id);
    })
    console.log('All Tournaments', tournaments);
    
    return tournaments;
  } catch (error) {
    throw error;
  }
};


module.exports = {
  createTourScore,
  updateTourScore,
  getTourScoresByUser,
  getScoresByTour,
  getAllScores
}