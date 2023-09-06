export const token_key = "jwt_token";

const getFullUrl = (url) => {return(process.env.REACT_APP_API_HOST +url);}


export const setToken = (token) => {
  localStorage.setItem(token_key, token);
}

export const getToken = () => localStorage.getItem(token_key);

export const clearToken = () => localStorage.clear(token_key)

export const getAuthorized = () => {
  const token = getToken();
  if (token !== null && token !== undefined) return true;
  return false;
  // return true;
};

export function sendRequestsWithToken(url, config){
  const token = getToken();
  console.log(url);
  return fetch(getFullUrl(url), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    ...config,
  })
}


export function sendRequestsWithToken_as_JSON(url, config){
  const token = getToken();
  // console.log(url);
  return fetch(getFullUrl(url), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    ...config,
  })
}