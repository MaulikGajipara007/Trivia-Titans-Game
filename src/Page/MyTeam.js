import React, { useEffect, useState } from "react";
import { Button, Card, Col, ConfigProvider, Divider, Row, Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import NavBar from "../components/NavBar";
import InviteMember from "../components/team/InviteMember";
import {
    createTeam,
    getTeamDetailsById,
    getTeamStastics,
    getUserDetails,
    leaveTeam,
    makeAdmin,
} from "../services/teamApi";
import { showPromiseConfirm } from "../components/team/InvitationModal";
import { PRIMARY_COLOR } from "../Configurations/constants";
import "./css/MyTeam.css";
import ToastMessage from "../components/ToastMessage";

const Team = () => {
    const [teamDetails, setTeamDetails] = useState({});
    const [teamStastics, setTeamStastics] = useState({});
    const [currentUser, setCurrentUser] = useState({});

    const getUserDetailsAndSetCurrentUser = async (email) => {
        const response = await getUserDetails(email);
        setCurrentUser(response);
        localStorage.setItem("team_id", response.team_id);
        if (response.team_id) {
            const teamDetails = await getTeamDetailsById(response.team_id);
            setTeamDetails(teamDetails);

            const teamStastics = await getTeamStastics(response.team_id);
            setTeamStastics(teamStastics);
        }
    };

    const getTeamStasticsAPICall = async () => {
        // TODO: Pass TEAM_ID in API call
        const response = await getTeamStastics("120000");
        setTeamStastics(response);
    };

    useEffect(() => {
        // TODO: pass currentUser Email in API call
        // getUserDetailsAndSetCurrentUser("dhruvin15720@gmail.com");
        getUserDetailsAndSetCurrentUser(localStorage.getItem("email"));
        // getTeamStasticsAPICall();
    }, []);

    const handleMakeAdmin = async (record) => {
        const response = await makeAdmin(record.email, teamDetails.team_id);
        setTeamDetails(response);
        // getTeamDetailsApiCall();
    };
    const handleRemoveMember = async (record) => {
        const response = await leaveTeam(record.email, teamDetails.team_id);
        if (response) {
            ToastMessage("Member removed successfully");
            setTeamDetails(response);
        } else {
            ToastMessage("Error in removing member", "fail");
        }
    };
    const handleLeaveMember = async (record) => {
        const response = await leaveTeam(record.email, teamDetails.team_id);
        if (response) {
            setTeamDetails(response);
            if (record.email === currentUser.email) {
                setCurrentUser({
                    ...currentUser,
                    isTeamMember: false,
                    isTeamOwner: false,
                });
            }
            ToastMessage("Member leave successfully");
        } else {
            ToastMessage("Error in leave", "fail");
        }
    };
    const handleCreateTeam = async () => {
        const response = await createTeam(currentUser);
        if (response.user) {
            setCurrentUser(response.user);
            setTeamDetails(response.teamDetails);
            localStorage.setItem("team_id", response.teamDetails.team_id);
            ToastMessage("Team created successfully");
        } else {
            ToastMessage("Error in team creation", "fail");
        }
    };
    console.log(teamDetails, currentUser);

    const columns = [
        {
            title: "Name",
            dataIndex: "given_name",
            key: "given_name",
            width: "70%",
            render: (text) => <>{text}</>,
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <div>
                    {currentUser.isTeamOwner &&
                        currentUser.email !== record.email && (
                            <div className="action-button">
                                {record?.isTeamOwner ? (
                                    <></>
                                ) : (
                                    <Button
                                        type="primary"
                                        onClick={() => handleMakeAdmin(record)}
                                    >
                                        make admin
                                    </Button>
                                )}

                                <Button
                                    danger
                                    type="primary"
                                    onClick={() => handleRemoveMember(record)}
                                >
                                    remove
                                </Button>
                            </div>
                        )}

                    {/* Condition for showing leave button */}
                    {currentUser.isTeamMember &&
                        currentUser.email === record.email && (
                            <Button
                                danger
                                type="primary"
                                onClick={() => handleLeaveMember(record)}
                            >
                                leave
                            </Button>
                        )}
                </div>
            ),
        },
    ];
    return (
        <>
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: PRIMARY_COLOR,
                    },
                }}
            >
                <NavBar />
                {currentUser.isTeamMember ? (
                    <>
                        <div className="teamHeader">
                            <div className="teamDetails">
                                <h2>Team name: {teamDetails.name} </h2>
                                <h5>
                                    Team Owner:{" "}
                                    {teamDetails?.teamOwner?.given_name}
                                </h5>
                            </div>
                            <div>
                                {currentUser.isTeamOwner && (
                                    <InviteMember
                                        teamId={teamDetails.team_id}
                                    />
                                )}
                            </div>
                            {/* <div>
                                {currentUser.isTeamOwner && (
                                    <Button
                                        size="large"
                                        type="primary"
                                        onClick={() =>
                                            showPromiseConfirm(teamDetails)
                                        }
                                    >
                                        Open confirm modal
                                    </Button>
                                )}
                            </div> */}
                        </div>
                        <Table
                            columns={columns}
                            dataSource={teamDetails?.teamMember}
                            pagination={false}
                        />
                        <h1 style={{ marginTop: "50px" }}>
                            View team statistics
                        </h1>
                        <Divider />
                        <Row gutter={16}>
                            <Col span={8}>
                                <Card
                                    title="Game played"
                                    headStyle={{
                                        backgroundColor: PRIMARY_COLOR,
                                        color: "white",
                                    }}
                                    bordered={false}
                                    bodyStyle={{ backgroundColor: "#eeeeee" }}
                                >
                                    <h3>
                                        {teamStastics.playedGames
                                            ? teamStastics.playedGames
                                            : 0}
                                        /
                                        {teamStastics.totalGames
                                            ? teamStastics.totalGames
                                            : 0}
                                    </h3>
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card
                                    title="Win/Loss ratio"
                                    headStyle={{
                                        backgroundColor: PRIMARY_COLOR,
                                        color: "white",
                                    }}
                                    bordered={false}
                                    bodyStyle={{ backgroundColor: "#eeeeee" }}
                                >
                                    <h3>
                                        {teamStastics.winLossRatio
                                            ? teamStastics.winLossRatio * 100
                                            : 0}
                                        %
                                    </h3>
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card
                                    title="Total points earned"
                                    headStyle={{
                                        backgroundColor: PRIMARY_COLOR,
                                        color: "white",
                                    }}
                                    bordered={false}
                                    bodyStyle={{ backgroundColor: "#eeeeee" }}
                                >
                                    <h3>
                                        {teamStastics.totalPoints
                                            ? teamStastics.totalPoints
                                            : 0}
                                    </h3>
                                </Card>
                            </Col>
                        </Row>
                    </>
                ) : (
                    <div className="no-team">
                        <br />
                        <h2>You are not part of any team.</h2>
                        <Button
                            size="large"
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => handleCreateTeam()}
                        >
                            Create team
                        </Button>
                    </div>
                )}
            </ConfigProvider>
        </>
    );
};

export default Team;
