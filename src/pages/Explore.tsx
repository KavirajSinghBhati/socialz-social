import React from "react";
import MainPage from "../components/MainPage";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { firebaseDb } from "../firebase.config";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const Explore = () => {
  const [users, setUsers] = React.useState<any | null>([]);
  const [currentUser, setCurrentUser] = React.useState<any | null>(null);
  const user = JSON.parse(localStorage.getItem("socialz-user")!);
  const getData = async () => {
    const querySnapshot = await getDocs(collection(firebaseDb, "users"));
    const temp: any = [];
    querySnapshot.forEach((doc) => {
      temp.push({
        ...doc.data(),
        id: doc.id,
      });
    });
    const filteredUsers = temp.filter((userDb: any) => userDb.id !== user.id);
    setUsers(filteredUsers);
  };

  const getUserProfile = async () => {
    const result = await getDoc(doc(firebaseDb, "users", user.id!));
    setCurrentUser(result.data());
  };

  React.useEffect(() => {
    getUserProfile();
    getData();
  }, []);

  const followUnfollowUser = async (id: any) => {
    const docRef = doc(firebaseDb, "users", user.id!);
    if (currentUser.following.includes(id)) {
      await updateDoc(docRef, {
        following: arrayRemove(id),
      });
    } else {
      await updateDoc(docRef, {
        following: arrayUnion(id),
      });
    }
    getUserProfile();
    getData();
  };

  return (
    <MainPage>
      <div className="flex justify-center items-center flex-col gap-y-8">
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
          Suggested people to follow
        </h1>

        {users.map((user: any) => (
          <Card sx={{ width: 345 }} key={user.id}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {user.fullName}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => followUnfollowUser(user.id)}>
                {currentUser.following.includes(user.id)
                  ? `Unfollow`
                  : "Follow"}
              </Button>
            </CardActions>
          </Card>
        ))}
      </div>
    </MainPage>
  );
};

export default Explore;
