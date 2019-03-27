var BlockChain = require('../services/blockchain');
var Block = require('../services/block');
var MemPool = require('../services/mempool');

const mempool = new MemPool.Mempool();

module.exports = {

  add: async function (req, res) {
    var address = req.param('address');
    
    mempool.addRequestValidation(address).then((data) => {
        return res.json(data);
    }).catch((err) => {
        console.log(err);
        return res.notFound();
    });
  },

  validate: async function (req, res) {
    var address = req.param('address');
    var signature = req.param('signature');

    mempool.validateRequestByWallet(address, signature).then((data) => {
        return res.json(data);
    }).catch((err) => {
        return res.notFound();
    });
  }
};
