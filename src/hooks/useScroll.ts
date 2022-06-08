import _ from 'lodash'

export const useScroll = () => {

  const scrollbarWidth = () => {
    const outer = document.createElement('div')
    outer.style.visibility = 'hidden'
    outer.style.width = '100px'
    outer.style.position = 'absolute'
    outer.style.top = '-9999px'
    document.body.appendChild(outer)

    const widthNoScroll = outer.offsetWidth
    outer.style.overflow = 'scroll'

    const inner = document.createElement('div')
    inner.style.width = '100%'
    outer.appendChild(inner)

    const widthWithScroll = inner.offsetWidth
    outer.remove()
    return widthNoScroll - widthWithScroll
  }

  const pxToRem = (px: number) => _.round(px / 19.2, 10)

  const gutter = scrollbarWidth()

  interface StyleOption {
    min?: boolean
    top?: number
    width?: number
  }

  const buildStyle = (opts: StyleOption = {}) => {
    const height = opts.top ? `100vh - ${pxToRem(opts.top)}rem` : '100vh'
    const width = opts.width ? `${pxToRem(opts.width)}rem` : '100%'
    let style = `height: calc(${height} + ${gutter}px);width:calc(${width} + ${gutter}px);`
    if (opts.min) {
      const min_height = opts.top ? `600px - ${pxToRem(opts.top)}rem` : '600px'
      style += `min-height: calc(${min_height} + ${gutter}px);`
    }
    return style
  }

  return {
    buildStyle
  }
}
