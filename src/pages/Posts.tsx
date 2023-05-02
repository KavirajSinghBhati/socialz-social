import React from "react";
import MainPage from "../components/MainPage";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { firebaseDb } from "../firebase.config";
import { useNavigate } from "react-router-dom";
import CircularIndeterminate from "../components/Loader";

const Posts = () => {
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [description, setDescription] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const navigate = useNavigate();
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };
  const handleDescChange = (e: any) => {
    setDescription(e.target.value);
  };
  const addPost = () => {
    setIsLoading(true);
    const storage = getStorage();
    const storageRef = ref(storage, `/posts/${imageFile?.name}`);
    const userString = localStorage.getItem("socialz-user");
    const userDetail = JSON.parse(userString!);
    uploadBytes(storageRef, imageFile!)
      .then((snapshot) => {
        getDownloadURL(ref(storage, `/posts/${imageFile?.name}`)).then(
          (url) => {
            addDoc(collection(firebaseDb, "posts"), {
              description,
              userId: userDetail.id,
              imageUrl: url,
              likes: [],
              comments: [],
              user: JSON.parse(localStorage.getItem("socialz-user")!),
              createdAt: serverTimestamp(),
            })
              .then(() => {
                setIsLoading(false);
                toast.success("Post uploaded successfully");
                navigate("/");
              })
              .catch(() => {
                setIsLoading(false);
                toast.error("Something went wrong");
              });
          }
        );
      })
      .catch((er) => {
        setIsLoading(false);
        console.log(er.message);
      });
  };
  return (
    <MainPage>
      <div>
        {isLoading && <CircularIndeterminate />}
        <h1 className="text-3xl text-gray-600">Add new post</h1>
        <div className="w-screen flex flex-col">
          <textarea
            value={description}
            onChange={handleDescChange}
            className="border-gray-500 border-2 w-1/2 md:w-full my-5 p-5"
            rows={3}
          ></textarea>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {imageFile && (
            <img
              className="mt-5 h-52 w-52 rounded"
              src={URL.createObjectURL(imageFile)}
              alt="Selected post"
            />
          )}
        </div>
        {imageFile && description && (
          <Button
            sx={{ width: 200, padding: 1, marginTop: 4 }}
            variant="outlined"
            onClick={addPost}
          >
            Upload
          </Button>
        )}
      </div>
    </MainPage>
  );
};

export default Posts;
