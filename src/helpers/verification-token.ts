import { api } from "@/utils/api";
import { generateRandomNumbers } from "./random-generators";

const useVerificationToken = () => {
  const utils = api.useUtils();
  const deleteVerificationToken = api.user.deleteVerificationTokenByEmail.useMutation();
  const storeAndSendVerificationToken = api.user.storeAndSendVerificationToken.useMutation();

  const createAndSendVerificationToken = async (email: string) => {
    const numbers = generateRandomNumbers(6);
    const verificationToken = `${numbers}`;

    // Check if token already exists and delete it
    const existingTokenData = await utils.user.getVerificationTokenByEmail.fetch({ email });
    if (existingTokenData?.token) {
      deleteVerificationToken.mutate({ email });
    }

    // Create new token and hash it for DB
    storeAndSendVerificationToken.mutate({ email, token: verificationToken });
  };

  const verifyVerificationToken = async (email: string, token: string) => {
    const isValidToken = await utils.user.verifyVerificationToken.fetch({ email, token });
    console.log("isValidToken", isValidToken);
    if (isValidToken.error) return false;
    return true;
  };

  return {
    generateVerificationToken: createAndSendVerificationToken,
    verifyVerificationToken,
  };
};

export default useVerificationToken;
