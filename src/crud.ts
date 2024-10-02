// src/services/firestoreService.ts
import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";

const collectionName = "items";

export const createItem = async (data: any) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

export const getItems = async () => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const updateItem = async (id: string, data: any) => {
  const itemDoc = doc(db, collectionName, id);
  await updateDoc(itemDoc, data);
};

export const deleteItem = async (id: string) => {
  const itemDoc = doc(db, collectionName, id);
  await deleteDoc(itemDoc);
};
