"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useDebounceValue } from "usehooks-ts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { signUpSchema } from "@/schemas/signUpSchema";
import { ApiResponse } from "@/types/apiResponse";
const router = useRouter();

// zod implementation
const form = useForm<z.infer<typeof signUpSchema>>({
  // resolver me use ho raha hai zodResoolver
  // and zodResolover ek schema mangta hai
  resolver: zodResolver(signUpSchema),
  defaultValues: {
    username: "",
    password: "",
    email: "",
  },
});

export default function page() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounceUsername = useDebounceValue(username, 400);

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (debounceUsername) {
        setIsCheckingUsername(true);
        setUsernameMessage("");

        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${debounceUsername}`,
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ??
              "Error while checking username uniqueness",
          );
        } finally {
          // finally hamesa run krta hai chahe error aaye ya response aaye
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
    // Todo: my work is add debounce for email
  }, [debounceUsername]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      toast.success(response.data.message);
      // router.replace => Naya page open hoga
      // Lekin browser history me previous page save nahi hoga
      // User Back button dabayega to wapas nahi jayega
      router.replace(`/verify/${username}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage =
        axiosError.response?.data.message ??
        "Error while checking username uniqueness";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystery Message
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        {/* start ower form */}
        
      </div>
    </div>
  );
}
