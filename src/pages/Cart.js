import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ProductCartInCheckout from "../components/cards/ProductCartInCheckout";
import {userCart} from '../functions/user'

const Cart = ({history}) => {
  const { cart, user } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();

const getTotal = () => {
    return cart.reduce((current, next)=> {
       return current + next.count * next.price
    },0)
}

const saveOrderToDb = () => {
// console.log('cart', JSON.stringify(cart, null, 4))
// console.log("userToken", user.token)
userCart(cart, user.token.token)
.then(res=> {
  console.log('cart post res', res)
  if(res.data.ok) history.push('/checkout')
}).catch(err=> console.log('cart save err', err))

}

const saveCashOrderToDb = () => {
  dispatch({
    type: "COD",
    payload: true
  })
  // console.log('cart', JSON.stringify(cart, null, 4))
  // console.log("userToken", user.token)
  userCart(cart, user.token.token)
    .then((res) => {
      console.log("cart post res", res);
      if (res.data.ok) history.push("/checkout");
    })
    .catch((err) => console.log("cart save err", err));
};

const showCartItems = () => (
  <table className="table table-bordered">
    <thead className="thead-light">
      <tr>
        <th scope="col">Image</th>
        <th scope="col">Title</th>
        <th scope="col">Price</th>
        <th scope="col">Brand</th>
        <th scope="col">Color</th>
        <th scope="col">Count</th>
        <th scope="col">Shipping</th>
        <th scope="col">Remove</th>
      </tr>
    </thead>
    <tbody>
    {cart.map((p)=> <ProductCartInCheckout key={p._id} p={p}/>)}
    </tbody>
  </table>
);

  return (
    <div className="container-fluid pt-2">
      <div className="row">
        <div className="col-md-8">
          <h4>Cart / {cart.length} product</h4>
          {!cart.length ? (
            <p>
              No products in cart. <Link to="/shop">Continue shopping ?</Link>
            </p>
          ) : (
            showCartItems()
          )}{" "}
        </div>
        <div className="col-md-4">
          <h4>Order Summary</h4>
          <hr />
          <p>Products</p>
          {cart.map((c, i) => (
            <div key={i}>
              <p>
                {c.title} * {c.count} = ${c.price * c.count}
              </p>
            </div>
          ))}
          <hr />
          Total: <b>${getTotal()}</b>
          <hr />
          {user ? (
            <>
              <button
                onClick={saveOrderToDb}
                className="btn btn-sm btn-primary mt-2"
                disabled={!cart.length}
              >
                Proceed to checkout
              </button>
              <br />
              <button
                onClick={saveCashOrderToDb}
                className="btn btn-sm btn-warning mt-2"
                disabled={!cart.length}
              >
                Pay Cash on Delivery
              </button>
            </>
          ) : (
            <button className="btn btn-sm btn-primary mt-2">
              <Link
                to={{
                  pathname: "/login",
                  state: { from: "/cart" },
                }}
              >
                Login to Checkout
              </Link>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
