import {useEffect} from 'react';
import './Footer.css'
import { LinkContainer } from 'react-router-bootstrap';
import { Button } from '@mui/material';
import { useGetCategoryQuery } from '../slices/productsApiSlice';
import { FaCcAmex, FaCreditCard, FaPaypal, FaCcVisa } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import GroupWorkIcon from '@mui/icons-material/GroupWork';


const Footer = () => {
  const { userInfo } = useSelector(state => state.auth);

  const { data: categories, isLoading, isError, error } = useGetCategoryQuery();
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-sm-3">
            <h4 className="title">About us</h4>
            <p>
              Gallery Whisper: Unleash the beauty of fine art. Discover captivating artworks and sculptures from talented artists. 
              Shop securely, explore artist profiles, and immerse yourself in the world of artistic expression. 
              Join our vibrant community of art lovers. Experience the power of art at Gallery Whisper.
            </p>
          </div>
          <div className="col-sm-3">
            <h4 className="title">Category</h4>
            <div className="category">
              {Array.isArray(categories) &&
                    categories.map((category) => (
                      <LinkContainer key={category} to={`/${category}`}>
                        <Button
                        style={{ color: 'white' }}
                          key={category}
                          sx={{ my: 2, color: 'white' }}
                          // className="categoryB"
                        >
                          {category.toUpperCase()}
                        </Button>
                      </LinkContainer>
                    ))}
            </div>
          </div>
          <div className="col-sm-3">
            <h4 className="title">Payment</h4>
            <ul className="payment">
              <li><span ><FaPaypal /></span></li>
              <li><span ><FaCcAmex /></span></li>
              <li><span ><FaCreditCard /></span></li>
              <li><span ><FaCcVisa /></span></li>
            </ul>
          </div>
          <div className="col-sm-3">
            {userInfo && userInfo.artists ? (
              <>
              <h3>Artist</h3>
              <LinkContainer to="/artist/panel" style={{ color: 'white' }}>
                <Button variant="contained" color="info">
                  <GroupWorkIcon/> Artist Dashboard
                </Button>
              </LinkContainer>
              </>
            ) : (
              userInfo && !userInfo.artists || !userInfo ? (
                <>
                <h3>Join As Artist</h3>
                <LinkContainer to="/artist/join" style={{ color: 'white' }}>
                  <Button variant="contained" color="info">
                    <GroupWorkIcon/> Join
                  </Button>
                </LinkContainer>
                </>
              ) : null
            )}

          </div>
        </div>
        <hr />
      <div className="row text-center">
        <span style={{ color: '#fff' }}>
          Copyright © Gallery Whisper
          {' '}
          {new Date().getFullYear()}
        </span>
      </div>
      </div>
    </footer>
  );
};

export default Footer;
