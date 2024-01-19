// import logo from './logo.svg';
import { BrowserRouter, Routes, Route, Navigate, Outlet} from "react-router-dom"
import './App.css';
import {useState} from "react";
import Login from './Components/Account/Login'
import DataProvider from './context/DataProvider';
import Home from './Components/Home/Home.js'
import Header from "./Components/Header/Header";
import About from "./Components/About/About";
import Contact from "./Components/Contact/Contact";
import CreatePost from "./Components/Create/CreatePost";
import DetailView from "./Components/Details/DetailView";
import Update from "./Components/Create/Update";

const PrivateRoute = ({isAuthenticated,...props}) =>{
  return  isAuthenticated?
  <>
    <Header/>
    <Outlet/>
  </>
  :
  <Navigate replace to ="/login"/>

}


function App() {

  const [isAuthenticated,setIsUserAuthenticated]=useState(false);
 {/* In react there are two ways to pass data the first is as a props and seconds using children as shown below  */}  
  return (

    <DataProvider>
      <BrowserRouter>
        <div style={{marginTop:60}}>
          <Routes>
            <Route path="/login" element={<Login setIsUserAuthenticated={setIsUserAuthenticated}/>}/>
            <Route path="/" element={<PrivateRoute isAuthenticated={isAuthenticated}/>}>
              <Route path="/" element={<Home/>} />
            </Route>
            <Route path="/create" element={<PrivateRoute isAuthenticated={isAuthenticated}/>}>
              <Route path="/create" element={<CreatePost/>} />
            </Route>
            <Route path="/details/:id" element={<PrivateRoute isAuthenticated={isAuthenticated}/>}>
              <Route path="/details/:id" element={<DetailView/>} />
            </Route>
            <Route path="/update/:id" element={<PrivateRoute isAuthenticated={isAuthenticated}/>}>
              <Route path="/update/:id" element={<Update/>} />
            </Route>
            <Route path="/about" element={<PrivateRoute isAuthenticated={isAuthenticated}/>}>
              <Route path="/about" element={<About/>} />
            </Route>
            <Route path="/contact" element={<PrivateRoute isAuthenticated={isAuthenticated}/>}>
              <Route path="/contact" element={<Contact/>} />
            </Route>
          </Routes> 
        </div>
      </BrowserRouter>
    </DataProvider>
      
  );
}

export default App;
