import { useState,useEffect } from "react";
import {API} from '../../../service/api.js'
import { Box, Grid} from "@mui/material";
import Post from "./Post.js";
import {useSearchParams,Link} from 'react-router-dom'


const Posts = () =>{

    // we need to store all the post from the database
    const [posts,setPosts]=useState([]);

    const[searchParams]=useSearchParams();
    const category=searchParams.get('category');

    useEffect(()=>{
        const fetchData = async() =>{
            console.log("category",category)
            let response = await API.getAllPosts({category:category || ''});
            if(response.isSuccess)
            {
                console.log("response ",response.data)
                setPosts(response.data);
            }
        }
        fetchData();
    },[category])

    return(
        <>
        <Grid container spacing={1}>
            {
                posts && posts.length > 0 ? posts.map(post => (
                    <Grid item lg={3} sm={4} xs={12}>
                        <Link to={`details/${post._id}`} style={{textDecoration:"none",color:"inherit"}}>
                            <Post post={post}/>
                        </Link>
                    </Grid>
                )) : <Box style={{color:'#878787',margin:'50px 80px',fontSize:18,fontWeight:"bold"}}>No data Available to display</Box>
            }
        </Grid>
        </>
    )
}

export default Posts;