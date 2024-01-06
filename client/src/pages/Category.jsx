import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { Button, Form, Icon, Loader, Modal, Table } from 'semantic-ui-react';
import { formatDate } from '../app/helpers';
import { addCategory, deleteCategory, editCategoryAction, getAllCategory } from '../features/category/categorySlice';
import { getMyProfile } from '../features/profile/profileSlice';
import { toast } from 'react-toastify';

const checkIfPrimeUser = ({ email }) => {
    let emails = ['porwalarjun95@gmail.com'];
    if (emails.includes(email)) return true;
    return false;
}

function Category() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector(state => state.auth);
    const { categories, isLoading } = useSelector(state => state.category);

    useEffect(async () => {

        const res = await dispatch(getMyProfile());

        if (!user || !user.token || res.payload.role !== "admin") {
            navigate('/');
            return
        }
        dispatch(getAllCategory());

    }, [navigate, dispatch])

    const handleCategoryDelete = async (id) => {
        if (window.confirm('All the blogs belongs to this category would also get delete. Are you sure to delete it ?')) {
            const payload = { categoryId: id, prime: checkIfPrimeUser(user) }
            const res = await dispatch(deleteCategory(payload));
            if (res.type === '/category/delete/rejected') {
                toast.error(res.payload)
            }
            else if (res.type === '/category/delete/fulfilled') {
                toast.success(res.payload.msg)
            }
        }
    }

    const [addCategoryValue, setAddCategoryValue] = useState('');
    const [addCategoryBtnLoading, setAddCategoryBtnLoading] = useState(false);
    const handleAddCategory = async (e) => {
        e.preventDefault();
        setAddCategoryBtnLoading(true);
        const res = await dispatch(addCategory({ name: addCategoryValue }));
        if (res.type === "/category/create/rejected") {
            toast.error(res.payload);
        }
        else if (res.type === "/category/create/fulfilled") {
            toast.success('Category created')
        }
        setAddCategoryBtnLoading(false);
    }

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editCategory, setEditCategory] = useState({});
    const handleEditIconClick = (category) => {
        setEditModalOpen(true);
        setEditCategory(category);
    }

    const handleEditCategory = async () => {
        const payload = { name: editCategory.name, categoryId: editCategory._id, prime: checkIfPrimeUser(user) }
        const res = await dispatch(editCategoryAction(payload));
        if (res.type === '/category/edit/rejected') {
            toast.error(res.payload);
        }
        else if (res.type === '/category/edit/fulfilled') {
            toast.success('Category Updated');
        }
        setEditModalOpen(false);
    }

    return (
        <Fragment>
            {/* Modal for editing category */}
            <Modal
                onClose={() => setEditModalOpen(false)}
                onOpen={() => setEditModalOpen(true)}
                open={editModalOpen}
                header='Edit Category'
                content={
                    <Fragment>
                        <div style={{ margin: 18 }}>
                            <Form>
                                <Form.Field>
                                    <input value={editCategory?.name} onChange={(e) =>
                                        setEditCategory({ ...editCategory, name: e.target.value })
                                    } />
                                </Form.Field>
                                <Button onClick={handleEditCategory} secondary>Edit</Button>
                            </Form>
                        </div>
                    </Fragment>
                }
            />

            {isLoading ?
                <Fragment>
                    <Loader active content='Loading categories...' />
                </Fragment>
                :
                <Fragment>
                    <div style={{ width: '70%', margin: 'auto' }} >
                        <Form>
                            <Form.Group>
                                <Form.Input placeholder='Category' width={13}>
                                    <input type="text" value={addCategoryValue} onChange={(e) => setAddCategoryValue(e.target.value)} />
                                </Form.Input>
                                <Form.Button fluid type='button' loading={addCategoryBtnLoading} content='Add' secondary width={3} onClick={handleAddCategory} />
                            </Form.Group>
                        </Form>
                    </div>
                    <div className="overflow-x-auto my-5">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated at</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Edit/Delete</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {categories &&
                                    categories.map((cat) => (
                                        <Fragment key={cat._id}>
                                            <tr>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div
                                                        className="flex items-center justify-start cursor-pointer"
                                                        onClick={() => navigate(`/profile/${cat.profile._id}`)}
                                                    >
                                                        <img
                                                            src={cat?.profile?.profileUrl}
                                                            className="rounded-full"
                                                            width={50}
                                                            height={50}
                                                            alt="profile"
                                                        />
                                                        <p className="ml-3 text-sm font-medium text-blue-500">{cat.user?.name}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">{cat.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{formatDate(cat.updatedAt)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {checkIfPrimeUser(user) || cat.user?._id === user?._id ? (
                                                        <Fragment>
                                                            <span
                                                                className="cursor-pointer mr-2 bg-yellow-400 px-3 py-2 rounded-xl text-white"
                                                                onClick={() => handleEditIconClick(cat)}
                                                            >
                                                                Edit
                                                            </span>
                                                            <span
                                                                className="cursor-pointer  bg-red-500 px-3 py-2 rounded-xl text-white"
                                                                onClick={() => handleCategoryDelete(cat._id)}
                                                            >
                                                                Delete
                                                            </span>
                                                        </Fragment>
                                                    ) : (
                                                        <span>-------------</span>
                                                    )}
                                                </td>
                                            </tr>
                                        </Fragment>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </Fragment>
            }
        </Fragment>

    )
}

export default Category