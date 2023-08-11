const getFullUrl = (url) => {return(process.env.REACT_APP_API_HOST +url);}

export function sendRequestsWithToken(url, config){
  return fetch(getFullUrl(url), {
    method: "POST",
    ...config,
  })
}