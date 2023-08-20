import { tw } from "twind"

export function showInformationMessage (text: string) {
  const message = document.createElement('div')
  message.className = tw`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none bg-black text-white text-xl p-4`
  message.style.opacity = '1'
  message.style.zIndex = '999'
  message.style.transition = 'opacity 0.5s ease-in-out'
  message.innerText = text
  document.body.appendChild(message)
  setTimeout(() => {
    message.style.opacity = '0'
    setTimeout(() => {
      document.body.removeChild(message)
    }, 500)
  }, 1000)
}