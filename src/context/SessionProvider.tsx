"use client";

import { getSession } from "@/lib/actions";
import {
  createSessionStore,
  defaultInitState,
  initSessionStore,
  SessionStore,
} from "@/stores/createSessionStore";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useStore } from "zustand";

type SessionStoreApi = ReturnType<typeof createSessionStore>;

export const SessionStoreContext = createContext<SessionStoreApi | undefined>(
  undefined,
);

export interface SessionStoreProviderProps {
  children: ReactNode;
}

export const SessionStoreProvider = ({
  children,
}: SessionStoreProviderProps) => {
  const storeRef = useRef<SessionStoreApi>();
  const [_, setIsLoading] = useState(true);

  const initialStore = useMemo(() => {
    const sessionWithStatus = {
      ...defaultInitState,
      status: {
        loading: true,
        error: "",
      },
    };

    return createSessionStore(initSessionStore(sessionWithStatus));
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const session = await getSession();
        if (session) {
          const sessionWithStatus = {
            ...session,
            status: {
              loading: false,
              error: "",
            },
          };

          storeRef.current = createSessionStore(
            initSessionStore(sessionWithStatus),
          );
        } else {
          storeRef.current = createSessionStore(defaultInitState);
        }
      } catch (err) {
        const sessionWithError = {
          ...defaultInitState,
          status: {
            loading: false,
            error: `세션 데이터를 불러오는 중 오류가 발생했습니다. ${err}`,
          },
        };

        storeRef.current = createSessionStore(sessionWithError);
        throw new Error(
          `세션 데이터를 불러오는 중 오류가 발생했습니다: ${err}`,
        );
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <SessionStoreContext.Provider value={storeRef.current || initialStore}>
      {children}
    </SessionStoreContext.Provider>
  );
};

export const useSessionStore = <T,>(
  selector: (store: SessionStore) => T,
): T => {
  const sessionStoreContext = useContext(SessionStoreContext);

  if (!sessionStoreContext) {
    throw new Error("useSessionStore must be used within SessionStoreContext");
  }

  return useStore(sessionStoreContext, selector);
};
