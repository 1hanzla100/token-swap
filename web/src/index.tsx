import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { ChakraProvider } from "@chakra-ui/react";

import { FC } from "react";
import "@rainbow-me/rainbowkit/styles.css";

import {
	getDefaultWallets,
	RainbowKitProvider,
	lightTheme,
} from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import "@rainbow-me/rainbowkit/styles.css";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { goerli } from "wagmi/chains";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);

const Index: FC = () => {
	const { chains, provider } = configureChains(
		[goerli],
		[
			jsonRpcProvider({
				rpc: (chain) => ({
					http: "https://goerli.infura.io/v3/96e9c48bc2704ff0b4743a59e8183b86",
				}),
			}),
		]
	);

	const { connectors } = getDefaultWallets({
		appName: "Token Swap",
		chains,
	});

	const wagmiClient = createClient({
		autoConnect: true,
		connectors,
		provider,
	});

	return (
		<WagmiConfig client={wagmiClient}>
			<RainbowKitProvider
				chains={chains}
				theme={lightTheme({
					accentColor: "#319795",
					accentColorForeground: "white",
					borderRadius: "large",
				})}
			>
				<App />;
			</RainbowKitProvider>
		</WagmiConfig>
	);
};

root.render(
	<React.StrictMode>
		<ChakraProvider>
			<Index />
		</ChakraProvider>
	</React.StrictMode>
);

reportWebVitals();
