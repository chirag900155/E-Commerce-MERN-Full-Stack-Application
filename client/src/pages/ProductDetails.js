import React, {useEffect, useState} from 'react'
import { Layout } from '../components/layout/Layout'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom';

const ProductDetails = () => {

  const params = useParams()
  const [product, setProduct] = useState({})
  const [relatedProduct, setRelatedProduct] = useState([])
  // I'm using this category because I'm getting error while direct calling the category so that why I have made a state
  const [category, setCategory] = useState("")
  const navigate = useNavigate()

  const getProduct = async ()=>{
    try {
      const {data} = await axios.get(`/api/v1/products/get-product/${params.slug}`)
      console.log('Product data: ' ,data);
      setProduct(data?.product)
      getSimilarProduct(data?.product._id, data.product.category._id)
      setCategory(data.product.category.name)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    if(params?.slug) getProduct()
  }, [params?.slug])

  // Get similar product
  const getSimilarProduct = async (pid, cid)=>{
    try {
      const {data} = await axios.get(`/api/v1/products/related-product/${pid}/${cid}`)
      setRelatedProduct(data?.products)
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Layout>
      <div className="row container mt-2">
        <div className="col-md-6">
        <img src={`/api/v1/products/product-photo/${product._id}`} className="card-img-top" alt={product.name}
        height='300' width={'350px'} />
        </div>
        <div className="col-md-6">
          <h1 className="text-center"> Product Details </h1>
          <h6> Name : {product.name} </h6>
          <h6> Description : {product.description} </h6>
          <h6> Price : {product.price} </h6>
          <h6> Category : {category } </h6>
          <button class="btn btn-secondary ms-1"> Add To Cart </button>
        </div>
      </div>
      <hr />
      <div className="row">
        <h5> Similar Product </h5>
        { relatedProduct.length < 1 && (<p className='text-center'> No Similar Product Found </p>) }
        <div className="d-flex flex-wrap">
            {relatedProduct?.map(p =>(
                  <div className="card m-2" style={{width: '18rem'}}>
                    <img src={`/api/v1/products/product-photo/${p._id}`} className="card-img-top" alt={p.name} />
                    <div className="card-body">
                      <h5 className="card-title">{p.name}</h5>
                      <p className="card-text"> {p.description.substring(0, 30)}... </p>
                      <p className="card-text"> ${p.price} </p>
                      <button class="btn btn-primary ms-1" onClick={()=> navigate(`/product/${p.slug}`)}> View Details </button>
                      <button class="btn btn-secondary ms-1"> Add To Cart </button>
                    </div>
                </div>
              ))}
            </div> 
      </div>
    </Layout>
  )
}

export default ProductDetails

// product.category