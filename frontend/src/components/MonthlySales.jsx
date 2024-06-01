import { useGetSalesOrderQuery } from '../slices/ordersApiSlice';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Loader from './Loader';
import Message from './Message';

const MonthlySales = () => {
  const { data: sales, refetch, isLoading, error } = useGetSalesOrderQuery();

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='error'>{error}</Message>
      ) : (
        <div>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={sales} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={3}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default MonthlySales;
