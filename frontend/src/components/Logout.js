import coockie from 'react-cookies'
import { useNavigate } from "react-router-dom"

const Logout = () => {
  const navigate = useNavigate()
  const onClickLogout = () => {
    console.log("LOGOUT")
    coockie.remove('user')
    navigate('/')
  }
  return (
    <div className="absolute bottom-full left-0 z-20 mb-2 w-full overflow-hidden rounded-md bg-gray-950 pb-1.5 pt-1 outline-none opacity-100 translate-y-0" aria-labelledby="headlessui-menu-button-:r3v:" id="headlessui-menu-items-:r4e:" role="menu" tabindex="0" data-headlessui-state="open"><nav role="none">

      <button onClick={onClickLogout} as="button" style={{ fontFamily: "Inter", fontWeight: "700" }} className="flex w-full p-3 items-center gap-3 transition-colors duration-200 text-white cursor-pointer text-sm hover:bg-gray-700" id="headlessui-menu-item-:r4i:" role="menuitem" tabindex="-1" data-headlessui-state=""><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" className="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4">
        </path><polyline points="16 17 21 12 16 7">
        </polyline><line x1="21" y1="12" x2="9" y2="12">
        </line></svg>Log out</button></nav></div>
  )
}

export default Logout