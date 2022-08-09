// Group members:
// Li Hong Man (1155127457), Yu Man Ho (1155127657), Ho Tsz Ngong (1155124840), Cheung Man Dick (1155127272), Mak Wing Chit (1155125179), David Pauschert (1155178207)
//This function accepts api and data to send put request, and return the response object from server. Moreover, the status code is added to the response object for further use.
function put(url, data) {
  let status;
  const token = localStorage.getItem("token") || "";
  return fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": token,
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      status = response.status;
      return response.json();
    })
    .then((result) => {
      result.status = status;
      return result;
    });
}
export default put;
// fetch(`https://weathering-with-me-g12.herokuapp.com/location/Dubai`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//       "x-auth-token": `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNzNlMjE0Y2VhZDc4NWI5MTRiOTVmZiIsImlhdCI6MTY1MjE4MzkyNSwiZXhwIjoxNjUyMjcwMzI1fQ.eTqYBJlhWWQvNmxq4YVJAsMeP717BO9nnR2hmPV3wwg`,
//     },
//     body: JSON.stringify({lat:25.25,long:55.28,cityName:"Dubai"}),
//   })
//     .then((response) => {
//       status = response.status;
//       return response.json();
//     })
//     .then((result) => {
//       result.status = status;
//       return result;
//     }).then((resultx)=>{console.log(resultx)});
