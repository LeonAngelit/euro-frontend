import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
const Home = lazy(() => import("./Views/App/Home"));
const NotFound = lazy(() => import("./Components/NotFoundComponent/NotFound"));
const UserDetails = lazy(() => import("./Views/UserDetails/UserDetails"));
const Login = lazy(() => import("./Views/Login/Login"));
const SignUp = lazy(() => import("./Views/CreateUser/SignUp"));
const CreateRoom = lazy(() => import("./Views/CreateRoom/CreateRoom"));
const AdminView = lazy(() => import("./Views/AdminView/AdminView"));
function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        <Routes>
          <Route path={"/app"} exact={true} element={<Home />} />
          <Route path={"/login"} exact={true} element={<Login />} />
          <Route path={"/signup"} exact={true} element={<SignUp />} />
          <Route path={"/profile"} exact={true} element={<UserDetails />} />
          <Route path={"/createroom"} exact={true} element={<CreateRoom />} />
          <Route path={"/admin"} exact={true} element={<AdminView />} />
          <Route path={"*"} element={<NotFound />} />
        </Routes>
      </div>
    </Suspense>
  );
}

export default App;
