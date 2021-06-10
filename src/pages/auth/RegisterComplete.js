import React, { useState, useEffect } from "react";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import {createOrUpdateUser} from '../../functions/auth'


const RegisterComplete = ({history}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState('')

let dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!email || !password) {
      toast.error('Email and password is required!')
      return
    }
        if (password.length <6 ) {
          toast.error("Password must be at least 6 characters long!");
          return
        }

    try {
      const result = await auth.signInWithEmailLink(email, window.location.href)
      if(result.user.emailVerified) {
        localStorage.removeItem('emailForRegistration')
        let user = auth.currentUser
        await user.updatePassword(password)
        const idTokenResult = await user.getIdTokenResult()
        // console.log(idTokenResult)
         createOrUpdateUser(idTokenResult.token)
           .then((res) => {
             dispatch({
               type: "LOGGED_IN_USER",
               payload: {
                 name: res.data.name,
                 email: res.data.email,
                 token: idTokenResult,
                 role: res.data.role,
                 _id: res.data._id,
               },
             });
           })
           .catch((err) => console.log(err));

        history.push('/')
      }
    } catch (error) {
      toast.error(error.message)
    }
   
  };

  useEffect(()=> {
    if(localStorage.getItem('emailForRegistration')) {
      setEmail(localStorage.getItem('emailForRegistration'))
    }  
  },[])

  const completeRegistrationForm = () => (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        className="form-control"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled
      />
      <input
        type="password"
        className="form-control"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder='Enter your password here'
        autoFocus
      />
      <br />
      <button type="submit" className="btn btn-raised">
       Complete registration
      </button>
    </form>
  );

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h4>Register Complete</h4>
          {completeRegistrationForm()}
        </div>
      </div>
    </div>
  );
};

export default RegisterComplete;
