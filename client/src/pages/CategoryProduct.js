import React, {useState, useEffect} from 'react'
import { Layout } from '../components/layout/Layout'
import { useParams } from 'react-router-dom';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import '../styles/CategoryProductStyles.css'

const CategoryProduct = () => {

    const params = useParams()
    const [products, setProducts] = useState([])
    const [category, setCategory] = useState([])
    const navigate = useNavigate()

    const getProductCat = async () =>{
        try {
            const {data} = await axios.get(`/api/v1/products/product-category/${params.slug}`)
            setProducts(data?.products)
            setCategory(data?.category)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{
        if(params?.slug) getProductCat()
    }, [params?.slug])

  return (
    <Layout>
        <div className="container">
            <h4 className="text-center"> Category- {category?.name} </h4>
            <h6 className="text-center"> {products?.length} Results Found </h6>
            <div className="row"> 
                <h1 className="text-center"> All Products </h1>
                <div className="d-flex flex-wrap">
                {products?.map(p =>(
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
        </div>
    </Layout>
  )
}

export default CategoryProduct