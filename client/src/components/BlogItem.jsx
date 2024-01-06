import React, { Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Icon, Label, Grid, Button } from 'semantic-ui-react';
import { extractDescriptionFromHTML, formatDate } from '../app/helpers';
import { deleteBlog } from '../features/blog/blogSlice';

function BlogItem({ blog, role }) {

    const auth = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleDeleteBlog = async (blogId) => {
        if (window.confirm('Do you surely want to delete your blog?')) {
            const res = await dispatch(deleteBlog({ id: blogId, prime: role === 'admin' }));
            if (res.type === '/blog/delete/rejected') {
                toast.error(res.payload);
                return;
            }
            else if (res.type === '/blog/delete/fulfilled') {
                toast.success('Blog deleted successfully');
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }
        }
    }

    return (
        <>
            <div className="card_flex flex shadow-sm w-full px-6 py-4 border-gray-100 border-[0.3px] rounded-3xl  m-2" key={blog._id}>
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
                        {auth?.user?.token && auth.user._id === blog.user._id ?
                            <div className='flex my-4 gap-[10px]'>
                                <div>
                                    <NavLink type='button' className={'text-white bg-gray-900 px-6 py-2 rounded-lg hover:text-white text-sm border-[0.3px] border-gray-900 hover:bg-gray-800'} as={Link} to={`/edit`} state={{ blog: blog }}>
                                        Edit Blog
                                    </NavLink>
                                </div>

                                <div style={{ marginLeft: 10 }}>
                                    <button className='text-red-500 px-6 py-2 rounded-lg border-[0.3px] border-red-600 text-sm font-medium hover:bg-red-100' type='button' onClick={() => handleDeleteBlog(blog._id)}>
                                        Delete Blog
                                    </button>
                                </div>
                            </div>
                            : null
                        }
                        {/* role wise  */}
                        {role === 'admin' && auth.user._id !== blog.user._id &&
                            <div style={{ display: 'flex', margin: '10px auto 13px auto' }}>
                                <div>
                                    <NavLink type='button' className={'text-white bg-gray-900 px-6 py-2 rounded-lg hover:text-white text-sm border-[0.3px] border-gray-900 hover:bg-gray-800'} as={Link} to={`/edit`} state={{ blog: blog }}>
                                        Edit Blog
                                    </NavLink>
                                </div>
                                <div style={{ marginLeft: 10 }}>
                                    <button className='text-red-500 px-6 py-2 rounded-lg border-[0.3px] border-red-600 text-sm font-medium hover:bg-red-100' type='button' onClick={() => handleDeleteBlog(blog._id)}>
                                        Delete Blog
                                    </button>
                                </div>
                            </div>
                        }
                    </div>
                </div>
                <div className="flex items-center justify-center rounded-xl overflow-hidden w-[40%] max-h-[250px]">
                    <img className='w-[100%]' alt='Blog Image' src={blog.coverPhoto} />
                </div>
            </div>
        </>
    )
}

export default BlogItem