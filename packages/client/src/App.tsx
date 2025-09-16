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
     <h1>{message || 'Loading message...'}</h1>
   </div>
 );

}

export default App
