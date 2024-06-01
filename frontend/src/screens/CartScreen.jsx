import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Image, ListGroup, Form, Button, Card } from 'react-bootstrap';
import { cartAdd, removeFromCart, clearCart } from '../slices/cartSlice';
import Message from '../components/Message';
import { FaTrash } from 'react-icons/fa';
import './CartScreen.css';
import { useEffect, useState } from 'react';
import { updateCart } from '../components/cartUtil';



const CartScreen = () => {
  const [qty, setQty] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const { userInfo } = useSelector(state => state.auth);

 
  const addToCartHandler = async (product, qty) => {
    dispatch(cartAdd({ ...product, qty }));
  };


  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  }

  const clearCartHandler = () => {
    dispatch(clearCart());
  };

  const checkoutHandler = () => {
    navigate('/shipping');
  };

  const imageBaseUrl = 'http://localhost:5000/uploads/';

  


  return (
    <Row style={{ marginTop: '100px' }} className="cart-screen-row">
      <h1 style={{ marginBottom: '20px' }}>Shopping Cart</h1>
    <Col md={8}>
      {cartItems.length === 0 ? (
        <Message>
          Your cart is empty <Link to='/'>Go Back</Link>
        </Message>
      ) : (
        <ListGroup variant='flush'>
            <Row>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '10px',
                  border: '1px solid #0001',
                  borderRadius: '10px',
                  padding: '10px',
                }}
              >
                <h6 style={{ marginRight: 'auto' }}>Clear Cart</h6>
                <Button
                  type='button'
                  variant='light'
                  onClick={() => clearCartHandler()}
                >
                  <FaTrash style={{color: 'red'}}/>
                </Button>
              </div>
            </Row>
          {cartItems.map((item) => (
            <ListGroup.Item key={item._id} style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '10px',
              border: '1px solid #0001',
              borderRadius: '10px',
              padding: '10px',
            }}>
              <Row>
                <Col md={2}>
                  <Image src={imageBaseUrl+item.image} alt={item.name} fluid rounded />
                </Col>
                <Col md={2}>
                  <h6 style={{textDecoration: 'none'}}><Link to={`/product/${item._id}`}>{item.name}</Link></h6>
                </Col>
                <Col md={2}>${item.price}</Col>
                <Col md={2}>
                  <Form.Control
                    as='select'
                    value={item.qty}
                    onChange={(e) => {
                      const selectedQty = Number(e.target.value);
                      addToCartHandler(item, selectedQty);
                      setQty(selectedQty);
                    }}
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </Form.Control>
                </Col>
                <Col md={2}>
                  <h6>${(item.qty * item.price).toFixed(2)}</h6>
                </Col>
                <Col md={2}>
                  <Button
                    type='button'
                    variant='light'
                    onClick={() => removeFromCartHandler(item._id)}
                  >
                    <FaTrash style={{color: 'red'}} />
                  </Button>
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Col>
    <Col md={4}>
      <Card>
        <ListGroup variant='flush'>
          <ListGroup.Item>
            <h2>
              Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
              items
            </h2>
          </ListGroup.Item>

          <ListGroup.Item>
          {cartItems.map((item) => (
            <ListGroup.Item key={item._id}>
              <Row>
                <Col md={6}>
                  <h6>{item.name}</h6>
                </Col>
                <Col md={6}>
                  <h6>${item.price} x {item.qty}</h6>
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
          </ListGroup.Item>
          <ListGroup.Item>
            <Row>
              <Col md={6}>
                <h5>Subtotal</h5>
              </Col>
              <Col md={6}>
                <h5>${cartItems
                    .reduce((acc, item) => acc + item.qty * item.price, 0)
                    .toFixed(2)}
                </h5>
              </Col>
            </Row>
          </ListGroup.Item>
          <ListGroup.Item>
            <Button
              type='button'
              className='btn-block'
              disabled={cartItems.length === 0}
              onClick={checkoutHandler}
            >
              Proceed To Checkout
            </Button>
          </ListGroup.Item>
        </ListGroup>
      </Card>
    </Col>
  </Row>
);
};

export default CartScreen;
