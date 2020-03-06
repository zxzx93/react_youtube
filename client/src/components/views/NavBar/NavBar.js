import React, { useState } from 'react';
import LeftMenu from './Sections/LeftMenu';
import RightMenu from './Sections/RightMenu';
import { Drawer, Button, Icon } from 'antd';
import './Sections/Navbar.css';
import logo from './asset/youtube_PNG21.png';
// client / src / asset / youtube_PNG21.png;
// client / src / components / views / NavBar / NavBar.js;
function NavBar() {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  return (
    <nav
      className='menu'
      style={{ position: 'fixed', zIndex: 5, width: '100%' }}
    >
      <div className='menu__logo' style={{ textAlign: 'center' }}>
        <a href='/' style={{}}>
          <img src={logo} alt='logo' width='50' />
        </a>
      </div>
      <div className='menu__container'>
        <div className='menu_left'>
          <LeftMenu mode='horizontal' />
        </div>
        <div className='menu_rigth'>
          <RightMenu mode='horizontal' />
        </div>

        {/* 반응형일때 아래 컴포넌트 */}
        <Button
          className='menu__mobile-button'
          type='primary'
          onClick={showDrawer}
        >
          <Icon type='align-right' />
        </Button>
        <Drawer
          title='Basic Drawer'
          placement='right'
          className='menu_drawer'
          closable={false}
          onClose={onClose}
          visible={visible}
        >
          <LeftMenu mode='inline' />
          <RightMenu mode='inline' />{' '}
          {/* string: vertical | horizontal | inline */}
        </Drawer>
      </div>
    </nav>
  );
}

export default NavBar;
