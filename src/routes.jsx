import App from "./App";
import ChatsScreen from "./components/chats/ChatsScreen";
import Friends from "./components/friends/Friends";
import FriendsRequests from "./components/friends/FriendsRequests";
import Suggested from "./components/friends/Suggested";
import LogIn from "./components/logIn/LogIn";
import LogOut from "./components/logOut/LogOut";
import Post from "./components/post/Post";
import Posts from "./components/post/Posts";
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
      {
        path: "feed",
        element: <Posts />,
      },
      {
        path: "friends/:userId?",
        element: <Friends />,
      },
      {
        path: "friends-requests",
        element: <FriendsRequests />,
      },
      {
        path: "suggested",
        element: <Suggested />,
      },
    ],
  },
];

export default routes;
