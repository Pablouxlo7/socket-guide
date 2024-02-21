const socketIo = require("socket.io");
const EnviaClient = require("../clients/enviaClient");
const {set} = require("express/lib/application");

class WebSocketServer {
  constructor(server) {
    if (WebSocketServer.instance) {
      return WebSocketServer.instance;
    }
    WebSocketServer.instance = this;
    this.guideCounter = 0;
    this.io = socketIo(server);
    this.enviaClient = new EnviaClient();
  }
  
  setup () {
    this.io.on('connection', (socket) => {

      console.log('Cliente conectado');
      this.io.emit('guideCounter', this.guideCounter);
      socket.on('createGuide', this.createGuide)

      socket.on('disconnect', () => {
        console.log('Cliente desconectado');
      });
    });
  }

  createGuide = async formData =>  {
    const { packages } = formData;
    console.log(formData)
    formData.modifiedPackages = packages.map((pack) => {
      return {
        ...pack,
        type: "box",
        dimensions: {
          length: 2,
          width: 5,
          height: 5
        },
        weight: 63,
        insurance: 0,
        declaredValue: 400,
        weightUnit: "KG",
        lengthUnit: "CM"
      };
    });

    formData.shipment = {
      carrier: "fedex",
      service: "express",
      type: 1
    }

    formData.settings = {
      printFormat: "PDF",
      printSize: "STOCK_4X6",
      comments: "comentarios de el envío"
    }

    console.log(this.enviaClient)
    let response = await this.enviaClient.createGuide(formData)

    //Tuve varios problemas con la API pero para poder hacer pruebas con exito hacia un response igual a true para subir el contador
    //response = true

    if (response) {
      this.guideCounter++;
      this.io.emit('guideCounter', this.guideCounter)
    }
  }
}

module.exports = WebSocketServer;