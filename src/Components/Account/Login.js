import React from 'react';
import { API } from '../../service/api';
// import Box from '@mui/material/Box';
import {Box,TextField,Button,styled,Typography} from '@mui/material';
import {useState ,useEffect} from 'react'
import { DataContext} from '../../context/DataProvider';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
// import { typography } from '@mui/system'

const Component = styled(Box)
`
    width:400px;
    margin:auto;
    box-shadow:5px 5px 5px 5px lightgrey;
`
// for html elements we use "quotes inside styled() function"
//  if we use html element inside styled() instead of material UI component then we have to use double parenthese with second parenthese containing a curly braces and styles values as shown below
const Image = styled('img')({
    width:100,
    margin:'auto',
    display:'flex',
    padding: '50 0 0'
})

const Wrapper = styled(Box)
`
    padding:25px 35px;
    display:flex;
    flex:1;
    flex-direction:column;
    & > div, & > button, & > p{
        margin-top:18px;
    }
`
const LoginButton = styled(Button)
`
    text-transform:none;
    border-radius:2px;
    background:#fb641b;
    color:#fff;
    height:48px
`
const SignUpButton = styled(Button)
`
    text-transform:none;
    border-radius:2px;
    background:lightgrey;
    color:#2874f0;
    height:48px;
    box-shadow:0 2px 4px 0;
`
const Error = styled(Typography)
`
    font-size:10px;
    color:#ff6161;
    line-height:0;
    margin-top:10px;
    font-weight:600;
`

const spanTag  = styled("span")
`
    margin:10px;
`

const Login = ({setIsUserAuthenticated}) => {

    const imageURL = 'https://www.sesta.it/wp-content/uploads/2021/03/logo-blog-sesta-trasparente.png';

    const signUpInitialValue ={
        name:'',
        username:'',
        password:''
    }
    const setLoginInitialvalue={
        username:"",
        password:""
    }

    const [account,toggleAccount]=useState('login');

    const [signup,setSignUp]=useState(signUpInitialValue);

    const[login,setLogin]=useState(setLoginInitialvalue);

    const[error,setError]=useState('');

    const {setAccount} = useContext(DataContext);

    const navigate=useNavigate();
    
    function toggleState(){
        account==='signup'?toggleAccount('login'):toggleAccount('signup');
        setLogin({username:"",password:""});
        setSignUp(signUpInitialValue);
    }
        


    function onInputChange(e){
        // spread operator is used to append the value to the current value instead of overriding the value
        setSignUp({...signup,[e.target.name]:e.target.value})
    }

    const onValueChange =(e) => {
        setLogin({...login,[e.target.name]:e.target.value});

    }

    const signUpUser = async () =>{

        if (signup.name == 0) {
            toast.error("Name cannot be empty");
            return;
        }
        if (signup.username == 0) {
            toast.error("Username cannot be empty !");
            return;
        }
        if (signup.password == 0) {
            toast.error("Password cannot be empty");
            return;
        }
        
        try {

            let response = await API.userSignUp(signup);
            setLogin({ username: "", password: "" });
            
            if (response.isSuccess) {

                setSignUp(signUpInitialValue);
                toast.success("signup successfull!")
                toggleAccount('login');
                setError('');
            }

        } catch (error) {
            toast.error("This username is already taken !")
            setError('Something Went Wrong ! Please try again later.');
        }

    }


    const loginUser = async () =>{

        if(login.username.length==0){
            toast.error("username cannot be empty !")
            return;
        }
        if(login.password.length==0){
            toast.error("password cannot be empty !")
            return;
        }
        try{

            let response = await API.userLogin(login);

            if(response.isSuccess)
            {

                setError("");
                sessionStorage.setItem('accessToken', ` Bearer ${response.data.accessToken} `);
                sessionStorage.setItem('refreshToken',` Bearer ${response.data.refreshToken} `);
                // We will store username and name  globally because we need to use them from different components of our application
                // we will use useContext for this (useContext hook)
                setAccount({username:response.data.username,name:response.data.name});
                setIsUserAuthenticated(true);
                navigate("/");
    
            }
        }catch(error){
            console.log("This is incorrect password")
            toast.error("Incorrect password!")
            setError("Something Went Wrong ! Please try Again");
        }

    }

    // const copyField = (fieldId) => {
    //         const Field = document.getElementById(fieldId);
    //         navigator.clipboard.writeText(Field.value);
    // }

  return (
    <Component>
        <Box>
            <Image src={imageURL} alt="login"  style={{marginTop:20}}/>
            {
            account==="login"?
                <Wrapper>
                    <TextField variant='standard' label="Enter Username" name="username" value={account==="login"?login.username:""} onChange={(e)=>onValueChange(e)} />
                    <TextField variant='standard' label="Enter Password" name="password" type ="password" value={account==="login"?login.password:""} onChange={(e)=>onValueChange(e)}/>
                    <LoginButton variant='contained' onClick={()=>loginUser()}>Login</LoginButton>
                    <Typography style={{textAlign:'center'}}>Or</Typography>
                    <SignUpButton onClick={()=>toggleState()} >Create an account</SignUpButton>
                    <span className='spanTag'>
                    <p>Demo user credentials</p>   
                    <p>userName: user1</p>
                    <p>password: 12345</p>
                    {/* <input type="text" value="user1" id="copyUserName" style={{marginTop:"35px",marginLeft:"15px",marginRight:"10px", }} readOnly/> */}
                    {/* <button type='button' onClick={() => copyField("copyUserName")}>copyUserName</button> */}
                    {/* <input type="text" value="12345" id="copyPassWord"  style={{margin:"15px"}} readOnly/> */}
                    {/* <button type='button' onClick={() => copyField("copyPassWord")}>copyPassword</button> */}
                    </span>
                </Wrapper>
            :
                <Wrapper>
                    <TextField variant='standard' label="Enter Name" name="name" value={account==="signup"?signup.name:""} onChange={(e)=>onInputChange(e)} />
                    <TextField variant='standard' label="Enter Username" name="username" value={account==="signup"?signup.username:""} onChange={(e)=>onInputChange(e)} />
                    <TextField variant='standard' label="Enter Password"  name="password" type ="password" value={account==="signup"?signup.password:""} onChange={(e)=>onInputChange(e)} />
                    <SignUpButton onClick={()=>{signUpUser()}}>SignUp</SignUpButton>
                    <Typography style={{textAlign:'center'}}>OR</Typography>
                    <LoginButton variant='contained' onClick={()=>toggleState()}>Already have an account</LoginButton>   
                </Wrapper>
            }
        </Box>
    </Component>
  )
}

export default Login
