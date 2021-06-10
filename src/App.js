import React, { useEffect, Suspense, lazy } from "react";
import { Switch, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { auth } from "./firebase";
import { currentUser } from "./functions/auth";
import { divide } from "lodash";
import { LoadingOutlined } from "@ant-design/icons";

const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const Home = lazy(() => import("./pages/Home"));
const Header = lazy(() => import("./components/nav/Header"));
const RegisterComplete = lazy(() => import("./pages/auth/RegisterComplete"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));

const History = lazy(() => import("./pages/user/History"));
const UserRoute = lazy(() => import("./components/routes/UserRoute"));
const AdminRoute = lazy(() => import("./components/routes/AdminRoute"));
const Password = lazy(() => import("./pages/user/Password"));
const CategoryCreate = lazy(() =>
  import("./pages/admin/category/CategoryCreate")
);
const SubCreate = lazy(() => import("./pages/admin/sub/SubCreate"));
const CategoryUpdate = lazy(() =>
  import("./pages/admin/category/CategoryUpdate")
);
const Wishlist = lazy(() => import("./pages/user/Wishlist"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const SubUpdate = lazy(() => import("./pages/admin/sub/SubUpdate"));
const ProductCreate = lazy(() => import("./pages/admin/product/ProductCreate"));
const ProductUpdate = lazy(() => import("./pages/admin/product/ProductUpdate"));
const AllProducts = lazy(() => import("./pages/admin/product/AllProducts"));
const Product = lazy(() => import("./pages/Product"));
const CategoryHome = lazy(() => import("./pages/category/CategoryHome"));
const SubHome = lazy(() => import("./pages/sub/SubHome"));
const Shop = lazy(() => import("./pages/Shop"));
const Cart = lazy(() => import("./pages/Cart"));
const SideDrawer = lazy(() => import("./components/drawer/SideDrawer"));
const Checkout = lazy(() => import("./pages/Checkout"));
const CreateCouponPage = lazy(() =>
  import("../src/pages/admin/coupon/CreateCouponPage")
);
const Payment = lazy(() => import("../src/pages/Payment"));

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        // console.log("user=>", user)
        currentUser(idTokenResult.token)
          .then((res) => {
            dispatch({
              type: "LOGGED_IN_USER",
              payload: {
                name: res.data.name,
                email: res.data.email,
                token: idTokenResult,
                role: res.data.role,
                _id: res.data._id,
              },
            });
          })
          .catch((err) => console.log(err));
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  return (
    <Suspense
      fallback={
        <div className="col text-center p-5">
          __ React Redux EC
          <LoadingOutlined />
          MMERCE __
        </div>
      }
    >
      <Header />
      <SideDrawer />
      <ToastContainer />
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} exact />
        <Route path="/" component={Home} exact />
        <Route path="/register/complete" component={RegisterComplete} exact />
        <Route path="/forgot/password" component={ForgotPassword} exact />
        <UserRoute path="/user/history" component={History} exact />
        <UserRoute path="/user/password" component={Password} exact />
        <UserRoute path="/user/wishlist" component={Wishlist} exact />
        <AdminRoute path="/admin/dashboard" component={AdminDashboard} exact />
        <AdminRoute path="/admin/category" component={CategoryCreate} exact />
        <AdminRoute path="/admin/sub/:slug" component={SubUpdate} exact />
        <AdminRoute
          path="/admin/category/:slug"
          component={CategoryUpdate}
          exact
        />
        <AdminRoute path="/admin/sub" component={SubCreate} exact />
        <AdminRoute path="/admin/product" component={ProductCreate} exact />
        <AdminRoute path="/admin/products" component={AllProducts} exact />
        <AdminRoute
          path="/admin/products/:slug"
          component={ProductUpdate}
          exact
        />
        <Route path="/product/:slug" component={Product} />
        <Route path="/category/:slug" component={CategoryHome} />
        <Route path="/sub/:slug" component={SubHome} />
        <Route path="/shop" component={Shop} />
        <Route path="/cart" component={Cart} />
        <UserRoute path="/checkout" component={Checkout} exact />
        <AdminRoute path="/admin/coupon" component={CreateCouponPage} exact />
        <UserRoute path="/payment" component={Payment} />
      </Switch>
    </Suspense>
  );
};

export default App;
