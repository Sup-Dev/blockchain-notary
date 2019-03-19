var BlockChain = require('../services/blockchain');
var Block = require('../services/block');

const currentBlockchain = new BlockChain.Blockchain();

module.exports = {

  create: async function (req, res) {
    let body = req.param('body');
    if (!body) {
      return res.badRequest("Invalid block body!");
    }

    let newBlock  = new Block.Block(body);
    currentBlockchain.addBlock(newBlock).then((result) => {
      // console.log(result);
      return res.send(result);
    }).catch((err) => {
      return res.notFound();
    });

  },

  read: async function (req, res) {
    var id = req.param('id');

    currentBlockchain.getBlock(id).then((block) => {
      return res.json(block);
    }).catch((err) => {
      return res.notFound();
    });
  }

};
