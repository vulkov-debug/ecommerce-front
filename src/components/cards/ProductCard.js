import React, { useState } from "react";
import { Card, Tooltip } from "antd";
import { EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import sample from "../../images/sample.jpg";
import { Link } from "react-router-dom";
import { showAverage } from "../../functions/rating";
import _ from "lodash";
import {useSelector, useDispatch} from 'react-redux'

const { Meta } = Card;

const ProductCard = ({
  product: { images, slug, title, description, price },
  product,
}) => {
  const [tooltip, setTooltip] = useState("Click to add");

  const dispatch = useDispatch()

  const {user, cart} = useSelector(state=> ({...state}))

  const handleAddToCart = () => {
    let cart = [];
    if (typeof window !== "undefined") {
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }
      cart.push({
        ...product,
        count: 1,
      });
      let unique = _.uniqWith(cart, _.isEqual);

      localStorage.setItem("cart", JSON.stringify(unique));

      setTooltip("Added");

      dispatch({
        type: 'ADD_TO_CART',
        payload: unique
      })
        dispatch({
          type: "SET_VISIBLE",
          payload: true,
        });
    }
  };

  return (
    <>
      {product && product.ratings && product.ratings.length > 0 ? (
        showAverage(product)
      ) : (
        <div className="text-center pt-1 pb-3">No rating yet</div>
      )}
      <Card
        cover={
          <img
            src={images && images.length ? images[0].url : sample}
            style={{ height: "150px", objectFit: "cover" }}
            className="p-1"
          />
        }
        actions={[
          <Link to={`/product/${slug}`}>
            <EyeOutlined className="text-warning" /> <br />
            View Product
          </Link>,
          <Tooltip title={tooltip} >
            <a onClick={product.quantity>1 ? handleAddToCart : null} disabled={product.quantity < 1 }>
              <ShoppingCartOutlined className="text-danger" />
              <br />
             {product.quantity < 1 ? 'Out of stock' : 'Add to Card'}
            </a>
          </Tooltip>,
        ]}
      >
        <Meta
          title={`${title} - $${price}`}
          description={`${description.substring(0, 10)}...`}
        />
      </Card>
    </>
  );
};

export default ProductCard;
