import dbConnect from "@/src/lib/dbConection";
import { UserModel } from "@/src/model/user.model";
import { z } from "zod";
import { usernameValidation } from "@/src/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {

  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      username: searchParams.get("username"),
    };
    // validate with zod
    const result = UsernameQuerySchema.safeParse(queryParams);

    console.log(result); // todo: remove it

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(",")
              : "Invalid query parameters",
        },
        {
          status: 400,
        },
      );
    }

    const { username } = result.data;

    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 },
      );
    }

    return Response.json(
      {
        success: true,
        message: "Username is available",
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("Error Check Username", error);
    return Response.json(
      {
        success: false,
        message: "Error Check Username",
      },
      {
        status: 500,
      },
    );
  }
}
