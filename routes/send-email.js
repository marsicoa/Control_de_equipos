var express = require('express');
//var nodemailer = require('nodemailer')
var router = express.Router();

/* Post email */
router.get('/send-email', function (req, res, next){
    res.send('test')
    /*
    let transporter = nodemailer.createTransport({
       host: 'smtp.ethereal.email'
      ,port: 587
      ,secure:false
      ,auth: {
         user: 'EMAIL_USER@ethereal.email'
        ,pass: 'EMAIL_PASSWORD'
      }
    })
    let mailOptions = {
       from: 'Remitente'
      ,to:'destinatario@example.com'
      ,subject: 'Entrega de equipos'
      ,text: 'Probando recepcion'
    }
    transporter.sendMail(mailOptions, (error, info) => {
      if(error) {
        res.status(500).send(error.message)
      }else{
        console.log('Email enviado')
        res.status(200).jsonp(req.body)
      }
    })
    */
})

module.exports = router;


