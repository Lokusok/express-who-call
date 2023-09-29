class TelController {
  async makeTel(req, res) {
    res.end('Creating new telephone number');
  }
}

module.exports = new TelController();
