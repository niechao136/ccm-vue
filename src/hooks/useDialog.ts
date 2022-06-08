import { MessageBox } from 'element-ui'
import { h } from '@vue/composition-api'
import { SvgIcon } from '@/components'

export const useDialog = () => {
  interface DialogOption {
    message?: string
    title?: string
    icon?: string
  }

  const buildMessage = (opts: DialogOption) => h('div', { staticClass: 'dialog-content' }, [
    h(SvgIcon, { props: { name: opts.icon ?? 'warning' } }),
    h('div', { staticClass: 'dialog-text' }, opts.message ?? '')
  ])

  const confirm = (opts: DialogOption) => {
    MessageBox({
      message: buildMessage(opts),
      title: opts.title ?? '',
      iconClass: '',
      customClass: 'tipConfirm',
      showClose: false,
      showCancelButton: false,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      confirmButtonText: ''
    })
  }

  return {
    confirm
  }
}
