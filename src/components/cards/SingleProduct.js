import React, {useState} from "react";
import { Card, Tabs, Tooltip } from "antd";
import { Link } from "react-router-dom";
import { HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import sample from '../../images/sample.jpg'
import ProductListItems from './ProductListItems'
import StarRating from 'react-star-ratings'
import RatingModal from '../modal/RatingModal'
import _ from "lodash";
import { useSelector, useDispatch } from "react-redux";
import { showAverage } from "../../functions/rating";
import { addToWishlist } from "../../functions/user";
import { toast } from "react-toastify";
import {useHistory} from 'react-router-dom'

const { Meta } = Card;

const {TabPane} = Tabs

const SingleProduct = ({ product, onStarClick, star }) => {
  const [tooltip, setTooltip] = useState("Click to add");

  const history = useHistory()

    const dispatch = useDispatch();

    const { user, cart } = useSelector((state) => ({ ...state }));

  const {title, images, description, _id} = product

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
        type: "ADD_TO_CART",
        payload: unique,
      });
         dispatch({
           type: "SET_VISIBLE",
           payload: true,
         });
    }
  };

  const handleAddToWishlist = e => {
    e.preventDefault()

    addToWishlist(product._id, user.token.token).then(res=> {
      console.log('ADDED TO WISHLIST', res.data);
      toast.success("Added to wishlist")
      history.push('/user/wishlist')
    })
  }

  return (
    <>
      <div className="col-md-7">
        {images && images.length ? (
          <Carousel showArrows={true} autoPlay infiniteLoop>
            {images && images.map((i) => <img src={i.url} key={i.public_id} />)}
          </Carousel>
        ) : (
          <Card cover={<img src={sample} className="mb-3 card-image" />}></Card>
        )}
        <div className="card-container">
          <Tabs type="card">
            <TabPane tab="Description" key="1">
              {description && description}
            </TabPane>
            <TabPane tab="More" key="2">
              Call us on XXXXX XXX XXX to learn more about this product.
            </TabPane>
          </Tabs>
        </div>
      </div>
      <div className="col-md-5">
        <h1 className="bg-info p-3">{title}</h1>
        {product && product.ratings && product.ratings.length > 0 ? (
          showAverage(product)
        ) : (
          <div className="text-center pt-1 pb-3">No rating yet</div>
        )}
        <Card
          actions={[
            <Tooltip title={tooltip}>
              <a onClick={handleAddToCart}>
                <ShoppingCartOutlined className="text-danger" />
                <br />
                Add to Card
              </a>
            </Tooltip>,
           <a onClick={handleAddToWishlist}>
              {" "}
              <HeartOutlined className="text-info" />
              <br />
              Add to Wishlist
           </a>,
            <RatingModal>
              <StarRating
                name={_id}
                numberOfStars={5}
                rating={star}
                changeRating={onStarClick}
                isSelectable={true}
                starRatedColor="red"
              />
            </RatingModal>,
          ]}
        >
          <ProductListItems product={product} />
        </Card>
      </div>
    </>
  );
};

export default SingleProduct;
