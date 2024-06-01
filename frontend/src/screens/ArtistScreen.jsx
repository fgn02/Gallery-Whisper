import { useParams } from 'react-router-dom'
import {useGetArtistByNameQuery} from '../slices/artistApiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Grid } from '@material-ui/core';
import { Row } from 'react-bootstrap';
import PersonIcon from '@mui/icons-material/Person';
import ProductCard from '../components/ProductCard';

const ArtistScreen = () => {
  const [flagUrl, setFlagUrl] = useState(null);

  const { name: artist } = useParams();
  const { data: artistInfo, isLoading, refetch, error } = useGetArtistByNameQuery(artist);

  useEffect(() => {
    const fetchFlag = async () => {
      if (artistInfo && artistInfo.artist && artistInfo.artist.nationality) {
        const countryName = artistInfo.artist.nationality;
        try {
          const response = 
          await axios.get(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}`);
          const countryData = response.data[0];
          const flagUrl = countryData.flags.png;
          setFlagUrl(flagUrl);
        } catch (error) {
          toast.error('Error fetching flag:', error);
        }
      }
    };
    fetchFlag();
  }, [artistInfo]);

  return (
    <div style={{paddingTop :'40px'}}>
      {isLoading ? (<Loader />)
        : error ? (<div style={{paddingTop :'40px'}}>
          <Message variant='error'>{error}</Message>
          </div>)
        : artistInfo.artist == null ? (
          <div style={{paddingTop :'40px'}}>
          <Message variant='info'><h5>{artist} not found</h5></Message>
          </div>
        )
            : (
                <div style={{paddingTop :'40px'}}>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                       {flagUrl && 
                        <img src={flagUrl} alt="Flag" 
                        style={{ width: '40px', height: '22px'}} />}
                        <h5 style={{ marginLeft: '10px' }}>  {artistInfo.artist.name}</h5>
                      </div>
                      <h5>Contact: {artistInfo.artist.email}</h5>
                      {artistInfo.artist.info.length > 0 && 
                      <p><b>Info:</b> <span>{artistInfo.artist.info}</span></p>}
                       {artistInfo.artist.exhibitions.length > 0 && 
                       <p><b>Exhibitions:</b> <span>{artistInfo.artist.exhibitions}</span></p>}
                    </Grid>
                    <Grid item xs={8}>
                   {artistInfo.artistProducts.length === 0 ? (
                    <Message variant='info'>No artworks found</Message>
                  ) : (
                    <>
                      <h3 style={{ textAlign: 'center', fontFamily: "Crimson Text" }}>
                        Artworks by {artistInfo.artist.name}
                      </h3>
                      {artistInfo.artistProducts && artistInfo.artistProducts.map((newProduct) => (
                        <Grid key={newProduct.product._id} md={4}>
                          <ProductCard product={newProduct.product} />
                        </Grid>
                      ))}
                    </>
                  )}
                    </Grid>
                  </Grid>
                </div>
            )} 
    </div>
  )
}

export default ArtistScreen
