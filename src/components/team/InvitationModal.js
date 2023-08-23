import { Modal } from "antd";
// import { acceptInvitation, declineInvitation } from "../../services/teamApi";

const { confirm } = Modal;

export const showPromiseConfirm = (teamDetails) => {
    console.log(teamDetails);
    confirm({
        title: `Do you want to accept these invitation to join ${teamDetails.teamName}`,
        okText: "Accept",
        cancelText: "Decline",
        async onOk() {
            try {
                // acceptInvitation();
                return await new Promise((resolve, reject) => {
                    setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                });
            } catch {
                return console.log("Oops errors!");
            }
        },
        async onCancel() {
            try {
                // declineInvitation();
                return "Decline";
            } catch {
                return console.log("Oops errors!");
            }
        },
    });
};
