import { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import './CartButton.css';
import { useSelector, useDispatch } from 'react-redux';
import { cartAdd } from '../slices/cartSlice';
import {toast} from 'react-toastify';

const CartButton = ({ product }) => {
  const [clicked, setClicked] = useState(false);
  const dispatch = useDispatch();
  const buttonAnimation = useSpring({
    transform: clicked ? 'scale(1.2)' : 'scale(1)',
  });
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const notify = (name) => toast.success(`${name} added to cart!`, {  });
  const addToCartHandler = () => {
    const qty = cartItems.find((item) => item._id === product._id) ? item.qty : 1;
    dispatch(cartAdd({ ...product, qty }));
    setClicked(true);
    setTimeout(() => {
    setClicked(false);
    }, 1000);
    notify(product.name);
  };
  


  return (
    <animated.button
      size="small"
      color="primary"
      className={`cart-button ${clicked ? 'clicked' : ''}`}
      style={buttonAnimation}
      onClick={addToCartHandler}
    >
      {clicked ? <ShoppingCartIcon /> : 'Add to Cart'}
    </animated.button>
  );
};

export default CartButton;
