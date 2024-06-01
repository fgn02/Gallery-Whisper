import { useEffect, useState } from 'react';
import { Typography, Table, TableHead, TableBody, TableRow, TableCell, Paper } from '@material-ui/core';
import { useGetFilterOrdersQuery } from '../../slices/ordersApiSlice.js';
import Loader from '../../components/Loader.jsx';
import Message from '../../components/Message.jsx';
import { LinkContainer } from 'react-router-bootstrap';
import { Button } from 'react-bootstrap';
import { useMarkAsDeliveredMutation } from '../../slices/ordersApiSlice.js';
import AdminPanelScreen from './AdminPanelScreen.jsx';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Row, Col } from 'react-bootstrap';
import {useNavigate}  from 'react-router-dom';
import { useParams } from 'react-router-dom';

const FilterOrderScreen = () => {
    const { filter: fil } = useParams();
  const { data: orders, refetch, isLoading, error } = useGetFilterOrdersQuery({ filter: fil });

  useEffect(() => {
    refetch();
  }, [fil]);

  const [deliverOrder, { isLoading: loadingDeliver }] = useMarkAsDeliveredMutation();

  const deliverHandler = async (orderId) => {
    await deliverOrder({orderId});
    refetch();
  };

  const navigate = useNavigate();
   const handleChange = (event) => {
    if(event.target.value === 'default'){
    navigate(`/admin/orders`)
    }
    else{
        navigate(`/admin/orders/filter/${event.target.value}`)
    }
  };
  return (
    <Grid container spacing={2}>
       <Grid item xs={2}>
        <AdminPanelScreen />
      </Grid>
      <Grid item xs={10}>
         <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
                <Typography variant="h4" style={{ margin : '10px'}}>Filtered Orders</Typography>
            </Grid>
        <Grid item>   
        <Row style={{ alignItems: 'center' }}>
          <Col>
            <FormControl style={{ minWidth: '150px' ,margin : '10px'}}>
              <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Filter"
                onChange={handleChange}
                variant="outlined"
                style={{ width: '100%'}}
              >
                <MenuItem value={'default'}>Default</MenuItem>
                <MenuItem value={'paid'}>Paid</MenuItem>
                <MenuItem value={'notPaid'}>Not Paid</MenuItem>
                <MenuItem value={'delivered'}>Delivered</MenuItem>
                <MenuItem value={'notDelivered'}>Not Delivered</MenuItem>
                <MenuItem value={'cancelled'}>Cancelled</MenuItem>
                <MenuItem value = {'notCancelled'}>Not Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Col>
        </Row>
            </Grid>
        </Grid>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant={'error'}>{'Error while finding'}</Message>
      ) : orders && orders.length === 0 ? (
        <Message>No orders found.</Message>
      ) : (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Total Price</TableCell>
                <TableCell>Payment Status</TableCell>
                <TableCell>Delivery Status</TableCell>
                <TableCell>Update Delivery Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders && orders.map((order) => (
                <TableRow key={order._id}>
                  <LinkContainer to={`/order/${order._id}`} style={{ cursor: 'pointer', color: 'blue' }}>
                    <TableCell><b>{order._id}</b></TableCell>
                  </LinkContainer>
                  <TableCell>{order.user.name}</TableCell>
                  <TableCell>${order.totalPrice}</TableCell>
                  {order.isPaid ? (
                    <TableCell>
                      <b style={{ color: 'green' }}>
                        Paid at :{' '}
                      </b>
                      {new Date(order.paidAt).toLocaleString()}
                    </TableCell>
                  ) : (
                      <TableCell style={{ color: 'red' }}><b>Not Paid</b></TableCell>
                    )}

                  {order.isPaid && !order.isDelivered ? (
                    <TableCell>
                      <b style={{ color: 'red' }}>
                        Not Delivered
                      </b>
                    </TableCell>
                  ) : !order.isPaid ? (
                    <TableCell style={{ color: 'red' }}><b>Not Delivered</b></TableCell>
                  ):
                  (
                      order.isPaid && order.isDelivered && (
                        <TableCell style={{ color: 'green' }}><b>Delivered</b></TableCell>
                      )
                    )}

                  {order.isPaid && !order.isDelivered ? (
                    <TableCell>
                      <Button
                        type='button'
                        className='btn btn-block'
                        variant='info'
                        onClick={() => deliverHandler(order._id)}
                      >
                        Mark as Delivered
                      </Button>
                    </TableCell>
                  )
                    : order.isPaid && order.isDelivered ?(
                      <TableCell>
                        <Button
                          type='button'
                          className='btn btn-block'
                          variant='success'
                          disabled>
                          Delivered
                          </Button>
                          </TableCell>
                          )
                        : (
                          <TableCell>
                            <Button
                              type='button'
                              className='btn btn-block'
                              variant='danger'
                              disabled>
                                Not Paid
                                </Button>
                                </TableCell>)}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
      </Grid>
    </Grid>
  );
};
export default FilterOrderScreen;