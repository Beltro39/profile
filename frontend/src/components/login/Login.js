import { useAuth } from '../../utils/auth';
import React, { useState, useRef } from 'react'
import { loginValidation } from "./Validation.js"
import {useNavigate} from 'react-router-dom';


function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [values, setValues] = useState({
        username: "",
        password: "",
    });
    const [errors, setErrors] = useState({});

    const handleChange = (event) => {
        setValues({
            ...values,
            [event.target.name]: event.target.value,
        })
        console.log(event.target.value);
    }

    const handleFormSubmit = async function (event) {
        event.preventDefault();
        const err = loginValidation(values)
        setErrors(err);
        if (Object.keys(err).length === 0) { 
            await login(values.username, values.password).then(response => {
                if (response.status !== 200) {
                    setErrors({
                        ...errors,
                        username: "Usuario o contraseña incorrectos",
                    })
                }
            }).catch(error =>{
                setErrors({
                    ...errors,
                    username: "Usuario o contraseña incorrectos",
                })
            })
        }
        navigate('/profile');
    }





    return(
        <form className='form'>
        <h3>Iniciar Sesión</h3>
        <div className="mb-3">
          <label>Nombre de usuario</label>
          <input
            type="text"
            name="username"
            className="form-control"
            placeholder="username"
            value={values.username}
            onChange={handleChange}
          />
        </div>
        <div className='mt-3  '>
            {errors.username && <p className='error'>{errors.username}</p>}
        </div>
        <div className="mb-3">
          <label>Constraseña</label>
          <input
            type="password"
            name="password"
            className="form-control"
            placeholder="password"
            value={values.password}
            onChange={handleChange}
          />
        </div>
        <div className='mt-3  '>
            {errors.password && <p className='error'>{errors.password}</p>}
        </div>
        
        <div className="d-grid mt-4">
          <button type="submit" className="btn btn-primary" onClick={handleFormSubmit}>
            Submit
          </button>
        </div>
      </form>
    )
    
}   
export default Login