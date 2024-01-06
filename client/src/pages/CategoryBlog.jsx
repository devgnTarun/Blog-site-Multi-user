import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';
import { getBlogsByCategoryId } from '../features/blog/blogSlice';
import BlogCard from '../components/BlogCard';

const CategoryBlog = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const id = params.id;
    const blog = useSelector(state => state.blog);

    useEffect(() => {
        dispatch(getBlogsByCategoryId({ categoryId: id }))
    }, [id])

    return (
        <>
            {
                blog && blog.latestBlogs?.length === 0 ?
                    <div className="w">
                        No blogs available on this category
                    </div>
                    : <div className="flex gap-x-5 gap-y-4 flex-wrap items-start md:justify-start justify-center">

                        {
                            blog?.latestBlogs?.map(blog =>
                                <BlogCard blog={blog} />
                            )
                        }
                    </div>
            }
        </>
    )
}

export default CategoryBlog