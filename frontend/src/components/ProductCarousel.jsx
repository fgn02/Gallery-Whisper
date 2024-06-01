import Carousel from 'react-bootstrap/Carousel';
import { useGetProductByFilterQuery } from '../slices/productsApiSlice';
import Message from './Message';
import Loader from './Loader';
import Rating from '@mui/material/Rating';
import { LinkContainer } from 'react-router-bootstrap';
import { useEffect } from 'react';

function ProductCarousel() {
  const { data: products, isLoading, error, refetch } = useGetProductByFilterQuery('ratingHigh');
  useEffect(() => {
    refetch();
  }, [products]);
  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <Message variant='error'>{error?.data?.message || error.error}</Message>;
  }
  const imageBaseUrl = 'http://localhost:5000/uploads/';

  return (
    <Carousel fade interval={5000}>
      {products?.slice(0, 3).map((product) => (
        <Carousel.Item key={product._id} style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
        }}>
          <LinkContainer to={`/product/${product._id}`}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '60vh',
              }}
            >
              <div
                style={{
                  backgroundColor: '#f8f8f8',
                  borderRadius: '8px',
                  padding: '20px',
                  maxWidth: '100%',
                  textAlign: 'center',
                }}
              >
                <div>
                  <b><p style={{ color: '#777', fontSize: '20px' }}>Top Rated Products</p></b>
                </div>
                <img
                  className="d-block w-100"
                  src={imageBaseUrl+product.image}
                  alt="Product"
                  style={{ maxHeight: 'calc(60vh - 120px)', objectFit: 'contain' }}
                />
                <div style={{ marginTop: '10px' }}>
                  <h5 style={{ color: '#333', fontSize: '24px', fontWeight: 'bold' }}>{product.name}</h5>
                  <Rating value={product.rating} readOnly/>
                  <b><p style={{ color: '#777', fontSize: '16px' }}>${product.price}</p></b>
                </div>
              </div>
            </div>
          </LinkContainer>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default ProductCarousel;
