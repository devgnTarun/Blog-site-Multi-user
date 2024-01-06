import React, { Fragment } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { googleSignInAuthentication } from '../features/auth/authSlice'
import { useDispatch } from 'react-redux'


function GoogleSignUpBtn() {

    const dispatch = useDispatch();

    const responseMessage = (response) => {
        console.log(response);
        const { credential } = response;
        // Dispatch the token to your Redux store
        dispatch(googleSignInAuthentication({ idToken: credential }));
    };
    const errorMessage = (error) => {
        console.log(error);
    };

    return (
        <Fragment>
            <section style={{
                marginTop: 12
            }} >
                <div className="w-full flex items-center justify-center">
                    <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
                </div>
            </section>
        </Fragment>
    )
}

export default GoogleSignUpBtn