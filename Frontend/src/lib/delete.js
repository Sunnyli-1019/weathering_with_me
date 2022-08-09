// Group members:
// Li Hong Man (1155127457), Yu Man Ho (1155127657), Ho Tsz Ngong (1155124840), Cheung Man Dick (1155127272), Mak Wing Chit (1155125179), David Pauschert (1155178207)
//This function accepts api and data to send delete request, and return the response object from server. Moreover, the status code is added to the response object for further use.
function deleteReq(url) {
  let status;
  const token = localStorage.getItem("token") || "";
  return fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": token,
    },
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
export default deleteReq;
