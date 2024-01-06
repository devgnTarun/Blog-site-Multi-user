import React, { Fragment, useEffect, useState } from 'react'
import { Button, Grid, Icon, Form } from 'semantic-ui-react'
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link, useParams, NavLink } from 'react-router-dom';
import { authReset, resetPassword } from '../features/auth/authSlice';
import { profileReset } from '../features/profile/profileSlice';

function ResetPassword() {

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });

    const onChange = (e) => {
        setFormData(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }


    const { token } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isLoading, isError, isSuccess, errorMessage, successMessage } = useSelector(state => state.auth);

    useEffect(() => {
        if (user && user.token) {
            navigate('/');
        }
        else {
            dispatch(authReset());
            dispatch(profileReset());
        }

        if (isError) {
            errorMessage.map(msg => toast.error(msg));
        }

        if (isSuccess) {
            successMessage.map(msg => toast.success(msg));
        }

    }, [user, isError, isSuccess, navigate, dispatch])

    const onSubmit = (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error('Password do not match');
            return;
        }
        else {
            dispatch(resetPassword({ newPassword: formData.password, token }));
        }
    }


    return (
        <Fragment>
            <div className="max-w-[1200px] w-full mx-auto flex-col items-start pt-[60px] text-center justify-center min-h-screen">
                <p className='text-gray-900 font-semibold text-4xl'>Reset Password </p>
                <form className=' max-w-[400px] flex-col mx-auto mt-[40px] items-center justify-center gap-[10px]'>
                    <input onChange={onChange} value={formData.password} name='password' type="password" placeholder='Enter New Password!' className='outline-none rounded-3xl  px-6 py-3 border-gray-300 border-[0.3px] w-full text-sm my-[10px]' />
                    <input onChange={onChange} value={formData.confirmPassword} name='confirmPassword' type="password" placeholder='Confirm your Password!' className='outline-none rounded-3xl  px-6 py-3 border-gray-300 border-[0.3px] w-full text-sm my-[10px]' />
                    <div className="flex gap-[10px]">
                        <button onClick={onSubmit} disabled={isLoading || !formData.password || !formData.confirmPassword} className='w-full px-3 py-3 bg-gray-900 text-white text-sm rounded-3xl my-[10px] hover:bg-gray-700 disabled:opacity-[0.5] '>{isLoading ? 'Submitting!' : 'Submit'}</button>
                        <NavLink to='/login' className={'w-full px-3 py-3 bg-white text-gray-900 border-[0.3px] border-gray-900 font-medium text-sm rounded-3xl my-[10px] hover:bg-gray-700 hover:text-white disabled:opacity-[0.5] text-center '}> Try Login!</NavLink>
                    </div>
                </form>
            </div>
        </Fragment>
    )
}

export default ResetPassword