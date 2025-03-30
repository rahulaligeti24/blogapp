import { useContext } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { userAuthorContextObj } from "../../contexts/UserAuthorContext";
import { useNavigate } from "react-router-dom";

function PostArticle() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { currentUser } = useContext(userAuthorContextObj);
  const navigate = useNavigate();

  async function postArticle(articleObj) {
    if (!currentUser) {
      console.error("User is not logged in!");
      return;
    }

    // Construct author data
    const authorData = {
      nameOfAuthor: currentUser.firstName,
      email: currentUser.email,
      profileImageUrl: currentUser.profileImageUrl,
    };
    articleObj.authorData = authorData;

    // Assign article ID (timestamp)
    articleObj.articleId = Date.now();

    // Format date correctly
    let currentDate = new Date();
    let formattedDate = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()} ${currentDate.toLocaleTimeString("en-US", { hour12: true })}`;

    articleObj.dateOfCreation = formattedDate;
    articleObj.dateOfModification = formattedDate;
    articleObj.comments = [];
    articleObj.isArticleActive = true;

    // Make API request with error handling
    try {
      let res = await axios.post("https://blogapp-s0ik.onrender.com/author-api/article", articleObj);
      if (res.status === 201) {
        navigate(`/author-profile/${currentUser.email}/articles`);
      }
    } catch (error) {
      console.error("Error posting article:", error);
    }
  }

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-lg-8 col-md-8 col-sm-10">
          <div className="card shadow">
            <div className="card-title text-center border-bottom">
              <h2 className="p-3" style={{ color: "goldenrod" }}>
                Write an Article
              </h2>
            </div>
            <div className="card-body bg-light">
              <form onSubmit={handleSubmit(postArticle)}>
                <div className="mb-4">
                  <label htmlFor="title" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    {...register("title", { required: "Title is required" })}
                  />
                  {errors.title && <p className="text-danger">{errors.title.message}</p>}
                </div>

                <div className="mb-4">
                  <label htmlFor="category" className="form-label">
                    Select a category
                  </label>
                  <select
                    {...register("category", { required: "Category is required" })}
                    id="category"
                    className="form-select"
                    defaultValue=""
                  >
                    <option value="" disabled>-- Select Category --</option>
                    <option value="programming">Programming</option>
                    <option value="AI&ML">AI & ML</option>
                    <option value="database">Database</option>
                  </select>
                  {errors.category && <p className="text-danger">{errors.category.message}</p>}
                </div>

                <div className="mb-4">
                  <label htmlFor="content" className="form-label">
                    Content
                  </label>
                  <textarea
                    {...register("content", { required: "Content is required" })}
                    className="form-control"
                    id="content"
                    rows="10"
                  ></textarea>
                  {errors.content && <p className="text-danger">{errors.content.message}</p>}
                </div>

                <div className="text-end">
                  <button type="submit" className="add-article-btn">
                    Post
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostArticle;
