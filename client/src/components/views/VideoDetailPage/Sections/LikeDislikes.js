import React, { useEffect, useState } from 'react';
import { Icon, Tooltip } from 'antd';
import Axios from 'axios';

function LikeDislikes(props) {
  const [Likes, setLikes] = useState(0);
  const [DisLikes, setDisLikes] = useState(0);
  const [LikeAction, setLikeAction] = useState(null);
  const [DisLikeAction, setDisLikeAction] = useState(null);

  let variable = {};

  if (props.video) {
    variable = { userId: props.userId, videoId: props.videoId };
  } else {
    variable = { userId: props.userId, commentId: props.commentId };
  }

  useEffect(() => {
    Axios.post('/api/like/getLikes', variable).then((res) => {
      if (res.data.success) {
        console.log(res.data.likes);
        //얼마나 많은 좋아요를 받았는지
        setLikes(res.data.likes.length);
        //내가 이미 그 좋아요를 눌렀는지
        res.data.likes.forEach((like) => {
          if (like.userId === props.userId) {
            setLikeAction('liked');
          }
        });
      } else {
        alert('Like 정보를 가져오지 못했습니다.');
      }
    });

    Axios.post('/api/like/getDisLikes', variable).then((res) => {
      if (res.data.success) {
        console.log(res.data.dislikes);
        //얼마나 많은 좋아요를 받았는지
        setDisLikes(res.data.dislikes.length);
        //내가 이미 그 좋아요를 눌렀는지
        res.data.dislikes.forEach((dislikes) => {
          if (dislikes.userId === props.userId) {
            setDisLikeAction('disliked');
          }
        });
      } else {
        alert('disLike 정보를 가져오지 못했습니다.');
      }
    });
  }, []);

  const onLike = async () => {
    //Like를 누르지 않은 상태
    if (LikeAction === null) {
      await Axios.post('/api/like/uplike', variable).then((res) => {
        if (res.data.success) {
          console.log('uplike : ', res.data.likeResult);

          setLikes(Likes + 1);
          setLikeAction('liked');

          //UpDisLike 된 상태일때
          if (DisLikeAction !== null) {
            setDisLikes(DisLikes - 1);
            setDisLikeAction(null);
          }
        } else {
          alert('Like를 올리지 못했습니다.');
        }
      });
    } else {
      //Like를 누른 상태
      await Axios.post('/api/like/unlike', variable).then((res) => {
        if (res.data.success) {
          console.log('UNLIKE : ', res.data.unlikeResult);
          setLikes(Likes - 1);
          setLikeAction(null);
        } else {
          alert('Like를 내리지 못했습니다.');
        }
      });
    }
  };

  const onDisLike = () => {
    if (DisLikes !== null) {
      Axios.post('/api/like/unDisLike', variable).then((res) => {
        if (res.data.success) {
          console.log('UNDISLIKE : ', res.data.unDisLike);
          setDisLikes(DisLikes - 1);
          setDisLikeAction(null);
        } else {
          alert('undisLike를 지우지 못했습니다.');
        }
      });
    } else {
      Axios.post('/api/like/upDisLike', variable).then((res) => {
        if (res.data.success) {
          console.log('UNDISLIKE : ', res.data.unDisLike);
          setDisLikes(DisLikes + 1);
          setDisLikeAction('disliked');
        } else {
          alert('undisLike를 지우지 못했습니다.');
        }
      });
    }
  };

  return (
    <div>
      <span key='comment-basic-like'>
        <Tooltip title='Like'>
          <Icon
            type='like'
            theme={LikeAction === 'liked' ? 'filled' : 'outlined'}
            onClick={onLike}
          />
        </Tooltip>
        <span style={{ paddingLeft: 5, cursor: 'auto' }}>{Likes}</span>
      </span>
      &nbsp;&nbsp;
      <span key=' key="comment-basic-dislike"'>
        <Tooltip title='DisLike'>
          <Icon
            type='dislike'
            theme={DisLikeAction === 'disliked ' ? 'filled' : 'outlined'}
            onClick={onDisLike}
          />
        </Tooltip>
        <span style={{ paddingLeft: 5, cursor: 'auto' }}>{DisLikes}</span>
      </span>
    </div>
  );
}

export default LikeDislikes;
