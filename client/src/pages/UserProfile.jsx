import React, { Fragment, useEffect, useState } from 'react';
import { useNavigate, useParams, Link, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { getAnyUserProfile, customProfileReset, followAnyUserProfile } from '../features/profile/profileSlice';
import { toast } from 'react-toastify';
import { Button, Modal, Icon, Loader, Message, List, Image, Label, Grid } from 'semantic-ui-react';
import { formatDate } from '../app/helpers';
import BlogItem from '../components/BlogItem';

function SingleProfile() {

    const { profileId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const auth = useSelector(state => state.auth);
    const { otherProfile, isLoading, isError, errorMessage } = useSelector(state => state.profile);

    const [toggleFollowProfileLoading, settoggleFollowProfileLoading] = useState(false);
    const toggleFollowProfileClick = async () => {
        settoggleFollowProfileLoading(true);
        const res = await dispatch(followAnyUserProfile(profileId));
        if (res.type === 'profile/follow/rejected') {
            toast.error(res.payload);
        }
        else if (res.type === 'profile/follow/fulfilled') {

        }
        settoggleFollowProfileLoading(false);
        dispatch(customProfileReset());
    }

    const [showPeopleViewedModal, setShowPeopleViewedModal] = useState(false);
    const peopleViewedClick = () => {
        setShowPeopleViewedModal(!showPeopleViewedModal);
    }

    const [showFollowersModal, setShowFollowersModal] = useState(false);
    const followersClick = () => {
        setShowFollowersModal(!showFollowersModal);
    }

    const [showFollowingModal, setShowFollowingModal] = useState(false);
    const followingClick = () => {
        setShowFollowingModal(!showFollowingModal);
    }

    useEffect(async () => {
        setShowPeopleViewedModal(false);
        setShowFollowersModal(false);
        setShowFollowingModal(false);
        await dispatch(getAnyUserProfile(profileId));
        dispatch(customProfileReset());
    }, [dispatch, navigate])

    return (
        <Fragment>
            {/* People who viewed profile modal */}
            <Modal
                closeIcon
                open={showPeopleViewedModal}
                onClose={peopleViewedClick}
                size='mini'
            >
                <Modal.Header>People who viewed your profile</Modal.Header>
                <Modal.Content scrolling>
                    <List verticalAlign='middle'>
                        {otherProfile && otherProfile.profile && otherProfile.profile.viewedBy ?
                            otherProfile.profile.viewedBy.map(user => <List.Item key={user._id} className='peopleWhoViewedYourProfileList' >
                                <List.Content floated='right'>
                                    <Button basic color='black' as={Link} to={`/profile/${user.profile._id}`}> Visit Profile </Button>
                                </List.Content>
                                <Image avatar src={user.profile.profileUrl} alt="Profile Image" />
                                <List.Content >
                                    <p style={{ paddingLeft: 5, color: 'rgb(66, 73, 175)' }}> {user.user.name}</p>
                                </List.Content>
                            </List.Item>
                            )
                            : null}
                    </List>
                </Modal.Content>
            </Modal>

            {/* Followers Modal */}
            <Modal
                closeIcon
                open={showFollowersModal}
                onClose={followersClick}
                size='mini'
            >
                <Modal.Header>Followers</Modal.Header>
                <Modal.Content scrolling>
                    <List verticalAlign='middle'>
                        {otherProfile && otherProfile.profile && otherProfile.profile.followers ?
                            otherProfile.profile.followers.map(user => <List.Item key={user._id} className='peopleWhoViewedYourProfileList' >
                                <List.Content floated='right'>
                                    <Button basic color='black' as={Link} to={`/profile/${user.profile._id}`}> Visit Profile </Button>
                                </List.Content>
                                <Image avatar src={user.profile.profileUrl} alt="Profile Image" />
                                <List.Content >
                                    <p style={{ paddingLeft: 5, color: 'rgb(66, 73, 175)' }}> {user.user.name}</p>
                                </List.Content>
                            </List.Item>
                            )
                            : null}
                    </List>
                </Modal.Content>
            </Modal>

            {/* Following Model */}
            <Modal
                closeIcon
                open={showFollowingModal}
                onClose={followingClick}
                size='mini'
            >
                <Modal.Header>Following</Modal.Header>
                <Modal.Content scrolling>
                    <List verticalAlign='middle'>
                        {otherProfile && otherProfile.profile && otherProfile.profile.following ?
                            otherProfile.profile.following.map(user => <List.Item key={user._id} className='peopleWhoViewedYourProfileList' >
                                <List.Content floated='right'>
                                    <Button basic color='black' as={Link} to={`/profile/${user.profile._id}`}> Visit Profile </Button>
                                </List.Content>
                                <Image avatar src={user.profile.profileUrl} alt="Profile Image" />
                                <List.Content >
                                    <p style={{ paddingLeft: 5, color: 'rgb(66, 73, 175)' }}> {user.user.name}</p>
                                </List.Content>
                            </List.Item>
                            )
                            : null}
                    </List>
                </Modal.Content>
            </Modal>

            {isError && !isLoading ?
                <Fragment>
                    {errorMessage.map(err => { <Message error floating content={err} /> })}
                </Fragment> : null
            }
            {!otherProfile ? <Loader active>Loading profile</Loader>
                :
                otherProfile.profile && otherProfile.user ?
                    <>
                        <div className="max-w-[1200px] mx-auto w-full min-h-screen pt-[20px] flex items-start justify-center">
                            {/* Profile box  */}
                            <div className="w-full h-full flex-col items-center justify-center mx-[20px]">
                                {/* Top profile box  */}
                                <div className="w-full min-h-[30vh] flex-col  items-start justify-center py-6 border-b-[0.3px]">
                                    {/* Image box  */}
                                    <img className='w-[100px] rounded-full mx-auto mb-4' src={otherProfile?.profile?.profileUrl} alt={'Profile image'} />
                                    {/* User text top  */}
                                    <div className="flex-col mx-[20px]">
                                        {/* Name and other box */}
                                        <div className="cont_flexy items-center justify-center my-2">
                                            <p className='text-2xl text-gray-900 font-semibold'>{otherProfile.user.name}</p>
                                            {/* Verified or not  */}
                                            <div className="flex items-center justify-center my-2">
                                                {otherProfile.profile.isActivated ?
                                                    <span className='mx-3 px-2 py-1 rounded-xl bg-green-600 text-white text-xs '>Verified Account</span> :
                                                    <span className='mx-3 px-2 py-1 rounded-xl bg-red-600 text-white text-xs '>Unverified Account</span>
                                                }
                                                {/* Edit button or not  */}
                                                {auth && auth.user && otherProfile.user._id === auth.user._id
                                                    ?
                                                    <NavLink className={'text-white text-xs px-4 py-1 rounded-2xl bg-gray-900 hover:text-white hover:bg-gray-800 my-2'} to='/update-profile'>
                                                        Edit Profile
                                                    </NavLink>
                                                    :
                                                    <div></div>
                                                }
                                            </div>
                                        </div>
                                        <p className='text-xs text-gray-600  '>  {otherProfile.profile.bio}</p>
                                        {/* Followers or not */}
                                        <div className='flex gap-[10px] items-center justify-center my-2'>

                                            {auth && auth.user && otherProfile.user._id === auth.user._id ?
                                                <div className="flex-col items-center text-center justify-center p-4 border-[0.3px] border-gray-100 rounded-xl cursor-pointer " onClick={peopleViewedClick}>
                                                    <p className='text-sm text-gray-900 font-medium mb-2'> {otherProfile.profile.viewedBy.length}</p> <p className='text-sm text-gray-900 '>Viewed</p>
                                                </div> : null
                                            }
                                            <div className="flex-col items-center text-center justify-center p-4 border-[0.3px] border-gray-100 rounded-xl cursor-pointer" onClick={followersClick}>
                                                <p className='text-sm text-gray-900 font-medium mb-2'> {otherProfile.profile.followers.length}</p> <p className='text-sm text-gray-900 '>Followers</p>
                                            </div>
                                            <div className="flex-col items-center text-center justify-center p-4 border-[0.3px] border-gray-100 rounded-xl cursor-pointer" onClick={followingClick}>
                                                <p className='text-sm text-gray-900 font-medium mb-2'> {otherProfile.profile.following.length}</p> <p className='text-sm text-gray-900 '>Following</p>
                                            </div>
                                        </div>

                                        {/* Auth button  */}
                                        <div className="w-full flex gap-[10px] items-center justify-center">
                                            {auth && auth.user && otherProfile.user._id !== auth.user._id ?
                                                otherProfile.profile.followers.find(user => user.user._id === auth.user._id)
                                                    ?
                                                    <Button secondary basic loading={toggleFollowProfileLoading} onClick={toggleFollowProfileClick}>
                                                        Unfollow
                                                    </Button> :
                                                    <Button secondary loading={toggleFollowProfileLoading} onClick={toggleFollowProfileClick}>
                                                        Follow
                                                    </Button>
                                                :
                                                <div></div>
                                            }
                                            {/* Send message  */}
                                            {auth && auth.user && otherProfile.user._id !== auth.user._id ?
                                                <Button as='a' href={`mailto:${auth.user.email}`} icon='mail' label='Contact' />
                                                :
                                                <div></div>
                                            }
                                        </div>
                                    </div>
                                </div>
                                {/* Blogs profile box  */}
                                <div className="flex-col items-center justify-center w-full">
                                    {otherProfile.blogs.length ?
                                        <Fragment>

                                            {otherProfile.blogs.map(blog => (
                                                <BlogItem blog={blog} />
                                            ))}

                                        </Fragment>
                                        : <div className="w-full min-h-[30vh] flex items-center justify-center  border-b-[0.3px] py-4 ">
                                            <p className='text-md text-gray-900 font-medium'>No Blogs By {otherProfile.user.name}</p>
                                        </div>
                                    }
                                </div>

                                {/* Joined and social footer  */}
                                <div className="w-full flex-col items-center justify-center bg-gray-900 px-4 py-2">
                                    <p className='text-xs text-center text-gray-200'>Joined at {formatDate(otherProfile.profile.createdAt)}</p>
                                    {
                                        otherProfile.profile.social && <div className="flex items-center justify-center gap-[10px] mt-4">
                                            {otherProfile.profile.social ?
                                                <Fragment>
                                                    {otherProfile.profile.social.github ?
                                                        <a href={otherProfile.profile.social.github} target="_blank" className='text-sm text-white hover:text-green-400'>
                                                            <Icon name='github' />
                                                        </a> : null
                                                    }
                                                    {otherProfile.profile.social.linkedin ?
                                                        <a href={otherProfile.profile.social.linkedin} target="_blank" className='text-sm text-white hover:text-green-400'>
                                                            <Icon name='linkedin' />
                                                        </a> : null
                                                    }
                                                    {otherProfile.profile.social.twitter ?
                                                        <a href={otherProfile.profile.social.twitter} target="_blank" className='text-sm text-white hover:text-green-400'>
                                                            <Icon name='twitter' />
                                                        </a> : null
                                                    }
                                                    {otherProfile.profile.social.facebook ?
                                                        <a href={otherProfile.profile.social.facebook} target="_blank" className='text-sm text-white hover:text-green-400'>
                                                            <Icon name='facebook' />
                                                        </a> : null
                                                    }
                                                    {otherProfile.profile.social.youtube ?
                                                        <a href={otherProfile.profile.social.youtube} target="_blank" className='text-sm text-white hover:text-green-400'>
                                                            <Icon name='youtube' />
                                                        </a> : null
                                                    }
                                                    {otherProfile.profile.social.instagram ?
                                                        <a href={otherProfile.profile.social.instagram} target="_blank" className='text-sm text-white hover:text-green-400'>
                                                            <Icon name='instagram' />
                                                        </a> : null
                                                    }
                                                </Fragment>
                                                : null
                                            }
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </>
                    :
                    <Message error floating content='No such profile exists!' />
            }
        </Fragment>
    )
}

export default SingleProfile