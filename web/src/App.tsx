import { Container } from "@chakra-ui/react";
import { FC } from "react";
import Header from "./components/Header";
import Swap from "./components/Swap";

interface AppProps {}

const App: FC<AppProps> = () => {
	return (
		<>
			<Header />
			<Container>
				<Swap />
			</Container>
		</>
	);
};

export default App;
