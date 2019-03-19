var BlockChain = require('../services/blockchain');
var Block = require('../services/block');
var MemPool = require('../services/mempool');

const mempool = new MemPool.Mempool();

module.exports = {

  read: async function (req, res) {
    var address = req.param('address');

    mempool.addRequestValidation(address).then((block) => {
      return res.json(block);
    }).catch((err) => {
      return res.notFound();
    });
  }

};
