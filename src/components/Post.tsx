import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { AiOutlineHeart } from "react-icons/ai";
import { BiCommentDetail } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

export default function Post(props: any) {
  const navigate = useNavigate();
  const getUserName = () => {
    return props.post.user.email.substring(
      0,
      props.post.user.email.length - 12
    );
  };
  return (
    <Card
      className="mt-10"
      sx={{ maxWidth: 345 }}
      onClick={() => navigate(`/post/${props.post.id}`)}
    >
      <CardHeader
        avatar={<Avatar>{getUserName()[0]}</Avatar>}
        title={getUserName()}
      />
      <CardMedia
        component="img"
        height="194"
        image={props.post.imageUrl}
        alt="post image"
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {props.post.description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton>
          <AiOutlineHeart />
          <p className="text-base ml-2">{props.post.likes.length}</p>
        </IconButton>
        <IconButton>
          <BiCommentDetail />
          <p className="text-base ml-2">{props.post.comments.length}</p>
        </IconButton>
      </CardActions>
    </Card>
  );
}
