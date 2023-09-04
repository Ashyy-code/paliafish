import { createStore } from "vuex";
export default createStore({
    state(){
        return{
            fishes:null,
            fishesFiltered:null,
            searchTerm:null,
        }
    }
})