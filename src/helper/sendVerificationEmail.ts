import { resend } from "../lib/resend";
import VerificationEmail from "@/emails/VerificatioEmail";

import { ApiResponse } from "../types/apiResponse";

export async function sendVerificationEmail(
  username: string,
  email: string,
  verifyCode: string,
): Promise<ApiResponse> {
  try {
    const res = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Incongnichat | Verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    console.log("result",res)
    return { success: true, message: "Successfully send verification mail " };
  } catch (error) {
    console.error("Error while sending verification mail", error);
    return { success: false, message: "Failed to send verification mail " };
  }
}
