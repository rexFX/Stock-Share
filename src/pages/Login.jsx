import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

const Login = () => {
	const navigate = useNavigate();
	const handler = useGoogleLogin({
		onSuccess: ({ access_token }) => {
			localStorage.setItem("token", access_token);
			fetch(`${process.env.REACT_APP_BACKEND}/api/addUser`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${access_token}`,
				},
			})
				.then(({ name, email }) => {
					localStorage.setItem("name", name);
					localStorage.setItem("email", email);
				})
				.catch((err) => console.log("error in login in frontend", err));
			navigate("/dashboard");
		},
	});

	const loginHandler = () => {
		handler();
	};

	return (
		<div className="h-full w-full flex flex-col justify-center items-center">
			<h1 className="font-poppins text-4xl">Stock Share</h1>
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
