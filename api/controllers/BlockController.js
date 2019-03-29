var BlockChain = require('../services/blockchain');
var Block = require('../services/block');
var MemPool = require('../services/mempool');

const mempool = new MemPool.Mempool();
const currentBlockchain = new BlockChain.Blockchain();

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
  },

  create: async function (req, res) {
    let address = req.param('address');
    let star = req.param('star');
    let body = {
      address: address, 
      star: {
        dec: star['dec'],
        ra: star['ra'],
        mag: star['mag'],
        cen: star['cen'],
        story: Buffer(star['story']).toString('hex')
      }
    }

    if (!body) {
      return res.badRequest("Invalid block body!");
    }

    let newBlock  = new Block.Block(body);
    currentBlockchain.addBlock(newBlock).then((result) => {
      // console.log(result);
      // let finalResult = result;
      // finalResult['body']['star']['storyDecoded'] = hex2ascii(result['body']['star']['story']);
      // console.log(finalResult);
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
  },

  gethash: async function (req, res) {
    var hash = req.param('hash');

    currentBlockchain.getBlockByHash(hash).then((block) => {
      return res.send(block);
    }).catch((err) => {
      return res.notFound();
    });
  },

  getaddress: async function (req, res) {
    var address = req.param('address');

    currentBlockchain.getBlockByAddress(address).then((block) => {
      return res.send(block);
    }).catch((err) => {
      return res.notFound();
    });
  },

};
