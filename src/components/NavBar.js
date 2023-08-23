import React from "react";
import { Menu } from "antd";
import {
  HomeOutlined,
  FundOutlined,
  SettingOutlined,
  TeamOutlined,
  BarChartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <Menu
      mode="horizontal"
      theme="dark"
      style={{
        fontSize: "large",
      }}
    >
      <Menu.Item key="home" icon={<HomeOutlined />}>
        <Link to="/games">Games</Link>
      </Menu.Item>
      <Menu.Item key="myTeam" icon={<TeamOutlined />}>
        <Link to="/myteam">My Team</Link>
      </Menu.Item>
      <Menu.Item key="leaderboard" icon={<BarChartOutlined />}>
        <Link to="/leaderboard">Leaderboard</Link>
      </Menu.Item>
      <Menu.Item key="Statistics" icon={<FundOutlined />}>
        <Link to="/reportAnalytics">Score Statistics</Link>
      </Menu.Item>
      <Menu.Item key="myProfile" icon={<UserOutlined />}>
        <Link to="/user/profile">Manage Profile</Link>
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        Settings
      </Menu.Item>
    </Menu>
  );
};

export default NavBar;
