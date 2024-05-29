import axios from 'axios'
// http://localhost:4000",
// https://apprenticeship-services-648bb8bb0723.herokuapp.com/
export default axios.create({
  baseURL: 'http://localhost:4000',
  withCredentials: true
})
