import axios, { AxiosRequestConfig, AxiosInstance } from 'axios'

const config: AxiosRequestConfig = {
  timeout: 300 * 1000,
  //baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  }
  //transformRequest: [
  //  data => {
  //    const param = new URLSearchParams()
  //    const handle = data !== undefined && Object.prototype.toString.call(data) !== '[object FormData]'
  //    if (handle) {
  //      Object.keys(data).forEach(key => {
  //        if (data[key] !== undefined) {
  //          param.append(key, typeof data[key] === 'string'
  //            ? data[key]
  //            : JSON.stringify(data[key])
  //          )
  //        }
  //      })
  //    }
  //    console.log(param, data, handle)
  //    return handle ? param : data
  //  }
  //]
}

const _axios: AxiosInstance = axios.create(config)

_axios.interceptors.request.use(
  request => {
    //console.log(request)
    return request
  },
  error => Promise.reject(error)
)

_axios.interceptors.response.use(
  response => {
    //console.log(response)
    return response.data
  },
  error => Promise.reject(error)
)

export default _axios
