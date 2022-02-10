import Modal from "../Components/Modal";
import classes from "../Components/CreateEditVacation.module.css";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showHide } from "../features/modal";
import { validateAlphanumeric, validateNumbers } from "../shared/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faInfoCircle, faTimes } from "@fortawesome/free-solid-svg-icons";
import { createVacation } from "../features/vacation";
import fileService from "../services/fileService";

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

    // File
    const [file, setFile] = useState('');

    const [price, setPrice] = useState('');
    const [validPrice, setValidPrice] = useState(false);
    const [priceFocus, setPriceFocus] = useState(false);

    const [errMessage, setErrMessage] = useState('');

    useEffect(() => {
        setName(props.name ?? '');
        setDescription(props.description ?? '');
        setPrice(props.price ?? '');
        setImage(props.image ?? '');
        setDateStart(props.dateStart ?? '');
        setDateEnd(props.dateEnd ?? '');
        setErrMessage('');
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

    useEffect(() => {
        setValidPrice(validateNumbers(price));
    }, [price]);


    const closeModal = () => {
        dispatch(showHide({ isShown: false }));
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        const fileUpload = await fileService.upload(file);

        console.log(fileUpload);
        if (fileUpload.hasOwnProperty('success') && fileUpload.success === true) {
            setImageUrl(fileUpload.link);
        } else {
            setErrMessage('An error has occurred during file upload.');
            return;
        }
        if (!name || !description || !imageUrl || !dateStart || !dateEnd || !price) {
            setErrMessage('All fields are required.')
            return;
        }

        const result = await dispatch(createVacation({ name, description, imageUrl, dateStart, dateEnd, price }));
        // if (resUser.meta.requestStatus === 'rejected')
        if (result.meta.requestStatus === 'rejected') {
            setErrMessage(result.payload.message ? result.payload.message : 'An error ocurred');
            errRef.current.focus();
        } else if (result.meta.requestStatus === "fulfilled") {

        } else if (!result.meta.requestStatus) {
            setErrMessage('An error occurred');
            errRef.current.focus();
        }
    }


    const uploadFile = (e) => {
        const file = e.target.files[0];
        if (!file) {
            return;
        }
        setFile(file);
    }

    return (<Modal>
            { user.isAdmin && <form onSubmit={ onSubmit } >
                <p ref={ errRef } className={ errMessage ? "errorMessage" : "offScreen" }
                   aria-live="assertive">{ errMessage }</p>
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
                        required
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
                    <label htmlFor="description">Description
                        <FontAwesomeIcon icon={ faCheck } className={ validDesc ? classes.valid : classes.hide }/>
                        <FontAwesomeIcon icon={ faTimes }
                                         className={ validDesc || !description ? classes.hide : classes.invalid }/>
                    </label>
                    <input
                        type="text"
                        name="description"
                        value={ description }
                        onChange={ (e) => {
                            setDescription(e.target.value)
                        } }
                        required
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
                <div className={ classes['input-parent'] }>
                    <label htmlFor="price">Price
                        <FontAwesomeIcon icon={ faCheck } className={ validPrice ? classes.valid : classes.hide }/>
                        <FontAwesomeIcon icon={ faTimes }
                                         className={ validPrice || !price ? classes.hide : classes.invalid }/></label>
                    <input
                        type="text"
                        name="price"
                        value={ price }
                        required
                        aria-describedby="pricenote"
                        onChange={ (e) => {
                            setPrice(e.target.value)
                        } }
                        onFocus={ () => setPriceFocus(true) }
                        onBlur={ () => setPriceFocus(false) }/>
                    <p id="pricenote"
                       className={ priceFocus && price && !validPrice ? classes.instructions : "offScreen" }>
                        <FontAwesomeIcon icon={ faInfoCircle }/>
                        Must be numbers only.
                    </p>
                </div>
                { imageUrl && <div className={ classes['input-parent'] }>
                    <label htmlFor="image-link">Image URL</label>
                    <input
                        type="text"
                        name="image-link"
                        value={ image }
                        required
                        onChange={ (e) => {
                            setImageUrl(e.target.value)
                        } }/>
                </div> }
                { !imageUrl && <div className={ classes['input-parent'] }>
                    <label htmlFor="image-link">Upload File</label>
                    <input
                        type="file"
                        name="image-link"
                        required
                        onChange={ uploadFile }/>
                </div> }
                <div className={ classes['input-parent'] }>
                    <label htmlFor="dateStart">Date Start</label>
                    <input
                        type="date"
                        name="dateStart"
                        value={ dateStart }
                        required
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
                        required
                        onChange={ (e) => {
                            setDateEnd(e.target.value)
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
