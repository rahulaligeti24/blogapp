import  { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {  useClerk ,useUser} from '@clerk/clerk-react';
import { userAuthorContextObj } from '../../contexts/UserAuthorContext';

function Header() {

          const { signOut }=useClerk()
          const { isSignedIn,user,isLoaded }=useUser()
       const {currentUser,setCurrentUser}=useContext(userAuthorContextObj)
     
     const navigate=useNavigate();



        //functyiom to signout//
       async  function handleSignOut(){
            await signOut();
       setCurrentUser(null)
        navigate('/')

    }




  return (



    
    <div>
         <nav className='header d-flex justify-content-between'>
              <div className='d-flex justify-content-center'>
                <Link to='/'>
                LOGO
                </Link>
              </div>
              <ul className='d-flex list-unstyled justify-content-around header-links'>
                
               {
                !isSignedIn?
                <>
                  <li>
                <Link to=''>Home</Link>
               </li>
               <li>
                <Link to='signin'>Signin</Link>
               </li>
               <li>
                <Link to='signup'>Signup</Link>
               </li>
                </>:
               
                  
                  <div  className='user-button container'>
                    <div style={{position:"relative"}}>
                       <img src={user.imageUrl} width='40px' className='rounded-circle' alt="" />
                         <p className='role' style={{position:'absolute',top:'opx',right:'-20px'}}>{currentUser.role}</p>
                    </div>
                    <p className='mb-0' style={{position:'absolute'}} >{user.firstName}</p>
                    <button className='btn btn-danger signedout-btn' onClick={handleSignOut}>SignOut</button>
                  </div>

               }

              </ul>
         </nav>
    </div>
  )
}

export default Header;