import axios from "axios"
import { API_NOTIFICATION_MESSAGES, SERVICE_URL } from "../constants/config.js";
import { getAccessToken, getType } from "../utils/common-utils.js";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL="http://localhost:8000";
const axiosInstance = axios.create({
    baseURL:API_URL,
    timeout:10000, 
    // timeout is in milliseconds i,e 10 seconds = 10*1000 = 10000 
    headers:{
        "content-type":"application/json"
    }
});

axiosInstance.interceptors.request.use(
    function(config)
    {
        if(config.TYPE.params)
        {
            config.params=config.TYPE.params;
        }
        else if(config.TYPE.query)
        {
            config.url=config.url+'/'+config.TYPE.query;
        }
        return config;
    },
    function(error)
    {
        return Promise.reject(error);
    }
)

axiosInstance.interceptors.response.use(
    function(response)
    {
        // we can stop the loading symbol used in our app here as now we have received data to render
        return processResponse(response);
    },
    function(error)
    {
        // we can stop the loading symbol used in our app here as now we have received message to display
        return Promise.reject(processError(error));
    }

)

//  If success the response will be 
// isSuccess:true,data:response.data

// if failure the response will be
// {isFailure:true,status:response?.status,msg:response?.msg,code:response?.code}

const processResponse = (response) =>{
    // the ? here will first check whether response is received or not
    if(response?.status===200)
    {
        return {isSuccess:true,data:response.data};
    }
    else
    {
        console.log("response");
        return {
            isFailure:true,
            status:response?.status,
            msg:response?.msg,
            code:response?.code
        };
    }

}

const processError = (error) => {
    if(error.response)
    {
        if(error.response?.status===403)
        {
            sessionStorage.clear();
        }
        else
        {
            console.log("Error in Response",error.toJSON());
            // toast.error("User does not exists !")
            return{
                isError:true,
                msg:API_NOTIFICATION_MESSAGES.responseFailure,
                code:error.response.status
            }

        }
        // request made was correct but the response by the server has status code other than 200
    }
    else if(error.request)
    {

        //  the request was sent but response has not been received  
        console.log("Error in request",error.toJSON());
        return{
            isError:true,
            msg:API_NOTIFICATION_MESSAGES.requestFailure,
            code:""
        }
    }
    else
    {

        console.log("Error in network",error.toJSON());
        return{
            isError:true,
            msg:API_NOTIFICATION_MESSAGES.networkError ,
            code:""
        }
    }
}

const API = {};

    for (const [key, value] of Object.entries(SERVICE_URL)) {
        API[key] = (body, showUploadProgress, showDownloadProgress) =>
            axiosInstance({
                method: value.method,
                url: value.url,
                headers:{
                    authorization:getAccessToken()
                },
                TYPE:getType(value,body),
                data: value.method === 'DELETE' ? {} : body,
                responseType: value.responseType,
                // headers: {
                //     authorization: getAccessToken(),
                // },
                // TYPE: getType(value, body),
                onUploadProgress: function(progressEvent) {
                    if (showUploadProgress) {
                        let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        showUploadProgress(percentCompleted);
                    }
                },
                onDownloadProgress: function(progressEvent) {
                    if (showDownloadProgress) {
                        let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        showDownloadProgress(percentCompleted);
                    }
                }
            });
    }

export { API };
