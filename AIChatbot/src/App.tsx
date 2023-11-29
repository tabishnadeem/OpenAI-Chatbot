import { useState } from 'react'

import './App.css'
import InputContainer from './components/InputContainer'
import ChatContainer from './components/ChatContainer'

function App() {


  const [message, setMessage] = useState("")

  const getInputMessage = (data:string)=>{
    setMessage(data);
  }
  return (
    <>
    <div className='pb-5 text-center flex flex-col gap-2 h-screen'>
      <ChatContainer payload = {message}/>
      <InputContainer sendInputMessage={getInputMessage}/>
    </div>
    </>
  )
}

export default App
