import AdminPanelScreen from './AdminPanelScreen.jsx';
import Grid from '@mui/material/Grid';
import MonthlySales from '../../components/MonthlySales.jsx';
import TopProductBySale from '../../components/TopProductBySale.jsx';
import TopCategoryBySale from '../../components/TopCategoryBySale.jsx';

const SalesScreen = () => {

  return (
    <Grid container spacing={2}>
       <Grid item xs={2}>
        <AdminPanelScreen />
      </Grid>
      <Grid item xs={10}>
        <div>
          <h3 style={{textAlign:'center', marginTop:'10px'}}>Monthly Sales Chart</h3>
          <MonthlySales />
        </div>
        <div>
          <h3 style={{textAlign:'center', marginTop:'10px'}}>Products Driving Most Sales</h3>
          <TopProductBySale />
        </div>
        <div>
          <h3 style={{textAlign:'center', marginTop:'10px'}}>Categories Driving Most Sales</h3>
          <TopCategoryBySale />
        </div>
      </Grid>
      </Grid>
        
  )
}

export default SalesScreen
