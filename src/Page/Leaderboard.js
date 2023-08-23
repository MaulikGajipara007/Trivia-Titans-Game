import { Button, ConfigProvider, Divider, Radio, Select, Table } from "antd";
import dayjs from "dayjs";
import NavBar from "../components/NavBar";
import "./css/Leaderboard.css";
import { useEffect, useState } from "react";
import { PRIMARY_COLOR } from "../Configurations/constants";
import {
    getTeamStatistics,
    getUserStatistics,
} from "../services/leaderboardApi";
const Leaderboard = () => {
    const [type, setType] = useState("individual");
    const [category, setCategory] = useState("all category");
    const [categoryList, setCategoryList] = useState([]);
    const [timeFrame, setTimeFrame] = useState("all-time");
    const [userData, setUserData] = useState([]);
    const [teamData, setTeamData] = useState([]);
    const [filterData, setFilterData] = useState([]);
    const currentDate = dayjs();
    const onChangeCategory = (value) => {
        setCategory(value);
    };
    const onSearch = (value) => {};
    const handleChange = (value) => {
        setTimeFrame(value);
    };
    const getAllCategory = () => {};

    const timeConstant = [
        {
            value: "all-time",
            label: "all-time",
        },
        {
            value: "daily",
            label: "daily",
        },
        {
            label: "weekly",
            value: "weekly",
        },
        {
            label: "monthly",
            value: "monthly",
        },
    ];

    const userDataColumns = [
        {
            title: "Name",
            dataIndex: "userID",
            key: "userID",
            width: "43%",
            render: (text) => <a>{text ? text.split("@")[0] : text}</a>,
        },
        {
            title: "Category",
            dataIndex: "quizCategory",
            key: "quizCategory",
            width: "43%",
            render: (text) => <a>{text}</a>,
        },
        {
            title: "Total points",
            dataIndex: "userScore",
            key: "userScore",
            width: "43%",
            render: (text) => <a>{text}</a>,
        },
        // {
        //     title: "Action",
        //     key: "action",
        //     render: (_, record) => (
        //         <div>
        //             {(record.index === 1 ||
        //                 record.index === 2 ||
        //                 record.index === 3) && (
        //                 <Button
        //                     style={{
        //                         color: "white",
        //                     }}
        //                     type="primary"
        //                     size="large"
        //                     onClick={() => record.}
        //                 >
        //                     View Details
        //                 </Button>
        //             )}
        //         </div>
        //     ),
        // },
    ];

    const teamDatacolumns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            width: "25%",
            render: (text) => <a>{text}</a>,
        },
        {
            title: "Category",
            dataIndex: "quizCategory",
            key: "quizCategory",
            width: "25%",
            render: (text) => <a>{text}</a>,
        },
        {
            title: "Win/loss Ratio",
            dataIndex: "ratio",
            key: "ratio",
            width: "25%",
            render: (text) => <a>{text}%</a>,
        },
        {
            title: "Total points",
            dataIndex: "totalPoints",
            key: "totalPoints",
            width: "25%",
            render: (text) => <a>{text}</a>,
        },
        // {
        //     title: "Action",
        //     key: "action",
        //     render: (_, record) => (
        //         <div>
        //             {(record.index === 1 ||
        //                 record.index === 2 ||
        //                 record.index === 3) && (
        //                 <Button
        //                     style={{
        //                         color: "white",
        //                     }}
        //                     type="primary"
        //                     size="large"
        //                     onClick={() => record.}
        //                 >
        //                     View Details
        //                 </Button>
        //             )}
        //         </div>
        //     ),
        // },
    ];

    const getUserStatisticsApiCall = async () => {
        const response = await getUserStatistics();
        const updatedUser = response.userData.map((e, index) => {
            return {
                ...e,
                index: index + 1,
                quizCreatedDate: dayjs
                    .unix(e.quizCreatedDate._seconds)
                    .toISOString(),
            };
        });
        setUserData(updatedUser);
        setFilterData(updatedUser);
        setCategoryList([
            ...response.categories.map((e) => {
                return {
                    value: e,
                    label: e,
                };
            }),
            {
                value: "all category",
                label: "all category",
            },
        ]);
    };
    const getTeamDataForLeaderBoard = async () => {
        const response = await getTeamStatistics();
        const data = response.teamLeaderBoardData.map((e) => {
            return {
                ...e,
                ratio: (+e.winGames / +e.playedGames) * 100,
            };
        });
        setUserData(data);
        setFilterData(data);
        // setCategory(response.unique_categories);
        return response;
    };

    const handleFilters = () => {
        let filterData = [];
        if (timeFrame === "all-time") {
            filterData = userData.filter((user) =>
                category !== "all category"
                    ? user.quizCategory === category
                    : true
            );
        } else if (timeFrame === "daily") {
            filterData = userData.filter(
                (user) =>
                    user.quizCategory === category &&
                    currentDate.diff(user.quizCreatedDate, "day") <= 1
            );
        } else if (timeFrame === "weekly") {
            filterData = userData.filter(
                (user) =>
                    user.quizCategory === category &&
                    currentDate.diff(user.quizCreatedDate, "day") <= 7
            );
        } else if (timeFrame === "monthly") {
            filterData = userData.filter(
                (user) =>
                    user.quizCategory === category &&
                    currentDate.diff(user.quizCreatedDate, "day") <= 30
            );
        }
        setFilterData(filterData);
    };

    useEffect(() => {
        getUserStatisticsApiCall();
    }, []);

    useEffect(() => {
        handleFilters();
    }, [category, timeFrame]);

    const setFilterType = (value) => {
        if (value === "individual") {
            getUserStatisticsApiCall();
        } else {
            //TODO: TEAM API
            getTeamDataForLeaderBoard();
            // Set teamDATA AND FILTER DATA
        }
        setType(value);
        setCategory("all category");
        setTimeFrame("all-time");
    };

    const handleSearch = () => {
        const searchData = {
            type,
            category,
            timeFrame,
        };
    };
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
                <h1 className="leaderboard-header">Leaderboard</h1>
                <div className="leaderboard-filters">
                    <div
                        style={{
                            display: "flex",
                            gap: "15px",
                        }}
                    >
                        <Select
                            showSearch
                            style={{ width: 300 }}
                            size="large"
                            placeholder="Select a category"
                            optionFilterProp="children"
                            onChange={onChangeCategory}
                            onSearch={onSearch}
                            filterOption={(input, option) =>
                                (option?.label ?? "")
                                    .toLowerCase()
                                    .includes(input.toLowerCase())
                            }
                            options={categoryList}
                        />
                        <Select
                            defaultValue={"all-time"}
                            size="large"
                            style={{ width: 300 }}
                            onChange={handleChange}
                            options={timeConstant}
                        />
                    </div>
                    <Radio.Group
                        value={type}
                        onChange={(e) => setFilterType(e.target.value)}
                        size="large"
                        buttonStyle="solid"
                    >
                        <Radio.Button
                            value="team"
                            style={{ width: 150, textAlign: "center" }}
                        >
                            Team
                        </Radio.Button>
                        <Radio.Button
                            value="individual"
                            style={{ width: 150, textAlign: "center" }}
                        >
                            Individual
                        </Radio.Button>
                    </Radio.Group>
                </div>
                {/* <div>
                    <Button
                        type="primary"
                        size="large"
                        style={{ width: 300, marginTop: "1rem" }}
                        onClick={() => handleSearch()}
                    >
                        Search
                    </Button>
                </div> */}
                <Divider />
                {type === "individual" ? (
                    <Table
                        columns={userDataColumns}
                        dataSource={filterData}
                        pagination={false}
                    />
                ) : (
                    <Table
                        columns={teamDatacolumns}
                        dataSource={filterData}
                        pagination={false}
                    />
                )}
            </ConfigProvider>
        </>
    );
};

export default Leaderboard;
