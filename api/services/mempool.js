class Mempool {
    constructor(data){
      // Add your Block properties
      // Example: this.hash = "";
        this.mempool = [];
        this.timeoutRequests = [];
    }

    addRequestValidation(address) {
        var data = {
            "walletAddress": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
            "requestTimeStamp": "1544451269",
            "message": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL:1544451269:starRegistry",
            "validationWindow": 300
        };
        return JSON.stringify(data);
    }
  }
  
  module.exports.Mempool = Mempool;
  