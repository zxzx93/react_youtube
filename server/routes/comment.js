const express = require('express');
const router = express.Router();
const { Comment } = require('../models/Comment');

//=================================
//         Comment
//=================================

//db에 댓글 저장
router.post('/saveComment', (req, res) => {
  //console.log(req.body);
  const comment = new Comment(req.body);
  comment.save((err, comment) => {
    if (err) res.status(400).json({ success: false, err });
    console.log('-------db에 댓글 저장-------');
    console.log(comment._id);

    //db 저장한 값 모델에서 찾아서 서버로 res
    Comment.find({ '_id': comment._id })
      .populate('writer')
      .exec((err, result) => {
        if (err) res.status(400).json({ success: false, err });
        res.status(200).json({ success: true, result });
      });
  });
});

//videoId와 맞는 전체 댓글 찾아서 작성자 정보 가져오기
router.post('/getComments', (req, res) => {
  Comment.find({ 'videoId': req.body.videoId })
    .populate('writer')
    .exec((err, comments) => {
      if (err) res.status(400).json({ success: false, err });
      res.status(200).json({ success: true, comments });
    });
});
module.exports = router;
