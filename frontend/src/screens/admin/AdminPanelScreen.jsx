import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { LinkContainer } from 'react-router-bootstrap';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import ListAltIcon from '@mui/icons-material/ListAlt';
import InventoryIcon from '@mui/icons-material/Inventory';
import ReviewsIcon from '@mui/icons-material/Reviews';
import HomeIcon from '@mui/icons-material/Home';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

const drawerWidth = 240;

export default function ClippedDrawer() {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Box sx={{ overflow: 'auto' }} style={{marginTop:'40px'}}>
          <List>
              <ListItem disablePadding>
                <ListItem>
                  <ListItemIcon>
                    <AdminPanelSettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary={'Admin Panel'} />
                </ListItem>
              </ListItem>
          </List>
          <Divider />
          <List>
          <LinkContainer to='/'>
              <ListItem disablePadding>
              <ListItemButton>
                  <ListItemIcon>
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText primary={'Home'} />
                </ListItemButton>
              </ListItem>
          </LinkContainer>
          </List>
          <Divider />
          <List>
            <LinkContainer to='/admin/userslist'>
                <ListItem disablePadding>
                    <ListItemButton>
                    <ListItemIcon>
                        <SupervisedUserCircleIcon />
                    </ListItemIcon>
                        <ListItemText primary={'Manage Customers'} />
                    </ListItemButton>
                </ListItem>
            </LinkContainer>
            <LinkContainer to='/admin/orders'>
                <ListItem disablePadding>
                    <ListItemButton>
                    <ListItemIcon>
                        <ListAltIcon />
                    </ListItemIcon>
                        <ListItemText primary={'Manage Orders'} />
                    </ListItemButton>
                </ListItem>
            </LinkContainer>
            <LinkContainer to='/admin/productslist'>
                <ListItem disablePadding>
                    <ListItemButton>
                    <ListItemIcon>
                        <InventoryIcon />
                    </ListItemIcon>
                        <ListItemText primary={'Manage Products'} />
                    </ListItemButton>
                </ListItem>
            </LinkContainer>
            <LinkContainer to='/admin/artistlist'>
                <ListItem disablePadding>
                    <ListItemButton>
                    <ListItemIcon>
                        <ColorLensIcon />
                    </ListItemIcon>
                        <ListItemText primary={'Manage Artists'} />
                    </ListItemButton>
                </ListItem>
            </LinkContainer>
             <LinkContainer to='/admin/reviewslist'>
                <ListItem disablePadding>
                    <ListItemButton>
                    <ListItemIcon>
                        <ReviewsIcon />
                    </ListItemIcon>
                        <ListItemText primary={'Manage Reviews'} />
                    </ListItemButton>
                </ListItem>
            </LinkContainer>
            <LinkContainer to='/admin/sales'>
                <ListItem disablePadding>
                    <ListItemButton>
                    <ListItemIcon>
                        <MonetizationOnIcon />
                    </ListItemIcon>
                        <ListItemText primary={'Sales and Analytics'} />
                    </ListItemButton>
                </ListItem>
            </LinkContainer>
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}