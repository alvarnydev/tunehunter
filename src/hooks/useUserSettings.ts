import { Locale } from "@/helpers/lang";
import { api } from "@/utils/api";

const useUserSettings = (userId: string | undefined) => {
  const mutateSettings = api.user.setUserSettings.useMutation();

  const getUserSettings = () => {
    const { data: userSettings } = api.user.getUserSettings.useQuery(
      { userId: userId! },
      { enabled: !!userId },
    );
    return userSettings;
  };

  const userSettingsUpdaters = {
    updatePreferredTheme: (theme: string) => {
      if (!userId) return { error: "Tried to save theme without user ID" };
      mutateSettings.mutate(
        { id: userId, theme },
        {
          onError: () => {
            return 0;
          },
          onSuccess: () => {
            return 1;
          },
        },
      );
    },

    updatePreferredLanguage: (language: Locale) => {
      if (!userId) return { error: "Tried to save language without userId" };
      mutateSettings.mutate(
        { id: userId, language },
        {
          onError: () => {
            return 0;
          },
          onSuccess: () => {
            return 1;
          },
        },
      );
    },

    updatePreferredRegion: (region: string) => {
      if (!userId) return { error: "Tried to save region without userId" };
      mutateSettings.mutate(
        { id: userId, region },
        {
          onError: () => {
            return 0;
          },
          onSuccess: () => {
            return 1;
          },
        },
      );
    },
  };

  return {
    getUserSettings,
    userSettingsUpdaters,
  };
};

export default useUserSettings;
