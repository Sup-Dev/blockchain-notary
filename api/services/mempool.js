const bitcoinMessage = require('bitcoinjs-message'); 

const TimeoutRequestsWindowTime = 5*60;

class Mempool {
    constructor() {
      // Add your Block properties
      // Example: this.hash = "";
        this.mempool = {};
        this.mempoolValid = {};
    }

    addRequestValidation(address) {
        
            let currentTime = Math.round(+new Date / 1000);

            // validation mempool, keeps addresses for 'TimeoutRequestsWindowTime' time
            if (!this.mempool[address] || ((this.mempool[address] + TimeoutRequestsWindowTime) < currentTime)) {
                this.mempool[address] = currentTime;
                setTimeout(() => {
                    delete this.mempool[address];
                    delete this.mempoolValid[address];
                }, TimeoutRequestsWindowTime * 1000);
            }

            let data = {
                address: address,
                requestTimeStamp: this.mempool[address],
                message: [address, this.mempool[address], 'starRegistry'].join(':'),
                validationWindow: this.mempool[address] + TimeoutRequestsWindowTime - currentTime
            };

        return new Promise(function(resolve, reject) {
            resolve(data);
        });
    }

    validateRequestByWallet(address, signature) {
        let isValid = null;
        let data = null;
        let error = null;
        console.log(this.mempool);
        let timestamp = this.mempool[address];

        if (timestamp === undefined) {
            data = {
                registerStar: false,
                error: 'Message Timed out'
            };
            
            return new Promise(function(resolve, reject) {
                resolve(data);
            });
        }

        const message = [address, timestamp, 'starRegistry'].join(':');

        // console.log(address);
        // console.log(signature);
        // console.log(timestamp);
        // console.log(message);

        try {
            isValid = bitcoinMessage.verify(message, address, signature);
        } catch(e) {
            isValid = false;
            console.log(e.message);
            error = e.message;
        }
        console.log(isValid);

        if (isValid) {
            let validationWindow = timestamp + TimeoutRequestsWindowTime - Math.round(+new Date/1000);
            this.mempoolValid[address] = true;
            console.log(validationWindow);

            data = {
                registerStar: true,
                status: {
                    address: address,
                    requestTimeStamp: timestamp,
                    message: message,
                    validationWindow: validationWindow,
                    messageSignature: true
                }
            };
        } else {
            data = {
                registerStar: false,
                error: error
            }
        }

        return new Promise(function(resolve, reject) {
            resolve(data);
        });
    }
  }
  
  module.exports.Mempool = Mempool;
  