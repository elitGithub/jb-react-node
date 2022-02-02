import Modal from "../Components/Modal";
import classes from "../Components/Login.module.css";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { showHide } from "../features/modal";

const CreateEditVacation = props => {
    const [inputs, setInputs] = useState({});
    const [inputError, setInputError] = useState(false);
    const dispatch = useDispatch();

    const handleChange = (event) => {
        setInputError(false);
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }));
    }

    const closeModal = () => {
        dispatch(showHide({ isShown: false }));
    }
    return (<Modal>
        <form>
            <h2>{ props.title }</h2>
            <div className={ classes['input-parent'] }>
                <label htmlFor="name">Email</label>
                <input className={ inputError ? classes['input-error'] : '' }
                       type="text"
                       name="name"
                       value={ props.vacationName || "" }
                       onInput={ handleChange }/>
            </div>
            <div className={ classes['input-parent'] }>
                <label htmlFor="description">Description</label>
                <input className={ inputError ? classes['input-error'] : '' }
                       type="text"
                       name="description"
                       value={ props.description || "" }
                       onInput={ handleChange }/>
            </div>
            <div className={ classes['input-parent'] }>
                <label htmlFor="image-link">Image URL</label>
                <input className={ inputError ? classes['input-error'] : '' }
                       type="text"
                       name="image-link"
                       value={ props.image || "" }
                       onInput={ handleChange }/>
            </div>
            <div className={ classes['input-parent'] }>
                <label htmlFor="dates">Dates</label>
                <input className={ inputError ? classes['input-error'] : '' }
                       type="date"
                       name="dates"
                       value={ props.dates || "" }
                       onInput={ handleChange }/>
            </div>
            <div className={ classes['input-parent'] }>
                <label htmlFor="price">Dates</label>
                <input className={ inputError ? classes['input-error'] : '' }
                       type="text"
                       name="price"
                       value={ props.price || "" }
                       onInput={ handleChange }/>
            </div>
            <div className={ classes['button-wrapper'] }>
                <button className={ classes['login-btn'] } type="submit">Login</button>
                <button className={ classes['cancel-btn'] } onClick={ closeModal }>Cancel</button>
            </div>
        </form>
    </Modal>);
};

export default CreateEditVacation;
