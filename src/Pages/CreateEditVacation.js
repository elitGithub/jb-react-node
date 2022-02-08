import Modal from "../Components/Modal";
import classes from "../Components/Login.module.css";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showHide } from "../features/modal";

const CreateEditVacation = props => {
    const user = useSelector((state) => state.user.value);
    const dispatch = useDispatch();
    const emailRef = useRef();
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


    const handleChange = (event) => {

    }
// https://blog.mobrand.com/wp-content/uploads/2020/12/Penang_Malasya-300x131.png
    const closeModal = () => {
        dispatch(showHide({ isShown: false }));
    }

    const onSubmit = () => {

    }
    return (<Modal>
        <form onSubmit={ onSubmit }>
            <h2>{ props.title }</h2>
            <div className={ classes['input-parent'] }>
                <label htmlFor="name">Vacation Name</label>
                <input className={ inputError ? classes['input-error'] : '' }
                       type="text"
                       name="name"
                       value={ inputs.vacationName }
                       onInput={ handleChange }/>
            </div>
            <div className={ classes['input-parent'] }>
                <label htmlFor="description">Description</label>
                <input className={ inputError ? classes['input-error'] : '' }
                       type="text"
                       name="description"
                       value={ inputs.description }
                       onInput={ handleChange }/>
            </div>
            <div className={ classes['input-parent'] }>
                <label htmlFor="image-link">Image URL</label>
                <input className={ inputError ? classes['input-error'] : '' }
                       type="text"
                       name="image-link"
                       value={ inputs.image }
                       onInput={ handleChange }/>
            </div>
            <div className={ classes['input-parent'] }>
                <label htmlFor="dateStart">Date Start</label>
                <input className={ inputError ? classes['input-error'] : '' }
                       type="date"
                       name="dateStart"
                       value={ inputs.dateStart }
                       onInput={ handleChange }/>
            </div>
            <div className={ classes['input-parent'] }>
                <label htmlFor="dateEnd">Date End</label>
                <input className={ inputError ? classes['input-error'] : '' }
                       type="date"
                       name="dateEnd"
                       value={ inputs.dateEnd }
                       onInput={ handleChange }/>
            </div>
            <div className={ classes['input-parent'] }>
                <label htmlFor="price">Price</label>
                <input className={ inputError ? classes['input-error'] : '' }
                       type="text"
                       name="price"
                       value={ inputs.price }
                       onInput={ handleChange }/>
            </div>
            <div className={ classes['button-wrapper'] }>
                <button className={ classes['login-btn'] } type="submit">Create</button>
                <button className={ classes['cancel-btn'] } onClick={ closeModal }>Cancel</button>
            </div>
        </form>
    </Modal>);
};

export default CreateEditVacation;
