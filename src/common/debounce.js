/*
 * @Author: Wushiqi
 * @Descripttion: 防抖函数
 * @Date: 2021-03-16 09:42:36
 * @LastEditor: Wushiqi
 * @LastEditTime: 2021-03-16 17:59:31
*/

/**
* 防抖函数
* @param func 用户传入的防抖函数
* @param wait 等待的时间
* @param immediate 是否立即执行
*/
export const debounce = function(func, wait = 50, immediate = false) {
  // 缓存一个定时器id
  let timer = null
  let result
  const debounced = function(...args) {
    // 如果已经设定过定时器了就清空上一次的定时器
    if (timer) {
      clearTimeout(timer)
    }
    if (immediate) {
      const callNow = !timer
      // 等待wait的时间间隔后，timer为null的时候，函数才可以继续执行
      timer = setTimeout(() => {
        timer = null
      }, wait)
      // 未执行过，执行
      if (callNow) result = func.apply(this, args)
    } else {
      // 开始一个定时器，延迟执行用户传入的方法
      timer = setTimeout(() => {
        // 将实际的this和参数传入用户实际调用的函数
        func.apply(this, args)
      }, wait)
    }
    return result
  }
  debounced.cancel = function() {
    clearTimeout(timer)
    timer = null
  }
  // 这里返回的函数时每次用户实际调用的防抖函数
  return debounced
}
