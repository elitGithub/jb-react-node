import Chart from "../Components/Chart";
import classes from "../Components/Admin.module.css";
import { DUMMY_VACATIONS } from "../shared/dummyData";

const AdminPanel = () => {
  return(<div className={classes['charts-container']}>
    <Chart data={DUMMY_VACATIONS} x={'id'} y={'followers'}/>
  </div>);
}

export default AdminPanel;