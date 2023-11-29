import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Spinner = ({path="login"}) => {

    const [count, setCount] = useState(5)
    const navigate = useNavigate()

    useEffect(()=>{
        const interval = setInterval(()=>{
            setCount((prevalue)=> --prevalue)
        }, 1000)
        count===0 && navigate(`/${path}`)
        return ()=> clearInterval(interval)
    },[count, navigate])

  return (
    <>
        <div>
            <div className="d-flex flex-column justify-content-center align-items-center" style={{height: '100vh'}}>
            <h1 className="Text-center"> Redirecting to you in {count} Seconds </h1>
            <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    </div>

    </>
  )
}

export default Spinner