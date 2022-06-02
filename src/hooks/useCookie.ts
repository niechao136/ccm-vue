import Cookies from 'js-cookie'

export const useCookie = () => {
  const TOKEN = 'CCM_TOKEN'

  const setToken = (token: string, expires: number = 1) => {
    Cookies.set(TOKEN, token, { expires })
  }

  const getToken = () => Cookies.get(TOKEN) ?? ''

  const clearToken = () => Cookies.remove(TOKEN)

  return {
    clearToken,
    getToken,
    setToken
  }
}
