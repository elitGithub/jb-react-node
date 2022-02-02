import { Fragment, useEffect, useState } from "react";
import classes from "./Vacation.module.css";
import { DeleteOutline, EditOutlined } from "@mui/icons-material";
import { useSelector } from "react-redux";

// TODO: user section is decorative for now
const Vacation = (props) => {
    // TODO: this will be state controlled
    const user = useSelector((state) => state.user.value);
    const [isFollowed, setIsFollowed] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        setIsAdmin(user?.isAdmin);
    }, [user]);

    useEffect(() => {
        setLoggedIn(user?.loggedIn)
    }, [user]);

    const tagClasses = [
        classes['tag'],
        isFollowed ? classes['tag-teal'] : classes['tag-grey'],
    ];
    const followClasses = [
        classes['tag'],
        isFollowed ? classes['tag-purple'] : classes['tag-grey'],
    ];

    const followOrUnfollow = (e) => {
        console.log(e.target);
        setIsFollowed(!isFollowed);
    }

    let followText = isFollowed ? 'Unfollow' : 'Follow';

    return (<Fragment>
            <div className={classes.card}>
                <div className={classes['card-header']}>
                    {!isAdmin && loggedIn && <div className={classes['top-buttons']}>
                        <span className={tagClasses.join(' ')} onClick={followOrUnfollow}>{props.name}</span>
                        <span className={followClasses.join(' ')} onClick={followOrUnfollow}>{followText}</span>
                    </div>}

                    {isAdmin && <div className={classes['top-buttons']}>
                        <span className={tagClasses.join(' ')} onClick={props.onEdit}><EditOutlined/></span>
                        <span className={followClasses.join(' ')} onClick={props.onRemove}><DeleteOutline/></span>
                    </div>}
                    <h4 className={classes['card-content-title']}>
                        {props.description}
                    </h4>
                </div>
                <div className={classes['card-body']}>
                    <h5>{props.dates}</h5>
                    <img src={props.image}
                         alt="rover"/>
                </div>
                <div className={classes.user}>
                    <img
                        src="https://yt3.ggpht.com/a/AGF-l7-0J1G0Ue0mcZMw-99kMeVuBmRxiPjyvIYONg=s900-c-k-c0xffffffff-no-rj-mo"
                        alt="user"/>
                    <div className="user-info">
                        <h5>July Dec</h5>
                        <small>2h ago</small>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default Vacation;
