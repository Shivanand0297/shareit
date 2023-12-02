import PostForm from "@/components/forms/PostForm";
import Loader from "@/components/shared/Loader";
import { useGetPostById } from "@/lib/react-query/queriesAndMutations";
import { useParams } from "react-router-dom";
import edidIcon from "/assets/icons/edit.svg";

const UpdatePost = () => {
  const { id } = useParams();

  const { data: post, isPending: isPostLoading } = useGetPostById(id ?? "");

  if (isPostLoading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img src={edidIcon} width={36} height={36} alt="edit post" />
          <h2 className="h3-bold md:h2-bold text-left w-full">Update Post</h2>
        </div>

        <PostForm action="Update" post={post} />
      </div>
    </div>
  );
};

export default UpdatePost;
