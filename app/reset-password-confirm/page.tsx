import { Suspense } from "react";
import ResetPasswordConfirmClient from "./ResetPasswordConfirmClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordConfirmClient />
    </Suspense>
  );
}