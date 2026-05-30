import { useMutation } from "@tanstack/react-query";
import { loginUserApi, registerUserApi } from "../api/authService";

export const useRegisterUser = () => {
  const { mutateAsync: registerUser } = useMutation({
    mutationFn: registerUserApi,
  });

  return { registerUser };
};

export const useLoginUser = () => {
  const { mutateAsync: loginUser } = useMutation({
    mutationFn: loginUserApi,
  });
  return { loginUser };
};
