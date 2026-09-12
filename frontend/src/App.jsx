import { useState } from "react"
let decoder = new TextDecoder
function App(){
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  async function handleSend(){
    setAnswer("")
    const response = await fetch("http://127.0.0.1:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "question": question
      })
    })
    let reader = response.body.getReader()
    let result = await reader.read()
    while(!result.done){
      let text = decoder.decode(result.value)
      setAnswer(prevAns => prevAns + text)
      result = await reader.read()
    }
  }
  return(
    <div>
      <h1>Hello I am Binit's AI Assistant !</h1>
      <p>Ask me about Binit</p>
      <input 
      type="text" 
      value = {question}
      onChange={event=>setQuestion(event.target.value)}
      placeholder="Ask a question about Binit..."
      />
      <button onClick = {handleSend}>
        send
      </button>
      <p>You typed: {question}</p>
      <h2>{answer}</h2>
    </div>
  )
}
export default App