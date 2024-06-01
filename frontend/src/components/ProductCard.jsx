import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, CardActions, IconButton, Tooltip } from '@mui/material';
import { useSpring, animated } from 'react-spring';
import CartButton from './CartButton';
import { LinkContainer } from 'react-router-bootstrap';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useAddFavoriteMutation, useGetFavoriteQuery } from '../slices/userApiSlice';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import { Grid } from '@mui/material';
import Rating from '@mui/material/Rating';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import GppMaybeIcon from '@mui/icons-material/GppMaybe';


const AnimatedCard = animated(Card);

const ProductCard = ({ product }) => {
  const imageBaseUrl = 'http://localhost:5000/uploads/';
  const { userInfo } = useSelector(state => state.auth);
  const animationProps = useSpring({
    opacity: 1,
    transform: 'translateY(0)',
    from: { opacity: 0, transform: 'translateY(50px)' },
    config: { tension: 300, friction: 10 },
  });

  const hoverProps = useSpring({
    transform: 'scale(1)',
    boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.10)',
    from: { transform: 'scale(0.9)', boxShadow: 'ash' },
  });

  const [isFavorite, setIsFavorite] = useState(false);
    const [addToFav, { isLoading }] = useAddFavoriteMutation();
    const { data: favProducts, FavIsLoading, refetch, error } = useGetFavoriteQuery();

const handleFavoriteClick = async () => {
    if (!userInfo) {
      toast.error('Please login to add to favorites');
      return;
    }
    try {
      const res = await addToFav({ productId: product._id });
      if (res.data.data.index !== -1) {
        toast(`${product.name} Removed from Favorites`);
        refetch();
      } else {
        toast(`${product.name} Added to Favorites`);
        refetch();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'Error adding to favorites');
    }
  };

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const inCart = cartItems.find((item) => item._id === product._id);

  useEffect(() => {
    refetch();
  }, []);


  useEffect(() => {
    if(!userInfo) return setIsFavorite(false);
    if (favProducts) {
      const index = favProducts.findIndex((item) => item._id === product._id);
      if (index !== -1) {
        setIsFavorite(true);
      } else {
        setIsFavorite(false);
      }
    }
  }, [favProducts, userInfo]);


  const [verifiedProduct,setVerifiedProduct] = useState(false);
  useEffect(() => {
    if(product.isVerified){
      setVerifiedProduct(true);
    }
  }, [product]);
  

  return (
    <div style={{ padding: '10px' }}>
      <AnimatedCard style={{ ...animationProps, ...hoverProps, borderRadius: '10px' }}>
        <Card>
          <LinkContainer to={`/product/${product._id}`}>
            <CardActionArea>
              <div>
              <CardMedia
                component="img"
                image={imageBaseUrl+product.image}
                alt={product.name}
                style={{width:'100%',height: '15vw',
                objectFit: 'cover'}}
                position="top"
              />
              </div>
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                    {product.name}
                </Typography>
                      <Typography gutterBottom variant="h8" component="div" 
                      // style={{ display: 'flex', alignItems: 'center' }}
                      >
                  {verifiedProduct ? (
                    <>
                    <DoneAllIcon sx={{ fontSize: 14, color: 'green', fontWeight: 'bold' }} />
                    <span style={{ marginLeft: 5, color: 'green' }}>Verified</span>
                    </>
                  ) : (
                    <>
                    <GppMaybeIcon sx={{ fontSize: 14, color: 'red', fontWeight: 'bold' }} />
                    <span style={{ marginLeft: 5, color: 'red' }}>Not Verified</span>
                    </>
                  )}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.countInStock > 0 ? (
                    <span style={{ color: 'green', fontWeight: 'bold' }}>In Stock</span>
                  ) : (
                    <span style={{ color: 'red', fontWeight: 'normal' }}>Out of Stock</span>
                  )}
                </Typography>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <Typography variant="body2" color="text.secondary">
                    <Rating name="half-rating" defaultValue={product.rating} precision={0.5} readOnly />
                  </Typography>
                </div>
                
                <Typography variant="body2" color="text.secondary">
                  <b>${product.price}</b>
                </Typography>
              </CardContent>
            </CardActionArea>
          </LinkContainer>
          <CardActions style={{ justifyContent: 'space-between' }}>
            {product.countInStock > 0 && verifiedProduct && !inCart? (
              <LinkContainer to="/cart">
                <CartButton product={product} size="small" color="primary">
                  Add to Cart
                </CartButton>
              </LinkContainer>
            ) : (
              <Button
                variant="danger"
                className="btn-sm"
                style={{
                  height: '50px',
                  width: '90px',
                  borderRadius: '10px',
                  marginLeft: '5px'
                }}
                disabled
              >
                Add to Cart
              </Button>
            )}

            {!isLoading && !FavIsLoading && (
              <Tooltip title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}>
                <IconButton onClick={handleFavoriteClick}>
                  <FavoriteIcon style={{ color: isFavorite ? 'red' : 'inherit' }} />
                </IconButton>
              </Tooltip>
            )}
          </CardActions>
        </Card>
      </AnimatedCard>
    </div>
  );
};

export default ProductCard;
