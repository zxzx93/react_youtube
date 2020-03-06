import React, { useState } from 'react';
import { Comment, Avatar, Button } from 'antd';
import Axios from 'axios';
import '../../../../index.css';
import { useSelector } from 'react-redux';
import LikeDislikes from './LikeDislikes';

function SingleComment(props) {
  const user = useSelector((state) => state.user);
  const [OpenReply, setOpenReply] = useState(false);
  const [commentReplyValue, setcommentReplyValue] = useState('');

  const onClickReplyOpen = () => {
    setOpenReply(!OpenReply);
  };

  const onhadleChange = (e) => {
    setcommentReplyValue(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    let variables = {
      videoId: props.videoId, //비디오 작성자
      content: commentReplyValue, //댓글
      writer: user.userData._id, //현재 로그인후 댓글 작성자
      responseId: props.comment._id, //db안의 댓글의 id
    };

    Axios.post('/api/comment/saveComment', variables).then((res) => {
      if (res.data.success) {
        console.log(res.data.result);
        setcommentReplyValue('');
        props.refreshFunction(res.data.result);
        setOpenReply(false);
      } else {
        alert('댓글을 저장하지 못했습니다.');
      }
    });
  };

  const action = [
    <LikeDislikes userId={user.userData._id} commentId={props.comment._id} />,
    <span onClick={onClickReplyOpen} key='comment-basic-reply-to'>
      대댓글 달기
    </span>,
  ];

  return (
    <div>
      <Comment
        actions={action}
        author={props.comment.writer.name}
        avatar={<Avatar src={props.comment.writer.image} alt='avatar image' />}
        content={<p>{props.comment.content}</p>}
      />

      {/* 대댓글 Form */}
      {OpenReply && (
        <form style={{ display: 'flex' }} onSubmit={onSubmit}>
          <textarea
            style={{ width: '100%', borderRadius: '5px' }}
            onChange={onhadleChange}
            value={commentReplyValue}
            placeholder='댓글을 작성해 주세요.'
          />
          <br /> &nbsp;
          <Button style={{ width: '20%', height: '50px' }} onSubmit={onSubmit}>
            Submit
          </Button>
        </form>
      )}
    </div>
  );
}

export default SingleComment;
