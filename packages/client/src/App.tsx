import { useState, useEffect } from 'react'



function App() {
 const [message, setmessage] = useState();

 useEffect(() => {
   fetch('/api/hello')
     .then(response => response.json())
     .then(data => setmessage(data.message));
 },[]);

 return (
   <div>
     <p className = "font-bold p-5 text-3xl">{message || 'Loading message...'}</p>
   </div>
 );

}

export default App
