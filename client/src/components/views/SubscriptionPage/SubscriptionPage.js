import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Avatar, Card } from 'antd';
import Axios from 'axios';
import moment from 'moment';

const { Title } = Typography;
const { Meta } = Card;

function SubscriptionPage(props) {
  const [video, setvideo] = useState([]);

  const SubscriptionVariable = {
    userFrom: localStorage.getItem('userId'),
  };

  useEffect(() => {
    //db에 들어있는 비디오 정보 들고오기
    Axios.post('/api/video/getSubscriptionVideos', SubscriptionVariable).then(
      (res) => {
        if (res.data.success) {
          console.log(res.data);
          setvideo(res.data.videos);
        } else {
          console.log('비디오 가져오기 실패');
        }
      },
    );
  }, []);

  const renderCards = video.map((video, index) => {
    const minutes = Math.floor(video.duration / 60); //Math.floor():내림
    const seconds = Math.floor(video.duration - minutes * 60);

    return (
      <Col lg={6} md={8} xs={24} key={index}>
        <a href={`/video/${video._id}`}>
          <div style={{ position: 'relative' }}>
            <img
              style={{ width: '100%' }}
              src={`http://localhost:5000/${video.thumbnail}`}
              alt='thumbnail'
            />
            <div className='duration'>
              <span>
                {minutes} : {seconds}
              </span>
            </div>
          </div>
        </a>
        <br />
        <Meta
          avatar={<Avatar src={video.writer.image}></Avatar>}
          title={video.title}
          description=''
        />
        <span>{video.writer.name}</span>
        <br />
        <span style={{ marginLeft: '3rem' }}>{video.views} views</span> -{' '}
        <span>{moment(video.createdAt).format('MMM Do YY')}</span>
        <br />
      </Col>
    );
  });

  return (
    <div
      style={{
        width: '85%',
        margin: '3rem auto',
      }}
    >
      <Title level={2}>맞춤 동영상</Title>
      <br />
      <Row gutter={[32, 16]}>{renderCards}</Row>
    </div>
  );
}

export default SubscriptionPage;
