import {useState,useEffect} from 'react'
import axios from 'axios';
import {useNavigate} from  'react-router-dom';
import { useAuth } from '@clerk/clerk-react';


function Articles() {

    const[articles,setArticles]=useState([])
    const[err,setErr]=useState('');
    const navigate=useNavigate();
    const {getToken}= useAuth();

      //get all artcicles//
    async function getArticles(){


             const token=await  getToken()
              let res=await axios.get('https://blogapp-s0ik.onrender.com/author-api/articles',{
                headers:{
                  Authorization:`Bearer ${token}`
                }
              })
               if(res.data.message==='articles'){
                     setArticles(res.data.payLoad)
               }
               else{
                    setErr(res.data.message);
               }
     }


  function gotoArticleById(articleObj){
    navigate(`../${articleObj.articleId}`,{ state:articleObj})
}

  //gotosepecfic articles

   useEffect(()=>{
        getArticles();
   },[])


   console.log(articles)

  return (
    <div className='container'>
      
       <div>
           <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3">
                {
                   articles.map((articleObj)=><div className='col' key={articleObj.articleId}>
                      <div className="card h-100">
                        <div className="card-body">
                          <div className="author-details text-end">
                            <img src={articleObj.authorData.profileImageUrl} width='40px' className='rounded-circle' alt="" />
                            <p>
                              <small className='text-secondary'>
                                {articleObj.authorData.nameOfAuthor}
                              </small>
                            </p>
                          </div>
                          <h5 className='card-title'>{articleObj.title}</h5>
                          <p className="card-text">
                            {articleObj.content.substring(0,80)+"..."}
                          </p>
                          <button className="btn btn-success mt-2" onClick={()=>gotoArticleById(articleObj)}>
                            Read More...
                          </button>
                          <div className="card-footer mt-2">
                                 <small className='text-body-secondary'>
                                  last updated on {
                                    articleObj.dateOfModification
                                  }
                                 </small>
                          </div>
                        </div>
                      </div>

            


                    </div>
                     )
                    
                  
                } 


           </div>
        </div>  
        
    </div>
  )
}

export default Articles;
