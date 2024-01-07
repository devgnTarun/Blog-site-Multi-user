import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authReset, logout } from '../features/auth/authSlice';
import { getMyProfile, profileReset } from '../features/profile/profileSlice';
import { categoryLogout, getAllCategory } from '../features/category/categorySlice';
import { adminLogout } from '../features/admin/adminSlice';
import WeatherApp from './WeatherData';

const Header = () => {

    // Profile dropdown 
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    //Toggle dropdown
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    // Code
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { profile } = useSelector(state => state.profile);
    const location = useLocation();

    // This is because our profile and user schema are diffrent and causing me difficuly. It's too late to change them.
    const [profileId, setProfileId] = useState('');

    useEffect(() => {
        if (profile) setProfileId(profile._id);
        else {
            const paths = ['/', '/update-profile', '/category']
            if (user && user.token && !paths.includes(location.pathname)) {
                dispatch(getMyProfile());
            }
        }
    }, [profile, navigate, dispatch])

    const pathName = location.pathname;
    const path = pathName === "/" ? "home" : pathName.substr(1);
    const [activeItem, setActiveItem] = useState(path);
    const { categories } = useSelector(state => state.category);

    useEffect(() => {
        const pathName = window.location.pathname;
        const path = pathName === "/" ? "home" : pathName.substr(1);
        setActiveItem(path);
        dispatch(getAllCategory());

    }, [user, navigate])

    const handleItemClick = () => {
        dispatch(logout());
        dispatch(authReset());
        dispatch(profileReset());
        dispatch(categoryLogout());
        dispatch(adminLogout());
        navigate('/');
    }
    // 1a490b0efb64b1f340087f6f5e132c5e
    return (
        <>
            <div className="w-full max-x-[1200px] mx-auto ">
                <div className="h-[80px] max-w-[1200px] mx-auto w-full flex justify-between items-center z-[5] border-b-[0.3px]">

                    <div className="logo">
                        <NavLink className='text-3xl text-gray-800 hover:text-gray-900 font-semibold ' to={'/'} >L4 News</NavLink>
                    </div>
                    {/* <WeatherApp /> */}
                    {
                        user ?
                            <>
                                {/* Profile box  */}
                                <WeatherApp />
                                <div onClick={toggleDropdown} className="profile w-[40px] h-[40px] bg-gray-900 rounded-full relative cursor-pointer z-[4] ">
                                    {/* dropped div  */}

                                    {
                                        isOpen &&
                                        <div ref={dropdownRef} style={{ flexDirection: "column" }} className="absolute top-[45px] right-[10px] w-[200px]  rounded-lg bg-white shadow-md flex items-start justify-start overflow-hidden">
                                            {/* Dropdown details */}
                                            <NavLink className='text-sm text-gray-800 hover:text-blue-400 hover:bg-gray-50 w-full font-medium px-4 py-3' to={'/account'} >Account</NavLink>
                                            <NavLink className='text-sm text-gray-800 hover:text-blue-400 hover:bg-gray-50 w-full font-medium  px-4 py-3' to={`/profile/${profile._id}`} >Your Profile</NavLink>
                                            <NavLink className='text-sm text-gray-800 hover:text-blue-400 hover:bg-gray-50 w-full font-medium  px-4 py-3' to={'/change-password'} >Change Password</NavLink>
                                            {/* Profile activated must  */}
                                            {
                                                profile?.isActivated &&
                                                <>
                                                    <NavLink className='text-sm text-gray-800 hover:text-blue-400 hover:bg-gray-50 w-full font-medium px-4 py-3' to={'/createBlog'} >Create</NavLink>
                                                    <NavLink className='text-sm text-gray-800 hover:text-blue-400 hover:bg-gray-50 w-full font-medium  px-4 py-3' to={'/blogs'} >My Blogs</NavLink>
                                                </>
                                            }
                                            {/* admin links  */}
                                            {
                                                profile?.role === 'admin' ?
                                                    <>
                                                        <NavLink className='text-sm text-gray-800 hover:text-blue-400 hover:bg-gray-50 w-full font-medium px-4 py-3' to={'/category'} >Category</NavLink>
                                                        <NavLink className='text-sm text-gray-800 hover:text-blue-400 hover:bg-gray-50 w-full font-medium  px-4 py-3' to={'/authors'} >Author</NavLink>
                                                    </> : null
                                            }

                                            <button className='text-sm text-red-600 hover:text-red-400 hover:bg-red-50 w-full font-medium  px-4 py-3 text-start' onClick={handleItemClick}>Logout</button>
                                        </div>
                                    }
                                </div>
                                {/* Profile div ends  */}
                            </> :
                            <div className="flex gap-[10px] items-center h-full">
                                <WeatherApp />
                                <NavLink className='text-sm text-gray-900 px-4 py-2 rounded-3xl border-[0.4px] border-gray-900 bg-white hover:text-gray-800 font-medium hover:bg-gray-100' to={'/register'} >Register</NavLink>
                                <NavLink className='text-sm text-white px-4 py-2 rounded-3xl border-[0.4px] border-gray-900 bg-gray-900 hover:text-white font-medium hover:bg-gray-800' to={'/login'} >Login</NavLink>
                            </div>

                    }
                </div>
                <div className='nav_scroll h-[60px] max-w-[1200px] mx-auto  flex  gap-[25px] items-center z-[5] border-b-[0.3px] mb-[20px] overflow-x-auto'>
                    <NavLink className={'text-lg text-gray-900 font-medium hover:text-green-600'} to={`/`}>Home</NavLink>
                    {categories && categories ? categories?.map(category =>
                        <>
                            <NavLink className={'text-lg text-gray-900 font-medium hover:text-green-600 whitespace-nowrap'} to={`/blogs/category/${category._id}`}>{category?.name}</NavLink>
                        </>
                    ) : null}
                </div>
            </div>
        </>
    )
}

export default Header