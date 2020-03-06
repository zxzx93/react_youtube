import React, { useEffect, useState } from 'react';
import { List, Avatar, Row, Col } from 'antd';
import Axios from 'axios';
import SideVideo from './Sections/SideVideo';
import Subscriber from './Sections/Subscriber';
import Comment from './Sections/Comment';
import LikeDislikes from './Sections/LikeDislikes';

function VideoDetailPage(props) {
  const videoId = props.match.params.videoId;
  const [Video, setVideo] = useState([]);
  const [Comments, setComments] = useState([]);

  const videoVariable = {
    videoId: videoId,
  };

  const refreshFunction = (NewComment) => {
    setComments(Comments.concat(NewComment));
  };

  useEffect(() => {
    //db에서 videoId 찾아서 하나 가져오기
    Axios.post('/api/video/getVideoDetail', videoVariable).then((res) => {
      if (res.data.success) {
        //console.log(res.data);
        setVideo(res.data.VideoDetail);
      } else {
        alert('비디오 정보 가져오길 실패 했습니다.');
      }
    });

    Axios.post('/api/comment/getComments', videoVariable).then((res) => {
      if (res.data.success) {
        // console.log(res.data);
        setComments(res.data.comments);
      } else {
        alert('코멘트 정보 가져오길 실패 했습니다.');
      }
    });

    // eslint-disable-next-line
  }, []);

  if (Video.writer) {
    const subscribeButton = Video.writer._id !==
      localStorage.getItem('userId') && (
      <Subscriber
        userTo={Video.writer._id}
        userFrom={localStorage.getItem('userId')}
      />
    );

    return (
      <Row gutter={[16, 16]}>
        <Col lg={18} xs={24}>
          <div
            className='postPage'
            style={{ width: '100%', padding: '3rem 4em' }}
          >
            <video
              style={{ width: '100%' }}
              src={`http://localhost:5000/${Video.filePath}`}
              //controls={<LikeDislikes />}
            ></video>

            <List.Item
              actions={[
                <LikeDislikes
                  video
                  userId={localStorage.getItem('userId')}
                  videoId={videoId}
                />,
                subscribeButton,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar src={Video.writer && Video.writer.image} />}
                title={Video.writer.name}
                description={Video.description}
              />
              <div></div>
            </List.Item>

            {/* comments */}
            <Comment
              videoId={videoId}
              commentLists={Comments}
              refreshFunction={refreshFunction}
            />
          </div>
        </Col>
        <Col lg={6} xs={24}>
          <SideVideo />
        </Col>
      </Row>
    );
  } else {
    return <div>Loading...</div>;
  }
}

export default VideoDetailPage;

// antd 가로 너비 기준
// xs : 모바일
// sm : 태플릿
// md : 노트북
// lg : 데스크탑
