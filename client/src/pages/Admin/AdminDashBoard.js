import React from 'react'
import { Layout } from '../../components/layout/Layout'
import AdminMenu from '../../components/layout/AdminMenu'
import { useAuth } from '../../context/Auth'

const AdminDashBoard = () => {
  const [auth] = useAuth()
  return (
    <Layout title={'DashBoard - Admin Details'}>
        <div className="container-fluid m-3 p-3">
          <div className="row">
            <div className="col-md-3">
              <AdminMenu/>
            </div>
            <div className="col-md-9">
              <div className="card w-75 p-3">
                <h3> Admin Name: {auth?.user?.name} </h3>
                <h3> Admin E-Mail: {auth?.user?.email} </h3>
                <h3> Admin Phone Number: {auth?.user?.phone} </h3>
              </div>
            </div>
          </div>
        </div>
    </Layout>
  )
}

export default AdminDashBoard