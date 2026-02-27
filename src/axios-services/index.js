import axios from 'axios';
// this file holds your frontend network request adapters
// think about each function as a service that provides data
// to your React UI through AJAX calls

// for example, if we need to display a list of users
// we'd probably want to define a getUsers service like this:

/* 
  export async function getUsers() {
    try {
      const { data: users } = await axios.get('/api/users')
      return users;
    } catch(err) {
      console.error(err)
    }
  }
*/

export const callApi = async ({ url, method = "GET", token, data }) => {
  try {
    const options = {
      url,
      method: method.toUpperCase(),
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      data: data
    };
    if (token) {
      options.headers["Authorization"] = `Bearer ${token}`;
    }
    console.log('options', options);
    const resp = await axios(options);
    
    console.log(resp);
    
    if (resp.error) {
      console.log(resp.error);
      throw resp.error;
    }
    return resp;
  } catch (error) {
    console.log(error);
  }
};

export async function getAPIHealth() {
  try {
    const { data } = await axios.get(`/api/health`);
    console.log(data);
    return data;
  } catch (err) {
    console.error(err);
    return { healthy: false };
  }
}
