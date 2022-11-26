import axios from "axios";
const baseUrl = '/api/persons'
/* 
baseUrl must be reset to http://localhost:3001/api/persons
after the whole build and copy into backend root thingy in order for this
frontend to work normally again in development and vice versa if gonna redo the build and copy again
*/
const getAll = () => {
    return axios.get(baseUrl)
}

const create = newObject => {
    return axios.post(baseUrl, newObject)
}

const update = (id, newObject) => {
    return axios.put(`${baseUrl}/${id}`, newObject)
}

const deleteOne = id => {
    return axios.delete(`${baseUrl}/${id}`)
}

const exportedObject = { getAll, create, update, deleteOne }

export default exportedObject