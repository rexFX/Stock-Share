import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { useNavigate } from "react-router-dom";

const Login = () => {
	const navigate = useNavigate();

	const loginHandler = () => {
		navigate("/dashboard");
	};

	return (
		<div className="h-full w-full flex flex-col justify-center items-center">
			<h1 className="font-ubuntu text-4xl">Stock Share</h1>
			<button
				className="mt-8 w-72 border-2 p-3 border-black rounded-sm font-ubuntu bg-[#F9DCC4] hover:bg-[#FEC89A] transition-colors"
				onClick={loginHandler}
			>
				<div className="flex justify-evenly items-center">
					<FontAwesomeIcon icon={faGoogle} />
					Continue with Google
				</div>
			</button>
		</div>
	);
};

export default Login;
