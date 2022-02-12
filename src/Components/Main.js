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

const Main = () => {
    const modal = useSelector((state) => state.modal.value);
    const [showModal, setShowModal] = useState(false);
    const [listVacations, setListVacations] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(refresh());
    }, []);

    useEffect(() => {
        setShowModal(modal.isShown);
    }, [modal]);

    const reload = () => {
        console.log('reload');
        setListVacations(true);
        return true;
    }

    return (
        <Fragment>
            <Router>
                <Navbar/>
                <Routes>
                    <Route path="/admin-panel" element={ <AdminPanel/> }/>
                    <Route path="/vacation-list" element={ <VacationList reload={reload} listVacations={listVacations} /> }/>
                    <Route path="/" element={ <VacationList reload={reload} listVacations={listVacations} /> }/>
                    <Route path="/login" element={ <Login/> }/>
                    <Route path="/register" element={ <Register/> }/>
                </Routes>
            </Router>
            { showModal && <CreateEditVacation /> }
        </Fragment>
    );
}

export default Main;
