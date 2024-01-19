import React from 'react'
import { useState,useEffect,useContext} from 'react';
import { Box, styled,FormControl,InputBase, Button, TextareaAutosize } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useLocation,useNavigate } from 'react-router-dom';
import { DataContext } from '../../context/DataProvider';
import { API } from '../../service/api';

const Image=styled('img')({
    width:'100%',
    height:'50vh',
    objectFit:'cover'
})

const Container = styled(Box)(({theme})=>({
    margin:'50px 100px',
    [theme.breakpoints.down('md')]:{
        margin:0
    }
}))


const StyledFormControl=styled(FormControl)
`
    margin-top:10px;
    display:flex;
    flex-direction:row;
`
const InputTextField = styled(InputBase)
`
    flex:1;
    margin:0 30px;
    font-size:25px;
`
const Textarea =styled(TextareaAutosize)
`
    width:100%;
    margin-top:50px;
    font-size:18px;
    border:none;
    &:focus-visible{
        outline:none;
    }
`
const initialPost={

    title:"",
    description:"",
    picture:"",
    username:"",
    categories:"",
    createdDate:new Date()
}

const CreatePost = () => {

    const url='https://images.unsplash.com/photo-1543128639-4cb7e6eeef1b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bGFwdG9wJTIwc2V0dXB8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80';    

    // const url = 'Archery.jpg'
    const [post,setPost]=useState(initialPost);
    const [file,setFile]=useState(null);
    // we have used useLocation hook to get the data from url
    const location = useLocation();
    const navigate = useNavigate()

    const {account}=useContext(DataContext);

    const handleChange = (e) =>{
        setPost({...post,[e.target.name]:e.target.value})
    }
    
    const savePost = async () =>{
       let response = await API.createPost(post);
       console.log("created",response)
       if(response.isSccuess)
       {
        console.log("it is ")
         navigate('/');
       }
    }

    const handleFile  =  (e) =>{    
        console.log("e here",e)
        console.log("file is ",e.target.files) 
        const selectedFile = e.target.files[0];
        console.log("selected File is ",selectedFile);
        setFile(e.target.files[0])
    }
        // setFile(selectedFile);
    // }

    // const handleUploadFile = async () =>{

    //     if(!file)
    //     {
    //         return 
    //     }
    //     try{
    //         const formData = new FormData();
    //         formData.append('file',file)
    //         const response = await API.uploadFile(formData)
    //         const {data:{url}} = response;
    //         setPost((prevPost)=>({...prevPost,picture:url}))
    //     }catch(err){
    //         console.log("Error While Uploading File",err);
    //     }

    // }

    // useEffect(()=>{
    //     const getImage = async () =>{
    //         try{

    //             await handleUploadFile()

    //         }catch(error){
    //             console.log('Error in Uploading',error)
    //         }
    //     }
    //     getImage()
    // },[file])


    const getImage = async () =>{
        //  we check if the file is there or not 
        //  pass if file is available
        if(file){

            try{
                console.log(" useEffect file:-",file);
                const formData = new FormData();
                formData.append("name",file.name)
                formData.append("file",file);

               const response = await fetch("https://blogpost-backend-ga1j.onrender.com/file/upload",
                {
                    method:"POST",
                    body:formData
                })
                // console.log("response is ",response)
                post.picture = "https://blogpost-backend-ga1j.onrender.com/file/"+file.name;
                // let data = {
                //     name:file.name,
                //     file:file
                // }

                // API call
                // console.log("useEffect data",data);
                // let response = await API.uploadFile(data);
                // console.log("response is == ", response);
                // we will set the value of post.picture to the url which wil be providefd by mongodb
                // post.picture=response.data;
                console.log("picture:- ",post.picture);
                // console.log("Effect file ",file);
            }catch(error){
                console.log("error is ",error)
            }

        }
    }

    useEffect(()=>{
        console.log("useEffect called");
        // const getImage = async () =>{
        //     //  we check if the file is there or not 
        //     //  pass if file is available
        //     if(file){

        //         try{
        //             console.log(" useEffect file:-",file);
        //             const formData = new FormData();
        //             formData.append("name",file.name)
        //             formData.append("file",file);
        //             console.log("formData",formData);

        //             await fetch("http://localhost:8000/file/upload",
        //             {
        //                 method:"POST",
        //                 body:formData
        //             }).then((res)=>{
        //                 console.log("imageRes",res.json());
        //                 post.picture=res.data;
        //             })
        //             // let data = {
        //             //     name:file.name,
        //             //     file:file
        //             // }

        //             // API call
        //             // console.log("useEffect data",data);
        //             // let response = await API.uploadFile(data);
        //             // console.log("response is == ", response);
        //             // we will set the value of post.picture to the url which wil be providefd by mongodb
        //             // post.picture=response.data;
        //             console.log("picture:- ",post.picture);
        //             // console.log("Effect file ",file);
        //         }catch(error){
        //             console.log("error is ",error)
        //         }

        //     }
        // }
        getImage();
        // location.search gives everything after ? in url in the form of array
        // So we will split the received query string by =(equalTo) and  get the first value from the array which is our category
        post.categories=location.search?.split("=")[1] || "All";
        post.username=account.username;
        // console.log("Effect category ",post.categories);
        // console.log("Effect  username",post.username);
    },[file])


  return (
    <Container>
        <Image src={url} alt="create"/>
        <StyledFormControl>
            <label htmlFor="fileInput">
                <AddCircleIcon fontSize='large' color="action" style={{marginTop:"6px"}}/>
            </label>
            {/* e.target.files is used to get the selected file, since user may select mutiple file and we only want one file from user we will use files[0], i,e first file from an array of files */}
            {/* <input type="file" id="fileInput" style={{display:'none'}} onChange={(e)=>{setFile(e.target.files[0])}}/> */}
            <input type="file" id="fileInput" style={{display:'none'}} onChange={(e)=>{handleFile(e)}}/>
            <InputTextField  placeholder='Title' name="title" onChange={(e)=>{handleChange(e)}}/>
            <Button variant='contained' onClick={()=>{savePost()}}>Publish</Button>
        </StyledFormControl>
        <Textarea minRows={7} placeholder="Share your knowledge" name="description" onChange={(e)=>{handleChange(e)}}/>
    </Container>
  )
}

export default CreatePost;
