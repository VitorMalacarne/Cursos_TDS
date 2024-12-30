import './css/App.css';
import './css/Props.css';
import './css/Icons.css';

import Header from './views/Header';
import SideBar from './views/SideBar';
import Navbar from './components/Navbar';
import { useDebugValue, useEffect, useState } from 'react';
import Navbar2 from './components/Navbar2';


function App() {

  const current_theme = localStorage.getItem("current_theme");
  const [theme, setTheme] = useState(current_theme ? current_theme : "light");

  useEffect(() => {
    localStorage.setItem("current_theme", theme)
  }, [theme]);

  return (
    <div className={`container ${theme}`}>
      <div>
        {/* <Navbar theme={theme} setTheme={setTheme}/> */}
        <Navbar2 theme={theme} setTheme={setTheme}/>
      </div>
      {/* <Header /> */}
      {/* <SideBar /> */}
    </div>
  );
}

export default App;
