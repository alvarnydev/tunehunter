import { useRouter } from "next/router";

type newParams = Record<string, string | number | null>;

const useRouterWithHelpers = () => {
  const router = useRouter();

  const getParams = (key: string) => {
    const params = router.query[key];
    return Array.isArray(params) ? params[0] : params;
  };

  // Adds the key-value pair to the URL, or removes them if the value is null
  const setParams = (params: newParams) => {
    const newQuery = { ...router.query };

    Object.keys(params).forEach((key) => {
      const value = params[key];
      if (!value) {
        delete newQuery[key];
      } else {
        newQuery[key] = typeof value === "number" ? String(value) : value;
      }
    });

    router.push(
      {
        pathname: router.pathname,
        query: newQuery,
      },
      undefined,
      { shallow: true, scroll: false },
    );
  };

  return {
    ...router,
    getParams,
    setParams,
  };
};

export default useRouterWithHelpers;
