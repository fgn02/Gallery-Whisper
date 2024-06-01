import { Row, Col } from 'react-bootstrap';
import Loader from '../components/Loader';
import ProductCard from '../components/ProductCard';
import Grid from '@material-ui/core/Grid';
import { useParams } from 'react-router-dom';
import { useGetProductByFilterQuery } from '../slices/productsApiSlice';
import Message from '../components/Message';
import Card from '@mui/material/Card';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {useNavigate}  from 'react-router-dom';

const FilterScreen = () => {
  const { filter: fil } = useParams();
  const navigate = useNavigate();
  const { data: products, isLoading, error } = useGetProductByFilterQuery(fil);
  const handleChange = (event) => {
    const filter = event.target.value;
    navigate(`/filter/${filter}`);
  };

  return (
    <div style={{ padding: '10px', textAlign: 'center', paddingTop: '50px' }}>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <>
        <Message variant='error' />
        </>
      ) : (
        <>
          <Col style={{ textAlign: 'center' }}>
            <h5 style={{ marginBottom: '10px' }}>
              FILTERED PRODUCTS
              {fil === 'stock' && ' (In Stock)'}
              {fil === 'pLow' && ' (Price Low to High)'}
              {fil === 'pHigh' && ' (Price High to Low)'}
              {fil === 'alphaA' && ' (Name A-Z)'}
              {fil === 'alphaZ' && ' (Name Z-A)'}
              {fil === 'ratingHigh' && ' (Rating Highest)'}
              {fil === 'ratingLow' && ' (Rating Lowest)'}
            </h5>
          </Col>
        <Grid container sx={{ maxWidth: 50 }} justifyContent="flex-start">
        <Row style={{ alignItems: 'center' }}>
          <Col>
            <FormControl style={{ minWidth: '150px' }}>
              <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Filter"
                onChange={handleChange}
                variant="outlined"
                style={{ width: '100%' }}
              >
                <MenuItem value={'stock'}>In Stock</MenuItem>
                <MenuItem value={'pLow'}>Price Low to High</MenuItem>
                <MenuItem value={'pHigh'}>Price High to Low</MenuItem>
                <MenuItem value={'alphaA'}>Name (A-Z)</MenuItem>
                <MenuItem value={'alphaZ'}>Name (Z-A)</MenuItem>
                <MenuItem value={'ratingHigh'}>Rating (Highest)</MenuItem>
                <MenuItem value={'ratingLow'}>Rating (Lowest)</MenuItem>
              </Select>
            </FormControl>
          </Col>
        </Row>
      </Grid>
         <Row style={{ padding: '10px', textAlign: 'center', marginTop: '50px', marginBottom: '80px' }}>
           {products.map((product) => (
             <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
               <ProductCard product={product} />
             </Col>
           ))}
         </Row>
         </>
      )}
    </div>
  );
};

export default FilterScreen;
