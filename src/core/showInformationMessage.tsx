import { tw } from 'twind'

let clearLastMessage = () => {}

export function showInformationMessage(text: string) {
  let cleared = false
  clearLastMessage()
  const message = document.createElement('div')
  message.className = tw`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none bg-black text-white text-4xl p-4`
  message.style.opacity = '1'
  message.style.zIndex = '999'
  message.style.transition = 'opacity 0.5s ease-in-out'
  message.innerText = text
  document.body.appendChild(message)
  const clear = () => {
    if (cleared) return
    cleared = true
    message.remove()
  }
  clearLastMessage = clear
  setTimeout(() => {
    message.style.opacity = '0'
    setTimeout(clear, 500)
  }, 1000)
}
