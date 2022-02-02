import { BrowserRouter as Router, Route, Routes, } from "react-router-dom";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import { Fragment, useEffect, useState } from "react";
import { Navbar } from "./Navbar";
import VacationList from "../Pages/VacationList";
import AdminPanel from "../Pages/AdminPanel";
import CreateEditVacation from "../Pages/CreateEditVacation";
import { useDispatch, useSelector } from "react-redux";
import { refresh } from "../features/user";
import LoginService from "../services/loginService";

const Main = () => {
    const user = useSelector((state) => state.user.value);
    const modal = useSelector((state) => state.modal.value);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(refresh());

    }, []);
    return (

        <Fragment>
            <Router>
                <Navbar/>
                <Routes>
                    <Route path="/admin-panel" element={ <AdminPanel/> }/>
                    <Route path="/vacation-list" element={ <VacationList/> }/>
                    <Route path="/" element={ <VacationList/> }/>
                    <Route path="/login" element={ <Login/> }/>
                    <Route path="/register" element={ <Register/> }/>
                </Routes>
            </Router>
            { modal.isShown && <CreateEditVacation/> }
        </Fragment>
    );
}

export default Main;
