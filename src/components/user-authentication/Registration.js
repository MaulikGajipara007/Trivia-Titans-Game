import React from "react";
import { Form, Input, Button, DatePicker, Select, Typography } from "antd";
import axios from "axios";
import "../../App.css";
import { useNavigate } from "react-router-dom";
const { Option } = Select;
const { Title } = Typography;

export default function Registration() {
  const navigate = useNavigate();

  // On finish will trigger when register button is clicked
  const onFinish = async (values) => {
    values.birthdate = values.birthdate.format("YYYY-MM-DD");

    console.log("Received values of form: ", values);

    //params for email
    const params2 = {
      user: values.email,
    };

    // Triggering Register POST API with payload- values
    try {
      const response = await axios.post(
        "https://app-2ktlibfmua-uc.a.run.app/register-user",
        values
      );

      //email
      // const response2 = await axios.post("https://btx2z6qsqe3hsd7rtb7bwox4fi0ronkg.lambda-url.us-east-1.on.aws/", JSON.stringify(params2));

      fetch(
        "https://btx2z6qsqe3hsd7rtb7bwox4fi0ronkg.lambda-url.us-east-1.on.aws/",
        { method: "POST", body: JSON.stringify(params2) }
      )
        .then((res) => res.json())
        .then((res) => console.log("resss ss==>", res))
        .catch((err) => console.log("eror from api ==>", err));

      console.log("Response from the API: ", response.data);
      console.log("Message : " + response.data.message);

      // handling responses from the api
      if (response.data.message === "User Registration Successful") {
        alert("User Registration Successful");
        navigate("/user/verify-email");
      } else {
        alert("User Registration Failed");
        navigate("user/register");
      }
    } catch (error) {
      console.error("Error: ", error.response);
    }
  };

  return (
    // HTML Component of Register
    <div className="form">
      <Title level={2}>Register</Title>
      <Form name="registration" onFinish={onFinish}>
        <Form.Item
          name="given_name"
          rules={[{ required: true, message: "Please input your given name!" }]}
        >
          <Input placeholder="Given Name" />
        </Form.Item>

        <Form.Item
          name="family_name"
          rules={[
            { required: true, message: "Please input your family name!" },
          ]}
        >
          <Input placeholder="Family Name" />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[
            {
              type: "email",
              message: "The input is not valid E-mail!",
            },
            {
              required: true,
              message: "Please input your E-mail!",
            },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item
          name="birthdate"
          rules={[{ required: true, message: "Please select your birthdate!" }]}
        >
          <DatePicker placeholder="Birthdate" />
        </Form.Item>

        <Form.Item
          name="gender"
          rules={[{ required: true, message: "Please select your gender!" }]}
        >
          <Select placeholder="Gender">
            <Option value="male">Male</Option>
            <Option value="female">Female</Option>
            <Option value="other">Other</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="securityQuestion1"
          initialValue="What is your favorite color?"
        >
          <Input disabled />
        </Form.Item>

        <Form.Item
          name="answer1"
          rules={[{ required: true, message: "Please input your answer!" }]}
        >
          <Input placeholder="Your Answer" />
        </Form.Item>

        <Form.Item
          name="securityQuestion2"
          initialValue="What is your pet's name?"
        >
          <Input disabled />
        </Form.Item>

        <Form.Item
          name="answer2"
          rules={[{ required: true, message: "Please input your answer!" }]}
        >
          <Input placeholder="Your Answer" />
        </Form.Item>

        <Form.Item
          name="securityQuestion3"
          initialValue="What city were you born in?"
        >
          <Input disabled />
        </Form.Item>

        <Form.Item
          name="answer3"
          rules={[{ required: true, message: "Please input your answer!" }]}
        >
          <Input placeholder="Your Answer" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
