import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import store from './store/store.js'
import { Provider } from 'react-redux'
import { BrowserRouter, Routes, Route } from "react-router";
import Header from './components/Header/Header.jsx'


// ROUTES IMPORTS
import HomePage from './pages/HomePage.jsx'
import VideoPage from './pages/VideoPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import LikedVideos from './pages/LikedVideos.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path='' element= {<App />} >
            <Route path='/' element= {<HomePage />} />
            <Route path='/video/:videoId' element= {<VideoPage />} />
            <Route path='/liked-videos' element= {<LikedVideos/>} />
          </Route>
          <Route path='/signup'element={<SignupPage />} ></Route>
          <Route path='/login'element={<LoginPage />} ></Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
