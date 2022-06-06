import axios from './config'

const base = '/local/'

export const post = (url: string, data: object = {}) => {
  console.log(base + url, data, import.meta.env)
  return axios.post(base + url, data)
}
