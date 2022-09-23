import { Box, Flex, Container, chakra } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FC } from "react";

const Header: FC = () => {
	return (
		<>
			<Box px={4}>
				<Container maxW={"6xl"}>
					<Flex
						h={16}
						alignItems={"center"}
						justifyContent={"space-between"}
					>
						<chakra.h1 fontSize="xl">Token Swap</chakra.h1>
						<ConnectButton />
					</Flex>
				</Container>
			</Box>
		</>
	);
};

export default Header;