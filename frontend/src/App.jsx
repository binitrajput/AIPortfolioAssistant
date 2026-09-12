import { useState } from "react"
import "./App.css"

function App(){
  const [question, setQuestion] = useState("")
  // const [answer, setAnswer] = useState("")
  const [messages, setMessages] = useState([])
  async function handleSend(){
    setMessages(prevMessages => [
      ...prevMessages,
      {
        "role": "user",
        "content": question
      }
    ])
    setMessages(prevMessages => [
      ...prevMessages,
      {
        "role": "assistant",
        "content": ""
      }
    ])
    const response = await fetch("http://127.0.0.1:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "question": question
      })
    })
    let decoder = new TextDecoder()
    let reader = response.body.getReader()
    let result = await reader.read()
    while(!result.done){
      let text = decoder.decode(result.value)
      setMessages (prevMessages =>
        prevMessages.map((message, index)=>{
        if(index ==prevMessages.length - 1){
          return {...message, content: message.content + text}
        }
        return message
      })
      )
      
      result = await reader.read()
    }
  }
  return(
    <div className="app">

      <div className="header">
        <h1>Hello I am Binit's AI Assistant !</h1>
        <p>Ask me about Binit</p>
      </div>
      

      <div className="chat-area">
        {messages.map((message, index)=>
          <div 
          key={index}
          className={ message.role ==="user"? "user-message": "assistant-message"}
          >
            <p>{message.content}</p>
          </div>
        )}
      </div>
      
      <div className="input-area">
        <input 
        type="text" 
        value = {question}
        onChange={event=>setQuestion(event.target.value)}
        placeholder="Ask a question about Binit..."
        />
        <button onClick = {handleSend}>
          send
        </button>
      </div>
      
    </div>
  )
}
export default App