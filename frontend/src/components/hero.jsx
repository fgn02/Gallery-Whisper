import { Container, Card, Button } from 'react-bootstrap';
import ProductCarousel from './ProductCarousel';

const Hero = () => {
  return (
    <div className=' py-5'>
      <Container className='d-flex justify-content-center'>
          <ProductCarousel />
      </Container>
    </div>
  );
};

export default Hero;