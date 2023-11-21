import { INewUser, ISaveUserToDB } from "@/types";
import { account, appwriteConfig, avatars, databases } from "./config";
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