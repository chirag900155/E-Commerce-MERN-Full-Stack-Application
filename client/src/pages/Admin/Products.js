import React, { useEffect, useState } from 'react'
import AdminMenu from '../../components/layout/AdminMenu'
import { Layout } from '../../components/layout/Layout'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'
const Products = () => {

  const [products, setProducts] = useState([])

  // Get all products 
  const getAllProducts = async ()=>{
    try {
      const {data} = await axios.get("/api/v1/products/get-product")
      if(data?.success){
        setProducts(data.product)
      }
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong while geting all products')
    }
  }

  // Lifecycle method 
  useEffect(()=>{
    getAllProducts()
  }, [])

  return (
    <Layout title={'Product List'}>
         <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu/>
          </div>
          <div className="col-md-9">
            <h1> All Product List </h1>
            <div className="d-flex flex-wrap">
              {products?.map(p =>(
                <Link key={p._id} to={`/dashboard/admin/product/${p.slug}`} className='product-link'>
                  <div className="card m-2" style={{width: '18rem'}}>
                    <img src={`/api/v1/products/product-photo/${p._id}`} className="card-img-top" alt={p.name} />
                    <div className="card-body">
                      <h5 className="card-title">{p.name}</h5>
                      <p className="card-text"> {p.description} </p>
                    </div>
                </div>

                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Products