import { useGetArtistByNameQuery, useUpdateArtistMutation } from '../slices/artistApiSlice';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect,useState } from 'react';
import { Grid } from '@material-ui/core';
import ProductCard from '../components/ProductCard';
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import UpdateIcon from '@mui/icons-material/Update';
import { Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { LinkContainer } from 'react-router-bootstrap';
import { Row } from 'react-bootstrap';


const ArtistPanelScreen = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

    const [show, setShow] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [nationality, setNationality] = useState('');
    const [info, setInfo] = useState('');
    const [exhibitions, setExhibitions] = useState('');
    const [userId, setUserId] = useState('');

  useEffect(() => {
    if (!userInfo || !userInfo.artists) {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  const { data: artistInfo, refetch, isLoading, error } = useGetArtistByNameQuery(userInfo.name);
  const [ updateArtist, { updateLoading , updateError} ] = useUpdateArtistMutation();

    const handleClose = () => {
    setShow(false);
    setUserId('');
    setName('');
    setEmail('');
    setNationality('');
    setInfo('');
    setExhibitions('');
  };

  useEffect(() => {
    
  }, []);


    const handleShow = (user) => {
    setShow(true);
    setUserId(user._id);
    setName(user.name);
    setEmail(user.email);
    setNationality(user.nationality);
    setInfo(user.info);
    setExhibitions(user.exhibitions);
  };

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
        // refetchUpdate();
        handleClose();
        }
    catch (err) {
        toast.error(err?.data?.message || err?.error);
    }
}

  return (
    <div style={{ marginTop: '100px' }}>
      <h1 style={{ textAlign: 'center' }}>Artist Panel</h1>
      {artistInfo && artistInfo.artist.isVerified ? (
        <>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <h3 style={{ textAlign: 'center' , marginBottom : '10px'}} >Artist Info</h3>
              <Message variant="success">
                <b>Verified Account</b>
              </Message>
              {isLoading && <Loader />}
              {error && <Message variant="error">{error}</Message>}
              {artistInfo && (
                <div style={{ margin: '10px' }}>
                  <h6>Name: {artistInfo.artist.name}</h6>
                  <h6>Email: {artistInfo.artist.email}</h6>
                  <h6>Commission: {artistInfo.artist.commission * 100}%</h6>
                  <h6>Information: {artistInfo.artist.info}</h6>
                  {artistInfo.artist.exhibitions && (<h6>Exhibitions: {artistInfo.artist.exhibitions}</h6>)}
                  <Button variant="info" onClick={() => handleShow(artistInfo.artist)}  
                        // style={{ width: '90px' }}
                        >
                    <UpdateIcon /> Update Your Artist Profile
                    </Button>
                    <h3 style={{ margin: '10px' }}>My Artworks</h3>
                  {artistInfo.artistProducts && artistInfo.artistProducts.length > 0 ? (
                    artistInfo.artistProducts.map((newProduct) => (
                      <Grid key={newProduct.product._id} md={6}>
                        <ProductCard product={newProduct.product} />
                      </Grid>
                    ))
                  ) : (
                    <div style={{ marginTop: '10px' }}>
                      <Message variant="info">You have no artworks</Message>
                    </div>
                  )}
                </div>
              )}
            </Grid>
            <Grid item xs={6}>
              <Grid container alignItems="center" justifyContent="space-between" style={{ padding : '0px'}}>
                <h3>Artwork Dashboard</h3>
                <LinkContainer container to="/artist/addproduct" style={{ marginBottom : '10px'}}>
                <Button variant="success">
                <AddCircleIcon /> Add Artwork
                </Button>
                </LinkContainer>
            </Grid>
                
                  <Paper>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell><b>Artwork Name</b></TableCell>
                          <TableCell><b>Price</b></TableCell>
                          <TableCell><b>Stock</b></TableCell>
                          <TableCell><b>Actions</b></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {artistInfo && artistInfo.artistProducts && artistInfo.artistProducts.map((product) => (
                          <TableRow key={product.product._id}>
                            <TableCell>{product.product.name}</TableCell>
                            <TableCell>${product.product.price}</TableCell>
                            <TableCell>{product.product.countInStock}</TableCell>
                            <TableCell>
                              {product.product.isVerified ? (
                                <LinkContainer to={`/product/${product.product._id}`}>
                                  <Button variant="info" className="btn-sm">
                                    View
                                  </Button>
                                </LinkContainer>
                              ) : (
                                <Button variant="danger" className="btn-sm" disabled>
                                  Not verified
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Paper>
              </Grid>
            </Grid>
          <Modal show={show} onHide={handleClose} style={{marginTop:'50px'}}>
        <Modal.Header closeButton>
          <Modal.Title>Update Artist Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form 
        onSubmit={submitHandler}
        >
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
            <Form.Control required type='text' placeholder='Update Info' value={info} onChange={(e) => setInfo(e.target.value)}></Form.Control>
        </Form.Group>

        <Form.Group className = 'my-2' controlId='exhibitions'>
            <Form.Label>Exhibitions</Form.Label>
            <Form.Control type='text' placeholder='Update Exhibitions' value={exhibitions} onChange={(e) => setExhibitions(e.target.value)}></Form.Control>
        </Form.Group>
        {isLoading && <Loader />}
        <Button type='submit' variant='primary' className='mt-3'>Update Profile</Button>
            </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

        </>
      ) : (
        <Message variant="info">
          <b>Your artist account is not verified yet</b>
        </Message>
      )}
    </div>
  );
};

export default ArtistPanelScreen;
