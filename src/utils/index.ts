
export * from './dom'

/**
 * 对 URL 中的参数进行解码校验
 */
export const checkURL = (query: string | (string | null)[] | undefined) =>
  typeof query === 'string' ? decodeURIComponent(query) : ''
