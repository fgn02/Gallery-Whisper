import { Row, Col } from 'react-bootstrap';
import Loader from '../components/Loader';
import ProductCard from '../components/ProductCard';
import Grid from '@material-ui/core/Grid';
import { useParams } from 'react-router-dom';
import { useGetFavoriteQuery } from '../slices/userApiSlice';
import { useEffect, useState } from 'react';
import Message from '../components/Message';
import { LinkContainer } from 'react-router-bootstrap';
import { Button } from 'react-bootstrap';

const FavoritesScreen = () => {
  const [isFavorite, setIsFavorite] = useState();
  const { id: userId } = useParams();
  const { data: favProducts, refetch: refetchFavProducts, isLoading: favIsLoading, error } = useGetFavoriteQuery();

  useEffect(() => {
    refetchFavProducts();
  }, []);

  useEffect(() => {
    if (favProducts && favProducts.data) {
      const index = favProducts.data.findIndex((item) => item._id === userId);
      setIsFavorite(index !== -1);
    }
  }, [favProducts]);

  return (
    <div style={{ padding: '10px', textAlign: 'center', paddingTop: '50px' }}>
      {favIsLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : favProducts && favProducts.length === 0 ? (
        <Message variant='info'>
          <div style={{ overflowX: 'hidden' }}>
            <Row className='d-flex justify-content-end'>
              <Col>
                <p>No favorites</p>
              </Col>
              <Col>
                <LinkContainer to='/'>
                  <Button variant='secondary' size='sm'>
                    Go Back
                  </Button>
                </LinkContainer>
              </Col>
            </Row>
          </div>
        </Message>
      ) : (
        <Row>
          {favProducts &&
            favProducts.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <ProductCard product={product} favFlag={isFavorite} />
              </Col>
            ))}
        </Row>
      )}
    </div>
  );
};

export default FavoritesScreen;
