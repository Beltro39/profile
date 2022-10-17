import './Profile.css';
import MyProfile from './MyProfile.js';
import { useAuth } from '../../utils/auth';
import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../utils/auth';
import {Link} from "react-router-dom";



export default function Profile() {

    const { userInfo } = useContext(AuthContext);
    const { axiosAuth } = useAuth();
    const [profiles, setProfiles] = useState([]);
    useEffect(() => {
        getProfiles();
    }, [setProfiles]);

    const getProfiles = async () => {

        let data = await Promise.all([
            axiosAuth.get(process.env.REACT_APP_URL_SERVICES + 'profiles'),
        
        ]);

        setProfiles(data[0].data);
        return data
    };
   
    
    return(
        <div class="container mt-5 mb-5">
            <MyProfile user= {userInfo}></MyProfile>
            <div class="container d-flex justify-content-center mt-5 mb-5 pb-5">
	            <div class="main">
	            	<div class="row">
                            {profiles?.map((profile, index)=> {
                                return(
                                    <div class="col-md-3 m-4">
	            			<div>
	            			    <div class="one">
	            			    	<div class="text-right pr-2 pt-1">
                                        <i class="mdi mdi-dots-vertical dotdot"></i>
                                    </div>
	            			    	<div class="d-flex justify-content-center mt-3">
                                        <img src={process.env.REACT_APP_URL_MEDIA+profile.avatar} width="20" class="rounded-circle w-50">
                                        </img>
                                    </div>
	            			    	<div class="text-center mt-2">
	            			    		<span class="name">{profile.username}</span>
	            
	            			    	</div>
	            			    	<div class="text-center">
	            			    		<span class="money">{profile.rol}</span>
	            			    	</div>
                                    
	            			    	<div class="text-center align-items-center d-flex justify-content-center pb-2">
                                        <span class="details">
                                            <Link to={profile.username}> View profile </Link>
                                        </span>
                                        <i class="mdi mdi-arrow-right right pl-1"></i>
                                    </div>
                                </div>
	            			</div>
                                    </div>
                                )
                            })}
	            		

                    

                        
	            	</div>
	            </div>
            </div>
        </div>
    )
}