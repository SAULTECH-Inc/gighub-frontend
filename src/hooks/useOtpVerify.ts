import { useMutation } from "@tanstack/react-query";
import { publicApiClient } from "../client/axios.ts";
import { toast } from "react-toastify";

interface VerifyOtpParams {
  otp: string;
}

interface VerifyOtpResponse {
  message: string;
  statusCode: number;
}

interface SendOtpParams {
  email: string;
  name: string; // Assuming user type is provided in the request
}

interface SendOtpResponse {
  message: string;
  statusCode: number;
}

const sendOtp = async (data: SendOtpParams): Promise<SendOtpResponse> => {
  return await publicApiClient
    .get("/auth/otp/send", {
      params: data,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response?.data || new Error("Unknown error occurred");
    });
};

const verifyOtp = async (data: VerifyOtpParams): Promise<VerifyOtpResponse> => {
  return await publicApiClient
    .get("/auth/otp/verify", {
      params: data,
    })
    .then((response) => {
      return response?.data;
    })
    .catch((error) => {
      throw error?.response?.data || new Error("Unknown error occurred");
    });
};

export const useOtp = () => {
  const sendOtpMutation = useMutation({
    mutationFn: sendOtp,
    onSuccess: (data) => {
      toast.success(data?.message);
      console.log("OTP Sent:", data);
    },
    onError: (error) => {
      toast.error(error?.message);
      console.error("OTP Sending Failed:", error);
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: verifyOtp,
    onSuccess: (data) => {
      console.log("OTP Verified:", JSON.stringify(data));
    },
    onError: (error) => {
      console.error("OTP Verification Failed:", error);
    },
  });

  return {
    sendOtp: sendOtpMutation.mutate,
    isSendingOtp: sendOtpMutation.isPending,
    isSendOtpError: sendOtpMutation.isError,
    isSendOtpSuccess: sendOtpMutation.isSuccess,
    sendOtpError: sendOtpMutation.error,

    verifyOtp: verifyOtpMutation.mutate,
    isVerifyingOtp: verifyOtpMutation.isPending,
    isVerifyOtpError: verifyOtpMutation.isError,
    isVerifyOtpSuccess: verifyOtpMutation.isSuccess,
    verifyOtpError: verifyOtpMutation.error,
  };
};
