import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Auth from './components/Auth/Auth';
import Cart from './components/Cart/Cart';
import Category from './components/Category/Category';
import DeliveryAddress from './components/DeliveryAddress/DeliveryAddress';
import Invoice from './components/Invoice/Invoice';
import Product from './components/Product/Product';
import UserProfile from './components/UserProfile/UserProfile';
import MainLayout from './layouts/MainLayout';
import ProductManagement from './components/Admin/ProductManagement';
import PrivateRoute from './components/PrivateRoute';
import Order from './components/Order/Order'; 

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      children: [
        {
          element: <MainLayout />,
          children: [
            {
              path: '/',
              element: <Product />,
            },
            {
              path: '/products',
              element: <Product />,
            },
            {
              path: '/admin/products',
              element: <ProductManagement />,
            },
          ],
        },
        {
          path: '/auth',
          element: <Auth />,
        },
        {
          path: '/cart',
          element: <Cart />,
        },
        {
          path: '/category',
          element: <Category />,
        },
        {
          path: '/delivery-address',
          element: <DeliveryAddress />,
        },
        {
          path: '/invoice/:orderId',
          element: <Invoice />,
        },
        {
          path: '/profile',
          element: <UserProfile />,
        },
        {
          path: '/login',
          element: <Auth />,
        },
        {
          path: '/admin',
          element: <UserProfile />,
        },
        {
          path: '/order',
          element: <PrivateRoute><Order /></PrivateRoute>,
        },
        {
          path: '*',
          element: <div>Page Not Found</div>,
        },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
    },
  }
);
