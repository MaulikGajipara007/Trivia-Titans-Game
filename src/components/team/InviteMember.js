import React, { useEffect, useState } from "react";
import { Button, ConfigProvider, Divider, Input, Modal, Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Search from "antd/es/input/Search";
import { getAllUserList, sendInvitationEmail } from "../../services/teamApi";

const InviteMember = (props) => {
    const teamId = props.teamId;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterData, setFilterData] = useState([]);
    const [tableData, setTableData] = useState([]);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const getAllUserListApiCall = async () => {
        const response = await getAllUserList();
        setTableData(response.data?.users);
        setFilterData(response.data?.users);
    };

    useEffect(() => {
        if (isModalOpen) {
            getAllUserListApiCall();
        }
    }, [isModalOpen]);

    const sendInvite = async (record) => {
        console.log("Send Invite Clicked", record);
        await sendInvitationEmail(teamId, record);
    };

    const columns = [
        {
            title: "Name",
            dataIndex: "given_name",
            key: "given_name",
            width: 150,
            render: (text) => <a>{text}</a>,
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            width: 300,
            render: (text) => <a>{text}</a>,
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Button type="primary" onClick={() => sendInvite(record)}>
                    Send Invite
                </Button>
            ),
        },
    ];

    const onSearch = (value) => {
        if (value) {
            setFilterData(
                tableData.filter((element) =>
                    element.given_name
                        .toLowerCase()
                        .includes(value.toLowerCase())
                )
            );
        } else {
            setFilterData(tableData);
        }
    };

    return (
        <>
            <Button
                size="large"
                type="primary"
                onClick={showModal}
                icon={<PlusOutlined />}
            >
                Invite Member
            </Button>
            <Modal
                title="Invite Member"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" danger onClick={handleCancel}>
                        Close
                    </Button>,
                ]}
            >
                <Divider />
                <Search
                    placeholder="input search text"
                    onSearch={onSearch}
                    allowClear
                    enterButton="Search"
                    size="large"
                />
                <Divider />
                <Table
                    columns={columns}
                    dataSource={filterData}
                    scroll={true}
                    pagination={{ pageSize: 5 }}
                    size="small"
                />
            </Modal>
        </>
    );
};
export default InviteMember;
