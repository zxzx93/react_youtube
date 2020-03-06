import React, { useEffect, useState } from 'react';
import SingleComment from './SingleComment';

function ReplyComment(props) {
  const [ChildCommentNumber, setChildCommentNumber] = useState(0);
  const [OpenReplyComments, setOpenReplyComments] = useState(false);

  useEffect(() => {
    let commentNumber = 0;
    props.commentLists.forEach((comment) => {
      if (comment.responseId === props.parentCommentId) {
        commentNumber++;
      }
      setChildCommentNumber(commentNumber);
    });
  }, [props.commentLists, props.parentCommentId]);

  const rederReplyComment = (parentCommentId) =>
    props.commentLists.map((comment, index) => (
      <React.Fragment>
        {comment.responseId === parentCommentId && (
          <div style={{ width: '80%', marginLeft: '40px' }} key={index}>
            <SingleComment
              comment={comment}
              videoId={props.videoId}
              refreshFunction={props.refreshFunction}
            />
            <ReplyComment
              commentLists={props.commentLists}
              parentCommentId={comment._id}
              videoId={props.videoId}
              refreshFunction={props.refreshFunction}
            />
          </div>
        )}
      </React.Fragment>
    ));

  const onHandleChange = () => {
    setOpenReplyComments(!OpenReplyComments);
  };

  return (
    <div>
      {ChildCommentNumber > 0 && (
        <p
          style={{ fontSize: '14px', margin: 0, color: 'gray' }}
          onClick={onHandleChange}
        >
          View {ChildCommentNumber} more comments
        </p>
      )}

      {OpenReplyComments && rederReplyComment(props.parentCommentId)}
    </div>
  );
}

export default ReplyComment;
