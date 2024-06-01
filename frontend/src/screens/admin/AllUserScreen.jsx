import { useEffect, useState } from 'react';
import { Typography, Table, TableHead, TableBody, TableRow, TableCell, Paper } from '@material-ui/core';
import { useGetAllUsersQuery, useMakeAdminMutation, useRemoveAdminMutation, 
    useUpdateUserMutation,useRemoveUserMutation } from '../../slices/userApiSlice.js';
import Loader from '../../components/Loader.jsx';
import Message from '../../components/Message.jsx';
import { LinkContainer } from 'react-router-bootstrap';
import { Button, Modal, Form } from 'react-bootstrap';
import AdminPanelScreen from './AdminPanelScreen.jsx';
import Grid from '@mui/material/Grid';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const AllUserScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userId, setUserId] = useState('');
  const { userInfo } = useSelector((state) => state.auth);
  const { data: users, refetch, isLoading, error } = useGetAllUsersQuery();
  const [makeAdmin, adminIsLoading] = useMakeAdminMutation();
  const [removeAdmin, removeAdminLoading] = useRemoveAdminMutation();
  const [updateUser, updateUserLoading] = useUpdateUserMutation();
  const [updateProfile, {profileIsLoading}] = useUpdateUserMutation();
  const [removeUser, removeUserLoading] = useRemoveUserMutation();

  const [show, setShow] = useState(false);  

  const handleClose = () => {
    setShow(false);
    setUserId('');
    setName('');
    setEmail('');
    setPassword('');
  };

  const handleShow = (user) => {
    setShow(true);
    setUserId(user._id);
    setName(user.name);
    setEmail(user.email);
  };

  useEffect(() => {
    refetch();
  }, []);

  const handleMakeAdmin = async (userId, name) => {
    if (userInfo._id === userId) {
      toast.error('You cannot make yourself admin');
      return;
    }
    const res = await makeAdmin({ userId });
    if (res.error) toast.error(res.error.message);
    else {
      refetch();
      toast.success(`${name} is now an admin`);
    }
  };

  const handleRemoveFromAdmin = async (userId, name) => {
    if (userInfo._id === userId) {
        toast.error('You cannot remove yourself from admin');
        return;
      }
    const res = await removeAdmin({ userId });
    if (res.error) toast.error(res.error.message);
    else {
      refetch();
      toast.success(`${name} removed from admin`);
    }
  };

  const handleRemoveUser = async () => {
    if (userInfo._id === userId) {
      toast.error('You cannot remove yourself');
      return;
    }
    try {
      const res = await removeUser({ userId });
      if (res.error) {
        toast.error(res.error.message);
      } else {
        refetch();
        handleClose();
        toast.success(`${name} removed`);
      }
    } catch (error) {
      toast.error(error?.data?.message || error?.error);
    }
  };
  
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
              _id: userId,
              name,
              email,
              password
            }).unwrap();
            handleClose();
            refetch();
            toast.success('Profile Updated Successfully');
        }catch(err){
            toast.error(err?.data?.message || err?.error);
        }}
    }
};

  return (
    <Grid container spacing={2}>
      <Grid item xs={2}>
        <AdminPanelScreen />
      </Grid>
      <Grid item xs={10}>
        <Typography variant="h3" style={{ margin : '10px'}}>All Customers</Typography>
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message>{error.message}</Message>
        ) : users && users.length === 0 ? (
          <Message>No users found.</Message>
        ) : (
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>User ID</b>
                  </TableCell>
                  <TableCell>
                    <b>Name</b>
                  </TableCell>
                  <TableCell>
                    <b>Email</b>
                  </TableCell>
                  <TableCell>
                    <b>Role</b>
                  </TableCell>
                  <TableCell>
                    <b>Actions</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users &&
                  users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <b>{user._id}</b>
                      </TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.isAdmin ? (
                        <Button variant="danger"
                        className="btn-sm"
                        onClick={() => handleRemoveFromAdmin(user._id, user.name)} 
                        style={{ width: '150px' }}>
                            Remove From Admin
                        </Button>
                        ) : (
                        <Button variant="success" className="btn-sm"
                        onClick={() => handleMakeAdmin(user._id, user.name)} 
                        style={{ width: '150px' }}>
                            Make Admin
                        </Button>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button variant="info" onClick={() => handleShow(user)}  className="btn-sm"
                        style={{ width: '150px' }}>
                          Update User
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
          <Modal.Title>Update User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
            <Form.Label>Update Password {' '}
                <small>(If you don't want to change password just retype the old password)</small></Form.Label>
            <Form.Control type='password' placeholder='Update Password' value={password} onChange={(e) => setPassword(e.target.value)}></Form.Control>
        </Form.Group>

        <Form.Group className = 'my-2' controlId='cPassword'>
            <Form.Label>Confirm Updated Password</Form.Label>
            <Form.Control type='password' placeholder='Confirm Updated Password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}></Form.Control>
        </Form.Group>
        {isLoading && <Loader />}
        <Button type='submit' variant='primary' className='mt-3 btn-sm'>Update Profile</Button>
            </Form>
        </Modal.Body>
        <Modal.Footer>
        <Button className="btn-sm" variant='danger' onClick={handleRemoveUser}>Remove User</Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Grid>
  );
};

export default AllUserScreen;
