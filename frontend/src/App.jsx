import { useState } from 'react'
import uniLogo from './assets/logo.png'
import moodleLogo from './assets/moodle.jpeg'
/* import apicommsServices from './services/apicomms' */
/* import Component_name from './components/component_name' */
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://www.jyu.fi/fi" target="_blank">
          <img src={uniLogo} className="logo" alt="jyu logo" />
        </a>
        <a href="https://moodle.jyu.fi" target="_blank">
          <img src={moodleLogo} className="logo moodle" alt="Moodle logo" />
        </a>
      </div>
      <h1>This is a template for the project</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Code for webpage is in <code>src/App.jsx</code>.
        </p>
        <p>
          Code for API communication should be in<code>src/services/apicomms.js</code>.
        </p>
        <p>
          Code for handling fetched data should be in <code>src/components/component_name.jsx</code>.
        </p>
      </div>
    </>
  )
}

export default App
