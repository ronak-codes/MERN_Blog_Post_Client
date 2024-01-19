import React from 'react'
import { useState,useEffect,useContext} from 'react';
import { Box, styled,FormControl,InputBase, Button, TextareaAutosize } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useLocation,useNavigate,useParams } from 'react-router-dom';
import { DataContext } from '../../context/DataProvider';
import { API } from '../../service/api';


const Container = styled(Box)(({ theme }) => ({
    margin: '50px 100px',
    [theme.breakpoints.down('md')]: {
        margin: 0
    },
}));

const Image=styled('img')({
    width:'100%',
    height:'50vh',
    objectFit:'cover'
})

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

const Update = () => {

    const url='https://images.unsplash.com/photo-1543128639-4cb7e6eeef1b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bGFwdG9wJTIwc2V0dXB8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80';    
    const [post,setPost]=useState(initialPost);
    const [file,setFile]=useState('');
    // we have used useLocation hook to get the data from url
    const location=useLocation();
    const navigate = useNavigate()

    const {id}= useParams();

    const {account}=useContext(DataContext);

    const handleChange = (e) =>{
        setPost({...post,[e.target.name]:e.target.value})
    }
    
    const updateBlogPost = async () =>{
        console.log("update")
       let response = await API.updatePost(post);
       if(response.isSuccess)
       {
         navigate(`/details/${id}`);
       }
    }

    const handleFile  =  (e) =>{     
        // const selectedFile = e.target.files[0];
        // console.log("selected File is ",selectedFile);
        setFile(e.target.files[0])
    }

    useEffect(()=>{
      const fetchData = async () =>{
        let response = await API.getPostById(id);
        if(response.isSuccess)
        {
            setPost(response.data);
        }
      }
      fetchData();
    },[])

    
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

                post.picture = "https://blogpost-backend-ga1j.onrender.com/file/"+file.name;

            }catch(error){
                console.log("error is ",error)
            }

        }
    }

    useEffect(()=>{
        getImage();
        // location.search gives everything after ? in url in the form of array
        // So we will split the received query string by =(equalTo) and  get the first value from the array which is our category
        post.categories=location.search?.split("=")[1] || "All";
        post.username=account.username;
    },[file])


  return (
    <Container>
        <Image src={url} alt="create"/>
        <StyledFormControl>
            <label htmlFor="fileInput">
                <AddCircleIcon fontSize='large' color="action" style={{marginTop:"6px"}}/>
            </label>
            {/* e.target.files is used to get the selected file, since user may select mutiple file and we only want one file from user we will use files[0], i,e first file from an array of files */}
            <input type="file" id="fileInput" style={{display:'none'}} onChange={(e)=>{handleFile(e)}}/>
            <InputTextField  placeholder='Title' name="title" onChange={(e)=>{handleChange(e)}} value={post.title} />
            <Button variant='contained' onClick={()=>{updateBlogPost()}}>Update</Button>
        </StyledFormControl>
        <Textarea minRows={7} placeholder="Share your knowledge" name="description" onChange={(e)=>{handleChange(e)}} value={post.description} autoFocus/>
    </Container>
    // <div>CreatePost</div>
  )
}

export default Update;
