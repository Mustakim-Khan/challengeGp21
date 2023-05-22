import jwtDecode from "jwt-decode";

const decryptToken = async function () {
  // Retreive token from storage
  let token = localStorage.getItem("authToken")
    ? localStorage.getItem("authToken")
    : null;
  let refreshToken = localStorage.getItem("refreshToken")
    ? localStorage.getItem("refreshToken")
    : null;
  try {
    let decoded = await jwtDecode(token);
    // let decoded = await jwtDecode(token);
    return {
      tokenDecoded: token,
      userDecoded: decoded,
      refreshTokenDecoded: refreshToken,
    };
  } catch (error) {
    return {
      tokenDecoded: token,
      userDecoded: null,
      refreshTokenDecoded: refreshToken,
    };
  }
};

export default decryptToken;
