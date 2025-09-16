import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'


function App() {
 const [message, setmessage] = useState();

 useEffect(() => {
   fetch('/api/hello')
     .then(response => response.json())
     .then(data => setmessage(data.message));
 },[]);

 return (
   <div className="App flex flex-col items-center justify-center min-h-screen bg-background">
     <p className = "font-bold p-5 text-3xl">{message || 'Loading message...'}</p>
     <Button >Click Me</Button>
   </div>
 );

}

export default App
