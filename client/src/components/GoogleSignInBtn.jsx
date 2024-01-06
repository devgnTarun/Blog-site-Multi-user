import React, { Fragment } from 'react';
import { googleSignInAuthentication } from '../features/auth/authSlice'
import { useDispatch } from 'react-redux'
import { GoogleLogin } from '@react-oauth/google';

function GoogleSignInBtn() {

    const dispatch = useDispatch();
    // dispatch(googleSignInAuthentication(idToken));

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

export default GoogleSignInBtn