require('dotenv').config();
const axios = require("axios");

class EnviaClient {

  constructor() {
    if (EnviaClient.instance) {
      return EnviaClient.instance;
    }
    EnviaClient.instance = this;
    this.baseUrl = process.env.BASE_URL
    this.token = process.env.TOKEN;
  }
  async createGuide ({ origin, destination, modifiedPackages, shipment, settings}) {

    try {
      const response = await axios.post(this.baseUrl +  '/ship/generate/', {
        origin,
        destination,
        packages: modifiedPackages,
        shipment,
        settings
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        }
      });
      console.log(response)
      if (response.status === 200) {
        return true
      }
    } catch (error) {
      console.error('Error en la petición:', error);
    }

    return false;
  }
}

module.exports = EnviaClient;