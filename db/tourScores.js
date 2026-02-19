const client = require('./client');

const createTourScore = async ({ userId, tournamentId, roundOneEnds, roundOneScore, roundTwoEnds, roundTwoScore, totalScore }) => {
  try {
    const { rows: [tourScore] } = await client.query(`
      INSERT INTO tour_scores ("userId", "tournamentId", "roundOneEnds", "roundOneScore", "roundTwoEnds", "roundTwoScore", "totalScore")
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `, [userId, tournamentId, roundOneEnds, roundOneScore, roundTwoEnds, roundTwoScore, totalScore]);
    return tourScore;
  } catch (error) {
    throw error
  };
};

const updateTourScore = async ({id}) => {

  // const setString = Object.keys(fields)
  // .map((key, index) => `"${ key }"=$${ index + 1 }`
  // ).join(', ');

  // if (setString.length === 0) {
  //   return;
  // };

// UPDATE table SET json_col = JSON_SET(json_col, '$.key', 'newValue') WHERE id = 1;  
// jsonb_set(endScore, '{${ path }, ${ key }}', ${ field }::jsonb, true)

  try {
    const { rows: [tourScore] } = await client.query(`
      UPDATE tour_scores
      SET "roundOneEnds" = jsonb_set("roundOneEnds", '{end10}', '[10,9,9]'::jsonb, false)
      WHERE id=$${ id }
      RETURNING *;
    `, [id]);
    
    return tourScore;
  } catch (error) {
    throw error;
  }
};

// const getTourScoresByUser = async (userId) => {
//   try {
//     const {rows: tourScores } = await client.query(`
//       SELECT *
//       FROM tourScores
//       WHERE "userId"=$1;
//     `, [userId]);

//     const {rows: tournaments} = await client.query(`
//       SELECT * FROM tournaments
//       JOIN order_products ON order_products."productId"=products.id;
//     `);
//     console.log('products54', tournaments);
//     console.log('orders55', tourScores);
//     orders.forEach((order) => {
//       order.products = products.filter(product => product.orderId === order.id);
//     })
//     console.log('order59', orders);
    
//     return orders;
//   } catch (error) {
//     throw error;
//   }
// };

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
}