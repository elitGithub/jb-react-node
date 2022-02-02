import { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import classes from "../Components/Login.module.css";
import { Link, Navigate } from "react-router-dom";
import { login } from "../features/user";

const Login = () => {
    const emailRef = useRef();
    const errRef = useRef();

    const user = useSelector((state) => state.user.value);

    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [errMessage, setErrMsg] = useState('');
    const [redirect, setRedirect] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        emailRef.current.focus();
    }, []);
    useEffect(() => {
        setErrMsg('');
    }, [userName, password]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loginSuccess = await dispatch(login({ userName, password }));
        if (loginSuccess.meta.requestStatus === 'rejected') {
            setErrMsg(loginSuccess.payload.message ? loginSuccess.payload.message : 'Error occurred');
        } else if (loginSuccess.meta.requestStatus === 'fulfilled') {
            setRedirect(loginSuccess.payload.success);
        }
    }

    return (<Fragment>
        { redirect && <Navigate to="/"/> }
        <form onSubmit={ handleSubmit } className="form">
            <p ref={ errRef } className={ errMessage ? "errorMessage" : "offScreen" } aria-live="assertive">{ errMessage }</p>
            <h2>Sign In</h2>
            <div className={ classes['input-parent'] }>
                <label htmlFor="username">Username:</label>
                <input
                    type="email"
                    name="username"
                    inputMode="email"
                    id="username"
                    ref={ emailRef }
                    autoComplete="off"
                    onChange={ e => setUserName(e.target.value) }
                    value={ userName }
                    required/>

            </div>
            <div className={ classes['input-parent'] }>
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    autoComplete="off"
                    onChange={ e => setPassword(e.target.value) }
                    value={ password }
                    required/>
            </div>
            <div className={ classes['button-wrapper'] }>
                <button className={ classes['login-btn'] } type="submit">Login</button>
                <button className={ classes['login-btn'] }><Link to="/register">Don't have an account?</Link></button>
            </div>
        </form>

    </Fragment>)
};

export default Login;
