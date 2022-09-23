import { FC } from "react";
import { Flex, Box, Input, Badge, useToast } from "@chakra-ui/react";
import SwapButton from "./SwapButton";
import * as Yup from "yup";
import { Formik, FormikHelpers } from "formik";
import { Contract, ethers } from "ethers";
import { useAccount, useBalance } from "wagmi";

interface BuyProps {
	exchangeRate: number;
	swap_contract: Contract;
}

const Buy: FC<BuyProps> = ({ exchangeRate, swap_contract }) => {
	const initialValues = {
		amount: 0,
	};

	const validationSchema = Yup.object({
		amount: Yup.number(),
	});

	const toast = useToast();
	const { address } = useAccount();
	const balance = useBalance({
		addressOrName: address,
	});

	const onSubmit: (
		values: typeof initialValues,
		helpers: FormikHelpers<typeof initialValues>
	) => void = ({ amount }, { setSubmitting, resetForm }) => {
		swap_contract
			.buyTokens({ value: ethers.utils.parseEther(amount.toString()) })
			.then(() => {
				setSubmitting(false);
				resetForm();
				toast({
					title: "Transaction Sent",
					status: "success",
					duration: 9000,
					isClosable: true,
				});
			})
			.catch((err: Error) => {
				setSubmitting(false);
				toast({
					title: "Transaction Failed",
					status: "error",
					duration: 9000,
					isClosable: true,
				});
			});
	};

	const balAmount: string =
		balance.data?.formatted !== undefined ? balance.data?.formatted : "";

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
									ETH
								</Badge>
								<Badge
									mt={3}
									bg="white"
									color={"black"}
									p={1}
									borderRadius={"md"}
									cursor={"pointer"}
									onClick={() => {
										props.setFieldValue(
											"amount",
											parseFloat(balAmount)
										);
									}}
								>
									Use
									{` ${parseFloat(balAmount).toFixed(2)} ${
										balance.data?.symbol
									}`}
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
									HZT
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
									value={props.values.amount * exchangeRate}
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

export default Buy;
