import { AuthContext } from '../../utils/auth';
import React, { useContext } from 'react';
export default function MyProfile(props) {
    const colorList = [
        { color: "#28a745" },
        { color: "#ffc107" },
        { color: "#dc3545" },
        { color: "#E21717" },
        { color: "#BF3312" },
        { color: "#D82E2F" },
        { color: "#EB4D4B" },
        { color: "#EF5354" },
        { color: "#B4161B" },
        { color: "#E6425E" },
        { color: "#E83A59" },
        { color: "#B9345A" },
      ];
    if(!(props.user.avatar?.includes("http"))){
        console.log("YES")
        props.user.avatar= process.env.REACT_APP_URL_MEDIA+ props.user.avatar
    }
    return(
        <div class="row no-gutters">
                <div class="col-md-4 col-lg-4"><img src={props.user.avatar}></img></div>
                <div class="col-md-8 col-lg-8">
                    <div class="d-flex flex-column">
                        <div class="d-flex flex-row justify-content-between align-items-center p-5" style={{backgroundColor: "#232428", color: "#b7b7b7"}}>
                            <h3 class="display-5">{props.user.username}</h3>
                        </div>
                        <div class="p-3 bg-black " style= {{color: "#dedbdb"}}>
                            <h6>{props.user.rol}</h6>
                        </div>
                        <div class="d-flex flex-row text-white">
                            {props.user.tools?.map((tool, index)=> {
                                return(
                                    <div class="p-3 text-center skill-block" style={{ backgroundColor: `${colorList[index].color}`,}} key= {tool.id}>
                                    <h4>{tool.level}%</h4>
                                    <h6>{tool.tool}</h6>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
    )

}