import React from 'react'
import { NavLink } from 'react-router-dom'

function NotFound() {
    return (
        <>
            <div style={{ flexDirection: 'column' }} className="w-full min-h-[80vh] flex items-center justify-center">
                <div ><iframe src="https://giphy.com/embed/lqFHf5fYMSuKcSOJph" width="100%" height="100%" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p><a href="https://giphy.com/gifs/quickpage-404-page-qewy-lqFHf5fYMSuKcSOJph">    </a></p>
                <p className='text-sm textgray-600'>Page you are looking for not found!</p>
                <NavLink className={'text-sm text-white px-6 py-3 my-4 bg-green-500 rounded-md shadow-sm hover:bg-green-600 hover:text-white'} to='/'>Go Back</NavLink>
            </div>
        </>
    )
}

export default NotFound