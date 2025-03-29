import axios from 'axios'
const baseUrl = '/api/blogs'

let config = null

const setToken = newToken => {
  config = {
    headers: { Authorization: `Bearer ${newToken}` },
  }
}

const getAll = async () => {
  return (await axios.get(baseUrl)).data
}

const create = async newObject => {
  return (await axios.post(baseUrl, newObject, config)).data
}

const update = async (id, newObject) => {
  return (await axios.put(`${baseUrl}/${id}`, newObject, config)).data
}

const remove = async id => {
  return (await axios.delete(`${baseUrl}/${id}`, config)).data
}

export default { getAll, create, update, remove, setToken }