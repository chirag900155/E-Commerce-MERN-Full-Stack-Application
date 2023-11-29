import React from 'react'
import { Layout } from './../components/layout/Layout';
import { useSearch } from '../context/Search';
import { useNavigate } from 'react-router-dom';

const Search = () => {

  const [values, setValues] = useSearch()
  const navigate = useNavigate()

  return (
    <Layout title={'Search Result'}>
      <div className="container">
        <div className="text-center">
          <h1> Search Result </h1>
          <h6> { values?.results.length < 1 ? "No Product Found" : `Founded ${values.results.length}` } </h6>

          <div className="d-flex flex-wrap mt-4">
            {values?.results.map(p =>(
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

export default Search