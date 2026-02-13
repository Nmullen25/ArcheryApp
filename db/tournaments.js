const client = require("./client");

const getTournamentById = async (id) => {
  try {
    const { rows: [tournament] } = await client.query(`
       SELECT * FROM tournaments
       WHERE id=$1;
      `,[id]);
    return tournament;
  } catch (error) {
    throw error;
  }
}

const getAllTournaments = async () => {
  try {
    const { rows: tournaments } = await client.query(`
           SELECT * FROM tournaments;
           `);
    return tournaments;
  } catch (error) {
    throw error;
  }
}

const createTournament = async ({ name, description, organizer, association, roundType, endCount, arrowsPerEnd, maxArrowValue, maxScore, date, location }) => {
  try {
    const {
      rows: [tournament] } = await client.query(
      `
       INSERT INTO tournaments(name, description, organizer, association, "roundType", "endCount", "arrowsPerEnd", "maxArrowValue", "maxScore", date, location)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *;     
     `, [name, description, organizer, association, roundType, endCount, arrowsPerEnd, maxArrowValue, maxScore, date, location] );

    return tournament;
  } catch (error) {
    throw error;
  }
}

const updateTournament = async ({id, ...fields}) => {
  const setString = Object.keys(fields).map(
      (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');

  try {
      const { rows: [tournament] } = await client.query(`
          UPDATE tournaments
          SET ${ setString }
          WHERE id=${ id }
          RETURNING *;
      `, Object.values(fields));
      console.log(tournament);
      return {message: "Tournament Updated"};
  } catch (error) {
      throw error;
  };
};


const destroyTournament = async (id) => {
  try {
    const { rows: [deletedTournament] } = await client.query(`
      DELETE FROM tournaments 
      WHERE id=${id}
    `);
    return deletedTournament;
    } catch (error){
      throw error;
    };
};
  
module.exports = {
  client,
  getTournamentById,
  getAllTournaments,
  createTournament,
  updateTournament,
  destroyTournament
};