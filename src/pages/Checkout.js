import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { getUserCart, emptyUserCart, saveUserAddress, applyCoupon, createCashOrderForUser } from "../functions/user";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // ES6

const Checkout = ({history}) => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState("");
  const [addressSaved, setAddressSaved] = useState(false);
  const [coupon, setCoupon] = useState('')
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0)
  const [discountError, setDiscountError] = useState('')

  const dispatch = useDispatch();
  const { user, COD } = useSelector((state) => ({ ...state }));
  const couponTrueOrFalse = useSelector((state) => state.coupon);


  useEffect(() => {
    //  console.log(user.token.token)
    getUserCart(user.token.token).then((res) => {
      console.log("user cart res", JSON.stringify(res.data, null, 4));
      setProducts(res.data.products);
      setTotal(res.data.cartTotal);
    });
  }, []);

  const emptyCart = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart");
    }
    dispatch({
      type: "ADD_TO_CART",
      payload: [],
    });
    // console.log(user.token.token)
    emptyUserCart(user.token.token).then((res) => {
      setProducts([]);
      setTotal(0);
      toast.error("Cart is empty. Countinue shopping.");
      setTotalAfterDiscount(0)
      setCoupon('')
    });
  };

  const saveAddressToDb = () => {
    // console.log(address)
    saveUserAddress(user.token.token, address).then((res) => {
      if (res.data.ok) setAddressSaved(true);
      toast.success("Address saved");
    });
  };

  const showAddress = () => (
    <>
      <ReactQuill theme="snow" value={address} onChange={setAddress} />
      <button className="btn btn-primary mt-2" onClick={saveAddressToDb}>
        Save
      </button>
    </>
  );

  const showProductSummary = () => {
  return products.map((p, i) => (
      <div key={i}>
        <p>
          {p.product.title} ({p.color}) x {p.count} ={" "}
          {p.product.price * p.count}
        </p>
      </div>
    ));
  };

  const showApplyCoupon = () => (
    <>
    <input type="text" className='form-control' onChange={e=> {setCoupon(e.target.value)
    setDiscountError('')
    }} value={coupon}/>
    <button className='btn btn-primary mt-2' onClick={applyDiscountCoupon}>Apply</button>
    </>
  )

  const applyDiscountCoupon = () => {
    console.log('send coupon to backend', coupon)
applyCoupon(user.token.token, coupon).then(res=> {
  console.log('res on coupon applied', res.data)
  setCoupon('')
  if(res.data) {
    setTotalAfterDiscount(res.data)
    dispatch({
      type: 'COUPON_APPLIED', 
      payload: true
    })
  }
  if(res.data.err) {
    setDiscountError(res.data.err)
   dispatch({
     type: "COUPON_APPLIED",
     payload: false,
   });
  }
})
  }

  const createCashOrder = () => {
   createCashOrderForUser(user.token.token, COD, couponTrueOrFalse).then(res=> {
     console.log('User cash order created', res)
if(res.data.ok) {
  if(typeof window !== 'undefined') localStorage.removeItem('cart')
  dispatch({
    type: "ADD_TO_CART",
    payload: []
  })
   dispatch({
     type: "COUPON_APPLIED",
     payload: false,
   })
  dispatch({
    type: "COD",
    payload: false,
  });
emptyUserCart(user.token)
setTimeout(()=> {
  history.push('/user/history')
},1000)
}
   })
  }

  return (
    <div className="row">
      <div className="col-md-6">
        <h4>Delivery Address</h4>
        <br />
        <br />
        {showAddress()}
        <hr />
        <h4>Got Coupon ?</h4>
        <br />
        {showApplyCoupon()}
        <br />
        {discountError && <p className="bg-danger p-2">{discountError}</p>}
      </div>
      <div className="col-md-6">
        <h4>Order Summary</h4>
        <hr />
        <p>Products {products.length} </p>
        <hr />
        {showProductSummary()}
        <hr />
        <p>Cart Total: {total}</p>

        {totalAfterDiscount > 0 && (
          <p className="bg-success p-2">
            Discount Applied: Total Payable ${totalAfterDiscount}
          </p>
        )}

        <div className="row">
          <div className="col-md-6">
            {COD ? (
              <button
                className="btn btn-primary"
                disabled={!addressSaved || !products.length}
                onClick={createCashOrder}
              >
                Place Order
              </button>
            ) : (
              <button
                className="btn btn-primary"
                disabled={!addressSaved || !products.length}
                onClick={() => history.push("/payment")}
              >
                Place Order
              </button>
            )}
          </div>
          <div className="col-md-6">
            <button
              className="btn btn-primary"
              disabled={!products.length}
              onClick={emptyCart}
            >
              Empty Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
