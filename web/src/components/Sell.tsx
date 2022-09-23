import { FC, useEffect, useState } from "react";
import { Flex, Box, Input, Badge, useToast } from "@chakra-ui/react";
import SwapButton from "./SwapButton";
import * as Yup from "yup";
import { Formik, FormikHelpers } from "formik";
import { Contract, ethers } from "ethers";
import { useAccount, useBalance } from "wagmi";

interface SellProps {
	exchangeRate: number;
	swap_contract: Contract;
	token_contract: Contract;
}

const Sell: FC<SellProps> = ({
	exchangeRate,
	swap_contract,
	token_contract,
}) => {
	const initialValues = {
		amount: 0,
	};

	const validationSchema = Yup.object({
		amount: Yup.number(),
	});

	const toast = useToast();
	const { address } = useAccount();
	const [balance, setBalance] = useState<number>(1);

	useEffect(() => {
		token_contract.balanceOf(address).then((bal: string) => {
			setBalance(parseFloat(ethers.utils.formatEther(bal)));
		});
	}, [address, token_contract]);

	const onSubmit: (
		values: typeof initialValues,
		helpers: FormikHelpers<typeof initialValues>
	) => Promise<void> = async ({ amount }, { setSubmitting, resetForm }) => {
		try {
			let parsedAmount = ethers.utils.parseEther(amount.toString());
			let tokenApprovTx = await token_contract.approve(
				swap_contract.address,
				parsedAmount
			);
			let tokenApprovTxReceipt = await tokenApprovTx.wait();
			if (tokenApprovTxReceipt.status === 1) {
				await swap_contract
					.sellTokens(parsedAmount)
                setSubmitting(false);
                resetForm();
                toast({
                    title: "Transaction Sent",
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                });
			}
		} catch {
			setSubmitting(false);
			toast({
				title: "Transaction Failed",
				status: "error",
				duration: 9000,
				isClosable: true,
			});
		}
	};

	return (
		<Box p="0.5rem" bg="white" borderRadius="0 0 1.37rem 1.37rem">
			<Formik
				initialValues={initialValues}
				validationSchema={validationSchema}
				onSubmit={onSubmit}
			>
				{(props) => (
					<form onSubmit={props.handleSubmit}>
						<Flex
							alignItems="center"
							justifyContent="space-between"
							bg="gray.50"
							p="1rem 1rem 1.7rem"
							borderRadius="1.25rem"
						>
							<Box>
								<Badge
									colorScheme={"teal"}
									borderRadius="1.12rem"
									boxShadow="lg"
									fontWeight="500"
									fontSize={"md"}
									px={4}
									py={2}
								>
									HZK
								</Badge>
								<Badge
									mt={3}
									bg="white"
									color={"black"}
									p={1}
									borderRadius={"md"}
									cursor={"pointer"}
									onClick={() => {
										if (balance > 0)
											props.setFieldValue(
												"amount",
												balance
											);
									}}
								>
									Use
									{` ${balance} HZK`}
								</Badge>
							</Box>
							<Box>
								<Input
									placeholder="0"
									fontWeight="500"
									fontSize="1.5rem"
									width="100%"
									size="19rem"
									textAlign="right"
									bg="gray.50"
									outline="none"
									border="none"
									focusBorderColor="none"
									type="number"
									color="black"
									name="amount"
									onChange={props.handleChange}
									onBlur={props.handleBlur}
									value={props.values.amount}
								/>
							</Box>
						</Flex>

						<Flex
							mt="0.25rem"
							alignItems="center"
							justifyContent="space-between"
							bg="gray.50"
							p="1rem 1rem 1.7rem"
							borderRadius="1.25rem"
						>
							<Box>
								<Badge
									colorScheme={"teal"}
									borderRadius="1.12rem"
									boxShadow="lg"
									fontWeight="500"
									fontSize={"md"}
									px={4}
									py={2}
								>
									ETH
								</Badge>
							</Box>
							<Box>
								<Input
									placeholder="0"
									fontSize="1.5rem"
									width="100%"
									size="19rem"
									textAlign="right"
									bg="rgb(247, 248, 250)"
									outline="none"
									border="none"
									focusBorderColor="none"
									type="number"
									color="black"
									readOnly
									value={
										props.values.amount > 0
											? props.values.amount / exchangeRate
											: 0
									}
								/>
							</Box>
						</Flex>
						<SwapButton
							isLoading={props.isSubmitting}
							isEmpty={props.values.amount <= 0}
							type="submit"
						/>
					</form>
				)}
			</Formik>
		</Box>
	);
};

export default Sell;
