import { firestoreDb } from "./firebaseConfig.js";
import { collection, doc, onSnapshot, query } from "firebase/firestore";

class FirestoreListener {
  constructor() {
    this.unsubscribe = null;
  }

  /**
   * Start listening to changes in a Firestore document
   * @param {string} documentPath - The path to the Firestore document
   * @param {Function} callback - The callback function to be executed when data changes
   */
  subscribeToDocument(documentPath, callback) {
    const docRef = doc(firestoreDb, documentPath);
    this.unsubscribe = onSnapshot(docRef, (snapshot) => {
      callback(snapshot);
    });
  }

  /**
   * Start listening to changes in a Firestore collection
   * @param {string} collectionPath - The path to the Firestore collection
   * @param {Function} callback - The callback function to be executed when data changes
   */
  subscribeToCollection(collectionPath, callback) {
    const q = query(collection(firestoreDb, collectionPath));
    this.unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });
      callback(data);
    });
  }

  /**
   * Stop listening to changes in the Firestore document or collection
   */
  stopListening() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}

export default FirestoreListener;
