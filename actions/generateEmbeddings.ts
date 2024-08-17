"use server";

import { generateEmbeddingsInPineconeVectorStore } from "@/lib/langchain";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function generateEmbeddings(docId: string) {
  auth().protect(); // Protect this route with clerk, make sure that only authenticated users access this function. It redirects them to your signin page if they are not auth

  // turn a pdf into embedding
  // this is a helper function that turns a pdf into lots of embeddings
  // and embedding is a like a string of numbers, turning a pdf into a lot of string of numbers
  // Why we so this is because large language models such as langchain
  await generateEmbeddingsInPineconeVectorStore(docId);

  // we would have added a new document and whatever we fetched on the dashboard, we want to make sure that it was refetched
  revalidatePath(`/dashboard`);

  return { completed: true };
}
