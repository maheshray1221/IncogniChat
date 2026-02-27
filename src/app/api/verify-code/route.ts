import dbConnect from "@/src/lib/dbConection";
import { UserModel } from "@/src/model/user.model";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { username, code } = await request.json();

    // always use when data come from url
    const decodedUsername = decodeURIComponent(username);

    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 400,
        },
      );
    }

    // check code
    const isCodeValid = user.verifyCode === code;
    // check code duration
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        {
          success: true,
          message: "Account verified successfully",
        },
        {
          status: 200,
        },
      );
    }
    // Todo: when verify code was expiry
    else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message:
            "verification code has expired. Please sign-up to get new code",
        },
        {
          status: 400,
        },
      );
    }
    // Todo : verify code has wrong
    else {
      return Response.json(
        {
          success: false,
          message: "Incorrect verification code",
        },
        {
          status: 400,
        },
      );
    }
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Error verifying user",
      },
      {
        status: 500,
      },
    );
  }
}
