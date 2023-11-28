import { MouseEvent, useState, useEffect } from "react";

// appwrite
import { Models } from "appwrite";

// icons
import likedIcon from "/assets/icons/liked.svg";
import likeIcon from "/assets/icons/like.svg";
import savedIcon from "/assets/icons/saved.svg";
import saveIcon from "/assets/icons/save.svg";

// mutations and queries
import { useDeleteSavedPost, useGetCurrentUser, useLikePost, useSavePost } from "@/lib/react-query/queriesAndMutations";

// loader components
import Loader from "./Loader";

type PostStatsProps = {
  post: Models.Document;
  userId: string;
};

const PostStats = ({ post, userId }: PostStatsProps) => {
  const likesList: string[] = post.likes.map((user: Models.Document) => user.$id);
  const [likes, setLikes] = useState<string[]>(likesList);

  const { mutate: likePost, isPending: isLikePending, isError: isLikeError } = useLikePost();
  const { mutate: savePost, isPending: isSavePending } = useSavePost();
  const { data: currentUser } = useGetCurrentUser();
  const { mutate: deleteSavedPost, isPending: isDeleteSavedPostPending } = useDeleteSavedPost();

  const savedPostRecord = currentUser?.save.find((record: Models.Document) => record.post.$id === post.$id)
  
  useEffect(()=> {
    setIsSaved(!!savedPostRecord)
  }, [currentUser])


  const [isSaved, setIsSaved] = useState<boolean>(false);


  const handleLikePost = (e: MouseEvent) => {
    e.stopPropagation();

    let likesArray = [...likes];

    const hasLiked = likesArray.includes(userId);

    // if clicking 2nd time
    if (hasLiked) {
      likesArray = likesArray.filter((id) => id !== userId);
    } else {
      likesArray.push(userId);
    }
    setLikes(likesArray);

    // make api call to like the post
    likePost({ postId: post.$id, likesArray})
  };

  const handleSavePost = (e: MouseEvent) => {
    e.stopPropagation();

    // if clicking second time
    if(savedPostRecord){
      setIsSaved(false);
      deleteSavedPost(savedPostRecord.$id)
    } else {
      setIsSaved(true);
      // make api call to like the post
      savePost({ postId: post.$id, userId: userId})
    }
    
  };

  const checkedIsLiked = (likes: string[], userId: string) => {
    return likes.includes(userId)
  }

  return (
    <div className={`flex justify-between items-center z-20`}>
      <div className="flex gap-2 mr-5">
        {isLikePending ? (
          <Loader />
        ) : (
          <img
            src={`${checkedIsLiked(likes, userId) ? likedIcon : likeIcon}`}
            alt="like"
            width={20}
            height={20}
            onClick={handleLikePost}
            className="cursor-pointer"
          />
        )}
        {isLikeError ? <p>Error liking post</p> : <p className="small-medium lg:base-medium">{likes.length}</p>}
      </div>

      <div className="flex gap-2">
        {isSavePending || isDeleteSavedPostPending ? (
          <Loader />
        ) : (
          <img
            src={isSaved ? savedIcon : saveIcon}
            alt="share"
            width={20}
            height={20}
            className="cursor-pointer"
            onClick={handleSavePost}
          />
        )}
      </div>
    </div>
  );
};

export default PostStats;
