import { Fragment, useEffect, useState } from "react";
import classes from "./Navbar.module.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { showHide } from "../features/modal";
import { logout } from "../features/user";

export const Navbar = () => {
    const user = useSelector((state) => state.user.value);
    const modal = useSelector((state) => state.modal.value);
    const dispatch = useDispatch();
    const addVacation = (e) => {
        e.preventDefault();
        dispatch(showHide({ isShown: !modal.isShown }));
    };

    const [loggedIn, setLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        setLoggedIn(user && user.loggedIn);
        setIsAdmin(user && user.isAdmin && user.loggedIn);

    }, [user]);

    return (<Fragment>
        <div className={ classes.topNav }>
            { loggedIn && isAdmin && <Link to='/admin-panel'>
                Admin Panel
            </Link> }
            { loggedIn && isAdmin && <Link to='/' onClick={ addVacation }>
                Add Vacation
            </Link> }
            { loggedIn && <Link to={ '/vacation-list' }>
                Vacation List
            </Link> }
            { loggedIn && <Link to={ '/logout' } onClick={ () => dispatch((logout())) }>
                Logout
            </Link> }
            { !loggedIn && <Link to={ '/login' }>
                Login
            </Link> }
            { !loggedIn && <Link to={ '/register' }>
                Register
            </Link> }
        </div>
    </Fragment>);

}
