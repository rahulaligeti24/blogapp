import {useContext, useState} from 'react'
import { useLocation } from 'react-router-dom'
import { userAuthorContextObj } from '../../contexts/UserAuthorContext' ;
import {useForm} from 'react-hook-form'
import {FaEdit} from 'react-icons/fa'
import {MdDelete,MdRestore} from 'react-icons/md';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {useAuth} from '@clerk/clerk-react'
//import { useForm } from 'react-hook-form';

function ArticleByID(){ 

 const {state}=useLocation()
  // console.log(state)
  const {currentUser}=useContext(userAuthorContextObj)
   const [editArticleStatus,setEditArticleStatus]=useState(false);
   const {register,handleSubmit}=useForm();
   const navigate=useNavigate();

   const {getToken}=useAuth();

   const [currentArticle,setCurrentArticle]=useState(state);
   const [currentComment,setCommentStatus]=useState('')



  //funxtion to change edit status 
  function enableEdit(){
       setEditArticleStatus(true);
  }


    async function OnSave(modifiedArticle){
        const articleAfterChanges={...state,...modifiedArticle}
        const token=await getToken()
        const currentDate=new Date();

        articleAfterChanges.dateOfModification=currentDate.getDate()+"-"+currentDate.getMonth()+"-"+currentDate.getFullYear()

        let res=await axios.put(`https://blogapp-s0ik.onrender.com/author-api/article/${articleAfterChanges.articleId}`,articleAfterChanges,
          {
            headers:{
              Authorization:`Bearer ${token}`
            }
          }
        )

        if (res.data.message==='article modified'){
              setEditArticleStatus(false);
              naviaget(`/author-profile/articles/${state.articleId}`,{state:res.data.payLoad})
        }
    }


async function deleteArticle(){
     state.isArticleActive=false;
     let res=await axios.put(`https://blogapp-s0ik.onrender.com/author-api/articles/${state.articleId}`,state)
     if(res.data.message==='article deleted or restored'){
      setCurrentArticle(res.data.payLoad)
     }
}


async function restoreArticle(){
  state.isArticleActive=true;
  let res=await axios.put(`https://blogapp-s0ik.onrender.com/author-api/articles/${state.articleId}`,state)

  if (res.data.message==='article deleted or restored'){
               setCurrentArticle(res.data.payLoad)
  }
}



//add cooment to article 
async function addComment(commentObj){
     commentObj.nameOfUser=currentUser.firstName;
     console.log(commentObj)
     let res=axios.put(`https://blogapp-s0ik.onrender.com/user-api/comment/${currentArticle.articleId}`,commentObj)
     if (res.data.message==='comment added'){
            setCommentStatus(res.data.message)
     }
}


  return (
    <div className='container'>

      {
        editArticleStatus===false?
        <>
        <div className="d-flex justify-content-between">
          <div className="mb-5 author-block w-100 px-4 py-2 rounded-2 d-flex justify-content-between align-items-center" >
            
            <div>
              <p className="display-3 me-4">{state.title}</p>
              {/* doc of creation */}
              <span className="py-3">
                <small className="text-secondary me-4">
                  Created on :{state.dateOfCreation}
                </small>
                <small className="text-secondary me-4">
                  Created on :{state.dateOfModification}
                </small>
              </span>
            </div>
             
             {/* author details */}
             <div className="author-details text-center">
                 <img src={state.authorData.profileImageUrl} width='60px' className='rounded-circle' alt="" />
                  <p>{state.authorData.nameOfAuthor}</p>
             </div>
 
          </div>
          {/* edit and soft delete from db */}

          {
              currentUser.role==='author'&&(
                <div className="d-flex me-3">
                  <button className="me-2 btn btn-light" onClick={enableEdit}>
                    <FaEdit className='text-warning'/>
                  </button>
                  

                  {/* edit or restore  */}
                  {

                    state.isArticleActive===true?(
                      <button className="me-2 btn-btn-light" onClick={deleteArticle}>
                        <MdDelete className='text-danger fs-4'  />
                      </button>
                    ):(
                      <button className="me-2 btn-btn-light">
                      <MdRestore className='text-info fs-4' onClick={restoreArticle} />
                    </button>
                    )

                  }

                </div>
              )
          }
         </div>
         {/* content */}
         <p className="lead mt-3 article-content" style={{whiteSpace:'pre-line'}}>
          {state.content}
         </p>
         {/* comments */}
         <div className="comments my-4">
          { 
            state.comments.length===0?<p className='display-3'>No comments yet..</p>:
            state.comments.map(commentObj=>{
              return <div key={commentObj._id}>
                      <p className='user-name'>
                      {
                        commentObj?.nameOfUser
                      } 
                        </p> 
                        <p className='comment'>
                      {
                        commentObj?.comment
                      } 
                        </p>
              </div>
            })
          }
         </div>
         {/* comments  array */}
         <h1>comment added</h1>

         {
          currentUser.role==='user' && <form onSubmit={handleSubmit(addComment)}>
            <input type="text" {...register("comment")}  className='form-control' />
            <button className="btn btn-success mt-3 mb-3">
              AddComment
            </button>
          </form>
         }
        </>:
          <form onSubmit={handleSubmit(OnSave)}>
          <div className="mb-4">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              defaultValue={state.title}
              {...register("title")}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="category" className="form-label">
              Select a category
            </label>
            <select
              {...register("category")}
              id="category"
              className="form-select"
              defaultValue={state.category}
            >
              <option value="programming">Programming</option>
              <option value="AI&ML">AI&ML</option>
              <option value="database">Database</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="form-label">
              Content
            </label>
            <textarea
              {...register("content")}
              className="form-control"
              id="content"
              rows="10"
              defaultValue={state.content}
            ></textarea>
          </div>

          <div className="text-end">
            <button type="submit" className="btn btn-success">
              Save
            </button>
          </div>
        </form>
          
      }
          
    </div>
  )
}

export default ArticleByID
