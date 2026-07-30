import App from "./App";
import LogIn from "./components/logIn/LogIn";
import SignUp from "./components/signUp/SignUp";

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: null,
  },

  {
    path: "sign-up",
    element: <SignUp />,
  },
  {
    path: "log-in",
    element: <LogIn />,
  },
];

export default routes;
