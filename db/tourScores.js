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

// const getOrderById = async (id) => {
//   try {
//     const { rows: [order] } = await client.query(`
//        SELECT * FROM orders
//        WHERE id=$1;
//       `,[id]);

//     const {rows: products} = await client.query(`
//       SELECT * FROM products
//       JOIN order_products ON products.id=order_products."productId"
//     `);
//     console.log('order', order);
//     order.products = products.filter((product) => product.orderId === order.id);
//     console.log('order', order);
//     return order;
//   } catch (error) {
//     throw error;
//   }
// };

// const getAllOrders = async () => {
//   try {
//     const { rows: orders } = await client.query(`
//       SELECT * FROM orders;
//       `);
      
//     const {rows: products} = await client.query(`
//       SELECT * FROM products
//       JOIN order_products ON products.id=order_products."productId"
//     `);

//     orders.forEach((order) => {
//       order.products = products.filter((product) => product.orderId == order.id);
//     })
//     console.log('order', orders);
    
//     return orders;
//   } catch (error) {
//     throw error;
//   }
// };


module.exports = {
  createTourScore,
  updateTourScore,
  getTourScoresByUser
}