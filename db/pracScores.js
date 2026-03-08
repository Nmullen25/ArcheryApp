const client = require('./client');

const createPracRound = async ({ userId, roundEnds, arrowsPerEnd, maxArrowValue, roundScore, roundType, maxScore }) => {
  try {
    const { rows: [prac_score] } = await client.query(`
      INSERT INTO prac_scores ("userId", "roundEnds", "arrowsPerEnd", "maxArrowValue", "roundScore", "roundType", "maxScore")
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `, [userId, roundEnds, arrowsPerEnd, maxArrowValue, roundScore, roundType, maxScore]);
    return prac_score;
  } catch (error) {
    throw error
  };
};

const updatePracScore = async ({user, pracScoreId, endNumber, endScore}) => {

  const updateString = `"roundEnds" = jsonb_set("roundEnds", '{end${ endNumber }}', '[${ endScore }]'::jsonb, false)`

// "roundOneEnds" = jsonb_set("roundOneEnds", '{end10}', '[10,9,9]'::jsonb, false)

  try {
    const { rows: [prac_score] } = await client.query(`
      UPDATE prac_scores
      SET ${ updateString }
      WHERE "userId"=$1 AND prac_score.id=$2
      RETURNING *;
    `, [user, pracScoreId]);
    
    return prac_score;
  } catch (error) {
    console.error ("Problem updating score info", error);
  }
};

const getPracScoresByUser = async (userId) => {
  try {
    const {rows: prac_scores } = await client.query(`
      SELECT *
      FROM prac_scores
      WHERE "userId"=$1;
    `, [userId]);

    const {rows: [user] } = await client.query(`
      SELECT *
      FROM users
      WHERE id=$1;
    `, [userId]);

    console.log('user', user);
    console.log('Practice Scores', prac_scores);

    // const userPracScores = prac_scores.filter(prac_score => prac_score.userId === user.id);

    user.pracScores = prac_scores;

    console.log('user82', user)
    console.log('userT99', user.pracScores)

    
    return user;
  } catch (error) {
    console.error ("Problem getting user info", error);
  }
};

// const getScoresByPrac = async (id) => {
//   try {
//     const { rows: [tournament] } = await client.query(`
//        SELECT * FROM tournaments
//        WHERE id=$1;
//       `,[id]);

//     const {rows: pracScores} = await client.query(`
//       SELECT * FROM tour_scores
//       JOIN tournaments ON tour_scores."tournamentId"=tournaments.id
//     `);
//     console.log('tournament', tournament);
//     tournament.pracScores = tourScores.filter((score) => score.tournamentId === tournament.id);
//     console.log('tournament w/ scores', tournament);
//     return tournament;
//   } catch (error) {
//     throw error;
//   }
// };

// const getAllPracScores = async () => {
//   try {
//     const { rows: tournaments } = await client.query(`
//       SELECT * FROM tournaments;
//       `);
      
//     const {rows: tourScores} = await client.query(`
//       SELECT * FROM tour_scores
//       JOIN tournaments ON tour_scores."tournamentId"=tournaments.id
//     `);

//     tournaments.forEach((tournament) => {
//       tournament.scores = tourScores.filter((score) => score.tournamentId == tournament.id);
//     })
//     console.log('All Tournaments', tournaments);
    
//     return tournaments;
//   } catch (error) {
//     throw error;
//   }
// };


module.exports = {
  createPracRound,
  updatePracScore,
  getPracScoresByUser,
  // getScoresByPrac,
  // getAllPracScores
}