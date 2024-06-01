import { useGetTopCategoryQuery } from '../slices/ordersApiSlice';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Loader from './Loader';
import Message from './Message';

const TopProductBySale = () => {
    const { data: topCategory, refetch, isLoading, error } = useGetTopCategoryQuery();

  const renderChart = () => {
    if (isLoading) return <Loader />;
    if (error) return <Message variant='error'>{error}</Message>;
    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={topCategory} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="orderCount" fill="#FF0010" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return <div>{renderChart()}</div>;
};

export default TopProductBySale;
