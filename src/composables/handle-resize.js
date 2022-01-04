/**
 * This function attaches a resize event listener to the window and uses a debouncing optimization to call the passed function after the last trigger of the event
 * 
 * @param { function(): any} functionToRun The function to run on the window resize event
 */
export function runOnResize(functionToRun) {
  let timeout

  window.addEventListener('resize', () => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      functionToRun()
    }, 250)
  })
}