import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Nopage from "./pages/Nopage";
import PageInfo from "./pages/PageInfo";
import ScrollTop from "./components/ScrollTop";
import Cart from "./pages/Cart";
import AllProduct from "./pages/AllProduct";
import Signup from "./pages/registration/Signup";
import Login from "./pages/registration/Login";
import UserDashboard from "./pages/admin/user/UserDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import MyState from "./components/context/MyState";

// Import ToastContainer
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import styles for react-toastify
import { ProtectedRouteForUser } from "./protectedRoute/ProtectedRouteForUser";
import { ProtectedRouteForAdmin } from "./protectedRoute/ProtectedRouteForAdmin";
import UpdateProduct from "./pages/admin/UpdateProduct";
import AddProductPage from "./pages/admin/AddProductPage";
import Homepagecard from "./components/Homepagecard";

function App() {
  return (
    <div>
      <MyState>
        <Router>
          <ScrollTop />
          
          <Routes>
            {/* Display Homepagecard only on Home page */}
            <Route path="/" element={<>
              <Home />
          
            </>} />
            
            <Route path="/*" element={<Nopage />} />
            <Route path="/productinfo/:id" element={<PageInfo />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/allproduct" element={<AllProduct />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes */}
            <Route path="/user-dashboard" element={      
              <ProtectedRouteForUser>
                <UserDashboard/>
              </ProtectedRouteForUser>} />

            <Route path="/admin-dashboard" element={
              <ProtectedRouteForAdmin>
                <AdminDashboard/>
              </ProtectedRouteForAdmin>} />

            <Route path="/updateproduct/:id" element={
              <ProtectedRouteForAdmin>
                <UpdateProduct/>
              </ProtectedRouteForAdmin>} />

            <Route path="/addproduct" element={
              <ProtectedRouteForAdmin>
                <AddProductPage/>
              </ProtectedRouteForAdmin>} />
          </Routes>

          {/* ToastContainer to display toast notifications */}
          <ToastContainer />

        </Router>
      </MyState>
    </div>
  );
}

export default App;
