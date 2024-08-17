"use client";

import { generateEmbeddings } from "@/actions/generateEmbeddings";
import { db, storage } from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export enum StatusText {
  UPLOADING = "Uploading file...",
  UPLOADED = "File uploaded successfully",
  SAVING = "Saving file to database...",
  GENERATING = "Generating AI Embeddings, This will only take a few seconds...",
}

export type Status = StatusText[keyof StatusText];

const useUpload = () => {
  const [progress, setProgress] = useState<number | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);
  const [status, setStatus] = useState<Status | null>(null);
  const { user } = useUser(); // Gets the current user from clerk
  const router = useRouter();

  const handleUpload = async (file: File) => {
    //always include defensise programming

    if (!file || !user) return;

    // free/pro limitations : TODO

    const FileIDToUploadTo = uuidv4();

    const storageRef = ref(
      storage,
      `users/${user.id}/files/${FileIDToUploadTo}`
    );

    const uploadTask = uploadBytesResumable(storageRef, file); // this is a task

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );

        setStatus(StatusText.UPLOADING);
        setProgress(percent);
      },
      (error) => {
        console.error("Error uploading file", error);
      },
      async () => {
        setStatus(StatusText.UPLOADED);
        // Get the download URL because i just uploaded a file to firebase storage, now it is living in firebase storage
        // Now what i need to do is generate a special download URL that anyone can click to get access to the file

        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setStatus(StatusText.SAVING);

        await setDoc(doc(db, "users", user.id, "files", FileIDToUploadTo), {
          name: file.name,
          size: file.size,
          type: file.type,
          downloadURL: downloadURL,
          ref: uploadTask.snapshot.ref.fullPath,
          createdAt: new Date(),
        });

        setStatus(StatusText.GENERATING);
        // Generating the AI Embeddings

        await generateEmbeddings(FileIDToUploadTo);

        setFileId(FileIDToUploadTo);
      }
    );
  };
  return { progress, status, fileId, handleUpload };
};

export default useUpload;
