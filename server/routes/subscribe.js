const express = require('express');
const router = express.Router();
const { Subscribe } = require('../models/Subscribe');

//=================================
//         Subscribe
//=================================

router.post('/SubscribeNumber', (req, res) => {
  //console.log(req.body.userTo);

  Subscribe.find({ 'userTo': req.body.userTo }).exec((err, Subscribe) => {
    console.log(Subscribe);
    if (err) {
      res.status(400).json({ success: false, err });
    }
    res.status(200).json({ success: true, SubscribeNumber: Subscribe.length });
  });
});

//본인이 구독을 했는지에 대한 것
router.post('/Subscribed', (req, res) => {
  Subscribe.find({
    'userTo': req.body.userTo,
    'userFrom': req.body.userFrom,
  }).exec((err, Subscribe) => {
    if (err) res.status(400).json({ success: false, err });
    //구독 했으면 1 안했으면 0
    let result = false;
    if (Subscribe.length != 0) {
      result = true;
    }
    res.status(200).json({ success: true, Subscribed: result });
  });
});

router.post('/unSubscribe', (req, res) => {
  Subscribe.findOneAndDelete({
    'userTo': req.body.userTo,
    'userFrom': req.body.userFrom,
  }).exec((err, doc) => {
    if (err) res.status(400).json({ success: false, err });
    res.status(200).json({ success: true, doc });
  });
});

router.post('/Subscribe', (req, res) => {
  const subscribe = new Subscribe(req.body);
  subscribe.save((err, doc) => {
    if (err) res.status(400).json({ success: false, err });
    res.status(200).json({ success: true, doc });
  });
});

module.exports = router;
