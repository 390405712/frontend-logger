import axios from 'axios'

function getDate() {
  const date = new Date().toLocaleString('chinese', {
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  return date
}

function getComPath(vm, str = '') {
  if (vm.$parent.$parent === undefined) return str
  return getComPath(vm.$parent, `${vm.$options.name}/${str}`)
}

function underline2Hump(s) {
  return s.replace(/-(\w)/g, (all, letter) => letter.toUpperCase())
}

export default {
  install: (Vue, ops = {}) => {
    if (!ops.project) return console.error('frontend-logger缺少配置：project')
    if (!ops.url) return console.error('frontend-logger缺少配置：url')
    Vue.config.errorHandler = function (err, vm, info) {
      const params = {
        err: String(err),
        vm: getComPath(vm),
        info,
        date: getDate(),
      }
      axios.post(`${ops.url}error/add/${underline2Hump(ops.project)}`, params)
      console.table(params)
    }

    Vue.config.warnHandler = function (msg, vm, trace) {
      const params = {
        msg,
        vm: getComPath(vm),
        trace,
        date: getDate(),
      }
      axios.post(`${ops.url}warn/add/${underline2Hump(ops.project)}`, params)
      console.table(params)
    }
  },
}
