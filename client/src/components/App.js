import React, { Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import Auth from '../hoc/auth';
// pages for this product
import LandingPage from './views/LandingPage/LandingPage.js';
import LoginPage from './views/LoginPage/LoginPage.js';
import RegisterPage from './views/RegisterPage/RegisterPage.js';
import NavBar from './views/NavBar/NavBar';
import Footer from './views/Footer/Footer';
import UploadVideoPage from './views/UploadVideoPage/UploadVideoPage';
import VideoDetailPage from './views/VideoDetailPage/VideoDetailPage';
import SubscriptionPage from './views/SubscriptionPage/SubscriptionPage';

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NavBar />
      <div style={{ paddingTop: '69px', minHeight: 'calc(100vh - 80px)' }}>
        <Switch>
          <Route exact path='/' component={Auth(LandingPage, null)} />{' '}
          {/* null의 값이면 사용자 권한 상관없이 페이지 보여줌 */}
          <Route exact path='/login' component={Auth(LoginPage, false)} />{' '}
          {/* 로그인 한 사람은 login page 못들어감 */}
          <Route exact path='/register' component={Auth(RegisterPage, false)} />
          <Route
            exact
            path='/video/upload'
            component={Auth(UploadVideoPage, true)}
          />
          <Route
            exact
            path='/video/:videoId'
            component={Auth(VideoDetailPage, null)}
          />
          <Route
            exact
            path='/subscription'
            component={Auth(SubscriptionPage, null)}
          />
        </Switch>
        {/* true 값이면 로그인한 사람만 페이지 보여줌 */}
      </div>
      <Footer />
    </Suspense>
  );
}

export default App;

// <Suspense fallback={(<div>Loading...</div>)}>
// 트리 상에 아직 렌더링이 준비되지 않은 컴포넌트가 있을 때 로딩 지시기(Loading indicator)를 나타냄
// fallback={}: OtherComponent가 로드 될 때까지 <div>Loading...</div> 를 표시
