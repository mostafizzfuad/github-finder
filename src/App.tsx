import UserSearch from "./components/UserSearch";
import { Toaster } from "sonner";

const App = () => {
	return (
		<div className="container">
			<h1>GitHub User Search</h1>
			<UserSearch />
			<Toaster richColors position="top-center" />
		</div>
	);
};

export default App;
