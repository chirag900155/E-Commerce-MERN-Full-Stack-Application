import React, {useState, useEffect} from 'react'
import { Layout } from '../components/layout/Layout'
import axios from 'axios'
import {Checkbox, Radio} from 'antd'
import { prices } from '../components/Prices'
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartProvider'
import { toast } from 'react-hot-toast';
import '../styles/HomePage.css'

export const HomePage = () => {
  //const [auth, setAuth] =  useAuth()

  const [cart, setCart] = useCart()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [checked, setChecked] = useState([])
  const [radio, setRadio] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Get total count of prodcuts
  const totalProducts = async ()=>{
    try {
      const {data} = await axios.get('/api/v1/products/product-count')
      setTotal(data?.total)
    } catch (error) {
      console.log(error);
    }
    
  }

  //Get all categorys 
  const getAllCategory = async ()=>{
    try {
      const {data} = await axios.get('/api/v1/category/get-category')
      if(data?.success){
        setCategories(data.category)
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    getAllCategory()
    totalProducts()
  }, [])

  //Get all products 
  const getAllProducts = async ()=>{
    try {
      setLoading(true)
      const {data} = await axios.get(`/api/v1/products/product-list/${page}`)
      setLoading(false)
      setProducts(data.product)
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  }

  useEffect(()=>{
    if(!checked.length || !radio.length)  getAllProducts()
  }, [checked.length, radio.length])

  useEffect(()=>{
    if(checked.length || radio.length)  filterProduct()
  }, [checked, radio])

  // Filter by the category function
  const handleFilter = ( value, id )=>{
    let all = [...checked]
    if(value){
      all.push(id)
    }else{
      all = all.filter((c)=> c!== id)
    }

    setChecked(all)
  }

  useEffect(()=>{
    if(page === 1) return
    loadMore()
  }, [page])
  const loadMore = async () =>{
    try {
      setLoading(true)
      const {data} = await axios.get(`/api/v1/products/product-list/${page}`)
      setLoading(false)
      setProducts([...products, ...data?.product])
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  }

  const filterProduct = async () =>{
    try {
      const {data} = await axios.post('/api/v1/products/product-filters', {checked, radio})
      setProducts(data.product)
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Layout title={"All Products -Best Offers"}>
      {/* banner image */}
      <img
        src="/images/banner.png"
        className="banner-img"
        alt="bannerimage"
        width={"100%"}
      />
        <div className="row mt-3">
          <div className="col-md-3">
            <h4 className="text-center"> Filter By Category </h4>
            <div className="d-flex flex-column">
              {categories?.map((c)=>(
                <Checkbox key={c._id} onChange={(e)=> handleFilter(e.target.checked, c._id)}> {c.name} </Checkbox>
              ))}
            </div>

            <h4 className="text-center"> Filter By Price </h4>
            <div className="d-flex flex-column mt-4">
              <Radio.Group onChange={(e) => setRadio(e.target.value)}>
                {prices?.map(p =>(
                  <div key={p._id}>
                    <Radio value={p.array}> {p.name} </Radio>
                  </div>
                ))} 
              </Radio.Group>
            </div>

            <div className="d-flex flex-column mt-4">
              <button className='btn btn-danger' onClick={()=> window.location.reload()}> RESET FILTER </button>
            </div>

          </div>

          <div className="col-md-9">
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
                      <button class="btn btn-secondary ms-1"
                      onClick={()=> { setCart([...cart, p]); localStorage.setItem('cart', JSON.stringify([...cart, p])) 
                      toast.success('Product Added Succesfully') }}> Add To Cart </button>
                    </div>
                </div>
              ))}
            </div>
            <div className='m-2 p-2'>
              {products && products.length < total && (
                <button className='btn btn-warning' onClick={(e)=> {
                  e.preventDefault()
                  setPage(page+1)
                }}>
                  {loading ? "Loading.." : "Load More"}
                </button>
              )}
            </div>
          </div>
        </div>
    </Layout>
  )
}
