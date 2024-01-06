import React, { Fragment, useEffect, useState } from 'react';
import { Form, Button, Icon, Grid } from 'semantic-ui-react';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { registerUserForm, authReset } from '../features/auth/authSlice';
import { profileReset } from '../features/profile/profileSlice';
import GoogleSignUpBtn from '../components/GoogleSignUpBtn';

function Register() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isLoading, isError, isSuccess, errorMessage } = useSelector(state => state.auth);

    useEffect(() => {

        if (user || isSuccess) {
            navigate('/');
        }
        else {
            dispatch(authReset());
            dispatch(profileReset());
        }

        if (isError) {
            errorMessage.map(msg => toast.error(msg));
            return;
        }


    }, [user, isError, isSuccess, navigate, dispatch])

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    })

    const onChange = (e) => {
        setFormData(prevState => (
            {
                ...prevState,
                [e.target.name]: e.target.value
            }
        )
        )
    }

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(registerUserForm(formData));
    }

    return (
        <>
            <div className="max-w-[1200px] w-full mx-auto flex-col items-start pt-[60px] text-center justify-center min-h-screen">
                <p className='text-gray-900 font-semibold text-4xl'>Register </p>
                <form className=' max-w-[400px] flex-col mx-auto mt-[40px] items-center justify-center gap-[10px]'>
                    <input onChange={onChange} value={formData.name} name='name' type="text" placeholder='Enter name!' className='outline-none rounded-3xl  px-6 py-3 border-gray-300 border-[0.3px] w-full text-sm my-[10px]' />
                    <input onChange={onChange} value={formData.email} name='email' type="email" placeholder='Enter Your email!' className='outline-none rounded-3xl  px-6 py-3 border-gray-300 border-[0.3px] w-full text-sm my-[10px]' />
                    <input onChange={onChange} value={formData.password} name='password' type="password" placeholder='Enter Your Password!' className='outline-none rounded-3xl  px-6 py-3 border-gray-300 border-[0.3px] w-full text-sm my-[10px]' />
                    <button onClick={onSubmit} disabled={isLoading || !formData.name || !formData.email || !formData.password} className='w-full px-6 py-4 bg-gray-900 text-white text-sm rounded-3xl my-[10px] hover:bg-gray-700 disabled:opacity-[0.5] '>{isLoading ? 'Submitting!' : 'Submit'}</button>
                    <p className='text-sm text-gray-800 my-[10px]'>Already have account? <NavLink className={'text-blue-700 font-medium'} to='/login'>Sign In</NavLink></p>
                    <div className="flex items-center justify-center my-4">
                        <div className="border-t border-gray-300 flex-grow"></div>
                        <p className="mx-4 text-lg text-gray-500">OR</p>
                        <div className="border-t border-gray-300 flex-grow"></div>
                    </div>
                    {isLoading ? null : <GoogleSignUpBtn />}
                </form>
            </div>
        </>
    )
}

export default Register