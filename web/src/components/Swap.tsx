import {
	Flex,
	Box,
	Image,
	Text,
	Button,
	Input,
	Tabs,
	TabList,
	TabPanel,
	TabPanels,
	Badge,
	Tab,
	useDisclosure,
} from "@chakra-ui/react";
import { FC, useEffect } from "react";
import { SettingsIcon, ChevronDownIcon, ArrowDownIcon } from "@chakra-ui/icons";
import SwapButton from "./SwapButton";
import { useState } from "react";
import Buy from "./Buy";
import { useContract, useProvider, useSigner } from "wagmi";
import {
	HZT_TOKEN_ABI,
	HZT_TOKEN_ADDRESS,
	SWAP_CONTRACT_ABI,
	SWAP_CONTRACT_ADDRESS,
} from "../config";
import { Contract, ethers } from "ethers";
import Sell from "./Sell";

interface SwapProps {}

const Swap: FC<SwapProps> = () => {
	const [exchangeRate, setExchangeRate] = useState<number>(0);
	// const provider = useProvider();
	const { data: signer } = useSigner();

	const swap_contract: Contract = useContract({
		addressOrName: SWAP_CONTRACT_ADDRESS,
		contractInterface: SWAP_CONTRACT_ABI,
		signerOrProvider: signer,
	});

	const token_contract: Contract = useContract({
		addressOrName: HZT_TOKEN_ADDRESS,
		contractInterface: HZT_TOKEN_ABI,
		signerOrProvider: signer,
	});

	useEffect(() => {
		swap_contract.getRate().then((data: string) => {
			setExchangeRate(parseFloat(ethers.utils.formatUnits(data, 0)));
		});
	}, [swap_contract]);

	return (
		<Box
			maxWidth="30.62rem"
			mx="auto"
			mt={"5.25rem"}
			boxShadow={"lg"}
			borderRadius="1.37rem"
		>
			<Tabs py="1rem" isFitted variant="soft-rounded" colorScheme="teal">
				<TabList px="1.25rem">
					<Tab>Buy</Tab>
					<Tab>Sell</Tab>
				</TabList>
				<TabPanels>
					<TabPanel>
						<Buy
							exchangeRate={exchangeRate}
							swap_contract={swap_contract}
						/>
					</TabPanel>
					<TabPanel>
						<Sell
							exchangeRate={exchangeRate}
							swap_contract={swap_contract}
							token_contract={token_contract}
						/>
					</TabPanel>
				</TabPanels>
			</Tabs>
			{/* </Flex> */}
		</Box>
	);
};

export default Swap;
