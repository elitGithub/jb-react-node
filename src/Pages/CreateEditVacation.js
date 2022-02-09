import Modal from "../Components/Modal";
import classes from "../Components/CreateEditVacation.module.css";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showHide } from "../features/modal";
import { validateAlphanumeric } from "../shared/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faInfoCircle, faTimes } from "@fortawesome/free-solid-svg-icons";

const CreateEditVacation = props => {
    const user = useSelector((state) => state.user.value);
    const dispatch = useDispatch();
    const vacationNameRef = useRef();
    const errRef = useRef();

    // vacation Name
    const [name, setName] = useState('');
    const [nameFocus, setNameFocus] = useState(false);
    const [validName, setValidName] = useState(false);
    // vacation Name

    // Description
    const [description, setDescription] = useState('');
    const [descFocus, setDescFocus] = useState(false);
    const [validDesc, setValidDesc] = useState(false);
    // Description

    // Vacation Image
    const [image, setImage] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    // Vacation Image

    // Dates
    const [dateStart, setDateStart] = useState('');
    const [dateEnd, setDateEnd] = useState('');
    // Dates

    const [price, setPrice] = useState('');

    const [errMessage, setErrMessage] = useState('');

    useEffect(() => {
        setName(props.name);
        setDescription(props.description);
        setImage(props.image);
        setDateStart(props.dateStart);
        setDateEnd(props.dateEnd);
    }, [props])


    useEffect(() => {
        vacationNameRef.current.focus();
    }, []);

    useEffect(() => {
        setValidName(validateAlphanumeric(name));
    }, [name]);

    useEffect(() => {
        setValidDesc(validateAlphanumeric(description));
    }, [description]);


    const closeModal = () => {
        dispatch(showHide({ isShown: false }));
    }

    const onSubmit = () => {

    }
    return (<Modal>
            { user.isAdmin && <form onSubmit={ onSubmit } >
                <h2>{ props.title }</h2>
                <div className={ classes['input-parent'] }>
                    <label htmlFor="name">Vacation Name
                        <FontAwesomeIcon icon={ faCheck } className={ validName ? classes.valid : classes.hide }/>
                        <FontAwesomeIcon icon={ faTimes }
                                         className={ validName || !name ? classes.hide : classes.invalid }/>
                    </label>
                    <input
                        type="text"
                        name="name"
                        ref={ vacationNameRef }
                        value={ name }
                        onChange={ (e) => {
                            setName(e.target.value)
                        } }
                        aria-invalid={ validName ? "false" : "true" }
                        aria-describedby="namenote"
                        onFocus={ () => setNameFocus(true) }
                        onBlur={ () => setNameFocus(false) }/>
                    <p id="namenote"
                       className={ nameFocus && name && !validName ? classes.instructions : "offScreen" }>
                        <FontAwesomeIcon icon={ faInfoCircle }/>
                        Fill a fun name for the new vacation.
                    </p>
                </div>
                <div className={ classes['input-parent'] }>
                    <label htmlFor="description">Description</label>
                    <input
                        type="text"
                        name="description"
                        value={ description }
                        onChange={ (e) => {
                            setDescription(e.target.value)
                        } }
                        aria-invalid={ validDesc ? "false" : "true" }
                        aria-describedby="descnote"
                        onFocus={ () => setDescFocus(true) }
                        onBlur={ () => setDescFocus(false) }/>
                    <p id="descnote"
                       className={ descFocus && description && !validDesc ? classes.instructions : "offScreen" }>
                        <FontAwesomeIcon icon={ faInfoCircle }/>
                        Add some fun description.
                    </p>
                </div>
                { imageUrl && <div className={ classes['input-parent'] }>
                    <label htmlFor="image-link">Image URL</label>
                    <input
                        type="text"
                        name="image-link"
                        value={ image }
                        onChange={ (e) => {
                            setImageUrl(e.target.value)
                        } }/>
                </div> }
                { !imageUrl && <div className={ classes['input-parent'] }>
                    <label htmlFor="image-link">Upload File</label>
                    <input
                        type="file"
                        name="image-link"
                        value={ image }
                        onChange={ (e) => {
                            setImage(e.target.value)
                        } }/>
                </div> }
                <div className={ classes['input-parent'] }>
                    <label htmlFor="dateStart">Date Start</label>
                    <input
                        type="date"
                        name="dateStart"
                        value={ dateStart }
                        onChange={ (e) => {
                            setDateStart(e.target.value)
                        } }/>
                </div>
                <div className={ classes['input-parent'] }>
                    <label htmlFor="dateEnd">Date End</label>
                    <input
                        type="date"
                        name="dateEnd"
                        value={ dateEnd }
                        onChange={ (e) => {
                            setDateEnd(e.target.value)
                        } }/>
                </div>
                <div className={ classes['input-parent'] }>
                    <label htmlFor="price">Price</label>
                    <input
                        type="text"
                        name="price"
                        value={ price }
                        onChange={ (e) => {
                            setPrice(e.target.value)
                        } }/>
                </div>
                <div className={ classes['button-wrapper'] }>
                    <button className="login-btn" type="submit">Create</button>
                    <button className="login-btn" onClick={ closeModal }>Cancel</button>
                </div>
            </form> }
        </Modal>
    );
};

export default CreateEditVacation;
