import axios from 'axios'

export const fetchUser = () => {

    return async function(dispatch){
        const res = await axios.get('/api/allData')
        dispatch({type: 'FETCH_USER',payload:res.data})
    }

}

export const addUser = (data,next) => {

    return async function(dispatch){
        const res = await axios.post('/api/userData',data)
        next(res)
        dispatch({type: 'ADD_USER',payload:res.data})
    }

}

export const editUser = (data,next) => {

    return async function(dispatch){
        const res = await axios.put('/api/userData',data)
        next(res)
        dispatch({type: 'EDIT_USER',payload:res.data})
    }

}

export const deleteUser = (data,next) => {

    return async function(dispatch){
        const res = await axios.delete('/api/userData?userID='+data)
        next(res)
        dispatch({type: 'DELETE_USER',payload:res.data})
    }

}