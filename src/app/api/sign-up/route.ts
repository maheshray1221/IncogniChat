import dbConnect from "@/src/lib/dbConection";
import { UserModel } from "@/src/model/user.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/src/helper/sendVerificationEmail";
import { ApiResponse } from "@/src/types/apiResponse";
import { success } from "zod";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();

    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    const verifyCode = Math.floor(1000 + Math.random() * 9000).toString();
    if (existingUserVerifiedByUsername) {
      return Response.json(
        { success: false, message: "Username already taken" },
        { status: 400 },
      );
    }
    const existingUserByEmail = await UserModel.findOne({ email });

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exist with this email",
          },
          { status: 400 },
        );
      } else {
        const hasedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hasedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      // false user not exist
      const hasedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hasedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        message: [],
      });

      await newUser.save();
    }
    // send verification email

    const emailResponse = await sendVerificationEmail(
      username,
      email,
      verifyCode,
    );

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 },
      );
    }

    return Response.json(
      {
        success: true,
        message: "User successfully registered ! please verify your email",
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("Error while registering user", error);
    return Response.json(
      { success: false, message: "Error while registering user" },
      { status: 500 },
    );
  }
}
