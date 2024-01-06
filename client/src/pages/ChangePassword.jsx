import { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Button, Grid, Icon } from 'semantic-ui-react';
import { toast } from "react-toastify";
import { authReset, changePassword } from "../features/auth/authSlice"
import { profileReset } from '../features/profile/profileSlice';

function ChangePassword() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isLoading, isError, isSuccess, errorMessage, successMessage } = useSelector(state => state.auth);

    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const onSubmit = (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmNewPassword) {
            toast.error('New Passwords do not match');
            return;
        }
        if (formData.newPassword < 6) {
            toast.error('New Password must be length of greater than 6');
            return;
        }
        dispatch(changePassword(formData));
    }

    useEffect(() => {
        if (!user) {
            navigate('/');
            dispatch(authReset());
            dispatch(profileReset());
        }
        else {
            if (isError) {
                errorMessage.map(err => toast.error(err));
            }
            if (isSuccess) {
                successMessage.map(msg => toast.success(msg));
            }
            dispatch(authReset());
        }
    }, [isError, isSuccess, navigate, dispatch])

    return (
        <>
            <div className="max-w-[1000px] mx-auto w-full min-h-screen text-center pt-[50px]">
                <p className='text-gray-900 font-semibold text-4xl'> Change Password</p>

                <form onSubmit={onSubmit} className='max-w-[400px] flex-col justify-center items-center mx-auto px-[10px] mt-[40px]'>
                    <input onChange={onChange} value={formData.oldPassword} name='oldPassword' type="password" className="input_tail" placeholder='Your Old Password!' />
                    <input onChange={onChange} value={formData.newPassword} name='newPassword' type="password" className="input_tail" placeholder='New Password!' />
                    <input onChange={onChange} value={formData.confirmNewPassword} name='confirmNewPassword' type="password" className="input_tail" placeholder='Confirm new Password!' />
                    <button type='submit' disabled={isLoading || !formData.newPassword || !formData.oldPassword || !formData.confirmNewPassword} className="btn_tail">
                        Change
                    </button>
                </form>

            </div>
        </>
    )
}

export default ChangePassword