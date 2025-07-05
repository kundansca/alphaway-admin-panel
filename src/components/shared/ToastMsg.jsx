// Example ToastMsg.js (adjust as per your implementation)
import { toast } from "react-toastify";

const ToastMsg = (message, type = "success") => {
  if (type === "success") toast.success(message);
  else toast.error(message);
};

export default ToastMsg;
