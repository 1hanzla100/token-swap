import { Button, Box } from "@chakra-ui/react";
import { useAccount } from "wagmi";
import { FC } from "react";

interface SwapButtonProps {
	isLoading?: boolean;
	type?: "submit";
	isEmpty?: boolean;
}

const SwapButton: FC<SwapButtonProps> = (props) => {
	const { isConnected } = useAccount();

	return (
		<Box mt="0.5rem">
			<Button
				colorScheme={"teal"}
				width="100%"
				p="1.62rem"
				borderRadius="1.25rem"
				disabled={!isConnected || props.isLoading || props.isEmpty}
				isLoading={props.isLoading}
				type={props.type}
			>
				{isConnected ? "Swap" : "Connect Wallet"}
			</Button>
		</Box>
	);
};

export default SwapButton;
