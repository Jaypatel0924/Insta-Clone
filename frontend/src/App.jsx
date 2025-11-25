// import { useEffect } from 'react'
// import ChatPage from './components/ChatPage'
// import EditProfile from './components/EditProfile'
// import Home from './components/Home'
// import Login from './components/Login'
// import MainLayout from './components/MainLayout'
// import Profile from './components/Profile'
// import Signup from './components/Signup'
// import { createBrowserRouter, RouterProvider } from 'react-router-dom'
// import { io } from "socket.io-client";
// import { useDispatch, useSelector } from 'react-redux'
// import { setSocket } from './redux/socketSlice'
// import { setOnlineUsers } from './redux/chatSlice'
// import { setLikeNotification } from './redux/rtnSlice'
// import ProtectedRoutes from './components/ProtectedRoutes'


// const browserRouter = createBrowserRouter([
//   {
//     path: "/",
//     element: <ProtectedRoutes><MainLayout /></ProtectedRoutes>,
//     children: [
//       {
//         path: '/',
//         element: <ProtectedRoutes><Home /></ProtectedRoutes>
//       },
//       {
//         path: '/profile/:id',
//         element: <ProtectedRoutes> <Profile /></ProtectedRoutes>
//       },
//       {
//         path: '/account/edit',
//         element: <ProtectedRoutes><EditProfile /></ProtectedRoutes>
//       },
//       {
//         path: '/chat',
//         element: <ProtectedRoutes><ChatPage /></ProtectedRoutes>
//       },
//     ]
//   },
//   {
//     path: '/login',
//     element: <Login />
//   },
//   {
//     path: '/signup',
//     element: <Signup />
//   },
// ])

// function App() {
//   const { user } = useSelector(store => store.auth);
//   const { socket } = useSelector(store => store.socketio);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     if (user) {
//       const socketio = io('http://localhost:8000', {
//         query: {
//           userId: user?._id
//         },
//         transports: ['websocket']
//       });
//       dispatch(setSocket(socketio));

//       // listen all the events
//       socketio.on('getOnlineUsers', (onlineUsers) => {
//         dispatch(setOnlineUsers(onlineUsers));
//       });

//       socketio.on('notification', (notification) => {
//         dispatch(setLikeNotification(notification));
//       });

//       return () => {
//         socketio.close();
//         dispatch(setSocket(null));
//       }
//     } else if (socket) {
//       socket.close();
//       dispatch(setSocket(null));
//     }
//   }, [user, dispatch]);

//   return (
//     <>
//       <RouterProvider router={browserRouter} />
//     </>
//   )
// }

// export default App
import { useEffect } from 'react'
import ChatPage from './components/ChatPage'
import EditProfile from './components/EditProfile'
import Home from './components/Home'
import Login from './components/Login'
import MainLayout from './components/MainLayout'
import Profile from './components/Profile'
import Signup from './components/Signup'
import SearchPage from './components/SearchPage'
import SinglePost from './components/SinglePost'
import Stories from './components/Stories'
import Reels from './components/Reels'
import Explore from './components/Explore'
import Notifications from './components/Notifications'
import Settings from './components/Settings'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'
import { setOnlineUsers } from './redux/chatSlice'
import { setLikeNotification } from './redux/rtnSlice'
import ProtectedRoutes from './components/ProtectedRoutes'

import { initSocket, closeSocket } from "./socket";

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoutes><MainLayout /></ProtectedRoutes>,
    children: [
      { path: '/', element: <ProtectedRoutes><Home /></ProtectedRoutes> },
      { path: '/profile/:id', element: <ProtectedRoutes><Profile /></ProtectedRoutes> },
      { path: '/account/edit', element: <ProtectedRoutes><EditProfile /></ProtectedRoutes> },
      { path: '/chat', element: <ProtectedRoutes><ChatPage /></ProtectedRoutes> },
      { path: '/search', element: <ProtectedRoutes><SearchPage /></ProtectedRoutes> },
      {
        path: '/post/:id',
        element: <ProtectedRoutes><SinglePost /></ProtectedRoutes>
      },
      {
        path: '/stories',
        element: <ProtectedRoutes><Stories /></ProtectedRoutes>
      },
      {
        path: '/reels',
        element: <ProtectedRoutes><Reels /></ProtectedRoutes>
      },
      {
        path: '/explore',
        element: <ProtectedRoutes><Explore /></ProtectedRoutes>
      },
      {
        path: '/notifications',
        element: <ProtectedRoutes><Notifications /></ProtectedRoutes>
      },
      {
        path: '/settings',
        element: <ProtectedRoutes><Settings /></ProtectedRoutes>
      }
    ]
  },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> }
]);

function App() {
  const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const socket = initSocket(user._id);

      socket.on("getOnlineUsers", (list) => {
        dispatch(setOnlineUsers(list));
      });

      socket.on("notification", (notification) => {
        dispatch(setLikeNotification(notification));
      });

      return () => closeSocket();
    } else {
      closeSocket();
    }
  }, [user]);

  return (
    <RouterProvider router={browserRouter} />
  )
}

export default App;