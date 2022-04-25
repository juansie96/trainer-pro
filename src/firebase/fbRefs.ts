import {
  collection,
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from "firebase/firestore";
import { Client } from "../components/Pages/Clients/Clients";
import { firestoreDB } from "./firebase";

const clientConverter: FirestoreDataConverter<Client> = {
  toFirestore(client: WithFieldValue<Client>): DocumentData {
    console.log('executing', client)
    return {
      name: client.name,
      lastname: client.lastname,
      email: client.email,
      age: client.age,
      trainerId: client.trainerId
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Client {
    const data = snapshot.data(options);
    return {
      name: data.name,
      lastname: data.lastname,
      email: data.email,
      age: data.age,
      trainerId: data.trainerId,
      id: snapshot.id,
      ref: snapshot.ref,
    };
  },
};

export const clientsRef = collection(firestoreDB, "clients").withConverter(clientConverter);

export default null;