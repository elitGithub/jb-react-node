import { Fragment, useEffect, useState } from "react";
import Vacation from "../Components/Vacation";
import classes from "../Components/Vacation.module.css";

import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { edit, showHide } from "../features/modal";
import { deleteVacation, listVacations } from "../features/vacation";
import vacationService from "../services/vacationService";


const VacationList = props => {
    const user = useSelector((state) => state.user.value);
    const modal = useSelector((state) => state.modal.value);
    const dispatch = useDispatch();
    const [vacationList, setVacationList] = useState([]);
    const [reloadVacations, setReloadVacations] = useState(true);
    const [showVacations, setShowVacations] = useState(false);

    const fetchData = async () => {
        const response = await vacationService.list();
        setVacationList(response.data);
    }

    useEffect(() => {
        fetchData();
        setShowVacations(true);
    }, [reloadVacations]);

    useEffect(() => {
        fetchData();
        setReloadVacations(true);
        setShowVacations(true);
    }, [modal]);

    const vacationRemoveHandler = async (id) => {
        await dispatch(deleteVacation(id));
        await dispatch(listVacations());
        await setReloadVacations(true);
        if (vacationList.length === 1) {
            setShowVacations(false);
        }
    };

    const editVacationHandler = async (id) => {
        const vacation = await dispatch(edit(id));
        if (!(vacation.meta.requestStatus === 'fulfilled')) {
            alert(vacation.payload.message ? vacation.payload.message : 'Error occurred');
            return;
        }
        await dispatch(showHide(true));
        await setReloadVacations(true);
    };

    return (<Fragment>
        { user && !user.loggedIn && <Navigate to="/login"/> }
        { showVacations && <div className={ classes.container }>
            { vacationList.map((vacation) => {
                return <Vacation
                    key={ vacation._id }
                    id={ vacation._id }
                    name={ vacation.name }
                    description={ vacation.description }
                    imageUrl={ vacation.imageUrl }
                    image={ vacation.image }
                    dateStart={ vacation.dateStart }
                    dateEnd={ vacation.dateEnd }
                    price={ vacation.price }
                    onEdit={ editVacationHandler.bind(null, vacation._id) }
                    onRemove={ vacationRemoveHandler.bind(null, vacation._id) }
                />
            }) }
        </div> }

    </Fragment>);
}

export default VacationList;
