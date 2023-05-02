import { doc, getDoc, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainPage from "../components/MainPage";
import { firebaseDb } from "../firebase.config";
import { AiFillHeart, AiOutlineComment, AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import moment from "moment";

function PostDesc() {
  const currentUser = JSON.parse(localStorage.getItem("socialz-user")!);
  const [alreadyLiked, setAreadyLiked] = useState(false);
  const [showLikes, setShowLikes] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [post, setPost] = useState<any | null>(null);
  const params = useParams();
  const navigate = useNavigate();

  const getUserName = (text: any) => {
    const email = text;
    const username = email.substring(0, email.length - 12);
    return username;
  };

  const getData = () => {
    getDoc(doc(firebaseDb, "posts", params.id!))
      .then((response) => {
        setPost({ ...response.data(), id: response.id });
        if (
          response.data()?.likes.find((user: any) => user.id === currentUser.id)
        ) {
          setAreadyLiked(true);
        } else {
          setAreadyLiked(false);
        }
      })
      .catch(() => {});
  };
  useEffect(() => {
    getData();
  }, []);

  const likeOrUnlikePost = () => {
    let updatedLikes = post.likes;

    if (alreadyLiked) {
      updatedLikes = post.likes.filter(
        (user: any) => user.id !== currentUser.id
      );
    } else {
      updatedLikes.push({
        id: currentUser.id,
        email: currentUser.email,
      });
    }

    setDoc(doc(firebaseDb, "posts", post.id), { ...post, likes: updatedLikes })
      .then(() => {
        getData();
      })
      .catch(() => {
        toast.error("An error occurred");
      });
  };

  const addComment = () => {
    let updatedComments = post.comments;

    updatedComments.push({
      id: currentUser.id,
      email: currentUser.email,
      commentText,
      createdOn: moment().format("DD-MM-YYYY"),
    });

    setDoc(doc(firebaseDb, "posts", post.id), {
      ...post,
      comments: updatedComments,
    })
      .then(() => {
        getData();
        setCommentText("");
      })
      .catch(() => {
        toast.error("An error occurred");
      });
  };

  return (
    <MainPage>
      <div className="flex w-full justify-center space-x-5">
        {post && (
          <>
            {showLikes && (
              <div className="w-96">
                <div className="flex justify-between">
                  <h1 className="text-xl font-semibold text-gray-500">
                    Liked By
                  </h1>
                  <AiOutlineClose
                    color="gray"
                    className="cursor-pointer"
                    onClick={() => setShowLikes(false)}
                  />
                </div>
                <hr />
                {post.likes.map((like: any) => {
                  return (
                    <div className="flex item items-center card-sm p-2 mt-2">
                      <div className="h-10 w-10 rounded-full bg-gray-500 flex justify-center items-center text-white mr-2">
                        <span className="text-2xl">
                          {getUserName(like.email)[0]}
                        </span>
                      </div>
                      <span>{getUserName(like.email)}</span>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="cursor-pointer h-[550px] w-[550px]">
              <div className="flex item items-center card-sm p-2">
                <div className="h-10 w-10 rounded-full bg-gray-500 flex justify-center items-center text-white mr-2">
                  <span className="text-2xl">
                    {getUserName(post.user.email)[0]}
                  </span>
                </div>
                <span>{getUserName(post.user.email)}</span>
              </div>
              <div className="w-full text-center flex justify-center card-sm">
                <img src={post.imageUrl} alt="" className="h-full w-full" />
              </div>
              <div className="card-sm p-2 flex w-full items-center space-x-5">
                <div className="flex space-x-2 items-center">
                  <AiFillHeart
                    size={25}
                    onClick={likeOrUnlikePost}
                    color={alreadyLiked ? "red" : "gray"}
                  />
                  <h1
                    className="underline font-semibold cursor-pointer"
                    onClick={() => setShowLikes(true)}
                  >
                    {post.likes.length}
                  </h1>
                </div>
                <div className="flex space-x-2 items-center">
                  <AiOutlineComment size={25} />
                  <h1
                    className="underline text-xl cursor-pointer"
                    onClick={() => setShowComments(true)}
                  >
                    {post.comments.length}
                  </h1>
                </div>
              </div>
            </div>

            {showComments && (
              <div className="w-96">
                <div className="flex justify-between">
                  <h1 className="text-xl font-semibold text-gray-500">
                    Comments
                  </h1>
                  <AiOutlineClose
                    color="gray"
                    className="cursor-pointer"
                    onClick={() => setShowComments(false)}
                  />
                </div>
                {post.comments.map((comment: any) => {
                  return (
                    <div className="card-sm mt-2 p-2">
                      <h1 className="text-xl text-gray-700">
                        {comment.commentText}
                      </h1>
                      <hr />
                      <h1 className="text-right text-md">
                        By <b>{getUserName(comment.email)}</b> On{" "}
                        {comment.createdOn}
                      </h1>
                    </div>
                  );
                })}
                <div className="flex flex-col">
                  <textarea
                    className="border-dashed border-gray-500 border-2  md:w-full my-5 p-5 w-full"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  ></textarea>

                  <button
                    className="bg-primary h-10 rounded-sm text-white px-5 mt-2 w-20 text-center"
                    onClick={addComment}
                  >
                    Add
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </MainPage>
  );
}

export default PostDesc;
