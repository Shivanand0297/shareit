import { Client, Account, Databases, Avatars, Storage } from "appwrite"

export const appwriteConfig = {
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  baseUrl: import.meta.env.VITE_APPWRITE_URL,
  storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID,
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  savesCollectionId: import.meta.env.VITE_APPWRITE_SAVES_COLLECTION_ID,
  usersCollectionId: import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
  postsCollectionId: import.meta.env.VITE_APPWRITE_POSTS_COLLECTION_ID,
}

const client = new Client();
client
  .setProject(appwriteConfig.projectId)
  .setEndpoint(appwriteConfig.baseUrl)

export const account = new Account(client)
export const databases = new Databases(client)
export const avatars = new Avatars(client)
export const storage = new Storage(client)