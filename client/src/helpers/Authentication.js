//get token from loacal storage
exports.isAuthenticated = () => {
    if (typeof window == undefined) {
      return false;
    }
    if (localStorage.getItem("auth")) {
      return JSON.parse(localStorage.getItem("auth"));
    } else {
      return false;
    }
}