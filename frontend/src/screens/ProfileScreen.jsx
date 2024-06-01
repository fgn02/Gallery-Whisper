import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {Form, Button} from "react-bootstrap";
import Formcontainer from "../components/Formcontainer";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../slices/authSlice";
import {toast} from 'react-toastify'
import Loader from "../components/Loader";
import {useUpdateUserMutation} from '../slices/userApiSlice';
import Grid from '@mui/material/Grid';
import Image from 'react-bootstrap/Image';



const ProfileScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const dispatch = useDispatch();

    const {userInfo} = useSelector(state => state.auth);
    const [updateProfile, {isLoading}] = useUpdateUserMutation();

    useEffect(() => {
        setName(userInfo.name);
        setEmail(userInfo.email);
    }, [userInfo.setName, userInfo.setEmail]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password != confirmPassword){
            toast.error('Passwords do not match');
        }
        else{
          if (password.length <= 0){
            toast.error('Please enter your password');
        }else{
            try{
                const res = await updateProfile({
                  _id: userInfo._id,
                  name,
                  email,
                  password
                }).unwrap();
                dispatch(setCredentials({...res}))
                toast.success('Profile Updated Successfully');
            }catch(err){
                toast.error(err?.data?.message || err?.error);
            }}
        }
    };
    return (
        <Grid container spacing={2}>
                <Grid item xs={3} style={{ display: 'flex', justifyContent: 'center', 
                alignItems: 'center' }}>
                 <Image
                    src='https://cdn-icons-png.flaticon.com/512/6269/6269970.png'
                    alt='login image'
                    fluid
                    rounded
                    style={{ height: '200px', width: '200px' }}
                    />

                </Grid>
              <Grid item xs={9}>
        <Formcontainer>
            <h1 style={{ paddingTop: '80px' }}>Update Profile</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group className = 'my-2' controlId='name'>
                    <Form.Label>Enter Name</Form.Label>
                    <Form.Control type='text' placeholder='Enter Name' value={name} onChange={(e) => setName(e.target.value)}></Form.Control>
                </Form.Group>

                <Form.Group className = 'my-2' controlId='email'>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control type='email' placeholder='Enter Email' value={email} onChange={(e) => setEmail(e.target.value)}></Form.Control>
                </Form.Group>

                <Form.Group className = 'my-2' controlId='password'>
                    <Form.Label>Update Password
                    <small>(If you don't want to change password just retype your old password)</small>

                    </Form.Label>
                    <Form.Control type='password' placeholder='Update Password' value={password} onChange={(e) => setPassword(e.target.value)}></Form.Control>
                </Form.Group>

                <Form.Group className = 'my-2' controlId='cPassword'>
                    <Form.Label>Confirm Updated Password</Form.Label>
                    <Form.Control type='password' placeholder='Confirm Updated Password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}></Form.Control>
                </Form.Group>
                {isLoading && <Loader />}
                <Button type='submit' variant='primary' className='mt-3'>Update Profile</Button>
            </Form>
        </Formcontainer>
        </Grid>
        </Grid>
  )
}

export default ProfileScreen
