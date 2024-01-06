import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Loader, Message, Icon, Label, Form, Button } from 'semantic-ui-react';
import { formatDate } from '../app/helpers';
import { commentBlogByBlogID, deleteBlog, deleteCommentBlogByBlogID, dislikeBlogByBlogID, getBlogByBlogID, getBlogsByCategoryId, likeBlogByBlogID } from '../features/blog/blogSlice';

const checkIfKeyExists = (arr, loggedInUserId) => {
    return (arr.filter(elm => elm.user.toString() === loggedInUserId)).length == 0
}

function SingleBlog() {

    const { blogId } = useParams();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { singleBlog, isLoading, isError, errorMessage, latestBlogs } = useSelector(state => state.blog)
    const auth = useSelector(state => state.auth);

    const likeBlog = async () => {
        if (auth.user && auth.user.token) {
            dispatch(likeBlogByBlogID(blogId));
        }
        else {
            toast.error('Please login to like the blog');
        }
    }

    const dislikeBlog = async () => {
        if (auth.user && auth.user.token) {
            dispatch(dislikeBlogByBlogID(blogId));
        }
        else {
            toast.error('Please login to dislike the blog');
        }
    }

    const [commentText, setCommentText] = useState('');
    const commentOnSubmit = async () => {
        if (commentText.trim().length === 0) {
            toast.error('Comment text should not be empty');
            return
        }
        else {
            const res = await dispatch(commentBlogByBlogID({ blogId, text: commentText }));
            if (res.type === '/blog/comment/fulfilled') {
                toast.success('Comment Posted');
                setCommentText('');
            }
        }
    }

    const handleCommentDelete = async (commentId) => {
        const res = await dispatch(deleteCommentBlogByBlogID({ blogId, commentId }))
        if (res.type === '/blog/comment/delete/rejected') {
            toast.error(res.payload);
            return;
        }
    }

    const handleDeleteBlog = async () => {
        if (window.confirm('Do you surely want to delete your blog?')) {
            const res = await dispatch(deleteBlog({ id: blogId }));
            if (res.type === '/blog/delete/rejected') {
                toast.error(res.payload);
                return;
            }
            else if (res.type === '/blog/delete/fulfilled') {
                toast.success('Blog deleted successfully')
                navigate('/');
            }
        }
    }

    useEffect(() => {
        dispatch(getBlogByBlogID(blogId));
    }, [navigate, dispatch])

    return (
        <>
            <Fragment>
                {
                    isLoading ? <Loader active>Loading Blog</Loader>
                        :
                        !singleBlog ? <Message error floating content={'No such blog found'} />
                            :
                            <Fragment>

                                <div style={{ flexDirection: 'column' }} className="w-[100%] mx-auto min-h-[100vh] flex items-start justify-start pt-[20px] px-4">
                                    {/* top */}
                                    <div className="flex items-center justify-start">
                                        <Link to={`/profile/${singleBlog.profile._id}`} className="w-[80px] h-[80px] p-auto rounded-full overflow-hidden">
                                            <img src={singleBlog.profile.profileUrl} alt="profile" className='w-full' />
                                        </Link>
                                        <Link to={`/profile/${singleBlog.profile._id}`} className='flex-col items-center justify-start ml-4'>
                                            <p className='text-gray-900 text-2xl font-semibold'>{singleBlog.user?.name}</p>
                                            <p className='text-gray-600 text-sm my-2'> Last updated on  {formatDate(singleBlog.updatedAt)}</p>
                                        </Link>
                                    </div>
                                    {/* category  */}
                                    <div className='my-7'>
                                        <p className='text-white bg-green-500 px-6 py-2 rounded-sm text-sm'>Topic : {singleBlog.category.name}</p>
                                    </div>

                                    {/* blog head  */}

                                    <div className="flex-col mt-6">
                                        <p className='text-4xl text-gray-900 font-bold tracking-wide'> {singleBlog.title}</p>
                                        <div className="w-[100%] flex items-center justify-start rounded-md my-4 min-h-[300px] max-h-[400px] overflow-hidden" >
                                            <img src={singleBlog.coverPhoto} alt="blog photo" className='w-[80%]' />
                                        </div>
                                        <div className='my-4'>
                                            <div className='single-blog-desc' dangerouslySetInnerHTML={{ __html: singleBlog.desc }}></div>
                                        </div>


                                        <div className="flex my-[20px] items-center justify-start gap-[20px]">
                                            <p className='text-lg text-gray-900 cursor-pointer' >
                                                <Icon name='eye' />
                                                {singleBlog.viewedBy.length} Views
                                            </p>
                                            <p className='text-lg text-gray-900 cursor-pointer' onClick={likeBlog} >
                                                {checkIfKeyExists(singleBlog.likes, auth?.user?._id) ?
                                                    <Icon name='thumbs up ' /> :
                                                    <Icon name='thumbs up' />
                                                }
                                                {singleBlog.likes.length}
                                            </p>
                                            <p className='text-lg text-gray-900 cursor-pointer' onClick={dislikeBlog} >
                                                {checkIfKeyExists(singleBlog.dislikes, auth?.user?._id) ?
                                                    <Icon name='thumbs down ' /> :
                                                    <Icon name='thumbs down' />
                                                }
                                                {singleBlog.dislikes.length}
                                            </p>
                                            <p className='text-lg text-gray-900 cursor-pointer' >
                                                <Icon name='comments' />
                                                {singleBlog.comments.length}
                                            </p>
                                        </div>

                                    </div>


                                    {auth?.user?.token ?
                                        <div className='w-full pt-19'>
                                            <p className=' mb-4 text-gray-900  text-xl'>Write a comment....</p>
                                            <Form onSubmit={commentOnSubmit}>
                                                <textarea className='w-full outline-none resize-none ' rows={3} placeholder='Write your comment here' value={commentText} onChange={(e) => setCommentText(e.target.value)} />
                                                <button className='mt-6 px-6 py-2 my-3 rounded-3xl bg-green-500 text-white' type='submit' >Post comment</button>
                                            </Form>
                                            <br />
                                        </div>
                                        : null
                                    }
                                    {/* comments  */}
                                    <div className="w-full flex-col items-start justify-center mt-[40px] mb-8">

                                        {
                                            singleBlog.comments?.length ? singleBlog.comments.map((comment) =>
                                                <>
                                                    <article class="p-6 mb-6 text-base bg-white rounded-lg dark:bg-gray-900">
                                                        <footer class="flex justify-between items-center mb-2">
                                                            <div class="flex items-center">
                                                                <p class="inline-flex items-center mr-3 font-semibold text-sm text-gray-900 dark:text-white"><img
                                                                    class="mr-2 w-6 h-6 rounded-full"
                                                                    src={comment.profile.profileUrl}
                                                                    alt={comment?.user?.name} />{comment?.user?.name}</p>
                                                                <p class="text-sm text-gray-600 dark:text-gray-400"><time pubdate datetime="2022-02-08"
                                                                    title="February 8th, 2022">Feb. 8, 2022</time></p>
                                                            </div>

                                                        </footer>
                                                        <p>{comment?.text}</p>
                                                        <div class="flex items-center mt-4 space-x-4">

                                                            {auth?.user?._id.toString() === comment.user._id.toString() ?
                                                                <button type="button" onClick={() => handleCommentDelete(comment._id)}
                                                                    class="flex items-center font-medium text-sm text-gray-500 hover:underline dark:text-gray-400">
                                                                    <svg class="mr-1.5 w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                                                        <path d="M18 0H2a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2v4a1 1 0 0 0 1.707.707L10.414 13H18a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5 4h2a1 1 0 1 1 0 2h-2a1 1 0 1 1 0-2ZM5 4h5a1 1 0 1 1 0 2H5a1 1 0 0 1 0-2Zm2 5H5a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Zm9 0h-6a1 1 0 0 1 0-2h6a1 1 0 1 1 0 2Z" />
                                                                    </svg>
                                                                    Remove
                                                                </button>
                                                                : null
                                                            }
                                                        </div>
                                                    </article>


                                                </>
                                            ) : <div className="my-7 text-center w-full"><p className='text-lg text-gray-800 font-medium py-5'>No comments yet</p></div>
                                        }
                                    </div>
                                </div>
                            </Fragment>
                }
            </Fragment >



        </>
    )
}

export default SingleBlog