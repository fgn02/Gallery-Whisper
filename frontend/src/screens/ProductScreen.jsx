import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Typography, Paper, Button, Box } from '@mui/material';
import { useSpring, animated } from 'react-spring';
import { useGetProductByIdQuery } from '../slices/productsApiSlice';
import Loader from '../components/Loader';
import { Row, Col, Form } from 'react-bootstrap';
import { cartAdd } from '../slices/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { LinkContainer } from 'react-router-bootstrap';
import Rating from '@mui/material/Rating';
import {useCreateReviewMutation, useGetReviewQuery} from '../slices/reviewApiSlice';
import Message from '../components/Message';
import Footer from '../components/Footer';
import { useGetFavoriteQuery } from '../slices/userApiSlice';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Link } from 'react-router-dom';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import GppMaybeIcon from '@mui/icons-material/GppMaybe';

 

const ProductScreen = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const { id: productId } = useParams();
  const {userInfo} = useSelector(state => state.auth);
  const { data, isLoading, refetch: refetchProduct, error } = useGetProductByIdQuery(productId);
  const [cartItems, setCartItems] = useState([]);
  const [quan, setQuan] = useState();

  useEffect(() => {
    const prevQuan = cartItems.find((item) => item._id === productId)?.qty || 1;
    setQuan(prevQuan);
  }, [cartItems, productId]);
  
  const fadeInProps = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 500 },
  });

  const dispatch = useDispatch();
  const addToCartHandler = async (product, qty) => {
    dispatch(cartAdd({ ...product, qty }));
    toast.success(`${product.name} added to cart`);
  };

  const cart = useSelector((state) => state.cart);
  useEffect(() => {
    setCartItems(cart.cartItems);
  }, [cart.cartItems]);


  const [createReview, {isLoading: reviewSubmitLoading }] = useCreateReviewMutation();
  const {data: reviewData, isLoading: reviewSuccess, refetch: refetchReviews} = useGetReviewQuery(productId);
  const [hasReviewed, setHasReviewed] = useState(false);


  const [isFavorite, setIsFavorite] = useState(false);
  const { data: favProducts, FavIsLoading, refetch, favError } = useGetFavoriteQuery();

  useEffect(() => {
    if (userInfo && reviewData && reviewData.some((review) => review.user._id === userInfo._id)) {
      setHasReviewed(true);
    }
  }, [userInfo, reviewData]);
  

  useEffect(() => {
    if (favProducts && userInfo && !FavIsLoading && !favError) {
      const index = favProducts && data ? favProducts.findIndex((item) => item._id === data._id) : -1;
      if (index !== -1) {
        setIsFavorite(true);
      } else {
        setIsFavorite(false);
      }
    }
  }, [favProducts, data]);
  
  

  const submitHandler = async (e) => {
    e.preventDefault();
    if(rating == 0 || comment === ''){
        toast.error('Please fill all the fields');
        return;
      }
    try {
      const res = await createReview({ rating, comment, productId }).unwrap();
      if (res) {
        if (res.data.flag) {
          setHasReviewed(true);
          toast.error('You have already reviewed the product');
          refetchReviews();
          refetchProduct();
        } else {
          toast.success('Review added successfully');
          setRating(0);
          setComment('');
          setHasReviewed(true);
          refetchReviews();
        }
      } else {
        toast.error('Something went wrong');
        setRating(0);
        setComment('');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error);
      setRating(0);
      setComment('');
      refetchReviews();
      refetchProduct();
    }
  };
  //   useEffect(() => {
  //     refetchReviews();
  // });


function calculateTimeAgo(createdAt) {
  const commentDate = new Date(createdAt);
  const currentDate = new Date();
  const timeDifference = currentDate.getTime() - commentDate.getTime();
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
  }
}
const imageBaseUrl = 'http://localhost:5000/uploads/';

