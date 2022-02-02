import { Fragment, useEffect, useRef, useState } from "react";
import classes from "../Components/Register.module.css";
import { Link, Navigate, } from "react-router-dom";
import { validateAlphanumeric, validateAndMatchPasswords, validatePassword, validateUserName } from "../shared/utils";
import { faCheck, faInfoCircle, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { register, login } from "../features/user";

const Register = () => {
    const user = useSelector((state) => state.user.value);
    const dispatch = useDispatch();
    const emailRef = useRef();
    const errRef = useRef();

    // Username
    const [email, setEmail] = useState('');
    const [emailFocus, setEmailFocus] = useState(false);
    const [validEmail, setValidEmail] = useState(false);
    // Username

    // Password
    const [password, setPassword] = useState('');
    const [passwordFocus, setPasswordFocus] = useState(false);
    const [validPassword, setValidPassword] = useState(false);
    // Password

    // Match Password
    const [confirmPwd, setConfirmPwd] = useState('');
    const [confirmPwdFocus, setConfirmPwdFocus] = useState(false);
    const [validConfirmPwd, setValidConfirmPwd] = useState(false);
    // Match Password

    // Passwords are valid and matching
    const [matchingPwds, setMatchingPwds] = useState(false);
    // Passwords are valid and matching


    // User's name
    const [firstName, setFirstName] = useState('');
    const [firstNameFocus, setFirstNameFocus] = useState(false);
    const [validFirstName, setValidFirstName] = useState(false);

    const [lastName, setLastName] = useState('');
    const [lastNameFocus, setLastNameFocus] = useState(false);
    const [validLastName, setValidLastName] = useState(false);
    // User's name

    const [errMessage, setErrMessage] = useState('');
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        emailRef.current.focus();
    }, []);

    useEffect(() => {
        setValidFirstName(validateAlphanumeric(firstName));
    }, [firstName]);

    useEffect(() => {
        setValidLastName(validateAlphanumeric(lastName));
    }, [lastName]);

    useEffect(() => {
        const result = validateUserName(email);
        setValidEmail(result);
    }, [email]);

    useEffect(() => {
        setValidPassword(validatePassword(password));
        setValidConfirmPwd(validatePassword(confirmPwd));
        setMatchingPwds(validateAndMatchPasswords(password, confirmPwd));
    }, [password, confirmPwd]);

    useEffect(() => {
        setErrMessage('')
    }, [email, password, confirmPwd]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateUserName(email) || !validateAndMatchPasswords(password, confirmPwd)) {
            setErrMessage('Invalid Entry');
            return;
        }

        const resUser = await dispatch(register({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            loggedIn: true,
            isAdmin: false,
        }));

        console.log('resUser', resUser);

        if (resUser.meta.requestStatus === 'fulfilled') {
            const loginSuccess = await dispatch(login(resUser.payload));
            if (loginSuccess.meta.requestStatus === 'rejected') {
                setErrMessage(loginSuccess.payload ? loginSuccess.payload : 'Error occurred' );
            } else if (loginSuccess.meta.requestStatus === 'fulfilled') {
                setRedirect(loginSuccess.payload.success);
            }
        } else if(resUser.meta.requestStatus === 'rejected') {
            setErrMessage(resUser.payload);
            errRef.current.focus();
        } else {
            setErrMessage('Registration failed');
            errRef.current.focus();
            setRedirect(false);
        }
    };

    return (<Fragment>
        {redirect && <Navigate to="/" />}
        <form onSubmit={handleSubmit} className="form">
            <p ref={errRef} className={errMessage ? "errorMessage" : "offScreen"}
               aria-live="assertive">{errMessage}</p>
            <h2>Register</h2>

            <div className={classes['input-parent']}>
                <label htmlFor="username">Username:
                    <FontAwesomeIcon icon={faCheck} className={validEmail ? classes.valid : classes.hide}/>
                    <FontAwesomeIcon icon={faTimes} className={validEmail || !email ? classes.hide : classes.invalid}/>
                </label>
                <input type="email"
                       id="username"
                       inputMode="email"
                       ref={emailRef}
                       autoComplete="off"
                       onChange={(e) => {
                           setEmail(e.target.value)
                       }}
                       required
                       aria-invalid={validEmail ? "false" : "true"}
                       aria-describedby="uidnote"
                       name="username"
                       value={email}
                       onFocus={() => setEmailFocus(true)}
                       onBlur={() => setEmailFocus(false)}/>
                <p id="uidnote"
                   className={emailFocus && email && !validEmail ? classes.instructions : "offScreen"}>
                    <FontAwesomeIcon icon={faInfoCircle}/>
                    Must be a valid email address.
                </p>
            </div>

            <div className={classes['input-parent']}>
                <label htmlFor="firstName">First Name:
                    <FontAwesomeIcon icon={faCheck} className={validFirstName ? classes.valid : classes.hide}/>
                    <FontAwesomeIcon icon={faTimes} className={validFirstName || !firstName ? classes.hide : classes.invalid}/>
                </label>
                <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={firstName || ""}
                    required
                    onInput={(e) => {
                        setFirstName(e.target.value)
                    }}
                    aria-invalid={validFirstName ? "false" : "true"}
                    aria-describedby="fnamenote"
                    onFocus={() => setFirstNameFocus(true)}
                    onBlur={() => setFirstNameFocus(false)}
                />
                <p id="fnamenote"
                   className={firstNameFocus && firstName && !validFirstName ? classes.instructions : "offScreen"}>
                    <FontAwesomeIcon icon={faInfoCircle}/>
                    Must be alphanumeric.
                </p>

            </div>
            <div className={classes['input-parent']}>
                <label htmlFor="lastName">Last Name:
                    <FontAwesomeIcon icon={faCheck} className={validLastName ? classes.valid : classes.hide}/>
                    <FontAwesomeIcon icon={faTimes} className={validLastName || !lastName ? classes.hide : classes.invalid}/>
                </label>
                <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    value={lastName || ""}
                    onInput={(e) => {
                        setLastName(e.target.value)
                    }}
                    required
                    aria-invalid={validLastName ? "false" : "true"}
                    aria-describedby="lnamenote"
                    onFocus={() => setLastNameFocus(true)}
                    onBlur={() => setLastNameFocus(false)}
                />
                <p id="lnamenote"
                   className={lastNameFocus && lastName && !validLastName ? classes.instructions : "offScreen"}>
                    <FontAwesomeIcon icon={faInfoCircle}/>
                    Must be alphanumeric.
                </p>
            </div>

            <div className={classes['input-parent']}>
                <label htmlFor="password">Password:
                    <FontAwesomeIcon icon={faCheck} className={validPassword ? classes.valid : classes.hide}/>
                    <FontAwesomeIcon icon={faTimes}
                                     className={validPassword || !password ? classes.hide : classes.invalid}/>
                </label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onInput={(e) => {
                        setPassword(e.target.value)
                    }}
                    required
                    aria-invalid={validPassword ? "false" : "true"}
                    aria-describedby="pwdnote"
                    onFocus={() => setPasswordFocus(true)}
                    onBlur={() => setPasswordFocus(false)}
                />
                <p id="pwdnote"
                   className={passwordFocus && !validPassword ? classes.instructions : "offScreen"}>
                    <FontAwesomeIcon icon={faInfoCircle}/>
                    At least 7 characters long.
                    Must contain at least one lower case and one upper case letter.
                    Allowed special characters:
                    <span aria-label="exclamation mark">!</span>
                    <span aria-label="at symbol">@</span>
                    <span aria-label="hashtag">#</span>
                    <span aria-label="dollar sign">$</span>
                    <span aria-label="percent">%</span>
                </p>
            </div>

            <div className={classes['input-parent']}>
                <label htmlFor="confirmPass">
                    Confirm Password:
                    <span className={matchingPwds && validConfirmPwd ? classes.valid : classes.hide}>
                        <FontAwesomeIcon icon={faCheck}/>
                    </span>
                    <span className={matchingPwds || !validConfirmPwd ? classes.hide : classes.invalid}>
                        <FontAwesomeIcon icon={faTimes}/>
                    </span>

                </label>
                <input
                    type="password"
                    id="confirmPass"
                    value={confirmPwd}
                    onInput={(e) => {
                        setConfirmPwd(e.target.value)
                    }}
                    required
                    aria-invalid={validConfirmPwd ? "false" : "true"}
                    aria-describedby="confirm-note"
                    onFocus={() => setConfirmPwdFocus(true)}
                    onBlur={() => setConfirmPwdFocus(false)}
                />
                <p id="confirm-note"
                   className={confirmPwdFocus && !matchingPwds ? classes.instructions : "offScreen"}>
                    <FontAwesomeIcon icon={faInfoCircle}/>
                    Must match the password input field.
                </p>
            </div>

            <div className={classes['button-wrapper']}>
                <button className={classes['login-btn']} type="submit"
                        disabled={!validFirstName || !validLastName || !validEmail || !matchingPwds}
                        onClick={handleSubmit}>Register
                </button>
                <button className={classes['login-btn']}><Link to="/login">Already Have an account?</Link></button>
            </div>
        </form>
    </Fragment>)
}

export default Register;
