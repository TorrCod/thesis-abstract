import React, { useEffect, useState } from 'react';
import { Layout, Menu } from 'antd';
const { Header, Content } = Layout;
const { SubMenu } = Menu;
import Link from 'next/link';
import { PriButton } from '@/components/button';
import { MenuProps } from 'antd';

interface DashboardProps {
  children: React.ReactNode;
  selectedMenu: string;
}

function Dashboard({ children }: {children:React.ReactNode}) {

  const [selectedMenu, setSelectedMenu] = useState("/dashboard")

  useEffect(() => {
    
    (document.getElementsByClassName("navbar")[0] as HTMLDivElement).style.display = "none"
    
    return () => {
      (document.getElementsByClassName("navbar")[0] as HTMLDivElement).style.display = "flex"
    }
  }, [])

  const menuItem:MenuProps["items"] = [
    {key:"/dashboard",label:<Link href="/dashboard">Dashboard</Link>},
    {key:"/setting",label:<Link href="/settings">Settings</Link>},
    {key:"/back",label:<Link href="/"><PriButton>Home</PriButton></Link>}
  ]
  
  return (
    <section>
      <Layout style={{ background: 'transparent' }}>
      <Header className="header">
        <div className="logo" />
        <Menu theme='dark' mode="horizontal" selectedKeys={[selectedMenu]} onSelect={(info)=>setSelectedMenu(info.key)} items={menuItem} defaultSelectedKeys={['/dashboard']} />
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
            {selectedMenu === '/dashboard' && (
              <>
                {children}
              </>
            )}
            {selectedMenu === '/settings' && (
              <>
                {children}
              </>
            )}
          </Content>
        </Layout>
      </Layout>
    </Layout>
    </section>
  );
}

export default Dashboard;
