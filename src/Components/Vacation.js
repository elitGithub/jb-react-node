import { Fragment, useEffect, useState } from "react";
import classes from "./Vacation.module.css";
import { DeleteOutline, EditOutlined } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { followVacation, unfollowVacation } from "../features/vacation";

const Vacation = (props) => {
    const user = useSelector((state) => state.user.value);
    const dispatch = useDispatch();
    const [isFollowed, setIsFollowed] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        setIsAdmin(user?.isAdmin);
    }, [user]);

    useEffect(() => {
        setLoggedIn(user?.loggedIn);
    }, [user]);


    useEffect(() => {
        setIsFollowed((user.followedVacations.indexOf(props.id) > -1));
    }, [user]);

    const tagClasses = [
        classes['tag'],
        isFollowed ? classes['tag-teal'] : classes['tag-grey'],
    ];
    const followClasses = [
        classes['tag'],
        isFollowed ? classes['tag-purple'] : classes['tag-grey'],
    ];

    const followOrUnfollow = () => {
        if (isFollowed) {
            dispatch(unfollowVacation(props.id));
        } else {
            dispatch(followVacation(props.id));
        }
        setIsFollowed(!isFollowed);
    }

    let followText = isFollowed ? 'Unfollow' : 'Follow';
    const dateStart = new Date(props.dateStart);
    const dateEnd = new Date(props.dateEnd);

    return (<Fragment>
            <div className={ classes.card }>
                <div className={ classes['card-header'] }>
                    { loggedIn && <div className={ classes['top-buttons'] }>
                        <span className={ tagClasses.join(' ') } onClick={ followOrUnfollow }>{ props.name }</span>
                        { !isAdmin && <span className={ followClasses.join(' ') } onClick={ followOrUnfollow }>{ followText }</span> }
                    </div> }

                    { isAdmin && <div className={ classes['top-buttons'] }>
                        <span className={ tagClasses.join(' ') } onClick={ props.onEdit }><EditOutlined/></span>
                        <span className={ followClasses.join(' ') } onClick={ props.onRemove }><DeleteOutline/></span>
                    </div> }
                    <h4 className={ classes['card-content-title'] }>
                        { props.description }
                    </h4>
                    <div>
                        For: { props.price } $
                    </div>
                </div>
                <div className={ classes['card-body'] }>
                    <h5>{ dateStart.toDateString() } - { dateEnd.toDateString() }</h5>
                    <img src={ props.imageUrl }
                         alt="vacation photo"/>
                </div>
            </div>
        </Fragment>
    );
}

export default Vacation;
