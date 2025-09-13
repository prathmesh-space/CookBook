// FirestoreService.js
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
} from "firebase/firestore";
import { firestoreDb } from "./firebaseConfig"; // Make sure this exports your Firestore instance
import FirebaseConverter from "./FirebaseConverter";

/**
 * FirestoreService - Utility class for Firestore CRUD operations
 */
class FirestoreService {
  /**
   * Get a single document
   * @param {string} collectionPath
   * @param {string} documentId
   * @param {string|null} dataType Optional converter type (e.g., "recipe")
   * @returns {Object|null} Document data or null if not found
   */
  static async getDocument(collectionPath, documentId, dataType = null) {
    try {
      if (!collectionPath || !documentId) throw new Error("Invalid path or ID");

      const firebaseConverter = new FirebaseConverter();
      const converter = dataType ? getConverter(dataType, firebaseConverter) : null;

      let docRef = doc(firestoreDb, collectionPath, documentId);
      if (converter?.objectConverter) docRef = docRef.withConverter(converter.objectConverter);

      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
      console.error("Error getting document:", error);
      return null;
    }
  }

  /**
   * Create or overwrite a document
   * @param {string} collectionPath
   * @param {string} documentId
   * @param {Object} data
   * @param {string|null} dataType Optional converter type
   */
  static async createDocument(collectionPath, documentId, data, dataType = null) {
    try {
      if (!collectionPath || !documentId) throw new Error("Invalid path or ID");
      if (!data || typeof data !== "object") throw new Error("Invalid data");

      const firebaseConverter = new FirebaseConverter();
      const converter = dataType ? getConverter(dataType, firebaseConverter) : null;

      let docRef = doc(collection(firestoreDb, collectionPath), documentId);
      if (converter?.objectConverter) {
        docRef = docRef.withConverter(converter.objectConverter);
        data = converter.objectConverter.toFirestore(data);
      }

      await setDoc(docRef, data);
      return docRef.id;
    } catch (error) {
      console.error("Error creating document:", error);
      return null;
    }
  }

  /**
   * Update an existing document
   * @param {string} collectionPath
   * @param {string} documentId
   * @param {Object} data
   */
  static async updateDocument(collectionPath, documentId, data) {
    try {
      if (!collectionPath || !documentId) throw new Error("Invalid path or ID");
      if (!data || typeof data !== "object") throw new Error("Invalid data");

      const docRef = doc(firestoreDb, collectionPath, documentId);
      await updateDoc(docRef, data);
    } catch (error) {
      console.error("Error updating document:", error);
    }
  }

  /**
   * Delete a document
   * @param {string} collectionPath
   * @param {string} documentId
   */
  static async deleteDocument(collectionPath, documentId) {
    try {
      if (!collectionPath || !documentId) throw new Error("Invalid path or ID");

      const docRef = doc(firestoreDb, collectionPath, documentId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  }

  /**
   * Get all documents in a collection
   * @param {string} collectionPath
   * @param {string|null} dataType Optional converter type
   * @returns {Array} Array of documents {id, data}
   */
  static async getAllDocuments(collectionPath, dataType = null) {
    try {
      if (!collectionPath) throw new Error("Invalid collection path");

      const firebaseConverter = new FirebaseConverter();
      const converter = dataType ? getConverter(dataType, firebaseConverter) : null;

      let collectionRef = collection(firestoreDb, collectionPath);
      if (converter?.objectConverter) collectionRef = collectionRef.withConverter(converter.objectConverter);

      const querySnapshot = await getDocs(query(collectionRef));

      const documents = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, data: doc.data() });
      });

      return documents;
    } catch (error) {
      console.error("Error getting all documents:", error);
      return [];
    }
  }
}

/**
 * Helper: get Firestore converter by data type
 * @param {string} dataType
 * @param {FirebaseConverter} firebaseConverter
 * @returns {Object|null} converter object
 */
const getConverter = (dataType, firebaseConverter) => {
  switch (dataType) {
    case "recipe":
      return { objectConverter: firebaseConverter.recipeConverter };
    case "ingredient":
      return { objectConverter: firebaseConverter.ingredientsConverter };
    case "order":
      return { objectConverter: firebaseConverter.orderConverter };
    case "gptResponse":
      return { objectConverter: firebaseConverter.gptResponseConverter };
    case "goalsResponse":
      return { objectConverter: firebaseConverter.goalsResponseConverter };
    case "plan":
      return { objectConverter: firebaseConverter.planConverter };
    default:
      return null; // No converter, default Firestore behavior
  }
};

export default FirestoreService;
