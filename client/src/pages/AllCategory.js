import React from 'react'
import { Layout } from '../components/layout/Layout'
import useCategory from '../hooks/useCategory'
import { Link } from 'react-router-dom'

const AllCategory = () => {

    const category = useCategory()

  return (
    <Layout title={"All Categories"}>
      <div className="container" style={{ marginTop: "100px" }}>
        <div className="row container">
          {category.map((c) => (
            <div className="col-md-4 mt-5 mb-3 gx-3 gy-3" key={c._id}>
              <div className="card">
              <Link to={`/category/${c.slug}`} className='btn btn-primary'>
                    {c.name}
               </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export default AllCategory