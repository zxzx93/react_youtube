import React, { useEffect, useState } from 'react';
import Axios from 'axios';

function Subscriber({ userTo, userFrom }) {
  const [SubscribeNumber, setSubscribeNumber] = useState(0);
  const [Subscribed, setSubscribed] = useState(false);

  const subscribedVariable = {
    userTo, //비디오 작성자 id
    userFrom, //현재 로그인한 사람
  };

  useEffect(() => {
    let variable = { userTo }; //비디오 작성자 id

    Axios.post('/api/subscribe/SubscribeNumber', variable).then((res) => {
      if (res.data.success) {
        // console.log(res.data);
        setSubscribeNumber(res.data.SubscribeNumber);
      } else {
        alert('구독자 수 정보를 가져오지 못했습니다.');
      }
    });

    Axios.post('/api/subscribe/Subscribed', subscribedVariable).then((res) => {
      if (res.data.success) {
        console.log(res.data.Subscribed);
        setSubscribed(res.data.Subscribed);
      } else {
        alert('정보를 가져오지 못했습니다.');
      }
    });
  }, []);

  const onSubscribe = () => {
    //이미 구독중일때 구독 취소하기
    if (Subscribed) {
      Axios.post('/api/subscribe/unSubscribe', subscribedVariable).then(
        (res) => {
          if (res.data.success) {
            //console.log(res.data.doc);
            setSubscribeNumber(SubscribeNumber - 1);
            setSubscribed(!Subscribed);
          } else {
            alert('구독 취소하는데 실패 했습니다.');
          }
        },
      );

      //아직 구독중이지 않을때 구독하기
    } else {
      Axios.post('/api/subscribe/Subscribe', subscribedVariable).then((res) => {
        if (res.data.success) {
          console.log(res.data.doc);
          setSubscribeNumber(SubscribeNumber + 1);
          setSubscribed(!Subscribed);
        } else {
          alert('구독 하는데 실패 했습니다.');
        }
      });
    }
  };

  return (
    <div>
      <button
        onClick={onSubscribe}
        style={{
          backgroundColor: `${Subscribed ? '#AAA' : 'red'}`,
          borderRadius: '4px',
          color: '#fff',
          padding: '10px 16px',
          fontWeight: 500,
          fontSize: '1em',
          textTransform: 'uppercase',
        }}
      >
        {SubscribeNumber} {Subscribed ? 'Subscribed' : 'Subscribe'}
      </button>
    </div>
  );
}

export default Subscriber;
