import { Fragment, useEffect, useState } from "react";
import Vacation from "../Components/Vacation";
import classes from "../Components/Vacation.module.css";

import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import vacationService from "../services/vacationService";


const VacationList = props => {
    const user = useSelector((state) => state.user.value);
    const vacation = useSelector((state) => state.vacation.value);
    const [vacationList, setVacationList] = useState([]);
    const [reloadVacations, setReloadVacations] = useState(true);

    const vacationRemoveHandler = (id) => {
        console.log(id);
    };
    const editVacationHandler = (id) => {
        console.log(id);
    };

    useEffect(() => {
        const refreshVacationList = async () => {
            await setVacationList(vacation.data);
        }

        refreshVacationList();
    }, [vacation])

    useEffect(() => {
        const fetchVacationsList = async () => {
            const response = await vacationService.list();
            if (response.hasOwnProperty('success') && response.success === true) {
                await setVacationList(response.data);
            }

        }
        if (reloadVacations) {
            fetchVacationsList();
        }

        return () => setReloadVacations(false);
    }, [reloadVacations]);

    return (<Fragment>
        { user && !user.loggedIn && <Navigate to="/login"/> }
        { vacationList && <div className={ classes.container }>
            { vacationList.map((vacation) => {
                return <Vacation
                    key={ vacation._id }
                    name={ vacation.name }
                    description={ vacation.description }
                    image={ vacation.imageUrl }
                    dateStart={ vacation.dateStart }
                    dateEnd={ vacation.dateEnd }
                    price={ vacation.price }
                    onEdit={ editVacationHandler.bind(null, vacation.id) }
                    onRemove={ vacationRemoveHandler.bind(null, vacation.id) }
                />
            }) }
        </div> }

    </Fragment>);
}

export default VacationList;
