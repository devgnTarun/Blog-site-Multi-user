import React, { Fragment, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { authReset, sendActivationMail } from '../features/auth/authSlice';
import { profileReset, getMyProfile, customProfileReset } from '../features/profile/profileSlice';
import { Grid, Message, Icon, Label, Loader, Menu, Header, Input } from 'semantic-ui-react'
import { blogReset, getBlogsByCategoryId, getLatestBlogs } from '../features/blog/blogSlice';
import { extractDescriptionFromHTML, formatDate, searchBlogs } from '../app/helpers';
import { getAllCategory } from '../features/category/categorySlice';

const renderBlogsData = (blogs, activeCategory) => {
    return (
        <Grid>
            {blogs ?
                blogs.length === 0 ?
                    <div className="w-full flex items-center justify-center min-h-[30vh] p-10">
                        <p className='text-2xl text-gray-900 font-medium '> No blog found</p>
                    </div>
                    :
                    blogs.map(blog => (
                        <>
                            <div className="card_flex flex shadow-sm w-full px-6 py-4 border-gray-100 border-[0.3px] rounded-3xl  m-2" key={blog?._id}>
                                {/* top div  */}
                                <div className="flex-col w-[60%]">
                                    <Link className="flex mb-2 items-center justify-start gap-[10px]" to={`/profile/${blog.profile._id}`} >
                                        <img src={blog.profile.profileUrl} width={35} height={35} alt="Profile Image" className='rounded-full' />
                                        {' '} <span className='text-md font-medium text-gray-900 hover:text-green-600'> {blog.user.name}</span>
                                        <span className='text-xs text-gray-600'>{formatDate(blog.updatedAt)}</span>
                                    </Link>
                                    {/* title  */}
                                    <div className="w-full flex-col mt-8">
                                        <p className='text-xl text-gray-900 font-medium'>
                                            {blog.title}
                                        </p>
                                        <p className='text-sm text-gray-700 my-4 '>
                                            {extractDescriptionFromHTML(blog.desc).substr(0, 300)}...........
                                            <Link to={`/blog/${blog._id}`} className='text-green-500 hover:text-green-600' >Read more</Link>
                                        </p>
                                        <p className='my-4 text-white bg-gray-900 px-5 py-1 rounded-xl w-[fit-content] text-sm'>{blog.category.name}</p>
                                        <div className='flex gap-[17px] my-5' >
                                            <p className='text-sm text-gray-600'>
                                                <Icon name='eye' />
                                                {blog.viewedBy.length}
                                            </p>
                                            <p className='text-sm text-gray-600'>
                                                <Icon name='thumbs up' />
                                                {blog.likes.length}
                                            </p>
                                            <p className='text-sm text-gray-600'>
                                                <Icon name='thumbs down' />
                                                {blog.dislikes.length}
                                            </p>
                                            <p className='text-sm text-gray-600'>
                                                <Icon name='comments' />
                                                {blog.comments.length}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* image div  */}
                                <div className="flex items-center justify-center rounded-xl overflow-hidden w-[40%] max-h-[250px] min-h-[150px]">
                                    <img className='w-[100%]' alt='Blog Image' src={blog.coverPhoto} />
                                </div>
                            </div>
                        </>
                    ))
                : <Loader active content={activeCategory !== 'all blogs' ? 'Loading blogs of selected category' : 'Loading Latest Blogs'} />
            }
        </Grid>
    )
}


function Landing() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isSuccess, successMessage } = useSelector(state => state.auth);
    const { profile, isError, errorMessage } = useSelector(state => state.profile);
    const blog = useSelector(state => state.blog);
    const { categories } = useSelector(state => state.category);
    const [activeCategory, setActiveCategory] = useState('');

    useEffect(() => {

        dispatch(getLatestBlogs());
        setActiveCategory('all blogs');

        if (user && user.token) {
            dispatch(getMyProfile());
        }
        else {
            dispatch(authReset());
            dispatch(profileReset());
            dispatch(blogReset());
        }

        if (isError) {
            errorMessage.map(msg => toast.error(msg));
            return;
        }

        if (isSuccess) {
            successMessage.map(msg => toast.success(msg));
            return;
        }

    }, [user, isError, isSuccess, navigate, dispatch])

    const sendActivationMailAgain = async () => {
        await dispatch(sendActivationMail());
        dispatch(customProfileReset());
        dispatch(authReset());
    }

    useEffect(() => {
        // Get all categories
        dispatch(getAllCategory());
    }, [user, navigate, dispatch])

    const handleCategoryClick = async (e, data) => {
        await setActiveCategory(data.name);
        if (data.index === "all blogs") {
            await dispatch(getLatestBlogs());
            return;
        }
        await dispatch(getBlogsByCategoryId({ categoryId: data.index }));
    }

    const [searchVal, setSearchVal] = useState('');
    const [searchedBlogsResult, setSearchedBlogsResult] = useState([]);
    useEffect(() => {
        if (blog?.latestBlogs) {
            const searchedBlogs = searchBlogs(blog?.latestBlogs, searchVal);
            setSearchedBlogsResult(searchedBlogs);
        }
    }, [blog, searchVal])

    return (
        <div className='w-full'>
            <Fragment>
                {user && user.token ?
                    profile && !profile.isActivated ?
                        <Message info className='activation-message' >
                            <p>Your Account is not verified yet.
                                <span
                                    style={{ textDecoration: 'underline', marginLeft: 6, cursor: 'pointer' }}
                                    onClick={sendActivationMailAgain}
                                >
                                    Click here to Verify Account
                                </span>
                            </p>
                        </Message> :
                        profile && profile.isActivated ?
                            null : null
                    :
                    <div></div>
                }

                {/* Search Blogs */}
                <div className="w-full flex min-h-[60px] items-center justify-center mb-[40px]">
                    <input type="text" value={searchVal} onChange={(e) => setSearchVal(e.target.value)} placeholder='Search blogs by author or title . . . . . .' className='w-[90%] border-gray-100 border-[0.3px] px-6 py-3 outline-none rounded-3xl shadow-sm text-sm text-gray-800' />
                </div>

                <div className=' flex w-full items-start justify-start max-w-[1400px]'>
                    <div style={{ flexDirection: 'column' }} className="flex hidden_cat  w-[25%] bg-white  text-center py-4 px-2 overflow-hidden items-center justify-center mr-[20px]">
                        <Menu className='w-[200px] ' color='green' pointing secondary vertical>
                            <Menu.Item
                                name={'all blogs'}
                                key={'all blogs'}
                                index={'all blogs'}
                                active={activeCategory === 'all blogs'}
                                onClick={handleCategoryClick}
                            />
                            {categories?.map(category => {
                                return <Menu.Item
                                    name={category.name}
                                    key={category._id}
                                    index={category._id}
                                    active={activeCategory === category.name}
                                    onClick={handleCategoryClick}
                                />
                            })}
                        </Menu>
                    </div>
                    <div className='md:w-[75%] w-[90%] mx-auto flex-col' >
                        {/* Render Blogs */}
                        {searchVal ?
                            renderBlogsData(searchedBlogsResult, activeCategory) : // when search val is not null, find blogs from selected category using key and render them
                            renderBlogsData(blog.latestBlogs, activeCategory) // when search val is null, render blogs of selected category
                        }

                        {/* We can render data from writting this condition also. renderBlogsData(searchedBlogsResult, activeCategory). But for more clarification, using conditional rendering */}

                    </div>
                </div>

            </Fragment>
        </div>

    )
}

export default Landing