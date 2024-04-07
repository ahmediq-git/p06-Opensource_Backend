import {fetchData} from '../api/retrieveData'

export async function loadData(){
    const response = await fetchData();
    if (!response){
        throw new Error("Not loaded")
    }
    return response
}