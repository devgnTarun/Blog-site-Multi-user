import React, { Fragment } from 'react';
import { GoogleLogin } from 'react-google-login';
import { Button } from 'semantic-ui-react';
import { GOOGLE_CLIENT_ID } from '../config/defaults';
import { googleSignInAuthentication } from '../features/auth/authSlice'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify';
import GooglePng from '../assets/google.png'

function GoogleSignUpBtn() {

    const dispatch = useDispatch();

    const onSuccessResponseGoogle = (response) => {
        const idToken = response.tokenId;
        dispatch(googleSignInAuthentication(idToken));
    }

    const onFailureResponseGoogle = (response) => {
        console.log(response)
        toast.error('Google Sign In unsuccessful.')
    }

    return (
        <Fragment>
            <section style={{
                marginTop: 12
            }} >
                <GoogleLogin
                    clientId={GOOGLE_CLIENT_ID}
                    render={renderProps => (
                        <div onClick={renderProps.onClick} disabled={renderProps.disabled} className="w-full items-center justify-center hover:bg-gray-100 cursor-pointer px-6 py-3 flex mt-[10px] border-gray-300 border-[0.5px] rounded-3xl">
                            <img src={GooglePng} alt="google" className='w-[20px]' /> <p className='text-sm font-medium text-gray-700 mx-3'>Sign in with google</p>
                        </div>
                    )}
                    onSuccess={onSuccessResponseGoogle}
                    onFailure={onFailureResponseGoogle}
                    cookiePolicy={'single_host_origin'}
                />
            </section>
        </Fragment>
    )
}

export default GoogleSignUpBtn