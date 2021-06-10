import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { createProduct } from "../../../functions/product";
import ProductCreateForm from "../../../components/forms/ProductCreateForm";
import FileUpload from "../../../components/forms/FileUpload"
import { getCategories, getCategorySubs } from "../../../functions/category";
import {LoadingOutlined} from '@ant-design/icons'

const initialState = {
  title: "",
  description: "",
  price: "",
  category: "",
  categories: [],
  subs: [],
  shipping: "",
  quantity: "",
  images: [],
  colors: ["Black", "Brown", "Silver", "White", "Blue"],
  brands: ["Apple", "Samsung", "Microsoft", "Lenovo", "Asus"],
  color: "",
  brand: "",
};

const ProductCreate = ({ history }) => {
  const [values, setValues] = useState(initialState);
  const [subOptions, setSubOptions] = useState([])
  const [showSub, setShowSub] = useState(false)
  const [loading, setLoading] = useState(false)

  const { user } = useSelector((state) => ({ ...state }));

    useEffect(() => {
      loadCategories();
    }, []);

    const loadCategories = () =>
      getCategories().then((c) => setValues({...values, categories: c.data}));

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(values);
    createProduct(values, user.token.token)
      .then((res) => {
        console.log(res);
        toast.success(`"${res.data.title}" is created`);
        history.push("/products");
      })
      .catch((err) => {
        console.log(err);
        // if (err.response.status === 400) toast.error(err.response.data);
        toast.error(err.response.data.err);
      });
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = e => {
    e.preventDefault()
    console.log('CLicked Category', e.target.value)
    setValues({ ...values, category: e.target.value, subs: [] });
   getCategorySubs(e.target.value)
   .then(res=> {
     console.log('SUB OPTIONS ON CATEGORY CLICK', res.data)
            setSubOptions(res.data)
   })
   setShowSub(true)
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-10">
         {loading ? <LoadingOutlined className='text-danger h1'/> : <h4>Product create</h4>}
          <hr />

{/* {JSON.stringify(values.images)} */}
          <div className="p-3">
            <FileUpload values={values} setValues={setValues} setLoading={setLoading}/>
          </div>
          <ProductCreateForm
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            handleCategoryChange={handleCategoryChange}
            values={values}
            setValues={setValues}
            subOptions={subOptions}
            showSub={showSub}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCreate;
