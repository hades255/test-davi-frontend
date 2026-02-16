"use client";
import MainLayout from "@/components/layout/mainLayout"
import DocumentClient from "./(protected)/documentchat/DocumentClient";
import ProtectedRoute from "@/components/ProtectedRoute";
import { WorkspaceProvider } from "@/context/WorkspaceContext";

export default function Home() {
  console.log(process.env.NEXT_PUBLIC_SKIP_AUTH);

  return (
    // <ProtectedRoute>
      <WorkspaceProvider>
        <MainLayout>
          <DocumentClient />
        </MainLayout>
      </WorkspaceProvider>
    // {/* </ProtectedRoute> */}
  );
}
