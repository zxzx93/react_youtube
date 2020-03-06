import React, { useState } from 'react';
import { Button } from 'antd';
import Axios from 'axios';
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';
import { useSelector } from 'react-redux';

function Comment(props) {
  const user = useSelector((state) => state.user);
  const [CommentValue, setCommentValue] = useState('');

  const handleClick = (e) => {
    setCommentValue(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    let variables = {
      videoId: props.videoId, //비디오 작성자
      content: CommentValue, //댓글
      writer: user.userData._id, //현재 로그인 중인 댓글 작성자
    };

    Axios.post('/api/comment/saveComment', variables).then((res) => {
      if (res.data.success) {
        console.log(res.data.result);
        setCommentValue('');
        props.refreshFunction(res.data.result);
      } else {
        alert('댓글을 저장하지 못했습니다.');
      }
    });
  };

  return (
    <div>
      <br />
      <p>댓글</p>
      <hr />
      {/* comment List */}
      {props.commentLists &&
        props.commentLists.map(
          (comment, index) =>
            !comment.responseId && (
              <React.Fragment key={index}>
                <SingleComment
                  videoId={props.videoId}
                  comment={comment}
                  refreshFunction={props.refreshFunction}
                />
                <ReplyComment
                  videoId={props.videoId}
                  parentCommentId={comment._id}
                  commentLists={props.commentLists}
                  refreshFunction={props.refreshFunction}
                />
              </React.Fragment>
            ),
        )}

      {/* Root comment Form */}
      <form style={{ display: 'flex' }} onSubmit={onSubmit}>
        <textarea
          style={{ width: '100%', borderRadius: '5px' }}
          onChange={handleClick}
          value={CommentValue}
          placeholder='댓글을 작성해 주세요.'
        />
        <br /> &nbsp;
        <Button style={{ width: '20%', height: '50px' }} onClick={onSubmit}>
          Submit
        </Button>
      </form>
    </div>
  );
}

export default Comment;
