import { Fragment } from "react";
import Vacation from "../Components/Vacation";
import classes from "../Components/Vacation.module.css";

import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";



const VacationList = () => {
    const vacationList = useSelector((state) => state.vacation.value);
    const user = useSelector((state) => state.user.value);
    const vacationRemoveHandler = (id) => {
        console.log(id);
    };
    const editVacationHandler = (id) => {
        console.log(id);
    };

  return(<Fragment>
      {/*{user && !user.loggedIn && <Navigate to="/register" />}*/}
      <div className={classes.container}>
          {vacationList.map((vacation) => {
              return <Vacation
                  key={vacation.id}
                  name={vacation.name}
                  description={vacation.description}
                  image={vacation.image}
                  dates={vacation.dates}
                  price={vacation.price}
                  onEdit={editVacationHandler.bind(null, vacation.id)}
                  onRemove={vacationRemoveHandler.bind(null, vacation.id)}
              />
          })}
      </div>

  </Fragment>);
}

export default VacationList;