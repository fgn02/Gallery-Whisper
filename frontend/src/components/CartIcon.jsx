import { IconButton, Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const Cart = ({ itemCount }) => {
  return (
    <IconButton color="inherit">
      <Badge badgeContent={itemCount} color="error">
        <ShoppingCartIcon />
      </Badge>
    </IconButton>
  );
};

export default Cart;
