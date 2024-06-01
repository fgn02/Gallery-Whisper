import { useEffect, useState } from 'react';
import { Typography, Table, TableHead, TableBody, TableRow, TableCell, Paper } from '@material-ui/core';
import { useGetAllArtistQuery, useAddArtistMutation, useRemoveArtistMutation, 
    useUpdateArtistMutation, useUpdateArtistVerificationStatusMutation
} from '../../slices/artistApiSlice.js';
import Loader from '../../components/Loader.jsx';
import Message from '../../components/Message.jsx';
import { LinkContainer } from 'react-router-bootstrap';
import { Button, Modal, Form } from 'react-bootstrap';
import AdminPanelScreen from './AdminPanelScreen.jsx';
import Grid from '@mui/material/Grid';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const AllArtistScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [nationality, setNationality] = useState('');
    const [info, setInfo] = useState('');
    const [exhibitions, setExhibitions] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newInfo, setNewInfo] = useState('');
    const [newExhibitions, setNewExhibitions] = useState('');
    const [newNationality, setNewNationality] = useState('');
    

    const [userId, setUserId] = useState('');
    const { userInfo } = useSelector((state) => state.auth);
    const { data: artists, refetch, isLoading, error } = useGetAllArtistQuery();

  const [show, setShow] = useState(false);
  const [addShow, setAddShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    setUserId('');
    setName('');
    setEmail('');
    setNationality('');
    setInfo('');
    setExhibitions('');
    setNewPassword('');
  };

const addHandleClose = () => {
    setAddShow(false);
    setNewName('');
    setNewEmail('');
    setNewInfo('');
    setNewExhibitions('');
  };

  const handleShow = (user) => {
    setShow(true);
    setUserId(user._id);
    setName(user.name);
    setEmail(user.email);
    setNationality(user.nationality);
    setInfo(user.info);
    setExhibitions(user.exhibitions);
    setNewPassword(user.exhibitions);
    
  };

const addHandleShow = () => {
    setAddShow(true);
  };

  useEffect(() => {
    refetch();
  }, []);

  const [ removeArtist, {removeLoading, removeError} ] = useRemoveArtistMutation();
    const handleRemoveArtist = async (e) => {
    e.preventDefault();
    try {
        const res = await removeArtist({ userId }).unwrap();
        toast.success('Artist Removed Successfully');
        refetch();
        handleClose();
    } catch (err) {
        toast.error(err?.data?.message || err?.error);
    }
    };

  const [ addArtist, {addLoading, addError} ] = useAddArtistMutation();
  const handleAddArtist = async (e) => {
    e.preventDefault();
    const artist = {
        name: newName,
        email: newEmail,
        nationality: newNationality,
        info: newInfo,
        isVerified: true,
        exhibitions: newExhibitions,
    };
    try {
        const res = await addArtist(artist).unwrap();
        toast.success('Artist Added Successfully');
        refetch();
        setAddShow(false);
        }
    catch (err) {
        toast.error(err?.data?.message || err?.error);
    }
}
const [ updateArtist, {updateLoading, updateError} ] = useUpdateArtistMutation();

const submitHandler = async (e) => {
    e.preventDefault();
    const artist = {
        _id: userId,
        name,
        email,
        nationality,
        info,
        exhibitions,
    };
    try {
        const res = await updateArtist( artist ).unwrap();
        toast.success('Artist Updated Successfully');
        refetch();
        handleClose();
        }
    catch (err) {
        toast.error(err?.data?.message || err?.error);
    }
}
  const [ updateArtistStatus, {updateStatusLoading, updateStatusError} ] = useUpdateArtistVerificationStatusMutation();
