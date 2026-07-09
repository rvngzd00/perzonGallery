import { createBrowserRouter } from 'react-router-dom'
import { PageLayout } from '@/components/layout/PageLayout'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import Home from '@/pages/Home'
import ProductsPage from '@/pages/ProductsPage'
import ProductDetail from '@/pages/ProductDetail'
import Wishlist from '@/pages/Wishlist'
import NotFound from '@/pages/NotFound'
import AdminLogin from '@/pages/admin/Login'
import AdminDashboard from '@/pages/admin/Dashboard'
import AdminProducts from '@/pages/admin/Products'
import AdminProductForm from '@/pages/admin/ProductForm'
import AdminCategories from '@/pages/admin/Categories'
import AdminBrands from '@/pages/admin/Brands'
import AdminBranches from '@/pages/admin/Branches'
import AdminOrders from '@/pages/admin/Orders'
import AdminOrderDetail from '@/pages/admin/OrderDetail'
import AdminCustomers from '@/pages/admin/Customers'
import AdminCustomerDetail from '@/pages/admin/CustomerDetail'
import AdminMessages from '@/pages/admin/Messages'
import AdminSettings from '@/pages/admin/Settings'

export const router = createBrowserRouter([
  {
    element: <PageLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/products', element: <ProductsPage /> },
      { path: '/products/:id', element: <ProductDetail /> },
      { path: '/wishlist', element: <Wishlist /> },
      { path: '*', element: <NotFound /> },
    ],
  },
  { path: '/admin/login', element: <AdminLogin /> },
  {
    path: '/admin',
    element: (
      <ProtectedRoute redirectTo="/admin/login">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'products', element: <AdminProducts /> },
      { path: 'products/new', element: <AdminProductForm /> },
      { path: 'products/:id/edit', element: <AdminProductForm /> },
      { path: 'categories', element: <AdminCategories /> },
      { path: 'brands', element: <AdminBrands /> },
      { path: 'branches', element: <AdminBranches /> },
      { path: 'orders', element: <AdminOrders /> },
      { path: 'orders/:id', element: <AdminOrderDetail /> },
      { path: 'customers', element: <AdminCustomers /> },
      { path: 'customers/:id', element: <AdminCustomerDetail /> },
      { path: 'messages', element: <AdminMessages /> },
      { path: 'settings', element: <AdminSettings /> },
    ],
  },
])
