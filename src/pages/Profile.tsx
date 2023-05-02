import React from "react";
import MainPage from "../components/MainPage";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { firebaseDb } from "../firebase.config";
import { useParams } from "react-router-dom";
import Post from "../components/Post";
import CircularIndeterminate from "../components/Loader";

const Profile = () => {
  const [posts, setPosts] = React.useState([]);
  const [user, setUser] = React.useState<any | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const params = useParams();

  const getData = async () => {
    setIsLoading(true);
    const querySnapshot = await getDocs(
      query(collection(firebaseDb, "posts"), orderBy("createdAt", "desc"))
    );
    const temp: any = [];
    querySnapshot.forEach((doc) => {
      temp.push({ ...doc.data(), id: doc.id });
    });
    const filteredPosts = temp.filter(
      (post: any) => post.user.id === params.id
    );
    setPosts(filteredPosts);
    setIsLoading(false);
  };

  const getUserProfile = async () => {
    const result = await getDoc(doc(firebaseDb, "users", params.id!));
    setUser(result.data());
  };

  React.useEffect(() => {
    getData();
    getUserProfile();
  }, []);

  const getUserName = (text: string) => {
    const email = text;
    const username = email.substring(0, email.length - 10);
    return username;
  };

  return (
    <MainPage>
      {isLoading && <CircularIndeterminate />}
      {user && (
        <>
          {" "}
          <div>
            <div className="flex item items-center card-sm p-2">
              <div className="h-24 w-24 rounded-full bg-gray-500 flex justify-center items-center text-white mr-2">
                <span className="text-7xl">{getUserName(user.email)[0]}</span>
              </div>
              <div className="flex flex-col space-y-1">
                <span>{getUserName(user.email)}</span>
                <span>{user.email}</span>
                <hr />
                <span>{user.bio}</span>
                <span>{user.following.length} following</span>
              </div>
            </div>
          </div>
          <div className="mt-10 flex justify-center items-center flex-col gap-y-8">
            <div className="card-sm p-2">
              <h1>Posts uploaded by {getUserName(user.email)}</h1>
            </div>
            <div>
              {posts.map((post) => {
                return <Post post={post} />;
              })}
            </div>
          </div>
        </>
      )}
    </MainPage>
  );
};

export default Profile;
