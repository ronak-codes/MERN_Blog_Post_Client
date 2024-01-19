import { Box,Typography,styled} from "@mui/material"
import { borderRadius } from "@mui/system"
import { addElipses } from "../../../utils/common-utils"


const Container = styled(Box)
`
    border:3px solid #d3cede;
    border-radius:10px;
    // margin:10px;
    height:350px;
    & > p {
        padding: 0 5px 5px 5px;
    }
    display:flex;
    align-items:center;
    flex-direction:column;
    flex-wrap:wrap;
`

const Image = styled("img")({
    width:'100%',
    borderRadius:'10px 10px 0 0',
    objectFit:'cover',
    height:'150px'
})

const Text = styled(Typography)
`
    font-size:12px;
`
const Heading = styled(Typography)
`
    font-size:18px;
    font-weight:600; 
`

const Details = styled(Typography)
`
    font-size:14px;
    word-break:break-word; 
`

export const Post = ({post}) =>{
    const url=post.picture ? post.picture :'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=752&q=80';
    return(
            <Container display="flex" flexDirection="column" flexGrow={1} justifyContent="space-between" p={1}>
                <Image src={url} alt="Image" />
                <Text>{post.categories}</Text>
                <Heading>{addElipses(post.title,20)}</Heading>
                <Text>{post.username}</Text>
                <Details>{addElipses(post.description,100)}</Details>
            </Container>
    )
}

export default Post;