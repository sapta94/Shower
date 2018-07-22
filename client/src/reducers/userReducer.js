export default function (state=null,action) {
    //console.log(action)
    switch(action.type){
        case 'FETCH_USER':
            console.log(action.payload)
            return action.payload.data||false
        default :
            return state
    }
}