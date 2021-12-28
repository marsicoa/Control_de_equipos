var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/comprobante', function(req, res, next) {
  res.render('comprobante');
});

module.exports = router;
