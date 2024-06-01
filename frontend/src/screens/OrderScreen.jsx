import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useNavigate } from 'react-router-dom';
import {
  useGetOrderByIdQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
  useMarkAsDeliveredMutation,
  useCancelOrderMutation,
  useCreateOrderMutation,
} from '../slices/ordersApiSlice';


const OrderScreen = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderByIdQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

  const [deliverOrder, { isLoading: loadingDeliver }] =
  useMarkAsDeliveredMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();

  const deliverHandler = async () => {
    await deliverOrder({ orderId });
    refetch();
  };

  const imageBaseUrl = 'http://localhost:5000/uploads/';

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success('Order is paid');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    });
  }

  useEffect(() => {
    refetch();
  },);
  
  function onError(err) {
    toast.error(err.message);
  }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }
  const [reOrder, { ReorderIsLoading, ReorderError }] = useCreateOrderMutation();
  const [cancelOrder, { cancelOrderIsLoading, cancelOrderError }] = useCancelOrderMutation();
  const navigate = useNavigate();
  const reOrderHandler = async (order) => {
    try {
      const res = await reOrder({
        orderItems: order.orderItems,
        shippingAddress: order.shippingAddress,
        paymentMethod: order.paymentMethod,
        itemsPrice: order.itemsPrice,
        shippingPrice: order.shippingPrice,
        taxPrice: order.taxPrice,
        totalPrice: order.totalPrice,
      }).unwrap();
      toast.success('Reorder Successful!!');
      navigate(`/order/${res._id}`);
      refetch();
    } catch (err) {
      toast.error(err.message);
      console.log(err);
    }
  };

  const cancelOrderHandler = async (orderId) => {
    try {
      const res = await cancelOrder({orderId :orderId})
      console.log(res);
      if(res.error){
          toast.error(res.error.data.message);
      }else{
        toast.success('Order Cancelled Successfully!!');
        refetch();
      }
    } catch (err) {
      toast.error(err);
    }
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant='error'>{error}</Message>
  ) : (
    <>
      <h3 style = {{paddingTop: '70px'}}>Order ID {order._id}</h3>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>{' '}
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Address:</strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant='success'>
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant='error'>Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant='success'>Paid on {order.paidAt}</Message>
              ) : (
                <Message variant='error'>Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Ordered Items</h2>
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={imageBaseUrl+item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                           ${item.price} x {item.qty} = <b>${item.qty * item.price}</b>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total Items</Col>
                  <Col>{order.orderItems.reduce((acc, item) => acc + item.qty, 0)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {!order.isCancelled && !order.isPaid && userInfo._id === order.user._id &&(
                <ListGroup.Item>
                  {loadingPayPal || isLoading && <Loader />}

                  {isLoading ? (
                    <Loader />
                  ) : (
                    <div>
                      <div>
                        <PayPalScriptProvider options={{ 'client-id': paypal.clientId, currency: 'USD' }}>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                        </PayPalScriptProvider>
                      </div>
                    </div>
                  )}
                </ListGroup.Item>
              )}
              {userInfo && order &&
                order.isPaid  &&(
                  <ListGroup.Item>
                  <Button variant="success" onClick={() => reOrderHandler(order)} style={{marginTop:'10px'}}>
                        Reorder
                  </Button>
                  </ListGroup.Item>
                )}
              {userInfo &&
                !order.isPaid &&
                !order.isCancelled &&(
                  <ListGroup.Item>
                  <Button variant="danger" onClick={() => cancelOrderHandler(order)} style={{marginTop:'10px'}}>
                        Cancel Order
                  </Button>
                  </ListGroup.Item>
                )
                }

              {order.isCancelled && (
                <ListGroup.Item>
                  <Message variant='error'>Order Cancelled</Message>
                  </ListGroup.Item>)}
              {userInfo &&
                order.isPaid &&
                userInfo.admin &&
                !order.isDelivered &&
                userInfo._id !==  order.user._id &&
                (
                  <ListGroup.Item>
                    <Button
                      type='button'
                      className='btn btn-block'
                      variant='info'
                      onClick={deliverHandler}
                    >
                      Mark As Delivered
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;