const handleVerification = async (user) => {
  try {
    const res = await updateArtistStatus(user).unwrap();
    if (res) {
      toast.success('Artist Verification Status Updated Successfully');
      refetch(); // Call refetch after successful update
    }
  } catch (err) {
    toast.error(err?.data?.message || err?.error);
  }
};

  return (
    <Grid container spacing={2}>
      <Grid item xs={2}>
        <AdminPanelScreen />
      </Grid>
      <Grid item xs={10}>
       <Grid container alignItems="center" justifyContent="space-between" style={{ margin : '10px'}}>
            <Grid item>
                <Typography variant="h3">All Artists</Typography>
            </Grid>
            <Grid item>
                <Button className="btn-sm" variant="success" onClick={() => addHandleShow()}>
                <AddCircleIcon />
                </Button>
            </Grid>
        </Grid>
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message>{error.message}</Message>
        ) : artists && artists.length === 0 ? (
          <Message>No artists found.</Message>
        ) : (
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>Artists ID</b>
                  </TableCell>
                  <TableCell>
                    <b>Name</b>
                  </TableCell>
                  <TableCell>
                    <b>Email</b>
                  </TableCell>
                  <TableCell>
                    <b>Nationality</b>
                  </TableCell>
                   <TableCell>
                    <b>Verification Status</b>
                  </TableCell>
                  <TableCell>
                    <b>Actions</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {artists &&
                  artists.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <b>{user._id}</b>
                      </TableCell>
                   <TableCell>
                <LinkContainer to={`/artist/${user.name}`}>
                    <a>{user.name}</a>
                </LinkContainer>
                </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.nationality}
                      </TableCell>
                      <TableCell>
                        {user.isVerified
                          ? 
                          <>
                            <Button className="btn-sm" variant="danger" onClick={() => handleVerification(user)}  
                        >
                          Mark As Not Verified
                        </Button>
                          </>
                :           <>
                        <Button className="btn-sm" variant="success" onClick={() => handleVerification(user)}  
                              >
                              Mark As Verified
                        </Button>
                          </>
                        }
                        
                      </TableCell>
                      <TableCell>
                        <Button className="btn-sm" variant="info" onClick={() => handleShow(user)}  
                        style={{ width: '90px' }}>
                          Update Artist
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Paper>
        )}
      </Grid>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Artist</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form 
        onSubmit={submitHandler}
        >
        <Form.Group className = 'my-2' controlId='name'>
            <Form.Label>Update Name</Form.Label>
            <Form.Control type='text' placeholder='Enter Name' value={name} onChange={(e) => setName(e.target.value)}></Form.Control>
        </Form.Group>

        <Form.Group className = 'my-2' controlId='email'>
            <Form.Label>Update Address</Form.Label>
            <Form.Control type='email' placeholder='Enter Email' value={email} onChange={(e) => setEmail(e.target.value)}></Form.Control>
        </Form.Group>

        <Form.Group className = 'my-2' controlId='nation'>
            <Form.Label>Nationality</Form.Label>
            <Form.Control type='text' placeholder='Update Nationality' value={nationality} onChange={(e) => setNationality(e.target.value)}></Form.Control>
        </Form.Group>

        <Form.Group className = 'my-2' controlId='info'>
            <Form.Label>Info</Form.Label>
            <Form.Control type='text' placeholder='Update Info' value={info} onChange={(e) => setInfo(e.target.value)}></Form.Control>
        </Form.Group>

        <Form.Group className = 'my-2' controlId='exhibitions'>
            <Form.Label>Exhibitions</Form.Label>
            <Form.Control type='text' placeholder='Update Exhibitions' value={exhibitions} onChange={(e) => setExhibitions(e.target.value)}></Form.Control>
        </Form.Group>
        {isLoading && <Loader />}
        <Button type='submit' variant='primary' className='mt-3 btn-sm'>Update Profile</Button>
            </Form>
        </Modal.Body>
        <Modal.Footer>
        <Button className="btn-sm" variant="danger" onClick={handleRemoveArtist}>
                Remove Artist
                </Button>
          <Button className="btn-sm" variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={addShow} onHide={addHandleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Artist</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form 
        onSubmit={handleAddArtist}
        >
        <Form.Group className = 'my-2' controlId='newName'>
            <Form.Label>Name</Form.Label>
            <Form.Control type='text' placeholder='Enter Name' onChange={(e) => setNewName(e.target.value)}></Form.Control>
        </Form.Group>

        <Form.Group className = 'my-2' controlId='newEmail'>
            <Form.Label>Email</Form.Label>
            <Form.Control type='email' placeholder='Enter Email' onChange={(e) => setNewEmail(e.target.value)}></Form.Control>
        </Form.Group>

        <Form.Group className = 'my-2' controlId='newNationality'>
            <Form.Label>Nationality</Form.Label>
            <Form.Control type='text' placeholder='Nationality' onChange={(e) => setNewNationality(e.target.value)}></Form.Control>
        </Form.Group>

        <Form.Group className = 'my-2' controlId='newInfo'>
            <Form.Label>Info</Form.Label>
            <Form.Control type='text' placeholder='Info' onChange={(e) => setNewInfo(e.target.value)}></Form.Control>
        </Form.Group>

        <Form.Group className = 'my-2' controlId='newExhibitions'>
            <Form.Label>Exhibitions</Form.Label>
            <Form.Control type='text' placeholder='Exhibitions' onChange={(e) => setNewExhibitions(e.target.value)}></Form.Control>
        </Form.Group>
        {isLoading && <Loader />}
        <Button type='submit' variant='success' className='mt-3 btn-sm'>Add Artist</Button>
            </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={addHandleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Grid>
  );
};

export default AllArtistScreen;
