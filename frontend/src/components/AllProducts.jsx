import { useEffect, useState } from 'react';
import { useGetAllProductQuery } from '../slices/productsApiSlice';
import { Row, Col } from 'react-bootstrap';
import Loader from './Loader';
import ProductCard from './ProductCard';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import {useNavigate}  from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const AllProducts = () => {
  const { data, isLoading, refetch, error } = useGetAllProductQuery();
  useEffect(() => {
    refetch();
  }, []);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const filter = event.target.value;
    navigate(`/filter/${filter}`);
  };


  return (
    <div>
      <Col style={{ textAlign: 'center' }}>
          <h5 style={{ marginBottom: '10px' }}>LATEST PRODUCTS</h5>
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
  {isLoading ? (
    <Loader />
  ) : error ? (
    <h3>{<Loader />}</h3>
  ) : (
    <>
      <Grid
        container
        spacing={3}
        justifyContent="flex-start"
        style={{ padding: '10px', textAlign: 'center', marginBottom: '80px' }}
      >
        {Array.isArray(data) &&
          data.map((product) => (
            <Grid key={product._id} item xs={12} sm={6} md={4} lg={3}>
              <ProductCard product={product} />
            </Grid>
          ))}
      </Grid>
    </>
  )}
</div>

  );
};

export default AllProducts;
