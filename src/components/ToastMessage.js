import { message } from "antd";

const ToastMessage = (messageText, type = "success") => {
  if (type === "success") {
    message.success(messageText, 3);
  } else {
    message.error(messageText, 3);
  }
  return null;
};

export default ToastMessage;
