"use client";

import { createContext, useContext, useEffect, useState } from "react";

type SocketContextType = {
	isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
	isConnected: false,
});

export const useSocket = () => {
	return useContext(SocketContext);
};


export const SocketProvider = ({
	children
}: { children: React.ReactNode }) => {
	const [isConnected, setIsConnected] = useState(false);

	useEffect(() => {
		
    console.log('hola papus')

	}, []);


	return (
		<SocketContext.Provider value={{
			isConnected
		}}>
			{children}
		</SocketContext.Provider>
	)

}