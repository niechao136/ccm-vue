import _ from 'lodash'

export const setDomFontSize = () => {
  const width = document.documentElement.clientWidth || document.body.clientWidth
  const fontsize = (width <= 1200 ? 1200 : width) / 100 + 'px';
  (document.getElementsByTagName('html')[0].style as any)['font-size'] = fontsize
}

const setDomFontSizeDebounce = _.debounce(setDomFontSize, 400)

window.addEventListener('resize', setDomFontSizeDebounce) // 浏览器加入收缩监听防抖，重新计算rem配置

export const scrollbarWidth = () => {
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
