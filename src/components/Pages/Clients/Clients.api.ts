import { addDoc, collection } from "firebase/firestore";
import { firestoreDB } from "../../../firebase/firebase";
import { UserData } from "../../../types/user";
import { AddClientFormData } from "./AddClientDialog";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export const clientsApi = createApi({
  baseQuery: fakeBaseQuery(),
  endpoints: (build) => ({
    saveClient: build.mutation({
      async queryFn({
        newClient,
        loggedInUser,
      }: {
        newClient: AddClientFormData;
        loggedInUser: UserData;
      }) {
        try {
          const response = await addDoc(collection(firestoreDB, "clients"), {
            ...newClient,
            trainerId: loggedInUser ? loggedInUser.id : "GGWP",
          }); // call firebase here
          return { data: response };
        } catch (e) {
          return { error: e };
        }
      }
    }),

  }),
});

export const { useSaveClientMutation } = clientsApi;
