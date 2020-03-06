import React, { useEffect, useState } from 'react';
import Axios from 'axios';

function SideVideo(props) {
  const [SideVideos, setSideVideos] = useState([]);

  useEffect(() => {
    Axios.get('/api/video/getSideVideos').then((res) => {
      if (res.data.success) {
        //console.log(res.data);
        setSideVideos(res.data.SideVideos);
      } else {
        console.log('비디오 가져오기 실패');
      }
    });
  }, []);

  const renderSideVideos = SideVideos.map((video, index) => {
    var minutes = Math.floor(video.duration / 60); //Math.floor():내림
    var seconds = Math.floor(video.duration - minutes * 60);

    return (
      <div
        key={index}
        style={{ display: 'flex', marginBottom: '1rem', padding: '0 2rem' }}
      >
        <div style={{ width: '40%', marginRight: '1rem' }}>
          <a href>
            <img
              style={{ width: '100%', marginBottom: '1rem', height: '100%' }}
              src={`http://localhost:5000/${video.thumbnail}`}
              alt='thumbnail'
            />
          </a>
        </div>

        <div style={{ width: '50%' }}>
          <a href style={{ fontSize: '12px', color: 'gray' }}>
            <span style={{ fontWeight: 500, color: '#000' }}>
              {video.title}
            </span>
            <br />
            <span>{video.writer.name}</span>
            <br />
            <span>{video.views}views</span>
            <br />
            <span>
              {minutes} : {seconds}
            </span>
          </a>
        </div>
      </div>
    );
  });

  return <div style={{ marginTop: '3rem' }}>{renderSideVideos}</div>;
}

export default SideVideo;
