let token = "";
export function setToken(newToken) {
  console.log("token is set",newToken)
  token = newToken;
}

export function getToken() {
  return token;
}

