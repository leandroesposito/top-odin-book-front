import App from "./App";
import LogIn from "./components/logIn/LogIn";
import LogOut from "./components/logOut/LogOut";
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
    ],
  },
];

export default routes;
