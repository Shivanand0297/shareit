import { INewPost, INewUser, ISaveUserToDB, IUpdatePost } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { ID, Query } from "appwrite"

export const createUserAccount = async (user: INewUser) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    )

    if(!newAccount) throw new Error()

    const avatarUrl = avatars.getInitials(user.name)

    // saving user to appwrite database
    const newUser = await saveUserToDB({
      accountId: newAccount.$id, //id created on appwrite database
      email: newAccount.email,
      imageUrl: avatarUrl,
      username: user.username,
      name: user.name,
    })

    return newUser;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export const saveUserToDB = async (user: ISaveUserToDB) => {
  try {
    const newUserDocument = await databases.createDocument(
      appwriteConfig.databaseId, 
      appwriteConfig.usersCollectionId, 
      ID.unique(), 
      user
    )
    return newUserDocument;
  } catch(error) {
    console.log(error)
  }
}

export const signInAccount = async (user: {email: string; password: string;}) => {
  try {
    const emailSession = await account.createEmailSession(user.email, user.password)
    return emailSession;
  } catch (error) {
    console.log(error)
  }
}

export const getCurrentAccount = async () => {
  try {
    const currentAccount = await account.get();
    if(!currentAccount) {
      throw new Error("No Account Found!")
    }

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId, 
      appwriteConfig.usersCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    )

    if(!currentUser) throw new Error("No user Found!")

    return currentUser.documents[0];

  } catch (error) {
    console.log(error)
  }
}

export const signOutAccount = async () => {
  try {
    const session = await account.deleteSession("current")
    return session
  } catch (error) {
    console.log(error)
  }
}

export const createPost = async (post : INewPost) => {
  try {
    // upload photo
    const uploadFile = await uploadPhoto(post.file[0])

    if(!uploadFile) {
      throw new Error("File not uploaded")
    }

    // getting file url
    const filePreviewUrl = getFilePreview(uploadFile.$id)

    // deleting file if filePreviewUrl not Found
    if(!filePreviewUrl) {
      await deleteFile(uploadFile.$id)
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // creating post in database
    const newPostPayload = {
      creator: post.userId,
      caption: post.caption,
      imageUrl: filePreviewUrl,
      imageId: uploadFile.$id,
      location: post.location,
      tags: tags,
    }

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId, 
      appwriteConfig.postsCollectionId, 
      ID.unique(), 
      newPostPayload
    )

    if(!newPost) {
      await deleteFile(uploadFile.$id)
      throw new Error("Post not created")
    }

    return newPost;

  } catch (error) {
    console.log(error)
  }
}

export const uploadPhoto = async (file: File) => {
  try {
    const uploadFile = await storage.createFile(appwriteConfig.storageId, ID.unique(), file);
    if (!uploadFile) {
      throw new Error("File not uploaded");
    }
    return uploadFile;
  } catch (error) {
    console.error(error);
  }
}

export const deleteFile = async (fileId: string) => {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);
    return {
      status: "ok"
    }
  } catch (error) {
    console.error(error);
  }
}

export const getFilePreview = (id: string) => {
  try {
    const filePreviewUrl = storage.getFilePreview(appwriteConfig.storageId, id, 2000, 2000, "top", 100);
    if (!filePreviewUrl) {
      throw new Error();
    }
    return filePreviewUrl;
  } catch (error) {
    console.error(error);
  }
}


export const getRecentPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId, 
      appwriteConfig.postsCollectionId, 
      [Query.orderDesc("$createdAt"), Query.limit(20)]
    )

    if(!posts) {
      throw new Error("Post not found")
    }
    return posts;
  } catch (error) {
    console.log(error)
  }
}

export const likePost = async (postId: string, likesArray: string[]) => {
  try {
    const savePost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId,
      {
        likes: likesArray
      }
    );

    if(!savePost) {
      throw new Error("Post Not Liked!");
    }

    return savePost;

  } catch (error) {
    console.log(error);
  }
}

export const savePost = async (postId: string, userId: string) => {
  try {
    const updatePost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId
      }
    );

    if(!updatePost) {
      throw new Error("Post Not Saved!");
    }

    return updatePost;

  } catch (error) {
    console.log(error);
  }
}

export const deleteSavedPost = async (postId: string) => {
  try {
    const deleteSavedPost = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      postId,
    );

    if(!deleteSavedPost) {
      throw new Error("Saved Post Not Deleted !");
    }

    return { status: "ok"};

  } catch (error) {
    console.log(error);
  }
}

export const getPostById = async (postId?: string) => {
  try {

    if(!postId) {
      return;
    }

    const post = await databases.getDocument(appwriteConfig.databaseId, appwriteConfig.postsCollectionId, postId)

    if(!post) {
      throw new Error(`Post not found for id: ${postId}`)
    }

    return post;
  } catch (error) {
    console.log(error)
  }
}


export const updatePostById = async (post : IUpdatePost) => {
  const hasFileToUpdate = post.file.length > 0 ;

  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId
    }

    if(hasFileToUpdate) {
      // upload photo
      const uploadFile = await uploadPhoto(post.file[0])
  
      if(!uploadFile) {
        throw new Error("File not uploaded")
      }
  
      // getting file url
      const filePreviewUrl = getFilePreview(uploadFile.$id)
  
      // deleting file if filePreviewUrl not Found
      if(!filePreviewUrl) {
        await deleteFile(uploadFile.$id)
        throw new Error("file preview not found")
      }

      image = {
        ...image,
        imageId: uploadFile.$id,
        imageUrl: filePreviewUrl
      }
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // updating post in database
    const updatePost = {
      caption: post.caption,
      imageUrl: image.imageUrl,
      imageId: image.imageId,
      location: post.location,
      tags: tags,
    }

    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId, 
      appwriteConfig.postsCollectionId, 
      post.postId, 
      updatePost
    )

    if(!updatedPost) {
      await deleteFile(post.imageId)
      throw new Error("Post not updated")
    }

    return updatedPost;

  } catch (error) {
    console.log(error)
  }
}

export const deletePost = async (postId: string, imageId: string) => {
  try {
    const deletedPost = await databases.deleteDocument(appwriteConfig.databaseId, appwriteConfig.postsCollectionId, postId)

    if(!deletedPost) {
      throw new Error(`Sorry something went wrong`)
    }

    const deletedImage = await storage.deleteFile(appwriteConfig.storageId, imageId)

    if(!deletedImage) {
      throw new Error(`Sorry something went wrong while deleting image`)
    }

    return { status: "ok"};
  } catch (error) {
    console.log(error)
  }
}

export const getUserPosts = async (userId?: string) => {
  if (!userId) return;

  try {
    const post = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
    );

    if (!post) throw Error;

    return post;
  } catch (error) {
    console.log(error);
  }
}

export const getInfinitePosts = async ({ pageParam }: { pageParam: number }) => {
  const queries: string[] = [Query.orderDesc("$updatedAt"), Query.limit(9)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  try {
    const posts = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.postsCollectionId, queries);

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
};

export const getSearchPost = async (searchTerm: string) => {
  try {
    const searchedPost = await databases.listDocuments(
      appwriteConfig.databaseId, 
      appwriteConfig.postsCollectionId, 
      [Query.search("caption", searchTerm)]
    )
    if(!searchedPost) {
      throw new Error("Error Getting Searched Post")
    }
    return searchedPost;
  } catch (error) {
    console.log(error)
  }
}