import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Products from './components/Product/Products';
import Auth from './components/Auth/Auth';
import ProductManagement from './components/Admin/ProductManagement';
import Order from './components/Order/Order';
import Invoice from './components/Invoice/Invoice';
import UserProfile from './components/UserProfile/UserProfile';
import DeliveryAddress from './components/DeliveryAddress/DeliveryAddress';
import PrivateRoute from './components/PrivateRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Products />,
      },
      {
        path: 'auth',
        element: <Auth />,
      },
      {
        path: 'admin/products',
        element: (
          <PrivateRoute requiredRole="admin">
            <ProductManagement />
          </PrivateRoute>
        ),
      },
      {
        path: 'order',
        element: (
          <PrivateRoute>
            <Order />
          </PrivateRoute>
        ),
      },
      {
        path: "/invoice/:orderId",
        element: (
          <PrivateRoute>
            <Invoice />
          </PrivateRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <PrivateRoute>
            <UserProfile />
          </PrivateRoute>
        ),
      },
      {
        path: 'delivery-address',
        element: (
          <PrivateRoute>
            <DeliveryAddress />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export default router;
