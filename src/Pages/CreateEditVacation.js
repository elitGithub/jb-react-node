import Modal from "../Components/Modal";
import classes from "../Components/CreateEditVacation.module.css";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showHide } from "../features/modal";
import { validateAlphanumeric, validateNumbers } from "../shared/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faInfoCircle, faTimes } from "@fortawesome/free-solid-svg-icons";
import { createVacation, listVacations, updateVacation } from "../features/vacation";
import fileService from "../services/fileService";
import * as moment from 'moment';
import vacationService from "../services/vacationService";


const CreateEditVacation = props => {
    const user = useSelector((state) => state.user.value);
    const modal = useSelector((state) => state.modal.value);
    const dispatch = useDispatch();
    const vacationNameRef = useRef();
    const errRef = useRef();

    const [editMode, setEditMode] = useState(false);
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
    const [directLink, setDirectLink] = useState(false);
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

    const editingVacation = async () => {
        const res = await vacationService.one(modal.vacation._id);
        if (res.hasOwnProperty('success') && res.success === true) {
            console.log(res.data);
            let startDate = moment(new Date(res.data.dateStart)).format('yyyy-MM-DD');
            let endDate = moment(new Date(res.data.dateEnd)).format('yyyy-MM-DD');

            setName(res.data.name ?? '');
            setDescription(res.data.description ?? '');
            setPrice(res.data.price ?? '');
            setImageUrl(res.data.image ?? '');
            setDateStart(startDate ?? '');
            setDateEnd(endDate ?? '');
            setEditMode(true);
        }
    }

    useEffect(() => {
        setEditMode(false);
        if ((Object.keys(modal.vacation).length > 0)) {
            editingVacation();
        }
        setErrMessage('');
    }, [modal])


    useEffect(() => {
        vacationNameRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMessage('');
        if (name.length < 3) {
            setValidName(false);
            return;
        }
        setValidName(validateAlphanumeric(name));
    }, [name]);

    useEffect(() => {
        setErrMessage('');
        if (description.length < 3) {
            setValidDesc(false);
            return;
        }
        setValidDesc(validateAlphanumeric(description));
    }, [description]);

    useEffect(() => {
        setErrMessage('');
        setValidPrice(validateNumbers(price));
    }, [price]);


    const closeModal = () => {
        dispatch(showHide(false));
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        let newFile = imageUrl;
        if (file) {
            const fileUpload = await fileService.upload(file);
            if (!fileUpload.hasOwnProperty('success') || fileUpload.success !== true) {
                setErrMessage('An error has occurred during file upload.');
                return;
            }
            newFile = fileUpload.data.name;
        }

        if (!name || !description || !imageUrl || !dateStart || !dateEnd || !price) {
            setErrMessage('All fields are required.')
            switch (true) {
                case !name:
                    setErrMessage('Vacation name is missing.');
                    break;
                case !description:
                    setErrMessage('Vacation description is missing.');
                    break;
                case !imageUrl:
                    setErrMessage('Vacation image is missing.');
                    break;
                case !dateStart:
                    setErrMessage('No start date.');
                    break;
                case !dateEnd:
                    setErrMessage('No end date.');
                    break;
                case !price:
                    setErrMessage('No price.');
                    break;
            }
            return;
        }

        await setImageUrl(newFile);
        if (editMode) {
            await editVacation(newFile);
        } else {
            await newVacation(newFile);
        }

        dispatch(listVacations());
    }

    const editVacation = async (newFile) => {
        const result = await dispatch(updateVacation({ id: modal.vacation._id, name, description, image: newFile, dateStart, dateEnd, price }));
        if (!(result.meta.requestStatus === "fulfilled")) {
            setErrMessage(result.payload.message ? result.payload.message : 'An error occurred');
            errRef.current.focus();
            return;
        }
        closeModal();
    }

    const newVacation = async (newFile) => {
        const result = await dispatch(createVacation({ name, description, image: newFile, dateStart, dateEnd, price }));
        if (!(result.meta.requestStatus === "fulfilled")) {
            setErrMessage(result.payload.message ? result.payload.message : 'An error occurred');
            errRef.current.focus();
            return;
        }
        closeModal();
    }

    const validateFile = async (e) => {
        setErrMessage('');
        const file = e.target.files[0];
        if (!file) {
            return;
        }
        if (!fileService.validate(file)) {
            setErrMessage('Unsupported file type.');
            setFile(null);
            return;
        }

        await setFile(file);
        await setImageUrl(file.name);
    }

    return (<Modal>
            { user.isAdmin && <form onSubmit={ onSubmit }>
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
                        English letters and numbers only.
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
                { directLink && <div className={ classes['input-parent'] }>
                    <label htmlFor="image-link">Image URL</label>
                    <input
                        type="text"
                        name="image-link"
                        value={ image }
                        onChange={ (e) => {
                            setImageUrl(e.target.value)
                        } }/>
                </div> }
                { !directLink && <div className={ classes['input-parent'] }>
                    <label htmlFor="image-link">Upload File</label>
                    <input
                        type="file"
                        name="image-link"
                        onChange={ validateFile }/>
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
                    <button className="login-btn" disabled={ errMessage !== '' } type="submit">{ editMode ? 'Update' : 'Create'}</button>
                    <button className="login-btn" onClick={ closeModal }>Cancel</button>
                </div>
            </form> }
        </Modal>
    );
};

export default CreateEditVacation;
