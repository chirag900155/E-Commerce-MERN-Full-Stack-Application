import { useState, useEffect } from 'react'
import axios from 'axios'

export default function useCategory() {
    const [category, setCategory] = useState([])

    // get category
    const getCategory = async ()=>{
        try {
            const {data} = await axios.get('/api/v1/category/get-category')
            setCategory(data?.category)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() =>{
        getCategory()
    }, [])

    return category
}