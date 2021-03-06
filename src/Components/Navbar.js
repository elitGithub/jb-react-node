import { Fragment, useEffect, useState } from "react";
import classes from "./Navbar.module.css";
import { Link, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { showHide } from "../features/modal";
import { logout } from "../features/user";

export const Navbar = (props) => {
    const user = useSelector((state) => state.user.value);
    const modal = useSelector((state) => state.modal.value);
    const dispatch = useDispatch();
    const addVacation = (e) => {
        e.preventDefault();
        dispatch(showHide(true));
    };

    const reloadVacations = () => {
        props.reload();
    }

    const [loggedIn, setLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        setLoggedIn(user && user.loggedIn);
        setIsAdmin(user && user.isAdmin && user.loggedIn);

    }, [user]);

    const logOut = async (e) => {
        e.preventDefault();
        setLoggedIn(false);
        setIsAdmin(false);
        await dispatch((logout()));
    }

    return (<Fragment>
        <div className={ classes.topNav }>
            { loggedIn && isAdmin && <Link to='/admin-panel'>
                Admin Panel
            </Link> }
            { loggedIn && isAdmin && <Link to='/' onClick={ addVacation }>
                Add Vacation
            </Link> }
            { loggedIn && <Link to={ '/vacation-list' } onClick={ reloadVacations }>
                Vacation List
            </Link> }
            { loggedIn && <Link to={ '/login' } onClick={ logOut }>
                Logout
            </Link> }
            { !loggedIn && <Link to={ '/login' }>
                Login
            </Link> }
            { !loggedIn && <Link to={ '/register' }>
                Register
            </Link> }
            { loggedIn && <div className={ classes['topnav-right'] }>
                { loggedIn && <p className={ classes['user-greeting'] }>Hello, { user.firstName } { user.lastName }</p> }
            </div> }

        </div>
    </Fragment>);

}
