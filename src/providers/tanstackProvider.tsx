import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
  isServer,
} from "@tanstack/react-query";

const MAX_RETRY_AMOUNT = 4;

const makeQueryClient = (): QueryClient => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        refetchOnWindowFocus: false,
        retry: (failureCount) => {
          if (failureCount === MAX_RETRY_AMOUNT) return false;

          return true;
        },
      },
    },
    queryCache: new QueryCache(),
  });
};

let browserQueryClient: QueryClient | undefined = undefined;

const getQueryClient = (): QueryClient => {
  if (isServer) {
    return makeQueryClient();
  }

  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }

  return browserQueryClient;
};

export const TanstackProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
