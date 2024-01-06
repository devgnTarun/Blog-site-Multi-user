import React, { Fragment, useEffect, useState } from 'react';
import { Form, Button, Icon, Grid } from 'semantic-ui-react';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link, NavLink } from 'react-router-dom';
import { authReset, loginUserForm } from '../features/auth/authSlice';
import { profileReset } from '../features/profile/profileSlice';
import GoogleSignInBtn from '../components/GoogleSignInBtn';

function Login() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isLoading, isError, isSuccess, errorMessage } = useSelector(state => state.auth);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

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
            return;
        }

    }, [user, isError, isSuccess, navigate, dispatch])

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
        dispatch(loginUserForm(formData));
    }

    return (
        <>
            <div className="max-w-[1200px] w-full mx-auto flex-col items-start pt-[60px] text-center justify-center min-h-screen">
                <p className='text-gray-900 font-semibold text-4xl'>Login </p>
                <form className=' max-w-[400px] flex-col mx-auto mt-[40px] items-center justify-center gap-[10px]'>
                    <input onChange={onChange} value={formData.email} name='email' type="email" placeholder='Enter Your email!' className='outline-none rounded-3xl  px-6 py-3 border-gray-300 border-[0.3px] w-full text-sm my-[10px]' />
                    <input onChange={onChange} value={formData.password} name='password' type="password" placeholder='Enter Your Password!' className='outline-none rounded-3xl  px-6 py-3 border-gray-300 border-[0.3px] w-full text-sm my-[10px]' />
                    <button onClick={onSubmit} disabled={isLoading || !formData.email || !formData.password} className='w-full px-6 py-4 bg-gray-900 text-white text-sm rounded-3xl my-[10px] hover:bg-gray-700 disabled:opacity-[0.5] '>{isLoading ? 'Submitting!' : 'Submit'}</button>
                    <div className="flex items-center justify-between gap-[10px] my-[6px]">
                        <p className='text-xs text-gray-800  '>Don't have account? <NavLink className={'text-blue-700 font-medium'} to='/register'>Sign Up</NavLink></p>
                        <NavLink to={'/forgotpassword'} className={'text-xs text-blue-700 font-medium'}>Forgot Password?</NavLink>
                    </div>
                    <div className="flex items-center justify-center my-4">
                        <div className="border-t border-gray-300 flex-grow"></div>
                        <p className="mx-4 text-lg text-gray-500">OR</p>
                        <div className="border-t border-gray-300 flex-grow"></div>
                    </div>
                    {isLoading ? null : <GoogleSignInBtn />}
                </form>
            </div>
        </>
    )
}

export default Login