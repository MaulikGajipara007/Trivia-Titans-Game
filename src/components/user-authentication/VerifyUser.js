import React from 'react';
import { Form, Input, Button, Typography } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../App.css';
const { Title, Text } = Typography;


export default function VerifyEmail() {

    const navigate = useNavigate();

    // On finish will trigger when Verify button is clicked
    const onFinish = async (values) => {
        console.log('Received values of form: ', values);

        // Triggering Verify email POST API with payload- values
        try {
            const response = await axios.post("https://app-2ktlibfmua-uc.a.run.app/confirm-user", values);

            console.log("Response from the API: ", response.data);
            console.log("Message : " + response.data.message);

            // handling responses from the api
            if (response.data.message === "User Confirmation Successful") {
                alert("Email Verification Successful.")
                navigate("/user/login");
            } else {
                alert("Email Verification Failed")
                navigate("user/register");
            }

        } catch (error) {
            console.error("Error: ", error.response);
        }
    };

    return (
        // HTML Component of Verify Email Form
        <div className='form'>
            <Title level={2}>Verify Email</Title>
            <Text type="secondary">Please check your registered email for the confirmation code.</Text>
            <Form
                name="verifyEmail"
                onFinish={onFinish}
            >
                <Form.Item
                    name="email"
                    rules={[
                        {
                            type: 'email',
                            message: 'The input is not valid E-mail!',
                        },
                        {
                            required: true,
                            message: 'Please input your E-mail!',
                        },
                    ]}
                >
                    <Input placeholder="Email" />
                </Form.Item>

                <Form.Item
                    name="confirmationCode"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your confirmation code!',
                        },
                    ]}
                >
                    <Input placeholder="Confirmation Code" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Verify
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}
