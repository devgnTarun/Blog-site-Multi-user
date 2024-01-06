import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import { Button, Grid, Input, Loader, Table } from 'semantic-ui-react';
import { formatDate, searchAuthors } from '../app/helpers';
import { toast } from 'react-toastify';
import { getAllUsers } from '../features/admin/adminSlice';

const checkIfPrimeUser = ({ email }) => {
    let emails = ['porwalarjun95@gmail.com'];
    if (emails.includes(email)) return true;
    return false;
}

const renderUserData = (usersList, user, navigate) => {

    return (
        <tbody className="bg-white divide-y divide-gray-200">
            {usersList?.map((curruser) => (
                <Fragment key={curruser._id}>
                    <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div
                                className="flex items-center justify-start cursor-pointer"
                                onClick={() => navigate(`/profile/${curruser.profile._id}`)}
                            >
                                <img
                                    src={curruser.profile.profileUrl}
                                    className="rounded-full"
                                    width={50}
                                    height={50}
                                    alt="profile"
                                />
                                <p className="ml-3 text-sm font-medium text-blue-500">{curruser.name}</p>
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{curruser.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{formatDate(curruser.createdAt)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            {curruser.profile.role === 'admin' ? (
                                <Button color='green' content='Admin' />
                            ) : curruser.blogs.length > 0 ? (
                                <Button color='blue' content='Author' />
                            ) : (
                                <Button content='Viewer' />
                            )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <Button as='a' href={`mailto:${curruser.email}`} icon='mail' label='Send Message' />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            {curruser.profile.role === 'admin' ? (
                                checkIfPrimeUser(user) ? (
                                    <Button as={Link} to={'/edit/author'} state={{ user: curruser }} icon='setting' label='Edit Details' />
                                ) : (
                                    <Fragment>-------------</Fragment>
                                )
                            ) : (
                                <Button as={Link} to={'/edit/author'} state={{ user: curruser }} icon='setting' label='Edit Details' />
                            )}
                        </td>
                    </tr>
                </Fragment>
            ))}
        </tbody>
    )
}

function Authors() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector(state => state.auth);
    const { profile } = useSelector(state => state.profile);
    const { usersList, isLoading } = useSelector(state => state.admin);

    useEffect(async () => {

        if (!user || !user.token) {
            navigate('/');
            return
        }

        if (!profile) return;

        if (profile.role !== "admin") {
            navigate('/');
            return
        }

        const res = await dispatch(getAllUsers());
        if (res.type === "/admin/getAllUsers/rejected") {
            toast.error(res.payload)
        }

    }, [profile, navigate, dispatch])

    const [searchVal, setSearchVal] = useState('');
    const [searchedUsersResult, setSearchedUsersResult] = useState([]);
    useEffect(() => {
        if (usersList) {
            const searchedUsers = searchAuthors(usersList, searchVal);
            setSearchedUsersResult(searchedUsers);
        }
    }, [usersList, searchVal])

    return (
        <Fragment>
            {/* Search Box Authors */}
            <Grid centered>
                <Grid.Column width={16}>
                    <Input
                        icon='search'
                        iconPosition='left'
                        value={searchVal}
                        onChange={(e) => setSearchVal(e.target.value)}
                        focus
                        placeholder='Search users by thier name / role / email . . . . . .'
                    />
                </Grid.Column>
            </Grid>


            <div className="overflow-x-auto my-7">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Author
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                User Creation date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                User Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Contact
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Setting
                            </th>
                        </tr>
                    </thead>
                    {searchVal ?
                        renderUserData(searchedUsersResult, user, navigate) :
                        renderUserData(usersList, user, navigate)
                    }


                </table>
            </div>
        </Fragment>
    )
}

export default Authors