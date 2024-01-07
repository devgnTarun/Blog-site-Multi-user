import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Grid, Icon, Loader, Menu } from 'semantic-ui-react';
import BlogItem from '../components/BlogItem';
import { getBlogsOfUser } from '../features/blog/blogSlice';
import { isFulfilled } from '@reduxjs/toolkit';

const checkReactedBlogs = (blogs) => {
    return blogs.filter(blog => {
        if (blog.likes.length || blog.dislikes.length || blog.comments.length) return blog;
    })
}

function Blogs() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const auth = useSelector(state => state.auth);
    const [blogs, setBlogs] = useState(null);
    const [activeItem, setActiveItem] = useState('');
    const [loadingBlogs, setLoadingBlogs] = useState(false);

    useEffect(async () => {
        if (!auth || !auth.user || !auth.user.token) {
            navigate('/');
            return
        }
        setLoadingBlogs(true);
        // Get all blogs of current user
        const res = await dispatch(getBlogsOfUser({ userId: auth.user._id }));
        if (res.type === '/blog/specificUser/fulfilled') {
            setBlogs(res.payload);
            setActiveItem('published');
        }
        setLoadingBlogs(false);
    }, [auth, dispatch, navigate])

    const handleMenuItemClick = async (name) => {
        setActiveItem(name);
        setLoadingBlogs(true);
        if (name === 'published') {
            // Get all blogs of current user
            const res = await dispatch(getBlogsOfUser({ userId: auth.user._id }));
            if (res.type === '/blog/specificUser/fulfilled') {
                setBlogs(res.payload);
            }
        }
        else if (name === 'reacted') {
            const filteredBlogs = checkReactedBlogs(blogs);
            setBlogs(filteredBlogs);
        }
        setLoadingBlogs(false);
    }

    return (
        <Fragment>
            <p className='text-3xl text-gray-900 font-medium text-center my-5'>Blogs</p>
            {/* Blogs Menu */}
            <Menu pointing secondary>
                <Menu.Item
                    name={`Published ${blogs && activeItem === 'published' ? `(${blogs.length})` : ``}`}
                    active={activeItem === 'published'}
                    onClick={() => handleMenuItemClick('published')}
                />

            </Menu>
            {loadingBlogs &&
                <div className='w-full min-h-[60vh] flex items-center justify-center'>
                    <Loader active content='Loading your blogs' />
                </div>}
            {!loadingBlogs && <div className="user-blogs">
                <Fragment>
                    <Grid>
                        {blogs && blogs.map(blog => <BlogItem key={blog._id} blog={blog} />)}
                    </Grid>
                </Fragment>

            </div>}
        </Fragment>
    )
}

export default Blogs