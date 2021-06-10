import React, { useEffect, useState } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { getProductsByCount } from "../../../functions/product";
import AdminProductCard from "../../../components/cards/AdminProductCard";
import {removeProduct} from '../../../functions/product'
import {useSelector} from 'react-redux'
import {toast} from 'react-toastify'

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

const {user} = useSelector(state=> ({...state}))

  useEffect(() => {
    loadAllProducts();
  }, []);

  const loadAllProducts = () => {
    setLoading(true);
    getProductsByCount(100)
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

const handleRemove = (slug) => {
  if(window.confirm('Are you sure?')){
    removeProduct(slug,user.token.token)
    .then(res=> {
      loadAllProducts()
      toast.error(`${res.data.title} ise deleted!`)
    })
    .catch(err=> {
console.log(err)
if(err.response.status === 400) toast.error(err.response.data)
    })
  }
}

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col">
          {loading ? (
            <h4 className="text-danger">Loading ...</h4>
          ) : (
            <h4>All products</h4>
          )}
          <div className="row">
            {products.map((p) => (
              <div className="col-md-4 pb-3" key={p._id}>
                <AdminProductCard product={p} handleRemove={handleRemove} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
