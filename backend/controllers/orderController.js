import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';

const addOrderItems = asyncHandler(async (req, res) => {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;
  
    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error('No order items');
    } else {
      orderItems.map(async (item) => {
        const product = await Product.findById(item._id);
        if (product) {
          product.countInStock = product.countInStock - item.qty;
          await product.save();
        }
      });

      const order = new Order({
        orderItems: orderItems.map((x) => ({
          ...x,
          product: x._id,
          _id: undefined,
        })),

        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });
      const createdOrder = await order.save();
  
      res.status(201).json(createdOrder);
    }
  });

  const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'name email');
    if(orders){
      res.json(orders);
    }else{
      res.status(404);
      throw new Error('Orders not found');
    }
  });


  const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.orderId).populate(
      'user',
      'name email'
    );
    if(order){
      res.json(order);
    }else{
      res.status(404);
      throw new Error('Order not found');
    }
  });
  
  const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.orderId);
    if(order){
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address,
      };
      const updateOrder = await order.save();

      const pointsAchieved = order.totalPrice/100;
      const pointUser = await User.findOne({_id: order.user._id});
      console.log(pointUser);
      pointUser.points += pointsAchieved;
      await pointUser.save();

      res.json(updateOrder);
    }else{
      res.status(404);
      throw new Error('Order not found');
    }
  });

  const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.orderId);
    if(order){
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      const updateOrder = await order.save();
      res.json(updateOrder);
    }else{
      res.status(404);
      throw new Error('Order not found');
    }
  });

const myOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.params.userId })
    .sort({ createdAt: -1 })
    .exec();

  if (orders) {
    res.json(orders);
  } else {
    res.status(404);
    throw new Error('Orders not found');
  }
});


const updateOrderToCancel = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.body.orderId);
  if (order) {
    await Promise.all(
      order.orderItems.map(async (item) => {
        const product = await Product.findById(item.product);
        if (product) {
          product.countInStock += item.qty;
          await product.save();
        }
      })
    );

    order.isCancelled = true;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

const filterOrder = asyncHandler(async (req, res) => {
  const filter = req.params.filter;
  if(filter === 'paid'){
    const orders = await Order.find({ isPaid: true }).populate(
      'user',
      'name email'
    )
    .sort({ createdAt: -1 })
    .exec();
    res.status(200).json(orders);
  }else if(filter === 'notPaid'){
    const orders = await Order.find({ isPaid: false }).populate(
      'user',
      'name email'
    ).sort({ createdAt: -1 })
    .exec();
    res.status(200).json(orders);
  }else if(filter === 'delivered'){
    const orders = await Order.find({ isDelivered: true }).populate(
      'user',
      'name email'
    ).sort({ createdAt: -1 })
    .exec();
    res.status(200).json(orders);
  }else if(filter === 'notDelivered'){
    const orders = await Order.find({ isDelivered: false }).populate(
      'user',
      'name email'
    ).sort({ createdAt: -1 })
    .exec();
    res.status(200).json(orders);
  }else if(filter === 'cancelled'){
    const orders = await Order.find({ isCancelled: true }).populate(
      'user',
      'name email'
    ).sort({ createdAt: -1 })
    .exec();
    res.status(200).json(orders);
  }else if(filter === 'notCancelled'){
    const orders = await Order.find({ isCancelled: false }).populate(
      'user',
      'name email'
    ).sort({ createdAt: -1 })
    .exec();
    res.status(200).json(orders);
  }else{
    res.status(404);
    throw new Error('Invalid filter');
  }
});  

  const myFilterOrders = asyncHandler(async (req, res) => {
  const filter = req.params.filter;
  if(filter === 'paid'){
    const orders = await Order.find({ user: req.params.userId ,isPaid: true }).populate(
      'user',
      'name email'
    )
    .sort({ createdAt: -1 })
    .exec();
    res.status(200).json(orders);
  }else if(filter === 'notPaid'){
    const orders = await Order.find({ user: req.params.userId ,isPaid: false }).populate(
      'user',
      'name email'
    ).sort({ createdAt: -1 })
    .exec();
    res.status(200).json(orders);
  }else if(filter === 'delivered'){
    const orders = await Order.find({ user: req.params.userId ,isDelivered: true }).populate(
      'user',
      'name email'
    ).sort({ createdAt: -1 })
    .exec();
    res.status(200).json(orders);
  }else if(filter === 'notDelivered'){
    const orders = await Order.find({ user: req.params.userId ,isDelivered: false }).populate(
      'user',
      'name email'
    ).sort({ createdAt: -1 })
    .exec();
    res.status(200).json(orders);
  }else if(filter === 'cancelled'){
    const orders = await Order.find({ user: req.params.userId ,isCancelled: true }).populate(
      'user',
      'name email'
    ).sort({ createdAt: -1 })
    .exec();
    res.status(200).json(orders);
  }else if(filter === 'notCancelled'){
    const orders = await Order.find({ user: req.params.userId ,isCancelled: false }).populate(
      'user',
      'name email'
    ).sort({ createdAt: -1 })
    .exec();
    res.status(200).json(orders);
  }else{
    res.status(404);
    throw new Error('Invalid filter');
  }
});

const getSales = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    createdAt: { $gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) },
  });
  const monthlySales = {
    January: 0,
    February: 0,
    March: 0,
    April: 0,
    May: 0,
    June: 0,
    July: 0,
    August: 0,
    September: 0,
    October: 0,
    November: 0,
    December: 0,
  };

  orders.forEach(order => {
    const month = new Date(order.createdAt).toLocaleString('en-US', { month: 'long' });
    monthlySales[month] += order.totalPrice;
  });

  const salesData = Object.keys(monthlySales).map(month => ({
    month,
    value: parseFloat(monthlySales[month].toFixed(2))
  }));

  res.json(salesData);
});


