import { Session } from "next-auth";
import { createStore } from "zustand";

interface Status {
  loading: boolean;
  error: string;
}

interface SessionState extends Session {
  status: Status;
}

interface SessionAction {
  setSession: (session: SessionState) => void;
}

export type SessionStore = SessionState & SessionAction;

/**
 * 세션 정보 초기화
 *
 * @param session
 * @returns
 */
export const initSessionStore = (session: SessionState): SessionState => {
  return {
    user: session.user,
    accessToken: session.accessToken,
    status: session.status,
    expires: session.expires,
  };
};

export const defaultInitState: SessionState = {
  user: {
    id: "",
    name: "",
    email: "",
  },
  accessToken: "",
  expires: "",
  status: {
    loading: true,
    error: "",
  },
};

/**
 * 세션 스토어 생성
 *
 * @param initState
 * @returns
 */
export const createSessionStore = (
  initState: SessionState = defaultInitState,
) => {
  return createStore<SessionStore>()((set) => ({
    ...initState,
    setSession: (session) =>
      set({
        user: session.user,
        accessToken: session.accessToken,
        expires: session.expires,
        status: session.status,
      }),
  }));
};
