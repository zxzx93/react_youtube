const express = require('express');
const router = express.Router();
const { Video } = require('../models/Video');
const { Subscribe } = require('../models/Subscribe');
const { auth } = require('../middleware/auth');
const multer = require('multer');
var ffmpeg = require('fluent-ffmpeg');

var storage = multer.diskStorage({
  //destination 과 filename 의 두가지 옵션이 가능. 두 옵션 모두 파일을 어디에 저장할 지를 정하는 함수
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
    // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
    // cb 콜백함수를 통해 전송된 파일 이름 설정
  },
  fileFilter: (req, file, cb) => {
    //fileFilter:어떤 파일을 허용하거나 제어하는 함수
    const ext = path.extname(file.originalname); //path.extname: 파일의 확장자명 리턴
    if (ext !== '.mp4') {
      return cb(res.status(400).end('only jpg, png, mp4 is allowed'), false);
    }
    cb(null, true);
  },
});

// multer 미들웨어 등록
var upload = multer({ storage: storage }).single('file');
//single() : 폼데이터의 속성명이 file이거나 폼 태그 인풋의 name이 file인 파일 하나를 받겠다는 뜻

//=================================
//             video
//=================================

router.post('/uploadfiles', (req, res) => {
  //비디오를 서버에 저장

  upload(req, res, (err) => {
    //console.log(res.req);
    //console.log(res.req.file.path);

    if (err) {
      return res.json({ sucess: false, err });
    } else {
      return res.json({
        sucess: true,
        url: res.req.file.path,
        fileName: res.req.file.filename,
      });
    }
  });
});

router.post('/thumbnail', (req, res) => {
  let thumbsFilePath = '';
  let fileDuration = '';

  ffmpeg.ffprobe(req.body.url, function(err, metadata) {
    //console.dir(metadata);
    //console.log(metadata.format.duration);

    fileDuration = metadata.format.duration;
  });

  ffmpeg(req.body.url) //file path
    .on('filenames', function(filenames) {
      //console.log('Will generate ' + filenames.join(', '))
      //console.log(filenames);
      thumbsFilePath = 'uploads/thumbnails/' + filenames[0];
    })
    .on('end', function() {
      //console.log('Screenshots taken');
      return res.json({
        success: true,
        thumbsFilePath: thumbsFilePath,
        fileDuration: fileDuration,
      });
    })
    .screenshots({
      // Will take screens at 20%, 40%, 60% and 80% of the video
      count: 3,
      folder: 'uploads/thumbnails',
      size: '320x240',
      // %b input basename ( filename w/o extension )
      filename: 'thumbnail-%b.png',
    });
});

router.post('/uploadVideo', (req, res) => {
  //비디오 정보들을 db에 저장한다.
  const video = new Video(req.body);

  video.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    res.status(200).json({ success: true });
  });
});

router.get('/getvideos', (req, res) => {
  //비디오를 db에서 가져와 클라이언트에 보낸다
  //console.log(req.body);
  Video.find()
    .populate('writer')
    .exec((err, videos) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).json({ success: true, videos });
      }
    });
});

router.get('/getSideVideos', (req, res) => {
  //비디오를 db에서 가져와 클라이언트에 보낸다
  Video.find()
    .populate('writer')
    .exec((err, SideVideos) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).json({ success: true, SideVideos });
      }
    });
});

router.post('/getVideoDetail', (req, res) => {
  //console.log(req.body);
  Video.findOne({ '_id': req.body.videoId })
    .populate('writer')
    .exec((err, VideoDetail) => {
      if (err) {
        res.status(400).json({ success: false, err });
      } else {
        res.json({ success: true, VideoDetail });
      }
    });
});

router.post('/getSubscriptionVideos', (req, res) => {
  Subscribe.find({ 'userFrom': req.body.userFrom }).exec(
    (err, SubscriberInfo) => {
      if (err) res.status(400).json({ success: false, err });

      let subscribedUser = [];

      SubscriberInfo.map((subscriber, i) => {
        subscribedUser.push(subscriber.userTo);
      });

      //찾은 사람들의 비디오를 가지고 온다.
      Video.find({ writer: { $in: subscribedUser } })
        .populate('writer')
        .exec((err, videos) => {
          if (err) return res.status(400).json({ success: false, err });
          res.status(200).json({ success: true, videos });
        });
    },
  );
});

module.exports = router;
