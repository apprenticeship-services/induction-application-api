import axios from 'axios'
// http://localhost:4000",
// https://apprenticeship-services-648bb8bb0723.herokuapp.com/
console.log(process.env.NODE_ENV)
const loc = window.location
export default axios.create({
  baseURL: `${loc.protocol}//${loc.hostname}${process.env.NODE_ENV === 'production' ? '' : ':4000'}`,
  withCredentials: true
})
