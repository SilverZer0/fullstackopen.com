import axios from 'axios'
const baseUrl = '/api/persons'

let notify = () => { }
const setNotificationHandler = (handler) => {
  notify = handler
}

const responseHandler = (request, messages) => {
  return request
    .then(response => {
      notify(messages.success, false)
      return response.data
    })
    .catch(error => {
      notify(error.response.data.error || messages.error, true)
      if(error.response.status === 400){
        return false
      }
      return null
    })
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return responseHandler(request, {
    success: "Loaded Phonebook from server",
    error: "Failed to load Phonebook from server"
  })
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return responseHandler(request, {
    success: `Added ${newObject.name}`,
    error: `Failed to add ${newObject.name}`
  })
}

const remove = (id, name) => {
  const request = axios.delete(`${baseUrl}/${id}`)
  return responseHandler(request, {
    success: `Deleted ${name}`,
    error: `${name} was already deleted from server`
  })
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return responseHandler(request, {
    success: `Replaced number of ${newObject.name}`,
    error: `${newObject.name} was already deleted from server`
  })
}

export default {
  setNotificationHandler, getAll, create, remove, update
}