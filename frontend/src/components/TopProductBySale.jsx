import { useGetTopProductsQuery } from '../slices/ordersApiSlice';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Loader from './Loader';
import Message from './Message';
import { Link } from 'react-router-dom';

const TopProductBySale = () => {
    const { data: topProduct, refetch, isLoading, error } = useGetTopProductsQuery();

  const renderChart = () => {
    if (isLoading) return <Loader />;
    if (error) return <Message variant='error'>{error}</Message>;
    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={topProduct} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="productName" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="quantitySold" fill="#FF00a0" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return <div>{renderChart()}</div>;
};

export default TopProductBySale;
