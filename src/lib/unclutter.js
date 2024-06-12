const baseUrl = "https://jsonplaceholder.typicode.com";

function Fetch(url, options = {}, isForm = false) {
  const userData = localStorage.getItem("userData")
    ? JSON.parse(localStorage.getItem("userData") || "")
    : {};
  const headers = {
    ...options?.headers,

    "content-type": isForm ? "multipart/form-data" : "application/json",
    authorization: `Bearer ${userData.token}`,
  };
  const FetchOptions = { headers, method: options?.method || "GET" };
  if (options.data && !isForm) {
    FetchOptions["body"] = JSON.stringify(options.data);
  }
  return fetch(`${baseUrl}${url}`, { ...FetchOptions, credentials: "include" })
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
    })
    .then((data) => data)
    .catch((err) => {
      alert(err.message || "Error while loading data");
      throw new Error(err || "Error while loading data)");
    });
}

const fetchedData = Fetch("/todos/2")
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.error(err);
  });

const loginUser = (username, password) => {
  Fetch("/jwt-auth/v1/token", {
    data: { username: username, password: password },
  })
    .then(function (response) {
      if (response?.token) {
        localStorage.setItem("userData", JSON.stringify(response));
      }
    })
    .catch(function (error) {
      console.error("Error", error.data[0]);
    });
};

const refreshToken = Fetch("/jwt-auth/v1/token")
  .then(function (response) {
    if (response?.token) {
      localStorage.setItem("userData", JSON.stringify(response));
    }
  })
  .catch(function (error) {
    console.error("Error", error.data[0]);
  });
