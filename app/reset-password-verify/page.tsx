import { Suspense } from "react";
import ResetPasswordVerifyClient from "./ResetPasswordVerifyClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordVerifyClient />
    </Suspense>
  );
}
