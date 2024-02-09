import { FC, ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode
}
 
const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="h-full bg-indigo-500 flex items-center justify-center">
      {children}
    </div>
  );
}
 
export default AuthLayout;