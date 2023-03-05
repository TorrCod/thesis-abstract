import React from 'react';
import { Layout, Menu } from 'antd';
const { Header, Content } = Layout;
const { SubMenu } = Menu;

interface DashboardProps {
  children: React.ReactNode;
  selectedMenu: string;
  onMenuSelect: (key: string) => void;
}

function Dashboard({ children, selectedMenu, onMenuSelect }: DashboardProps) {
  return (
    <Layout style={{ background: 'transparent' }}>
      <Header className="header">
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" selectedKeys={[selectedMenu]} onSelect={(info) => onMenuSelect(info.key as string)} defaultSelectedKeys={['dashboard']}>
          <Menu.Item key="dashboard" title="Dashboard">
            Dashboard
          </Menu.Item>
          <Menu.Item key="settings" title="Settings">
            Settings
          </Menu.Item>
        </Menu>
      </Header>
      <Layout>
        <Layout style={{ padding: '0 24px 24px', background: 'transparent' }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 900,
            }}
          >
            {selectedMenu === 'dashboard' && (
              <>
                <div>Dashboard content</div>
                {children}
              </>
            )}
            {selectedMenu === 'settings' && (
              <>
                <div>Settings content</div>
                {children}
              </>
            )}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default Dashboard;
