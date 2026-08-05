import App from "./App";
import ChatsScreen from "./components/chats/ChatsScreen";
import LogIn from "./components/logIn/LogIn";
import LogOut from "./components/logOut/LogOut";
import PostForm from "./components/postForm/PostForm";
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
        path: "post/new",
        element: <PostForm />,
      },
      {
        path: "post/:postId/edit",
        element: <PostForm />,
      },
      {
        path: "messages",
        element: <ChatsScreen />,
      },
    ],
  },
];

export default routes;
