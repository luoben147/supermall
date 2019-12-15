/**
 * 函数防抖是指对于在事件被触发n秒后再执行的回调，如果在这n秒内又重新被触发，则重新开始计时
 * 防止函数过于频繁的不必要的调用
 */
export function debounce(func,delay){
  let timer=null;
  return function (...args) {
    if(timer) clearTimeout(timer)
    timer=setTimeout(()=>{
      func.apply(this,args)
    },delay)
  }
}
