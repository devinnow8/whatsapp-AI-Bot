const axios = require("axios");
const dotEnv = require("dotenv");

const keepAlive = () => {
  dotEnv.config();
  setInterval(() => {
    axios
      .get(`${process.env.APP_URL}test`)
      .then(function (response) {
        // handle success
        console.log(response);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  }, 5 * 60 * 1000);
};

module.exports = keepAlive;
