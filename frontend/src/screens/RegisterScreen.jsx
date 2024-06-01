import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {Form, Button, Row, Col} from "react-bootstrap";
import Formcontainer from "../components/Formcontainer";
import { useDispatch, useSelector } from "react-redux";
import {useRegisterMutation, useGoogleRegMutation} from '../slices/userApiSlice';
import { setCredentials } from "../slices/authSlice";
import {toast} from 'react-toastify'
import Loader from "../components/Loader";
import Message from "../components/Message";
import Grid from '@mui/material/Grid';
import Image from 'react-bootstrap/Image';
import { GoogleLoginButton } from "react-social-login-buttons";
import {LoginSocialGoogle} from 'reactjs-social-login'


const RegisterScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {userInfo} = useSelector(state => state.auth);
    const [register, {isLoading}] = useRegisterMutation();
    const [googleReg, {googleRegIsLoading}] = useGoogleRegMutation();

    useEffect(() => {
        if(userInfo) {
            navigate('/');
        }
    }, [navigate, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password != confirmPassword){
            toast.error('Passwords do not match');
        }
        else{
            try{
                const res = await register({name, email, password}).unwrap();
                dispatch(setCredentials({...res}))
                navigate('/');
            }catch(err){
                toast.error(err?.data?.message || err?.error);
            }
        }
    };

    const handleGoogleReg = async(response) => {
    if (response && response.provider === 'google') {
        const { email, name } = response.data;
        try{
        const res = await googleReg({email, name}).unwrap();
        dispatch(setCredentials({...res}))
        navigate('/');
        }catch(err){
            <Message variant='error'>{toast.error(err?.data?.message || err?.error)}</Message>
        }
    }
    };
    return (
        <Grid container spacing={2}>
                <Grid item xs={3} style={{ display: 'flex', justifyContent: 'center', 
                alignItems: 'center' }}>
                 <Image
                    src='https://cdn-icons-png.flaticon.com/512/8521/8521787.png'
                    alt='login image'
                    fluid
                    rounded
                    style={{ height: '200px', width: '200px' }}
                    />

                </Grid>
              <Grid item xs={9}>
        <Formcontainer>
            <h1 style={{ paddingTop: '40px' }}>Sign In</h1>
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
                    <Form.Label>Enter Password</Form.Label>
                    <Form.Control type='password' placeholder='Enter Password' value={password} onChange={(e) => setPassword(e.target.value)}></Form.Control>
                </Form.Group>

                <Form.Group className = 'my-2' controlId='cPassword'>
                    <Form.Label>Enter Password</Form.Label>
                    <Form.Control type='password' placeholder='Confirm Password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}></Form.Control>
                </Form.Group>
                {isLoading && <Loader />}
                <Button type='submit' variant='primary' className='mt-3'>Sign Up</Button>
                <Row className='py-3'>
                    <LoginSocialGoogle
                            client_id={"344095228693-51ag8162m29l3ocehqopu9a75sj3ptro.apps.googleusercontent.com"}
                            scope="openid profile email"
                            discoveryDocs="claims_supported"
                            access_type="offline"
                            onResolve={handleGoogleReg}
                            onReject={(err) => {
                            console.log(err);
                            }}
                        >
                        <GoogleLoginButton style={{
                            borderRadius: "4px",
                            fontWeight: "bold",
                        }} > Register with Google </GoogleLoginButton>
                        </LoginSocialGoogle>
                </Row>
                <Row className='py-3'>
                    <Col>
                        Already Have an Account? <Link to='/login'>Login</Link>
                    </Col>
                </Row>
            </Form>
        </Formcontainer>
        </Grid>
        </Grid>
  )
}

export default RegisterScreen
