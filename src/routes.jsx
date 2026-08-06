import App from "./App";
import ChatsScreen from "./components/chats/ChatsScreen";
import LogIn from "./components/logIn/LogIn";
import LogOut from "./components/logOut/LogOut";
import Post from "./components/post/Post";
import PostForm from "./components/postForm/PostForm";
import Profile from "./components/profile/Profile";
import ProfileForm from "./components/profileForm/ProfileForm";
import SignUp from "./components/signUp/SignUp";

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: null,
    children: [
      {
        path: "sign-up",
        element: <SignUp />,
      },
      {
        path: "log-in",
        element: <LogIn />,
      },
      {
        path: "log-out",
        element: <LogOut />,
      },
      {
        path: "profile/edit",
        element: <ProfileForm />,
      },
      {
        path: "profile/:userId",
        element: <Profile />,
      },
      {
        path: "post/new",
        element: <PostForm />,
      },
      {
        path: "post/:postId/edit",
        element: <PostForm />,
      },
      {
        path: "post/:postId",
        element: <Post />,
      },
      {
        path: "messages",
        element: <ChatsScreen />,
      },
    ],
  },
];

export default routes;
