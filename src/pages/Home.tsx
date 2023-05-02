import React from "react";
import MainPage from "../components/MainPage";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  orderBy,
  query,
} from "firebase/firestore";
import { firebaseDb } from "../firebase.config";
import CircularIndeterminate from "../components/Loader";
import Post from "../components/Post";

const Home = () => {
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const getData = async () => {
    setIsLoading(true);
    const querySnapshot = await getDocs(
      query(collection(firebaseDb, "posts"), orderBy("createdAt", "desc"))
    );
    const temp: any = [];
    querySnapshot.forEach((doc) => {
      temp.push({ ...doc.data(), id: doc.id });
    });
    setData(temp);
    setIsLoading(false);
  };

  React.useEffect(() => {
    getData();
  }, []);

  return (
    <MainPage>
      {isLoading && <CircularIndeterminate />}
      <div className="flex justify-center items-center flex-col gap-y-8">
        {data.map((post) => {
          return <Post post={post} />;
        })}
      </div>
    </MainPage>
  );
};

export default Home;
