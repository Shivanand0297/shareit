import { INewPost, INewUser, ISaveUserToDB } from "@/types";
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
      username: user.username
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
    const filePreviewUrl = await getFilePreview(uploadFile.$id)

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

export const getFilePreview = async (id: string) => {
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