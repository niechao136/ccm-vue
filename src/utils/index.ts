
export * from './dom'

export const copyObject = (target: any, value: any) => {
  Object.keys(value).forEach((key: string) => {
    target[key] = value[key]
  })
}
