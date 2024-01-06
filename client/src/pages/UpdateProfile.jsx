import React, { useEffect, Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Form, Button, Icon, Grid } from 'semantic-ui-react';
import { CLOUDINARY_USER_NAME } from "../config/defaults";
import axios from 'axios';
import { toast } from 'react-toastify';
import { getMyProfile, editMyProfile, profileReset } from "../features/profile/profileSlice";
import { authReset, setAuth } from '../features/auth/authSlice';

function UpdateProfile() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);
    const { profile, isError, isSuccess, errorMessage, successMessage, isLoading } = useSelector(state => state.profile);

    const [showSocial, setShowSocial] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        profileUrl: 'https://media.istockphoto.com/photos/white-studio-background-picture-id1040250650?k=20&m=1040250650&s=612x612&w=0&h=lEWpioJ3jet0QIZVBoU2Ygaua8YMHFfHN1mvT28xRZ4='
    });

    const [profileImage, setProfileImage] = useState('');

    const [social, setSocial] = useState({
        youtube: '',
        twitter: '',
        linkedin: '',
        instagram: '',
        github: '',
        facebook: ''
    })

    const onSubmit = async (e) => {
        e.preventDefault();

        // Check if file size is less than 2MB
        if (profileImage.size / 1000000 > 2) {
            toast.error('File too large. File size should be less than 2 MB.');
            return;
        }

        const profileUrl = await profileImageUpload();
        const data = {
            name: formData.name,
            bio: formData.bio,
            profileUrl,
            ...social
        }
        const res = await dispatch(editMyProfile(data));
        if (res.type === 'profile/edit/fulfilled') {
            dispatch(setAuth(res));
        }
    }

    const onChangeFormData = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }


    const onChangeSocial = (e) => {
        setSocial({ ...social, [e.target.name]: e.target.value });
    }

    const [cloudinaryUploadLoading, setCloudinaryUploadLoading] = useState(false);
    const profileImageUpload = async () => {
        setCloudinaryUploadLoading(true);
        let data = new FormData();
        data.append("file", profileImage);
        data.append("upload_preset", "mern-blog");
        data.append("cloud_name", CLOUDINARY_USER_NAME);
        try {
            const res = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUDINARY_USER_NAME}/image/upload`, data);
            setCloudinaryUploadLoading(false);
            return res.data.url;
        } catch (err) {
            // console.log(err);
            setCloudinaryUploadLoading(false);
            return profile.profileUrl
        }
    }

    // When name changes, we need this because of our structure.
    useEffect(() => {
        if (auth && auth.user) {
            setFormData({ ...formData, 'name': auth.user.name })
        }
    }, [auth, dispatch, navigate])

    useEffect(() => {
        if (!auth.user) {
            navigate('/');
            dispatch(authReset());
            dispatch(profileReset());
        }
        else {
            if (!profile) dispatch(getMyProfile());
            if (!isLoading && profile) {
                let data = {
                    'name': auth.user.name,
                    'bio': profile.bio,
                    'profileUrl': profile.profileUrl
                }
                setFormData({ ...formData, ...data });

                let socialData = {
                    'github': profile.social ? profile.social.github : '',
                    'twitter': profile.social ? profile.social.twitter : '',
                    'linkedin': profile.social ? profile.social.linkedin : '',
                    'instagram': profile.social ? profile.social.instagram : '',
                    'facebook': profile.social ? profile.social.facebook : '',
                    'youtube': profile.social ? profile.social.youtube : '',
                }
                setSocial({ ...social, ...socialData });
            }
        }

        if (isSuccess) {
            successMessage.map(err => toast.success(err));
        }

        if (isError) {
            errorMessage.map(err => toast.error(err));
        }

    }, [isError, isSuccess, dispatch, navigate, profile])

    return (
        <>
            <div className="max-w-[1200px] w-full mx-auto flex-col items-start pt-[60px] text-center justify-center min-h-screen">
                <p className='text-gray-900 font-semibold text-4xl'>Edit Profile </p>
                <form onSubmit={onSubmit} className=' max-w-[400px] flex-col mx-auto mt-[40px] items-center justify-center gap-[10px] px-4'>
                    <p className='w-full text-sm text-gray-800 text-start font-medium mt-2 px-2'>Name : </p>
                    <input
                        placeholder='Name'
                        name='name'
                        className='input_tail'
                        type='text'
                        value={formData.name}
                        onChange={onChangeFormData} />
                    <p className='w-full text-sm text-gray-800 text-start font-medium mt-2 px-2'>Your bio : </p>
                    <textarea
                        placeholder='Your bio!'
                        rows={4}
                        name='bio'
                        className='input_tail'
                        type='text'
                        value={formData.bio}
                        onChange={onChangeFormData} />
                    <p className='w-full text-sm text-gray-800 text-start font-medium mt-2 px-2'>Profile Image : </p>
                    {profileImage ?
                        <div className="w-[80px] h-[80px] mx-[10px] my-[10px] overflow-hidden rounded-full  border-gray-200 border-[1px]">
                            <img src={URL.createObjectURL(profileImage)} className='w-full' alt="Profile URL" />
                        </div> :
                        <div className="w-[80px] h-[80px] mx-[10px] my-[10px] overflow-hidden  rounded-full border-gray-200 border-[1px]">
                            <img src={profile?.profileUrl} className='w-full' alt="Profile URL" />
                        </div>
                    }
                    <div class="flex items-center justify-center w-full my-[10px]">
                        <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-64  border-gray-200 border-[0.3px] rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                            <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                </svg>
                                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                            </div>
                            <input id="dropzone-file" type="file" class="hidden" onChange={(e) => setProfileImage(e.target.files[0])} />
                        </label>
                    </div>
                    <button className='text-sm px-5 py-2 bg-gray-700 rounded-xl text-white mx-2 my-[10px]' type='button' onClick={() => setShowSocial(!showSocial)}>Add Social Networks </button>
                    {showSocial ?
                        <>
                            <p className='w-full text-sm text-gray-800 text-start font-medium mt-2 px-2'>Github Profile : </p>
                            <input
                                placeholder='Github Profile'
                                name='github'
                                type='text'
                                className='input_tail'
                                value={social.github}
                                onChange={onChangeSocial} />
                            <p className='w-full text-sm text-gray-800 text-start font-medium mt-2 px-2'>Linkedin Profile : </p>
                            <input
                                placeholder='Linkedin Profile'
                                name='linkedin'
                                type='text'
                                className='input_tail'
                                value={social.linkedin}
                                onChange={onChangeSocial} />
                            <p className='w-full text-sm text-gray-800 text-start font-medium mt-2 px-2'>Facebook Profile : </p>
                            <input
                                placeholder='Facebook Profile'
                                name='facebook'
                                type='text'
                                className='input_tail'
                                value={social.facebook}
                                onChange={onChangeSocial} />
                            <p className='w-full text-sm text-gray-800 text-start font-medium mt-2 px-2'>Twitter Profile : </p>
                            <input
                                placeholder='Twitter Profile'
                                name='twitter'
                                type='text'
                                className='input_tail'
                                value={social.twitter}
                                onChange={onChangeSocial} />
                            <p className='w-full text-sm text-gray-800 text-start font-medium mt-2 px-2'>Instagram Profile : </p>
                            <input
                                placeholder='Instagram Profile'
                                name='instagram'
                                type='text'
                                className='input_tail'
                                value={social.instagram}
                                onChange={onChangeSocial} />
                            <p className='w-full text-sm text-gray-800 text-start font-medium mt-2 px-2'>Youtube Profile : </p>
                            <input
                                placeholder='Youtube Profile'
                                name='youtube'
                                type='text'
                                className='input_tail'
                                value={social.youtube}
                                onChange={onChangeSocial} />
                        </>
                        : null}
                    <div className="btn">
                        <button disabled={isLoading} type='submit' className='btn_tail'>{isLoading ? "Updating" : "Update"}</button>
                        <NavLink to={`/profile/${profile?._id}`} type='button' className='w-full bg-white text-gray-900 text-sm font-medium rounded-3xl border-[0.3px] border-gray-900 px-6 py-3 hover:bg-gray-200 hover:text-gray-900'>View profile</NavLink>
                    </div>
                </form>
            </div>
        </>
    )
}

export default UpdateProfile