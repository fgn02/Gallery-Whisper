import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {Grid} from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';


const MembershipCards = () => {
  return (
    <div>
      <h5 style={{textAlign: 'center'}}>Join Our Membership Programs</h5>
    <Grid container spacing={2}  style={{paddingTop: '30px'}}>
    <Grid item md={4}>
      <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        sx={{ height: 100, width: 100 }}
        image="https://cdn-icons-png.flaticon.com/512/5494/5494520.png"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Bronze Membership
        </Typography>
          <Typography variant="body1" color="text">
            <h6 style={{ border: '1px solid #A0522D', backgroundColor: '#A0522D', color: 'white', padding: '5px', borderRadius: '5px',marginBottom: '10px' }}>
              For $10/month
          </h6>
            <ul style={{listStyleType: 'none', marginLeft:'-30px'}}>
              <li><DoneIcon style={{color: 'green'}}/>Free Shipping</li>
              <li><DoneIcon style={{color: 'green'}}/>10x Boost on Purchase Points</li>
              <li><DoneIcon style={{color: 'green'}}/>10% Discount for all products</li>
            </ul>
          </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Join</Button>
      </CardActions>
    </Card>
    </Grid>

    <Grid item md={4}>
      <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        sx={{ height: 100, width: 100 }}
        image="https://cdn-icons-png.flaticon.com/512/5494/5494509.png"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Silver Membership
        </Typography>
          <Typography variant="body1" color="text">
            <h6 style={{ border: '1px solid #808080', backgroundColor: '#808080', color: 'white', padding: '5px', borderRadius: '5px',marginBottom: '10px' }}>
              For $30/month
          </h6>
            <ul style={{listStyleType: 'none', marginLeft:'-30px'}}>
              <li><DoneIcon style={{color: 'green'}}/>Free Shipping</li>
              <li><DoneIcon style={{color: 'green'}}/>30x Boost on Purchase Points</li>
              <li><DoneIcon style={{color: 'green'}}/>20% Discount for all products</li>
            </ul>
          </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Join</Button>
      </CardActions>
    </Card>
    </Grid>
    <Grid item md={4}>
      <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        sx={{ height: 100, width: 100 }}
        image="https://cdn-icons-png.flaticon.com/512/5406/5406792.png"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Gold Membership
        </Typography>
        <Typography variant="body1" color="text">
          <h6 style={{ border: '1px solid #DAA520', backgroundColor: '#DAA520', color: 'white', padding: '5px', borderRadius: '5px',marginBottom: '10px' }}>
              For $50/month
          </h6>
            <ul style={{listStyleType: 'none', marginLeft:'-30px'}}>
              <li><DoneIcon how to remove li dot/>Free Shipping</li>
              <li><DoneIcon style={{color: 'green'}}/>50x Boost on Purchase Points</li>
              <li><DoneIcon style={{color: 'green'}}/>40% Discount for all products</li>
            </ul>
          </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Join</Button>
      </CardActions>
    </Card>
    </Grid>

    </Grid>
    </div>
  )
}

export default MembershipCards
