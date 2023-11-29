import { Routes, Route } from 'react-router-dom'
import { HomePage } from "./pages/HomePage";
import About from "./pages/About.js";
import Contact from "./pages/Contact.js";
import Policy from "./pages/Policy.js";
import PageNotFound from "./pages/PageNotFound.js";
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';
import Dashboard from './pages/user/Dashboard';
import PrivateRoute from './components/Routes/Private';
import ForgotPassword from './pages/Auth/ForgotPassword';
import AdminRoute from './components/Routes/AdminRoute';
import AdminDashBoard from './pages/Admin/AdminDashBoard';
import CreateCategory from './pages/Admin/CreateCategory';
import CreateProduct from './pages/Admin/CreateProduct';
import Users from './pages/Admin/Users';
import Orders from './pages/user/Orders';
import Profile from './pages/user/Profile';
import Products from './pages/Admin/Products.js';
import UpdateProduct from './pages/Admin/UpdateProduct.js';
import Search from './pages/Search.js';
import ProductDetails from './pages/ProductDetails.js';
import AllCategory from './pages/AllCategory.js';
import CategoryProduct from './pages/CategoryProduct.js';
import CartPage from './pages/CartPage.js';
import AdminOrder from './pages/Admin/AdminOrder.js';


function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage/>} />
        <Route path='/categories' element={<AllCategory/>} />
        <Route path='/cart' element={<CartPage/>} />
        <Route path='/product/:slug' element={<ProductDetails/>} />
        <Route path='/category/:slug' element={<CategoryProduct/>} />
        <Route path='/search' element={<Search/>} />
        <Route path='/dashboard' element={<PrivateRoute/>}>
          <Route path='user' element={<Dashboard/>} />
          <Route path='user/orders' element={<Orders/>} />
          <Route path='user/profile' element={<Profile/>} />
        </Route>
        <Route path='/dashboard' element={<AdminRoute/>}>
          <Route path='admin' element={<AdminDashBoard/>} />
          <Route path='admin/create-category' element={<CreateCategory/>} />
          <Route path='admin/orders' element={<AdminOrder/>} />
          <Route path='admin/create-product' element={<CreateProduct/>} />
          <Route path='admin/product/:slug' element={<UpdateProduct/>} />
          <Route path='admin/products' element={<Products/>} />
        </Route>
        <Route path='/register' element={<Register/>} />
        <Route path='/forgot-password' element={<ForgotPassword/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/about' element={<About/>} />
        <Route path='/contact' element={<Contact/>} />
        <Route path='/policy' element={<Policy/>} />
        <Route path='*' element={<PageNotFound/>} />
      </Routes>
    </>
  );
}

export default App;
