import { Fragment, useEffect, useState } from "react";
import Vacation from "../Components/Vacation";
import classes from "../Components/Vacation.module.css";

import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import vacationService from "../services/vacationService";


const VacationList = () => {
    const user = useSelector((state) => state.user.value);
    const [vacationList, setVacationList] = useState([]);

    const vacationRemoveHandler = (id) => {
        console.log(id);
    };
    const editVacationHandler = (id) => {
        console.log(id);
    };

    const fetchVacationsList = async () => {
        const response = await vacationService.list();
        if (response.hasOwnProperty('success') === response.success) {
            await setVacationList(response.data);
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
