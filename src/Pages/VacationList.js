import { Fragment, useEffect, useState } from "react";
import Vacation from "../Components/Vacation";
import classes from "../Components/Vacation.module.css";

import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { listVacations } from "../features/vacation";


const VacationList = () => {
    // TODO: got error:
    /**
     * Need to review
     * Rareact-dom.development.js:67 Warning: Can't perform a React state update on an unmounted component.
     * This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
     */
    const user = useSelector((state) => state.user.value);
    const vacations = useSelector((state) => state.vacation.value);
    const [vacationList, setVacationList] = useState([]);
    const dispatch = useDispatch();

    const vacationRemoveHandler = (id) => {
        console.log(id);
    };
    const editVacationHandler = (id) => {
        console.log(id);
    };

    const fetchVacationsList = async () => {
        await dispatch(listVacations());
        if (vacations) {
            await setVacationList(vacations);
        }
    }

    useEffect(() => {
        fetchVacationsList();
    }, [])

    return (<Fragment>
        { user && !user.loggedIn && <Navigate to="/login"/> }
        <div className={ classes.container }>
            { vacationList.map((vacation) => {
                return <Vacation
                    key={ vacation._id }
                    name={ vacation.name }
                    description={ vacation.description }
                    image={ vacation.image }
                    dateStart={ vacation.dateStart }
                    dateEnd={ vacation.dateEnd }
                    price={ vacation.price }
                    onEdit={ editVacationHandler.bind(null, vacation.id) }
                    onRemove={ vacationRemoveHandler.bind(null, vacation.id) }
                />
            }) }
        </div>

    </Fragment>);
}

export default VacationList;