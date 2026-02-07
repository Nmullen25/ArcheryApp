const { server, handle } = require('../index');
const client = require('../db/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'neverTell'
const { rebuildDB } = require('../db/seedData');
const axios = require('axios');
const { SERVER_ADDRESS = 'http://localhost:', PORT = 4000 } = process.env;
const API_URL = process.env.API_URL || SERVER_ADDRESS + PORT;



describe('API', () => {
  let token, registeredUser;
  // close db connection and supertest server tcp connection
  beforeAll(async() => {
    await rebuildDB();
  })
  afterAll(async () => {
    await client.end();
    handle.close();
  });

  it('should respond to a request at /api/health with { healthy: true }', async () => {
    const response = await axios.get(`${API_URL}/api/health`);
    expect(response.status).toBe(200);
    expect(response.data.healthy).toBe(true);
  });

  describe('Users', () => {
    let newUser = { 
      username: 'robert', 
      password: 'bobbylong321', 
      email: 'test@test.com', 
      firstName: 'robert', 
      lastName: 'long',
      isAdmin: true
    };
    let newUserLogin = { 
      username: 'robert', 
      password: 'bobbylong321'
    };
    let newUserShortPassword = { 
      username: 'robertShort', 
      password: 'bobby21',
      email: 'test@test.com', 
      firstName: 'robert', 
      lastName: 'long'
     };
    describe('POST /users/register', () => {
      let tooShortSuccess, tooShortResponse;
      beforeAll(async() => {
        const successResponse = await axios.post(`${API_URL}/api/users/register`, newUser);
        registeredUser = successResponse.data.user;
        try {
          tooShortSuccess = await axios.post(`${API_URL}/api/users/register`, newUserShortPassword);
        } catch(err) {
          tooShortResponse = err.response;
        }
      })
      it('Creates a new user.', () => {
        expect(typeof registeredUser).toEqual('object');
        expect(registeredUser.username).toEqual(newUser.username);
      });
      it('Requires username and password. Requires all passwords to be at least 8 characters long.', () => {
        expect(newUser.password.length).toBeGreaterThan(7);
      });
      it('Hashes password before saving user to DB.', async () => {
        const {rows: [queriedUser]} = await client.query(`
          SELECT *
          FROM users
          WHERE id = $1;
        `, [registeredUser.id]);
        expect(queriedUser.password).not.toBe(newUser.password);
        expect(await bcrypt.compare(newUser.password, queriedUser.password)).toBe(true);
      });
      it('Throws errors for duplicate username', async () => {
        let duplicateSuccess, duplicateErrResp;
        try {
          duplicateSuccess = await axios.post(`${API_URL}/api/users/register`, newUser);
        } catch (err) {
          duplicateErrResp = err.response;
        }
        expect(duplicateSuccess).toBeFalsy();
        expect(duplicateErrResp.data).toBeTruthy();
      });
      it('Throws errors for password-too-short.', async () => {
        expect(tooShortSuccess).toBeFalsy();
        expect(tooShortResponse.data).toBeTruthy();
      });
    });
    describe('POST /users/login', () => {
      it('Logs in the user. Requires username and password, and verifies that hashed login password matches the saved hashed password.', async () => {
        const {data} = await axios.post(`${API_URL}/api/users/login`, newUserLogin);
        token = data.token;
        expect(data.token).toBeTruthy();
      });
      it('Returns a JSON Web Token. Stores the id and username in the token.', async () => {
        const parsedToken = jwt.verify(token, JWT_SECRET);
        expect(parsedToken.id).toEqual(registeredUser.id);
        expect(parsedToken.username).toEqual(registeredUser.username);
      });
    })
    describe('GET /users/me', () => {
      it('sends back users data if valid token is supplied in header', async () => {
        const {data} = await axios.get(`${API_URL}/api/users/me`, {
          headers: {'Authorization': `Bearer ${token}`}
        });        
        expect(data.username).toBeTruthy();
        expect(data.username).toBe(registeredUser.username);
      });
      it('rejects requests with no valid token', async () => {
        let noTokenResp, noTokenErrResp;
        try {
          noTokenResp = await axios.get(`${API_URL}/api/users/me`);
        } catch (err) {
          noTokenErrResp = err.response;
        }
        expect(noTokenResp).toBeFalsy();
        expect(noTokenErrResp.data).toBeTruthy();
      });
    });
  })
  describe('Products', () => {
    let productToCreateAndUpdate = {
      name: 'test popcorn', 
      price: 1000000, 
      description: "a variety of popcorn to test the API",
      imageurl: "https://i.imgflip.com/4/a8dty.jpg",
      category: "Sweet",
      inStock: true
    }
    describe('GET /products', () => {
      it('Just returns a list of all products in the database', async () => {
        const {data: products} = await axios.get(`${API_URL}/api/products`);
        expect(Array.isArray(products)).toBe(true);
        expect(products.length).toBeGreaterThan(0);
        expect(products[0].name).toBeTruthy();
        expect(products[0].description).toBeTruthy();
      });
    });
    describe('POST /products (*)', () => {
      it('Creates a new product', async () => {
        const { data: respondedProduct } = await axios.post(`${API_URL}/api/products`, productToCreateAndUpdate, { headers: {'Authorization': `Bearer ${token}`} });
        expect(respondedProduct.name).toEqual(productToCreateAndUpdate.name);
        expect(respondedProduct.description).toEqual(productToCreateAndUpdate.description);
        productToCreateAndUpdate = respondedProduct;
      });
    });
  });
});
