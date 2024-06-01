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
import { useAddArtistMutation } from "../slices/artistApiSlice";


const ArtistJoinScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [newInfo, setNewInfo] = useState('');
    const [newExhibitions, setNewExhibitions] = useState('');
    const [newNationality, setNewNationality] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector(state => state.auth);
  const [ addArtist, {addLoading, addError} ] = useAddArtistMutation();

  useEffect(() => {
    if (!userInfo || userInfo && userInfo.artists) {
      navigate(location.state?.from || '/');
    }
  }, [navigate, location.state, userInfo]);

const handleAddArtist = async (e) => {
    e.preventDefault();
    const artist = {
        name :name,
        email:email,
        nationality: newNationality,
        info: newInfo,
        isVerified: false,
        exhibitions: newExhibitions,
        userId: userInfo._id,
    };
    try {
        const res = await addArtist(artist).unwrap();
        setName('');
        setEmail('');
        setNewNationality('');
        setNewInfo('');
        setNewExhibitions('');
        navigate('/artist/panel');
        dispatch(setCredentials({ ...userInfo, artists: true }));
        toast.success('Your artist join form submitted successfully');
        }
    catch (err) {
        toast.error(err?.data?.message || err?.error);
    }
}


  return (
    <Grid container spacing={2}>
      <Grid item xs={3} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Image
          src='https://cdn-icons-png.flaticon.com/512/2400/2400548.png'
          alt='login image'
          fluid
          rounded
          style={{ height: '200px', width: '200px' }}
        />
      </Grid>
      <Grid item xs={9}>
        <Formcontainer>
          <h1 style={{ paddingTop: '100px' }}>Join as Artist</h1>
          <Form onSubmit={handleAddArtist}>
            <Form.Group className='my-2' controlId='name'>
              <Form.Label>User Name</Form.Label>
              <Form.Control type="email" placeholder="Enter Name" value={userInfo ? userInfo.name : ''} 
               disabled />
            </Form.Group>

            <Form.Group className='my-2' controlId='email'>
              <Form.Label>Email Address</Form.Label>
              <Form.Control type="email" placeholder="Enter Email" value={userInfo ? userInfo.email : ''} 
               disabled />
            </Form.Group>

            <Form.Group className = 'my-2' controlId='newNationality'>
            <Form.Label>Nationality</Form.Label>
            <Form.Control
                type="text"
                placeholder="Enter Name"
                value={newNationality}
                onChange={(e) => {
                    setNewNationality(e.target.value);
                    setName(userInfo.name);
                    setEmail(userInfo.email);
                }}
                />

        </Form.Group>

        <Form.Group className = 'my-2' controlId='newInfo'>
            <Form.Label>Info</Form.Label>
            <Form.Control type='text' placeholder='Info' 
            onChange={(e) => setNewInfo(e.target.value)}></Form.Control>
        </Form.Group>

        <Form.Group className = 'my-2' controlId='newExhibitions'>
            <Form.Label>Exhibitions</Form.Label>
            <Form.Control type='text' placeholder='Exhibitions' 
            onChange={(e) => setNewExhibitions(e.target.value)}></Form.Control>
        </Form.Group>

            {isLoading && <Loader />}
            <Button type='submit' variant='success' className='mt-3'>Join</Button>
          </Form>
        </Formcontainer>
      </Grid>
    </Grid>
  );
};

export default ArtistJoinScreen;
