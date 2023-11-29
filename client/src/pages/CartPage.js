import React, {useState, useEffect} from 'react'
import { Layout } from '../components/layout/Layout'
import { useAuth } from '../context/Auth'
import { useCart } from '../context/CartProvider'
import { useNavigate } from 'react-router-dom';
import DropIn from "braintree-web-drop-in-react"
import axios from 'axios'
import { toast } from 'react-hot-toast';
import '../styles/CartStyles.css'

const CartPage = () => {

    const [clientToken, setClientToken] = useState("")
    const [auth] = useAuth()
    const [cart, setCart] = useCart()
    const [instance, setInstance] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const removeCartItem = (pid)=>{
        try {
            let myCart = [...cart]
            let index = myCart.findIndex(item => item._id === pid)
            myCart.splice(index, 1)
            setCart(myCart)
            localStorage.setItem('cart', JSON.stringify(myCart))
        } catch (error) {
            console.log(error);
        }
    }

    // Total Price
    const totalPrice = () =>{
        try {
            let total = 0
            cart?.map((item) => {
                total = total + item.price
            })
            return total.toLocaleString("en-us", {
                style: 'currency',
                currency: "USD",
            })
        } catch (error) {
            console.log(error);
        }
    }

    //Get Payment Gateway Token
    const getToken = async ()=>{
        try {
            const {data} = await axios.get('/api/v1/products/braintree/token')
            setClientToken(data?.clientToken)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() =>{
        getToken()
    },[auth?.token])

    const handlePayment = async ()=>{
        try {
            setLoading(true)
            const {nonce} = await instance.requestPaymentMethod()
            const {data} = await axios.post('/api/v1/products/braintree/payment', {nonce, cart})
            setLoading(false)
            localStorage.removeItem('cart')
            setCart([])
            toast.success('Payment completed succesfully')
            navigate('/dashboard/user/orders')
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong while payment')
        }
    }

  return (
    <Layout>
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <h1 className="text-center bg-light p-2 mb-1">
                        {`Hello ${auth?.token &&  auth?.user?.name}`}
                    </h1>
                    <h4 className="text-center">
                        { cart?.length ? 
                        `You have ${cart.length} items in yours cart ${auth?.token ? "" : "Please login to checkout"}` : 
                        `Your Cart is empty` }
                    </h4>
                </div>
            </div>

            <div className="row">
                <div className="col-md-8">
                    {cart?.map(p =>(
                        <div className="row mb-2 p-3 card flex-row">
                            <div className="col-md-4">
                            <img src={`/api/v1/products/product-photo/${p._id}`} className="card-img-top" alt={p.name}
                            width="100px" height={"100px"} />
                            </div>
                            <div className="col-md-8">
                                <p> {p.name} </p>
                                <p> {p.description.substring(0,30)}... </p>
                                <p> Price: ${p.price} </p>
                                <button className='btn btn-danger' onClick={()=> removeCartItem(p._id)}> Remove </button>
                            </div>
                        </div>
                    ))} 
                </div>
                <div className="col-md-4 text-center">
                    <h2> Cart Summary </h2>
                    <p> Total | CheckOut | Payment </p>
                    <hr/>
                    <h4> Total: {totalPrice()} </h4>
                    { auth?.user?.address ? (
                        <div className="mb-3">
                            <h4> Current Address </h4>
                            <h5> { auth?.user?.address } </h5>
                            <button className='btn btn-outline-warning' onClick={() => navigate('/dashboard/user/profile')}>
                                Update Address
                            </button>
                        </div>
                    ) : (
                        <div className="mb-3">
                            { auth?.token ? (
                                <button className='btn btn-outline-warning' onClick={() => navigate('/dashboard/user/profile')}>
                                    Update Address
                                </button>
                            ) : (
                                <button className='btn btn-outline-warning' onClick={() => navigate('/login') }>
                                    Please Login to Checkout
                                </button>
                            )}
                        </div>
                    )}

                <div className="mt-2">
                    {!clientToken || !auth?.token || !cart?.length ? (
                    ""
                    ) : (
                    <>
                        <DropIn
                        options={{
                            authorization: clientToken,
                            paypal: {
                                flow: 'vault',
                              },
                        }}
                        onInstance={(instance) => setInstance(instance)}
                        />

                        <button
                        className="btn btn-primary"
                        onClick={handlePayment}
                        disabled={loading || !instance || !auth?.user?.address}
                        >
                        {loading ? "Processing ...." : "Make Payment"}
                        </button>
                    </>
                    )}

                    <p> This is sample card number if your not working </p>
                    <p> 378282246310005 </p>
                    <p> 6304000000000000 </p>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
  )
}

export default CartPage