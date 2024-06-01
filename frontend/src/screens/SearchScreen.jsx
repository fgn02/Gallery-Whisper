import { useGetProductBySearchQuery } from '../slices/productsApiSlice';
import { Row, Col } from 'react-bootstrap';
import Loader from '../components/Loader';
import ProductCard from '../components/ProductCard';
import Message from '../components/Message';
import { useParams } from 'react-router-dom';

const SearchScreen = () => {
  const { keyWord } = useParams();
  const { data: products, isLoading, error } = useGetProductBySearchQuery(keyWord);

  return (
    <div>
      <h2 style={{ padding: '10px', textAlign: 'center', paddingTop: '50px' }}>
        Search Results for {keyWord}
      </h2>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <>
        <Message variant='error'><h6>No products found for <b>{keyWord}</b></h6></Message>
        </>
      ) : products && products.length > 0 && (
        <Row style={{ padding: '10px', textAlign: 'center', marginTop: '50px', marginBottom: '80px' }}>
          {products.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default SearchScreen;
