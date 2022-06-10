import { MessageBox } from 'element-ui'
import { ElMessageBoxComponent, MessageBoxCloseAction } from 'element-ui/types/message-box'
import { h } from '@vue/composition-api'
import { SvgIcon } from '@/components'

export const useDialog = () => {
  interface DialogOption {
    message?: string
    title?: string
    icon?: string
    confirm?: string
    cancel?: string
    close?: boolean
    class?: string
    beforeClose?: (action: MessageBoxCloseAction, instance: ElMessageBoxComponent, done: (() => void)) => void
    callback?: (action: MessageBoxCloseAction, instance: ElMessageBoxComponent) => void
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
      customClass: `tipConfirm ${opts.class ?? ''}`,
      showClose: opts.close ?? false,
      showCancelButton: opts.cancel !== undefined,
      closeOnClickModal: opts.close ?? false,
      closeOnPressEscape: opts.close ?? false,
      confirmButtonText: opts.confirm ?? '確定',
      cancelButtonText: opts.cancel ?? '取消',
      beforeClose: opts.beforeClose,
      callback: opts.callback
    })
  }

  return {
    confirm
  }
}