const getTopProducts = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
  });

  const productQuantities = {};

  orders.forEach(order => {
    order.orderItems.forEach(item => {
      const { product, qty } = item;
      if (!productQuantities[product]) {
        productQuantities[product] = 0;
      }
      productQuantities[product] += qty;
    });
  });

  const top5Products = Object.keys(productQuantities)
    .map(productId => ({
      productId,
      quantitySold: productQuantities[productId],
    }))
    .sort((a, b) => b.quantitySold - a.quantitySold)
    .slice(0, 5);

  const productIds = top5Products.map(product => product.productId);
  const products = await Product.find({ _id: { $in: productIds } });

  const top5ProductsData = top5Products.map(product => {
    const { productId, quantitySold } = product;
    const productDetails = products.find(prod => prod._id.toString() === productId);

    if (productDetails) {
      return {
        productId: productDetails._id,
        productName: productDetails.name,
        quantitySold,
      };
    }

    return {
      productId: productId,
      productName: "Product not found",
      quantitySold,
    };
  });

  res.json(top5ProductsData);
});

const getProductCategoriesSortedByOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    });

    const categoryCounts = {};

    for (const order of orders) {
      for (const item of order.orderItems) {
        const product = await Product.findById(item.product);

        if (product && product.category) {
          if (!categoryCounts[product.category]) {
            categoryCounts[product.category] = 0;
          }
          categoryCounts[product.category] += item.qty;
        } else {
          const unknownCategory = 'Unknown Category';
          if (!categoryCounts[unknownCategory]) {
            categoryCounts[unknownCategory] = 0;
          }
          categoryCounts[unknownCategory] += item.qty;
        }
      }
    }

    const sortedCategories = Object.keys(categoryCounts)
      .map(category => ({
        category,
        orderCount: categoryCounts[category],
      }))
      .sort((a, b) => b.orderCount - a.orderCount);

    res.json(sortedCategories);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Something went wrong.' });
  }
});


  export {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getAllOrders,
    myOrders,
    updateOrderToCancel,
    filterOrder,
    myFilterOrders,
    getSales,
    getTopProducts,
    getProductCategoriesSortedByOrders
  };