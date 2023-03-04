import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    BellOutlined,
    UserOutlined,
    SettingOutlined,
  } from '@ant-design/icons';
  import { Layout, Menu } from 'antd';
  import React, { useState } from 'react';
  const { Header, Sider, Content } = Layout;
  
  export default function Home() {
    const [collapsed, setCollapsed] = useState(false);
    return (
        <Layout className="layout" style={{ paddingTop: '70px'}}>
          <Sider trigger={null} collapsible collapsed={collapsed}>
            <div className="logo" />
            <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={['1']}
                items={[
                  {
                    key: '/dashboard',
                    icon: <UserOutlined />,
                    label: 'Dashboard',
                  },
                  {
                    key: '/settings',
                    icon: <SettingOutlined />,
                    label: 'Settings',
                  },
                  {
                    key: '/notification',
                    icon: <BellOutlined />,
                    label: 'Notifications',
                  },
                ]}
            />
          </Sider>
          <Layout className="site-layout">
            <Header
                className="site-layout-background"
                style={{
                  padding: 0,
                }}
            >
              {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger',
                onClick: () => setCollapsed(!collapsed),
              })}
            </Header>
            <Content
                className="site-layout-background"
                style={{
                  margin: '24px 16px',
                  padding: 24,
                }}
            >
              Content
            </Content>
          </Layout>
        </Layout>
    )
  }