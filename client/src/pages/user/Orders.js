import React, {useState, useEffect} from 'react'
import { Layout } from './../../components/layout/Layout';
import UserMenu from '../../components/layout/UserMenu';
import axios from 'axios'
import { useAuth } from '../../context/Auth';
import moment from 'moment'

const Orders = () => {

    const [order, setOrder] = useState([])
    const [auth] = useAuth()
    const getOrders = async () =>{
        try {
            const {data} = await axios.get('/api/v1/auth/orders')
            setOrder(data)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() =>{
        if(auth?.token) getOrders()
    }, [auth?.token])

  return (
    <Layout title={'Your Orders'}>
        <div className="container-flui m-3 p-3">
            <div className="row">
                <div className="col-md-3">
                    <UserMenu/>
                </div>
                <div className="col-md-9">
                    <h1> All Orders </h1>
                    {order?.map((o, i) => {
                        return(
                            <div className="border shadow">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <td scope='col'> # </td>
                                            <td scope='col'> Status </td>
                                            <td scope='col'> Buyer </td>
                                            <td scope='col'> Date </td>
                                            <td scope='col'> Payment </td>
                                            <td scope='col'> Quantity </td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th> {i + 1 } </th>
                                             <th> {o?.status } </th>
                                            <th> { o?.buyer.name } </th>
                                            <th> { moment(o?.createAt).fromNow() } </th>
                                            <th> {"Success"} </th>
                                            <th> { o?.products.length } </th>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="container">
                                {o?.products?.map(p =>(
                                    <div className="row mb-2 p-3 card flex-row">
                                    <div className="col-md-4">
                                        <img src={`/api/v1/products/product-photo/${p._id}`} className="card-img-top" alt={p.name}
                                        width="100px" height={"100px"} />
                                        </div>
                                        <div className="col-md-8">
                                        <p> {p.name} </p>
                                        <p> {p.description.substring(0,30)}... </p>
                                        <p> Price: ${p.price} </p>
                                    </div>
                                    </div>
                                ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    </Layout>
  )
}

export default Orders