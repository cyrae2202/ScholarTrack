import { createContext, useContext } from 'react';

interface NavContextType {
  navigate: (path: string) => void;
}

export const NavContext = createContext<NavContextType>({ navigate: () => {} });
export const useNavigate = () => useContext(NavContext);
