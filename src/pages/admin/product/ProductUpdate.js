import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { getProduct, updateProduct } from "../../../functions/product";
import FileUpload from "../../../components/forms/FileUpload";
import { getCategories, getCategorySubs } from "../../../functions/category";
import { LoadingOutlined } from "@ant-design/icons";
import ProductUpdateForm from '../../../components/forms/ProductUpdateForm'

const initialState = {
  title: "",
  description: "",
  price: "",
  category: "",
  subs: [],
  shipping: "",
  quantity: "",
  images: [],
  colors: ["Black", "Brown", "Silver", "White", "Blue"],
  brands: ["Apple", "Samsung", "Microsoft", "Lenovo", "Asus"],
  color: "",
  brand: "",
};

const ProductUpdate = ({history, match: {params: {slug}} }) => {
  const [values, setValues] = useState(initialState);
  const [categories, setCategories] = useState([])
  const [subOptions, setSubOptions] = useState([])
  const [arrayOfSubIds, setArrayOfSubIds] = useState([])
  const [productCategory, setProductCategory] = useState('')
  const [loading, setLoading] = useState(false);


// const [originalSubIds, setOriginalSubIds] = useState([]);

  const { user } = useSelector((state) => ({ ...state }));

  useEffect(()=> {
    loadProduct()
  },[])

    useEffect(() => {
      loadCategories();
    }, [arrayOfSubIds]);

const loadProduct = () => {
  getProduct(slug)
  .then(p=> {
    console.log('single product',p)
    setValues({...values, ...p.data})
    console.log('p.data', p.data)
    setProductCategory(p.data.category._id);
    getCategorySubs(p.data.category._id)
    .then(res=> {
      setSubOptions(res.data)
      console.log('subOptions', res.data)
    })
    let arr = []
    p.data.subs.map(s=> {
      console.log('p.data', p.data)
      arr.push(s._id)
    })
    console.log('arr',arr)
    setArrayOfSubIds(prev=> arr)
 
  })
}

const loadCategories = () => getCategories().then((c) => setCategories(c.data))
    

const handleSubmit = e => {
  e.preventDefault()
  setLoading(true)

  values.subs = arrayOfSubIds
  // console.log('arrayOfSubIds',arrayOfSubIds)
  // console.log('category', values.category)

  updateProduct(slug, values, user.token.token)
  .then(res=> {
   setLoading(false)
   toast.success(`"${res.data.title}" is updated!!`)
   history.push('/admin/products')
  }).catch(err=> {
    console.log(err)
   setLoading(false);
    toast.error(err.response.data.err);

  })
}

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  

    const handleCategoryChange = (e) => {
      e.preventDefault();
      // console.log("CLicked Category", e.target.value);
      setValues({ ...values, category: e.target.value, subs: [] });
      
      getCategorySubs(e.target.value).then((res) => {
        // console.log("SUB OPTIONS ON CATEGORY CLICK", res.data);
        setSubOptions(res.data);
      });
      // console.log('array of subIds', arrayOfSubIds)
      // console.log('values',values)
      // console.log('productCategory', productCategory)
      // console.log("originalSubIds", originalSubIds);
      if(e.target.value === productCategory.toString()) {
        // { setArrayOfSubIds([...originalSubIds])}
        loadProduct()
      }else
      setArrayOfSubIds([]) 
    };


  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-10">
          
          {loading ? (
            <LoadingOutlined className="text-danger h1" />
          ) : (
            <h4>Product update</h4>
          )}
          {/* {JSON.stringify(values)} */}
          <div className="p-3">
            <FileUpload
              values={values}
              setValues={setValues}
              setLoading={setLoading}
            />
          </div>
          <ProductUpdateForm
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            handleCategoryChange={handleCategoryChange}
            values={values}
            setValues={setValues}
            categories={categories}
            subOptions={subOptions}
            arrayOfSubIds={arrayOfSubIds}
            setArrayOfSubIds={setArrayOfSubIds}
          />
          <hr />
        </div>
      </div>
    </div>
  );
};

export default ProductUpdate;
