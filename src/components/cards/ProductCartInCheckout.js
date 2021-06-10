import {  CheckCircleOutlined, CloseCircleOutlined, CloseOutlined } from "@ant-design/icons";
import React from "react";
import ModalImage from "react-modal-image";
import sample from "../../images/sample.jpg";
import { useDispatch } from "react-redux";
import {toast} from 'react-toastify'

const ProductCartInCheckout = ({ p }) => {
  const colors = ["Black", "Brown", "Silver", "White", "Blue"];

  const dispatch = useDispatch();

  const handleColorChange = (e) => {
    console.log("color changed", e.target.value);

    let cart = [];
    if (typeof window !== "undefined") {
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }
      cart.map((product, i) => {
        if (product._id === p._id) {
          cart[i].color = e.target.value;
        }
      });
      localStorage.setItem("cart", JSON.stringify(cart));
      dispatch({
        type: "ADD_TO_CART",
        payload: cart,
      });
    }
  };

  const handleQuantityChange = (e) => {
    console.log("available quantity",p.quantity)
    let count = e.target.value < 1 ? 1 : e.target.value
    if(count > p.quantity){
      toast.error(`Max available quantity: ${p.quantity}`)
      return
    }

    let cart = [];

    if (typeof window !== "undefined") {
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }
      cart.map((product, i) => {
        if (product._id === p._id) {
          cart[i].count = count;
        }
      });
      localStorage.setItem('cart', JSON.stringify(cart))
       dispatch({
         type: "ADD_TO_CART",
         payload: cart,
       });
    }
  };

  const handleRemove = () => {
    // console.log(p._id, 'to remove')
    let cart = [];

    if (typeof window !== "undefined") {
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }
      cart.map((product, i) => {
        if (product._id === p._id) {
          cart.splice(i,1)
        }
      });
      localStorage.setItem('cart', JSON.stringify(cart))
       dispatch({
         type: "ADD_TO_CART",
         payload: cart,
       });
      }
  }

  return (
    <tr>
      <td>
        <div style={{ width: "100px", height: "auto" }}>
          {p.images.length ? (
            <ModalImage small={p.images[0].url} large={p.images[0].url} />
          ) : (
            <ModalImage small={sample} large={sample} />
          )}
        </div>
      </td>
      <td>{p.title}</td>
      <td>$ {p.price}</td>
      <td>{p.brand}</td>
      <td className="text-center">
        <input
          type="number"
          className="form-control"
          value={p.count}
          onChange={handleQuantityChange}
        />
      </td>
      <td>
        <select
          onChange={handleColorChange}
          name="color"
          id="color"
          className="form-control"
        >
          {p.color ? (
            <option value={p.color}>{p.color}</option>
          ) : (
            <option>Select</option>
          )}
          {colors
            .filter((co) => co !== p.color)
            .map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
        </select>
      </td>
      <td className='text-center'>{p.shipping === 'Yes' ?<CheckCircleOutlined className='text-success'/>:<CloseCircleOutlined className='text-danger'/> }</td>
      <td className='text-center'>
        <CloseOutlined onClick={handleRemove} className='text-danger pointer'/>
      </td>
    </tr>
  );
};

export default ProductCartInCheckout;
