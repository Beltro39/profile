import { useParams } from 'react-router-dom';
import React, { useEffect, useState} from 'react';
import MyProfile from './MyProfile.js';
import { AuthContext } from '../../utils/auth';
import { useAuth } from '../../utils/auth';
import {Link} from "react-router-dom";
import {useNavigate} from 'react-router-dom';
export default function OthersProfile() {
    const navigate = useNavigate();
    const { axiosAuth } = useAuth();
    const [otherProfile, setOtherProfile] = useState([]);
    let {username} = useParams();
    useEffect(() => {
        getOtherProfile();
    }, [setOtherProfile]);

    const getOtherProfile = async () => {

        let data = await Promise.all([
            axiosAuth.get(process.env.REACT_APP_URL_SERVICES + 'profile/'+username+"/"),
        ]);

        setOtherProfile(data[0].data);
        return data
    };
   
    const handleFormSubmit = async function (event) {
        event.preventDefault();
        navigate('/profile');
    };

    return(
        <div>
                <div class="container mt-5 mb-5">
                    <div class="d-flex flex-row-reverse m-3">
                        <button type="submit" className="btn btn-primary" onClick={handleFormSubmit}>
                           Back to my profile
                        </button>
                    </div>
                    <MyProfile user={otherProfile}></MyProfile>
               
                    </div>
        </div>
        
    )
 
}