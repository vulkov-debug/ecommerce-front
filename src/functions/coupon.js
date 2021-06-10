import axios from "axios";

export const getCoupons = async () =>
  axios.get(`${process.env.REACT_APP_API}/coupons`);
export const removeCoupon = async (couponId, authtoken) =>
  axios.delete(`${process.env.REACT_APP_API}/coupon/${couponId}`, {
    headers: {
      authtoken,
    },
  });

export const createCoupon = async (coupon, authtoken) =>
  axios.post(
    `${process.env.REACT_APP_API}/coupon`,
    coupon ,
    {
      headers: {
        authtoken,
      },
    }
  );
