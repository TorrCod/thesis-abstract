import { Button, Modal, Menu, Layout } from "antd";
import React, { useState } from "react";
import Link from "next/link";

const { Content } = Layout;

const styles = {
    contactbutton: {
        alignitems: "flex",
        background: "gray",
        marginRight: "40px",
        display: "flex",
        marginLeft: "auto",
        marginTop: "200px",
    },
};

const Dashboard = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };


    return (
        <>
        
            <Button type="primary" onClick={showModal} style={styles.contactbutton}>
                Admin Dashboard
            </Button>
            <Modal
                title="Admin Dashboard"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Layout>
                    <Content>
                        <Menu
                            theme="light"
                            mode="inline"
                            defaultSelectedKeys={['dashboard']}
                        >
                            <Menu.Item key="dashboard">
                                <Link href="/dashboard">
                                    Dashboard
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="settings">
                                <Link href="/settings">
                                    General Settings
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="editthesis">
                                <Content>
                                    <Link href="/editthesis">
                                        Thesis Abstract
                                    </Link>
                                </Content>
                            </Menu.Item>
                            <Menu.Item key="requests">
                                <Content>
                                    <Link href="/requests">
                                        Pending Requests
                                    </Link>
                                </Content>
                            </Menu.Item>
                        </Menu>
                    </Content>
                </Layout>
            </Modal>
        </>
    );
};

export default Dashboard;