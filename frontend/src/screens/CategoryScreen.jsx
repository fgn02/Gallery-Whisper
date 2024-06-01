import { useGetCategoryProductsQuery } from '../slices/productsApiSlice';
import { Row, Col } from 'react-bootstrap';
import Loader from '../components/Loader';
import ProductCard from '../components/ProductCard';
import Message from '../components/Message';
import { useParams } from 'react-router-dom';


const CategoryScreen = () => {
  const { category: cat } = useParams();
  const { data: products, isLoading, error } = useGetCategoryProductsQuery(cat);

  return (
    <div>
  <h2 style={{ padding: '10px', textAlign: 'center', paddingTop: '50px' }}>
    {cat.toUpperCase()}
  </h2>
  {isLoading ? (
    <Loader />
  ) : error ? (
    <h3>{error}</h3>
  ) : products ? (  // Add a check for products before mapping
    <Row style={{ padding: '10px', textAlign: 'center', marginTop: '50px', marginBottom: '80px' }}>
      {products.map((product) => ((
          <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
            <ProductCard product={product} />
          </Col>
        )
      ))}
    </Row>
  ) : (
    <Message variant='info'>No products found.</Message>  // Optional message when no products are available
  )}
</div>

  );
};

export default CategoryScreen;
