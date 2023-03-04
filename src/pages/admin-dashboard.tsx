    import {
        MenuFoldOutlined,
        MenuUnfoldOutlined,
        BellOutlined,
        UserOutlined,
        SettingOutlined,
    } from '@ant-design/icons';
    import { Layout, Menu } from 'antd';
    import React, { useState } from 'react';
    import Link from "next/link";


    const { Header, Sider, Content } = Layout;

    function Dashboard() {
        const [collapsed, setCollapsed] = useState(false);
        return (
            <Layout style={{ paddingTop: '70px' }}>
                <Sider trigger={null} collapsible collapsed={collapsed}>
                    <div className="logo" />
                    <Menu
                        theme="dark"
                        mode="inline"
                        defaultSelectedKeys={['dashboard']}
                    >
                    <Menu.Item key="dashboard">
                        <Link href="/dashboard">
                            Dashboard
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="settings">
                        <Content>
                        <Link href="/thesis">
                            Thesis
                        </Link>
                        </Content>
                    </Menu.Item>
                    </Menu>
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
                        Welcome to your Dashboard -User-
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

    export default Dashboard;