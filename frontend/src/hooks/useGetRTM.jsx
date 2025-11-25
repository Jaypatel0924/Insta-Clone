// import { setMessages } from "@/redux/chatSlice";
// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";

// const useGetRTM = () => {
//     const dispatch = useDispatch();
//     const { socket } = useSelector(store => store.socketio);
//     const { messages } = useSelector(store => store.chat);
//     useEffect(() => {
//         socket?.on('newMessage', (newMessage) => {
//             dispatch(setMessages([...messages, newMessage]));
//         })

//         return () => {
//             socket?.off('newMessage');
//         }
//     }, [messages, setMessages]);
// };
// export default useGetRTM;

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "@/redux/chatSlice";
import { getSocket } from "@/socket";

const useGetRTM = () => {
  const dispatch = useDispatch();
  const { messages } = useSelector((store) => store.chat);

  useEffect(() => {
    const socket = getSocket(); // ✅ Get socket from global module

    if (!socket) return;

    const handler = (newMessage) => {
      dispatch(setMessages([...messages, newMessage]));
    };

    socket.on("newMessage", handler);

    return () => socket.off("newMessage", handler);
  }, [messages]);
};

export default useGetRTM;
