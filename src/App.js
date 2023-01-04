import { useState } from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import rocket from './rocket.png';

function App() {
  return (
    <div className="App">
        <Router>
          <Routes>
            <Route path="/create" element={<Create />} />
            <Route path="*" element={<Redirect />} />
          </Routes>
        </Router>
      </div>
  );
}

const Redirect = () => {
  const currentURL = window.location.href.split('/');
  
  const redirectTo = (id) => {
    fetch('https://minilink-omega.vercel.app/api/tags/' + id, {
      method: 'GET',
      headers: {"Content-Type": "application/json"},
    })
    .then(res => res.json())
    .then(data => {
      if(data.length === 0){
        alert('This URL does not exist');
        window.location.href = '/create';
      }
      window.location.href = data[0].url;
    })
  }

  console.log(currentURL)
  if(currentURL[3] === ''){
    window.location.href = '/create';
  }
  else{
    redirectTo(currentURL[3]);
  }

  return  (
    <div className="redirect">
      <div className="background"></div>
      <div className="container" style={{display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center'}}>
        <h2>Redirecting...</h2>
        <img src={rocket} alt="rocket" width='100px'/>
      </div>
    </div>
  )
}

const Create = () => {
  const [url, setUrl] = useState('');
  const [tag, setTag] = useState('');

  const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');  

  const generateId = () => {
    let id = '';
    for(let i = 0; i < 5; i++){
      id += letters[Math.floor(Math.random() * letters.length)];
    }
    return id;
  }

  const [created, setCreated] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const tag = generateId();
    setTag(tag);
    const urlObject = {url, tag};

    fetch('https://minilink-omega.vercel.app/api/create', {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(urlObject)
    })
    .then(res => res.json())
    .then(() => {setCreated(true)})
  }

  return (
    <div className="create">
      <div className="background"></div>
      <div className="container">
        <h2>Create a new URL</h2>
        <form onSubmit={handleSubmit}>
          <label>URL</label>
          <input type="text" required value={url} onChange={(e) => setUrl(e.target.value)} />
          <button>Create</button>
        </form>
      </div>

      {created && <p>URL created! Your new URL is: <a href={'http://localhost:3000/' + tag}>{'http://localhost:3000/' + tag}</a></p>}
    </div>
  );
}

export default App;
