import axios from "axios";
import config from "../config/config";
const API_BASE = config.API_URL;
const getToken = async ()=>{
  const authData = await localStorage.getItem("authorization"); // Or however you're storing the token
  let token = "";
  if (authData) {
    const authJson = JSON.parse(authData);
    // console.log("AUTH DATA token",authJson)
    token = authJson.token;
  }
  return token;
}


export const apiRequest = async (endpoint, method, body = null, headers = {}) => {
  try {

    const response = await axios({
      url: `${API_BASE}${endpoint}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Backend-Token": backEndToken,
        ...headers, // Allows custom headers (e.g., Authorization)
      },
      data: body, // Axios automatically stringifies JSON data
    });

    return response.data; // Axios wraps response in a `data` object
  } catch (error) {
    console.error("API request failed:", error.response || error);
    throw error.response ? error.response.data : error;
  }
};

// export const apiRequestPost = async (endpoint,body) => {
//   try {

//     console.log("POST API REQUEST DATA",{
//       url: `${BASE_URL}${endpoint}`,
//       method:"POST", // <-- dynamic now
//       headers: {
//         "Content-Type": "application/json",
//         "X-Backend-Token": backEndToken,
//       },
//       data: body, // Used in POST, PUT etc. Axios ignores `data` in GET requests
//     })
//     const response = await axios({
//       url: `${BASE_URL}${endpoint}`,
//       method:"POST", // <-- dynamic now
//       headers: {
//         "Content-Type": "application/json",
//         "X-Backend-Token": backEndToken,
//       },
//       data: body, // Used in POST, PUT etc. Axios ignores `data` in GET requests
//     });

//     return response.data;
//   } catch (error) {
//     console.error("API request failed:", error.response || error);
//     throw error.response ? error.response.data : error;
//   }
// };




export const apiRequestPost = async (endpoint, body, isMultipart = false) => {
  try {
    const tokens = await getToken(); // or from store/context

    const headers = {
      ...(isMultipart
        ? {} // Let browser set correct multipart boundary
        : { "Content-Type": "application/json" }),
      ...(tokens && { Authorization: `Bearer ${tokens}` }),
    };

    console.log("API HEADER ",headers)
    const config = {
      url: `${API_BASE}/${endpoint}`,
      method: "POST",
      headers,
      data: body,
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error("API request failed:", error.response || error);
    throw error.response ? error.response.data : error;
  }
};

export const apiRequestGet = async (endpoint, queryParams = {}) => {
  try {
    // console.log("auth token ", token);
        const tokens = await getToken(); // or from store/context

    const response = await axios.get(`${API_BASE}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tokens}`, // <-- Bearer token here
      },
      params: queryParams, // <-- if you want to send ?key=value in URL
    });

    return response.data;
  } catch (error) {
    console.error("API request failed:", error.response || error);
    throw error.response ? error.response.data : error;
  }
};


export const apiRequestPostWithoutToken = async (endpoint, body) => {
  try {
    const config = {
      url: `${API_BASE}${endpoint}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
    };

    // console.log("POST API REQUEST DATA", config);

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error("API request failed:", error.response || error);
    throw error.response ? error.response.data : error;
  }
};