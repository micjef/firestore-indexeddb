// src/services/firestoreService.ts
import { db as firestoreDB } from "./firebase"; // Firestore DB
import { db as dexieDB, Item } from "./dexie"; // Dexie IndexedDB
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where
} from "firebase/firestore";

// Firestore collection name
const collectionName = "items";

// Function to add an item to Firestore and IndexedDB
export const createItem = async (data: { name: string }) => {
  const timestamp = Date.now();
  const itemData = { ...data, timestamp };  // Add timestamp

  try {
    // Save to Firestore
    const docRef = await addDoc(collection(firestoreDB, collectionName), itemData);

    // Save to IndexedDB (locally)
    await dexieDB.items.add({ id: docRef.id, ...itemData });

    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

// Function to get items from IndexedDB or Firestore (filtered by the latest timestamp in IndexedDB)
export const getItems = async () => {
  try {
    // Step 1: Fetch local items from IndexedDB and get the most recent timestamp
    const localItems = await dexieDB.items.orderBy("timestamp").reverse().toArray();
    let lastTimestamp = 0;

    if (localItems.length > 0) {
      // If there are local items, get the latest timestamp
      lastTimestamp = localItems[0].timestamp;
    }

    // Step 2: Query Firestore for items with a timestamp greater than the last saved item in IndexedDB
    const firestoreQuery = query(
      collection(firestoreDB, collectionName),
      where("timestamp", ">", lastTimestamp),
    );

    const querySnapshot = await getDocs(firestoreQuery);
    const firestoreItems = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Item));

    // Step 3: Save any new Firestore items to IndexedDB
    if (firestoreItems.length > 0) {
      await dexieDB.items.bulkPut(firestoreItems);
    }

    // Step 4: Return a combination of the local items and the new Firestore items
    return [...localItems, ...firestoreItems];
  } catch (error) {
    console.error("Error getting documents: ", error);
    return [];
  }
};

// Function to update an item in Firestore and IndexedDB
export const updateItem = async (id: string, data: { name: string }) => {
  const timestamp = Date.now();  // Update the timestamp
  const itemData = { ...data, timestamp };

  try {
    // Update in Firestore
    const itemDoc = doc(firestoreDB, collectionName, id);
    await updateDoc(itemDoc, itemData);

    // Update in IndexedDB
    await dexieDB.items.update(id, itemData);
  } catch (error) {
    console.error("Error updating document: ", error);
  }
};

// Function to delete an item from Firestore and IndexedDB
export const deleteItem = async (id: string) => {
  try {
    // Delete from Firestore
    const itemDoc = doc(firestoreDB, collectionName, id);
    await deleteDoc(itemDoc);

    // Delete from IndexedDB
    await dexieDB.items.delete(id);
  } catch (error) {
    console.error("Error deleting document: ", error);
  }
};
