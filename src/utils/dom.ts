import _ from 'lodash'

export const setDomFontSize = () => {
  const width = document.documentElement.clientWidth || document.body.clientWidth
  ;(document.getElementsByTagName('html')[0].style as any)['font-size'] = (width <= 1200 ? 1200 : width) / 100 + 'px'
}

const setDomFontSizeDebounce = _.debounce(setDomFontSize, 400)

window.addEventListener('resize', setDomFontSizeDebounce) // 浏览器加入收缩监听防抖，重新计算rem配置
