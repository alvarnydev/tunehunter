import { api } from "@/utils/api";

const useUserSettings = () => {
  const getUserSettings = (userId: string) => {
    return api.user.getUserSettings.useQuery({ id: userId });
  };

  const setUserSettings = (userId: string, theme?: string, language?: string, region?: string) => {
    // Implementation here
    const mutateSettings = api.user.setUserSettings.useMutation();
    mutateSettings.mutate(
      { id: userId, theme, language, region },
      {
        onError: () => {
          return 0;
        },
        onSuccess: () => {
          return 1;
        },
      },
    );
  };

  return {
    getUserSettings,
    setUserSettings,
  };
};

export default useUserSettings;
