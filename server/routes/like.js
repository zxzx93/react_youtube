const express = require('express');
const router = express.Router();
const { Like } = require('../models/Like');
const { DisLike } = require('../models/DisLike');

//=================================
//         Like
//=================================

//모든 like 찾기
router.post('/getLikes', (req, res) => {
  let variable = {};

  if (req.body.videoId) {
    variable = { videoId: req.body.videoId, userId: req.body.userId };
  } else {
    variable = { commentId: req.body.commentId, userId: req.body.userId };
  }

  Like.find(variable).exec((err, likes) => {
    if (err) res.status(400).json({ err, success: false });
    res.status(200).json({ success: true, likes });
  });
});

router.post('/getDisLikes', (req, res) => {
  let variable = {};

  if (req.body.videoId) {
    variable = { videoId: req.body.videoId, userId: req.body.userId };
  } else {
    variable = { commentId: req.body.commentId, userId: req.body.userId };
  }

  DisLike.find(variable).exec((err, dislikes) => {
    if (err) res.status(400).json({ err, success: false });
    res.status(200).json({ success: true, dislikes });
  });
});

router.post('/uplike', (req, res) => {
  let variable = {};

  if (req.body.videoId) {
    variable = { videoId: req.body.videoId, userId: req.body.userId };
  } else {
    variable = { commentId: req.body.commentId, userId: req.body.userId };
  }

  //like collection에 클릭정보를 넣어줌
  const like = new Like(variable);

  like.save((err, likeResult) => {
    if (err) res.status(400).json({ success: false, err });
    res.status(200).json({ success: true, likeResult });

    //만약에 disLike이 클릭이 되어 있다면 disLike를 -1 시켜줌
    DisLike.findOneAndDelete(variable).exec((err, disLikeResult) => {
      if (err) res.status(400).json({ success: false, err });
      res.status(200).json({ success: true, disLikeResult });
    });
  });
});

//unlike 시킬때
router.post('/unlike', (req, res) => {
  let variable = {};

  if (req.body.videoId) {
    variable = { videoId: req.body.videoId, userId: req.body.userId };
  } else {
    variable = { commentId: req.body.commentId, userId: req.body.userId };
  }

  Like.findOneAndDelete(variable).exec((err, unlikeResult) => {
    if (err) res.status(400).json({ success: false, err });
    res.status(200).json({ success: true, unlikeResult });
  });
});

router.post('/unDisLike', (req, res) => {
  let variable = {};

  if (req.body.videoId) {
    variable = { videoId: req.body.videoId, userId: req.body.userId };
  } else {
    variable = { commentId: req.body.commentId, userId: req.body.userId };
  }

  DisLike.findOneAndDelete(variable).exec((err, unDisLike) => {
    if (err) res.status(400).json({ success: false, err });
    res.status(200).json({ success: true, unDisLike });
  });
});

router.post('/upDisLike', (req, res) => {
  let variable = {};

  if (req.body.videoId) {
    variable = { videoId: req.body.videoId, userId: req.body.userId };
  } else {
    variable = { commentId: req.body.commentId, userId: req.body.userId };
  }

  //upDisLike collection에 클릭정보를 넣어줌
  const disLike = new DisLike(variable);

  disLike.save((err, dislikeResult) => {
    if (err) res.status(400).json({ success: false, err });
    //res.status(200).json({ success: true, dislikeResult });

    //만약에 Like이 클릭이 되어 있다면 disLike를 -1 시켜줌
    Like.findOneAndDelete(variable).exec((err, LikeResult) => {
      if (err) res.status(400).json({ success: false, err });
      res.status(200).json({ success: true, LikeResult });
    });
  });
});

module.exports = router;
