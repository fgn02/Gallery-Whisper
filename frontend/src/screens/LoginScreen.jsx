import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import Formcontainer from "../components/Formcontainer";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation, useGoogleLoginMutation } from '../slices/userApiSlice';
import { setCredentials } from "../slices/authSlice";
import { toast } from 'react-toastify';
import Loader from "../components/Loader";
import Message from "../components/Message";
import Grid from '@mui/material/Grid';
import Image from 'react-bootstrap/Image';
import { GoogleLoginButton } from "react-social-login-buttons";
import { LoginSocialGoogle } from 'reactjs-social-login';


const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();
  const [googleLogin, { googleLoginIsLoading }] = useGoogleLoginMutation();

  const { userInfo } = useSelector(state => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate(location.state?.from || '/');
    }
  }, [navigate, location.state, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(location.state?.from || '/');
    } catch (err) {
      toast.error(err?.data?.message || err?.error);
    }
  };

  const handleGoogleLogin = async (response) => {
    if (response && response.provider === 'google') {
      const { email, name } = response.data;
      try {
        const res = await googleLogin({ email }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(location.state?.from || '/');
      } catch (err) {
        toast.error(err?.data?.message || err?.error);
      }
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={3} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Image
          src='https://cdn-icons-png.flaticon.com/512/2250/2250207.png'
          alt='login image'
          fluid
          rounded
          style={{ height: '200px', width: '200px' }}
        />
      </Grid>
      <Grid item xs={9}>
        <Formcontainer>
          <h1 style={{ paddingTop: '100px' }}>Login</h1>
          <Form onSubmit={submitHandler}>
            <Form.Group className='my-2' controlId='email'>
              <Form.Label>Email Address</Form.Label>
              <Form.Control type='email' placeholder='Enter Email' value={email} onChange={(e) => setEmail(e.target.value)}></Form.Control>
            </Form.Group>

            <Form.Group className='my-2' controlId='password'>
              <Form.Label>Enter Password</Form.Label>
              <Form.Control type='password' placeholder='Enter Password' value={password} onChange={(e) => setPassword(e.target.value)}></Form.Control>
            </Form.Group>
            {isLoading && <Loader />}
            <Button type='submit' variant='primary' className='mt-3'>Login</Button>
            <Row className='py-3'>
              <Col>
                <LoginSocialGoogle
                  client_id={"344095228693-51ag8162m29l3ocehqopu9a75sj3ptro.apps.googleusercontent.com"}
                  scope="openid profile email"
                  discoveryDocs="claims_supported"
                  access_type="offline"
                  onResolve={handleGoogleLogin}
                  onReject={(err) => {
                    console.log(err);
                  }}
                >
                  <GoogleLoginButton style={{
                    borderRadius: "4px",
                    fontWeight: "bold",
                  }} />
                </LoginSocialGoogle>
              </Col>
            </Row>
            <Row className='py-3'>
              <Col>
                New Customer? <Link to='/register'>Register</Link>
              </Col>
            </Row>
          </Form>
        </Formcontainer>
      </Grid>
    </Grid>
  );
};

export default LoginScreen;
