/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain    |
|  ================================================*/

const SHA256 = require('crypto-js/sha256');
const LevelSandbox = require('./level.js');
const Block = require('./block.js');

class Blockchain {

    constructor() {
        this.bd = new LevelSandbox.LevelSandbox();
        this.generateGenesisBlock();
    }

    test() {
      console.log("Test worked!");
    }
    // Helper method to create a Genesis Block (always with height= 0)
    // You have to options, because the method will always execute when you create your blockchain
    // you will need to set this up statically or instead you can verify if the height !== 0 then you
    // will not create the genesis block
    generateGenesisBlock() {
        // Add your code here
        this.getBlockHeight().then((height) => {
            if (height == 0) {
                let genesisBlock = new Block.Block("Genesis Block");

                genesisBlock.height = 0;
                genesisBlock.time = new Date().getTime().toString().slice(0, -3);
                genesisBlock.hash = SHA256(JSON.stringify(genesisBlock)).toString();

                this.bd.addLevelDBData(genesisBlock.height, JSON.stringify(genesisBlock).toString());
            }
        });
    }

    // Get block height, it is a helper method that return the height of the blockchain
    getBlockHeight() {
        // Add your code here
        return this.bd.getBlocksCount();
    }

    // Add new block
    addBlock(block) {
        // Add your code here
        return this.getBlockHeight().then((height) => {
            return this.getBlock(height);
        }).then(previousBlock => {
            block.height = previousBlock.height + 1;
            block.time = new Date().getTime().toString().slice(0, -3);
            block.hash = SHA256(JSON.stringify(block)).toString();
            block.previousBlockHash = previousBlock.hash;

            return this.bd.addLevelDBData(block.height, JSON.stringify(block).toString());
        })
    }

    // Get Block By Height
    getBlock(height) {
        // Add your code here
        return this.bd.getLevelDBData(height);
    }

    // Validate if Block is being tampered by Block Height
    validateBlock(height) {
        // Add your code here
        return this.getBlock(height).then((block) => {
            let blockHash = block.hash;
            block.hash = '';
            let validBlockHash = SHA256(JSON.stringify(block)).toString();

            return blockHash===validBlockHash;
        });
    }

    // Validate Blockchain
    validateChain() {
        // Add your code here
        let errorLog = [];
        return new Promise((resolve, reject) => {
            // iterate over each block to validate
            this.bd.db.createValueStream()
                .on('data', blockRaw => {
                    const block = JSON.parse(blockRaw);

                    const getPreviousBlock = block.height !== 0
                        ? this.getBlock(block.height - 1)
                        : Promise.resolve(null);

                    getPreviousBlock.then(previousBlock => {
                        const blockHash = block.hash;
                        block.hash = "";
                        const validBlockHash = SHA256(JSON.stringify(block)).toString();
                        const isValidBlock = validBlockHash === blockHash;

                        if(!isValidBlock || previousBlock && previousBlock.hash !== block.previousBlockHash) {
                            errorLog.push("Invalid block # " + block.height);
                        }
                    });
                })
                .on('errors', () => reject())
                .on('close', () => resolve(errorLog))
        })
    }

    // Utility Method to Tamper a Block for Test Validation
    // This method is for testing purpose
    _modifyBlock(height, block) {
        let self = this;
        return new Promise( (resolve, reject) => {
            self.bd.addLevelDBData(height, JSON.stringify(block).toString()).then((blockModified) => {
                resolve(blockModified);
            }).catch((err) => { console.log(err); reject(err)});
        });
    }

}

module.exports.Blockchain = Blockchain;
