import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <footer className="p-4 bg-white md:p-8 lg:p-10 dark:bg-gray-800 mt-[50px]">
            <div className="mx-auto max-w-screen-xl text-center">
                <Link to='/' className="flex justify-center items-center text-2xl font-semibold text-gray-900 dark:text-white">
                    L4 News
                </Link>
                <p className="my-6 text-gray-500 dark:text-gray-400">Stay connected to know about the latest updates in tech/sports and grab the news before others.</p>
                <ul className="flex flex-wrap justify-center items-center mb-6 text-gray-900 dark:text-white">
                    <li>
                        <Link to="/" className="mr-4 hover:underline md:mr-6 ">Home</Link>
                    </li>
                    <li>
                        <Link to="/login" className="mr-4 hover:underline md:mr-6">Login</Link>
                    </li>
                    <li>
                        <Link to="/blogs/category/65982bfcba7f867425c0d763" className="mr-4 hover:underline md:mr-6 ">Tech</Link>
                    </li>
                    <li>
                        <Link to="/blogs/category/65982befba7f867425c0d75d" className="mr-4 hover:underline md:mr-6">News</Link>
                    </li>
                    <li>
                        <Link to="/blogs/category/65999bc5c8b2262ac6f47e20" className="mr-4 hover:underline md:mr-6">Market</Link>
                    </li>
                    <li>
                        <Link to="/faq" className="mr-4 hover:underline md:mr-6">FAQs</Link>
                    </li>
                    <li>
                        <Link to="/contact" className="mr-4 hover:underline md:mr-6">Contact</Link>
                    </li>
                </ul>
                <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2021-2022 <Link to='/' className="hover:underline">L4 News</Link>. All Rights Reserved.</span>
            </div>
        </footer>
    )
}

export default Footer