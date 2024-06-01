import { useEffect } from 'react';
import { Typography, Table, TableHead, TableBody, TableRow, TableCell, Paper, Button } from '@material-ui/core';
import { useGetAllReviewsQuery, useDeleteReviewMutation } from '../../slices/reviewApiSlice.js';
import Loader from '../../components/Loader.jsx';
import Message from '../../components/Message.jsx';
import { useNavigate } from 'react-router-dom';
import AdminPanelScreen from './AdminPanelScreen.jsx';
import Grid from '@mui/material/Grid';
import { toast } from 'react-toastify';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';

const AllReviewScreen = () => {
  const { data: reviews, refetch, isLoading, error } = useGetAllReviewsQuery();
  console.log(reviews);

  useEffect(() => {
    refetch();
  }, []);

  const [deleteReview, { isLoading: loadingDelete }] = useDeleteReviewMutation();

const handleDeleteReview = async (reviewId) => {
  try {
    const response = await deleteReview(reviewId);
    if (response) {
      toast.success('Review deleted');
      refetch();
    } else {
      toast.error('Failed to delete review');
    }
  } catch (error) {
    console.error('Failed to delete review', error);
    toast.error('Failed to delete review');
  }
};


  return (
     <Grid container spacing={2}>
        <Grid item xs={2}>
        <AdminPanelScreen />
      </Grid>
      <Grid item xs={10}>
      <Typography variant="h3" style={{ margin : '10px'}}>All Reviews</Typography>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message severity="error">{error}</Message>
      ) : reviews.length === 0 ? (<Message severity="info">No reviews found</Message>) : (
        <Paper elevation={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>USER</TableCell>
                <TableCell>PRODUCT</TableCell>
                <TableCell>RATING</TableCell>
                <TableCell>COMMENT</TableCell>
                <TableCell>PRODUCT CURRENT RATING</TableCell>
                <TableCell>DELETE</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reviews.map((review) => (
                <TableRow key={review._id}>
                  <TableCell>{review._id}</TableCell>
                  {/* <TableCell>{review.user.name}</TableCell> */}
                  {review.user ? (
                  <TableCell>
                      <span>{review.user.name || 'Deleted User'}</span>
                  </TableCell>
                ) : (
                  <TableCell>
                    <span>Deleted User</span>
                  </TableCell>
                )}
                <TableCell>
                <Link to={`/product/${review.product._id}`}>
                    <span>{review.product.name}</span>
                </Link>
                </TableCell>
                  <TableCell>{review.rating}</TableCell>
                  <TableCell>{review.comment}</TableCell>
                  <TableCell>{review.product.rating}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleDeleteReview(review._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
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

export default AllReviewScreen;