// if(reviewData && reviewData.length > 0){
//   setInterval(() => {
//   const createdAt = reviewData.createdAt;
//   const timeAgo = calculateTimeAgo(createdAt);
// }, 10000);
// }
  
  return (
    <div>
      
    <Box paddingTop="100px">
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="error">
          {error}
        </Message>
      ) : (
        <animated.div style={fadeInProps}>
          <Grid container>
            <Grid item xs={12} sm={6}>
              <img
                src={imageBaseUrl+data.image}
                alt="Product"
                style={{ width: '100%', height: 'auto', maxWidth: '300px', maxHeight: '300px', objectFit: 'cover' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper style={{ height: '100%', padding: '20px' }}>
                <Grid item style={{ paddingBottom: '10px' }}>
                  {data.countInStock > 0 ? (
                    <Typography variant="body2" style={{ color: 'green' }}>
                      <b>In Stock</b>
                    </Typography>
                  ) : (
                    <Typography variant="body2" style={{ color: 'red' }}>
                      <b>Out of Stock</b>
                    </Typography>
                  )}
                  {data.verifiedProduct ? (
                    <>
                    <DoneAllIcon sx={{ fontSize: 14, color: 'green', fontWeight: 'bold' }} />
                    <span style={{ marginLeft: 5, color: 'green', fontSize: 12 }}>Verified</span>
                    </>
                  ) : (
                    <>
                    <GppMaybeIcon sx={{ fontSize: 14, color: 'red', fontWeight: 'bold' }} />
                    <span style={{ marginLeft: 5, color: 'red',fontSize: 12 }}>Not Verified</span>
                    </>
                  )}
                  <Typography>
                      <div style={{marginTop:'10px'}}>
                      <LinkContainer to={`/${data.category}`} style={{cursor: 'pointer', color:"blue"}}>
                      <b>{data.category.toUpperCase()}</b>
                      </LinkContainer>
                      </div>
                    </Typography>
                </Grid>
                <Grid container direction="column" spacing={2}>
                <Grid item>
                  <Typography variant="h6">
                      {data.name} by <span><Link to={`/artist/${data.artists}`}>{data.artists}</Link></span>
                  </Typography>
                </Grid>
                  <Grid item>
                    <Typography variant="subtitle1">
                      <h6>{data.description}</h6>
                    </Typography>
                  </Grid>
                <Box
                sx={{
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '10px',
                  backgroundColor: '#c0c0c0', // Replace with your desired background color
                }}
              >
                <Grid item container>
                  {data.style && (
                    <Grid item sx={{ marginRight: '10px' }}>
                      <Typography variant="subtitle1" sx={{ fontSize: 'small', fontWeight: 'bold', color: 'primary.main' }}>
                        Style: {data.style.toUpperCase()}
                      </Typography>
                    </Grid>
                  )}
                  {data.subject && (
                    <Grid item sx={{ marginRight: '10px' }}>
                      <Typography variant="subtitle1" sx={{ fontSize: 'small', fontWeight: 'bold', color: 'secondary.main' }}>
                        Subject: {data.subject.toUpperCase()}
                      </Typography>
                    </Grid>
                  )}
                  {data.medium && (
                    <Grid item>
                      <Typography variant="subtitle1" sx={{ fontSize: 'small', fontWeight: 'bold', color: 'text.secondary' }}>
                        Medium: {data.medium.toUpperCase()}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
                </Box>

                  {isFavorite && userInfo &&
                  <>
                  <Grid item>
                    <div>
                      <Message variant='info'>
                        <b>
                          This product is in your
                          <LinkContainer to={`/favorites/${userInfo._id}`} 
                          style={{ color: 'blue', cursor: 'pointer',}}>
                            <span> Favorites list </span>
                          </LinkContainer>
                          <FavoriteIcon style={{ color: 'red' }} />
                        </b>
                      </Message>
                    </div>
                  </Grid>
                  </>
                  }
                  <Grid item>
                    <Row>
                      <Col sm={2}>
                      <Typography variant="body1">Rating: </Typography>
                      </Col>
                    <Col>
                    <Rating value={data.rating} precision={0.5} readOnly/>
                    </Col>
                    </Row>
                  </Grid>
                  <Grid item>
                    <Typography variant="body1">Price: <b>${data.price}</b></Typography>
                  </Grid>
                  {data.countInStock > 0 && (
                    <Grid item>
                      <Row>
                        <Col>
                          <h6>Quantity:</h6>
                        </Col>
                        <Col>
                          <Form.Control
                            as="select"
                            value={quan}
                            onChange={(e) => setQuan(Number(e.target.value))}
                            style={{width: '100px'}}
                          >
                            {[...Array(data.countInStock).keys()].map((x) => (
                              <option key={x + 1} value={x + 1}>
                                {x + 1}
                              </option>
                            ))}
                          </Form.Control>
                        </Col>
                      </Row>
                    </Grid>
                  )}

                  <Grid item>
                    <Col>
                    {data.countInStock > 0 && (
                        <h6>Total: ${(quan * data.price).toFixed(2)}</h6>
                    )}
                    </Col>
                  </Grid>
                  {data.countInStock > 0 && data.isVerified && (
                    <Grid item style={{ marginLeft: '-10px' }}>
                      <Button onClick={() => addToCartHandler(data, quan)} style={{backgroundColor : '#4834d4', color:'white'}}>Add to Cart</Button>
                    </Grid>
                  )}
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </animated.div>
      )}
    </Box>
    <Box paddingTop="20px" >
    <Grid container>
      <Grid item sm={6}>
        <Paper style={{ height: '100%', padding: '20px' }}>
          <Grid item style={{ paddingBottom: '10px' }}>
            <Typography variant="h5">
              <h4 style={{textAlign :'center'}}>Customer Reviews</h4>
            </Typography>
          </Grid>
          {reviewSuccess && <Loader />}
          {reviewData && reviewData.length === 0 && (
            <Message variant="info"><b style={{textAlign: 'center'}}>No reviews</b></Message>
          )}
          {reviewData && reviewData.map((review) => (
            <Grid item key={review._id} style={{ border: '1px solid #ccc', 
            borderRadius: '8px', padding: '10px', marginBottom : '10px' }}>
              <Row>
                <Col sm={2}>
                  <Typography variant="body1">Rating: </Typography>
                </Col>
                <Col>
                  <Rating read={false} value={review.rating} readOnly/>
                </Col>
              </Row>
              <Row>
                <Col sm={2} xs={1} md={2}>
                  <Typography variant="body1">Comment: </Typography>
                </Col>
                <Col sm={2}>
                  <Typography variant="body1">{review.comment}</Typography>
                </Col>
              </Row>
              <Row>
                <Col sm={2}>
                  <Typography variant="body1">By: </Typography>
                </Col>
                <Col>
                  <Typography variant="body1">{review.user.name.toUpperCase()}</Typography>
                </Col>
              </Row>
            <Row>
            <Col sm={2}>
              <Typography variant="body1">On:</Typography>
            </Col>
            <Col>
              <Typography variant="body1">{calculateTimeAgo(review.createdAt)}</Typography>
            </Col>
          </Row>
            </Grid>
        ))}

        </Paper>
      </Grid>
  <Grid item sm={6}>
  <Paper style={{ height: '100%', padding: '20px', marginLeft:'10px' }}>
    <Grid item style={{ paddingBottom: '10px' }}>
      <Typography variant="h5" align="center">
        Write a Customer Review
      </Typography>
      <Typography variant="body1" align="center">
        Share your thoughts with other customers
      </Typography>
      <Box>
        {reviewSubmitLoading && <Loader />}
        {hasReviewed ? (
          <Message variant="success">You have reviewed the product</Message>
        ) : userInfo ? (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="rating">
              <Form.Label>Rating</Form.Label>
              <Rating
                name="simple-controlled"
                value={rating}
                precision={0.5}
                onChange={(event, newValue) => {
                  setRating(newValue);
                }}
                disabled={hasReviewed}
              />
            </Form.Group>
            <Form.Group controlId="comment">
              <Form.Label>Comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </Form.Group>
            <Button
              type="submit"
              style={{
                backgroundColor: '#4834d4',
                color: 'white',
                marginTop: '10px',
              }}
            >
              Submit
            </Button>
          </Form>
        ) : (
          <Message variant="info">
            <div>
              <p>
                Please{' '}
                <LinkContainer to="/login">
                  <Button>Login</Button>
                </LinkContainer>{' '}
                to submit a review
              </p>
            </div>
          </Message>
        )}
      </Box>
    </Grid>
        </Paper>
        </Grid>
    </Grid>
  </Box>
  </div>
  );
};

export default ProductScreen;
