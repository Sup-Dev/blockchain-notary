/* ===== Persist data with LevelDB ==================
|  Learn more: level: https://github.com/Level/level |
/===================================================*/

const level = require('level');
const hex2ascii = require('hex2ascii');
const chainDB = './chaindata';

class LevelSandbox {

    constructor() {
        this.db = level(chainDB);
    }

    // Get data from levelDB with key (Promise)
    getLevelDBData(key){
        let self = this;
        return new Promise(function(resolve, reject) {
            // Add your code here, remember in Promises you need to resolve() or reject()
            self.db.get(key, function(err, value) {
                if (err)  {
                  resolve({"error": "Invalid block number"});
                  return console.log('Not found!', err);
                }

                let d = JSON.parse(value);

                try {
                    d['body']['star']['storyDecoded'] = hex2ascii(d['body']['star']['story']);
                } catch(err) {
                    console.log(err);
                }
                resolve(d);
            })
        });
    }

    // Add data to levelDB with key and value (Promise)
    addLevelDBData(key, value) {
        let self = this;
        return new Promise(function(resolve, reject) {
            // Add your code here, remember in Promises you need to resolve() or reject()
            self.db.put(key, value, function(err) {
                if (err) {
                  resolve({"error": "Couldn't add block"});
                  return console.log('Not found!', err);
                }
                resolve(value);
            })
        });
    }

    // Method that return the height
    getBlocksCount() {
        let self = this;
        return new Promise(function(resolve, reject){
            // Add your code here, remember in Promises you need to resolve() or reject()
            let i = 0;
            self.db.createReadStream()
            .on('data', function (data) {
                i++;
            })
            .on('error', function (err) {
                reject(err);
            })
            .on('close', function () {
                resolve(i > 0 ? (i - 1) : 0);
            });
        });
    }

    getBlockByHash(hash) {
        let self = this;
        let block = null;
        return new Promise(function(resolve, reject){
            self.db.createReadStream()
            .on('data', function (data) {
                let d = JSON.parse(data.value);
                
                if(d.hash === hash){
                    d['body']['star']['storyDecoded'] = hex2ascii(d['body']['star']['story']);
                    block = d;
                }
            })
            .on('error', function (err) {
                reject(err)
            })
            .on('close', function () {
                resolve(block);
            });
        });
    }

    getBlockByAddress(address) {
        let self = this;
        let block = [];
        return new Promise(function(resolve, reject){
            self.db.createReadStream()
            .on('data', function (data) {
                try {
                    let d = JSON.parse(data.value);
                    
                    if(d.body.address == address){
                        d['body']['star']['storyDecoded'] = hex2ascii(d['body']['star']['story']);
                        block.push(d);
                    }                 
                } catch(err) {
                    console.log(err);
                }
            })
            .on('error', function (err) {
                reject(err)
            })
            .on('close', function () {
                resolve(block);
            });
        });
    }
 
}

module.exports.LevelSandbox = LevelSandbox;
