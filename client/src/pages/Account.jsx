import React, { Fragment, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { authReset } from '../features/auth/authSlice';
import { profileReset } from '../features/profile/profileSlice';
import { Grid, Icon, Form, Button } from 'semantic-ui-react';


const formatDate = (iso) => {
    let date = new Date(iso);
    const yyyy = date.getFullYear();
    let mm = date.getMonth() + 1; // Months start at 0!
    let dd = date.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    date = dd + '/' + mm + '/' + yyyy;

    let time = new Date(iso).toLocaleTimeString();

    return date + " , " + time;
}

function Account() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);

    useEffect(() => {
        if (!user || !user.token) {
            navigate('/');
            dispatch(authReset());
            dispatch(profileReset());
        }
    }, [dispatch, navigate])

    return (
        <>
            <div className="max-w-[1000px] mx-auto w-full min-h-screen text-center pt-[50px]">
                {user ?
                    <>
                        <p className='text-gray-900 font-semibold text-4xl'> {user?.name}'s Account</p>
                        <div className="max-w-[400px] flex-col justify-center items-center mx-auto px-[10px] mt-[40px] ">
                            <input type="text" className="input_tail" value={user?.name} />
                            <input type="text" className="input_tail" value={user?.email} />
                            <input type="text" className="input_tail" value={`Created at - ${formatDate(user.createdAt)}`} />
                            <input type="text" className="input_tail " value={`Updated at - ${formatDate(user.updatedAt)}`} />
                            <div className='mt-[10px] btn_tail'>
                                <NavLink to={'/change-password'} className='w-full hover:text-white '>Change Password</NavLink>
                            </div>
                        </div>
                    </> : null}
            </div>

        </>
    )
}

export default Account