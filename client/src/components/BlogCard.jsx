import React from 'react'
import { Link } from 'react-router-dom'
import { extractDescriptionFromHTML } from '../app/helpers'

const BlogCard = ({ blog }) => {
    return (
        <>
            <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow   hover:border-green-200">
                <div className='max-h-[250px] overflow-hidden min-h-[250px] flex items-center justify-center'>
                    <img className="w-full rounded-t-lg" src={blog?.coverPhoto} alt="" />
                </div>
                <div className="p-5">
                    <Link to={`/blog/${blog._id}`}>
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900  py-3">{blog?.title?.length >= 25 ? `${blog.title?.slice(0, 25)}...` : `${blog.title?.slice(0, 25)}`}</h5>
                    </Link>
                    <p className="mb-3 font-normal text-gray-700">{extractDescriptionFromHTML(blog.desc).substr(0, 300)}...........</p>
                    <Link to={`/blog/${blog._id}`} className=" hover:text-white inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 ">
                        Read more
                        <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                        </svg>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default BlogCard