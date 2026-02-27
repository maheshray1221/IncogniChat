import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { UserModel } from "@/src/model/user.model";
import { User } from "next-auth";
import dbConnect from "@/src/lib/dbConection";

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticate",
      },
      {
        status: 401,
      },
    );
  }
  const userId = user._id;

  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true },
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "Failed to update user status to accept messages",
        },
        {
          status: 400,
        },
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message Acceptance status updated successfully ",
        updatedUser,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to update user status to accept messages",
      },
      {
        status: 500,
      },
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticate",
      },
      {
        status: 401,
      },
    );
  }
  const userId = user._id;

  try {
    const foundUser = await UserModel.findById(userId);

    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "User Not found",
        },
        {
          status: 404,
        },
      );
    }

    return Response.json(
      {
        success: true,
        isAcceptingMessage: foundUser.isAcceptingMessage,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to get user status to accept messages",
      },
      {
        status: 500,
      },
    );
  }
}
