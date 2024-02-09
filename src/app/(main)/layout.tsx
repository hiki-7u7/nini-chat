import { FC, ReactNode } from "react";
import NavigationSidebar from "@/components/navigation/navigation-sidebar";

interface LayoutMain {
  children: ReactNode;
}

const LayoutMain: FC<LayoutMain> = ({ children }) => {
  return (
    <div className="h-full">
      <div 
        className="
          hidden
          md:flex
          w-[70px]
          z-30
          h-full
          flex-col
          fixed
          inset-y-0`
        "
      >
        <NavigationSidebar />
      </div>
      <main className="md:pl-[70px] h-full">
        {children}
      </main>
    </div>
  );
}
 
export default LayoutMain;