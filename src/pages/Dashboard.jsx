import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Line } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Filler,
} from "chart.js";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Filler
);

const ChartRender = () => {
	const data = {
		labels: ["January", "February", "March", "April"],
		datasets: [
			{
				label: "Stock Price",
				data: [65, 59, 80, 81, 56, 55, 40],
				backgroundColor: "rgba(255, 181, 167, 0.4)",
				fill: true,
				borderColor: "rgba(75,192,192,1)",
				borderWidth: 2,
			},
		],
	};

	const options = {
		responsive: true,
		scales: {
			y: {
				beginAtZero: true,
			},
		},
		legend: {
			display: false,
		},
	};

	return (
		<div className="mt-20 w-full h-full max-w-[90%] lg:max-w-[85%] lg:max-h-[60%] flex justify-center">
			<Line data={data} options={options} />
		</div>
	);
};

const Dashboard = () => {
	const navigate = useNavigate();
	const [companyPresent, setCompanyPresent] = useState(false);
	const [company, setCompany] = useState("_______");
	const [exchange, setExchange] = useState("");
	const [symbol, setSymbol] = useState("");
	const [price, setPrice] = useState("______");
	const [companyList, setCompanyList] = useState([]);

	const companyFinder = () => {
		if (company.length > 0 && exchange.length > 0) {
			fetch(
				`https://fmpcloud.io/api/v3/search?query=${company}&limit=30&exchange=${exchange.toUpperCase()}&apikey=${
					process.env.REACT_APP_FMPCLOUD_API_KEY
				}`
			)
				.then((res) => res.json())
				.then((data) => {
					setCompanyList(data);
				});
		}
	};

	return (
		<div className="h-full w-full">
			<nav className="w-full flex-row">
				<button
					className="m-4 w-20 border-2 p-2 border-black rounded-sm font-ubuntu bg-[#F9DCC4] hover:bg-[#FEC89A] transition-colors"
					onClick={() => navigate("/", { replace: true })}
				>
					Logout
				</button>
				{companyPresent && (
					<button
						className="m-4 w-20 border-2 p-2 border-black rounded-sm font-ubuntu bg-[#F9DCC4] hover:bg-[#FEC89A] transition-colors"
						onClick={() => {
							setCompanyPresent(false);
							setCompany(" ");
							setSymbol(" ");
							setPrice(" ");
						}}
					>
						Back
					</button>
				)}
			</nav>

			{companyPresent && (
				<div className="h-[60%] w-full flex justify-center">
					<ChartRender />
				</div>
			)}

			<div
				className={`h-[${
					companyPresent ? "auto" : "50%"
				}] w-full flex justify-center items-center`}
			>
				{companyPresent ? (
					<h2 className="font-ubuntu text-lg md:text-2xl lg:text-4xl">
						The stock price of {company} on the 15th of May is{" "}
						{price}
					</h2>
				) : (
					<div className="h-full w-[80%] md:w-[75%] lg:w-1/3 flex-col justify-center items-center mt-36">
						<h2 className="font-ubuntu text-center text-lg lg:text-4xl">
							Company Search
						</h2>
						<div className="flex justify-around items-center">
							<input
								className="border-2 border-black rounded-sm p-2 mt-4 mr-2 w-44 md:w-72 font-ubuntu"
								type="text"
								placeholder="Company Name"
								onChange={(e) => setCompany(e.target.value)}
							/>
							<input
								className="border-2 border-black rounded-sm p-2 mt-4 w-44 md:w-72 font-ubuntu"
								type="text"
								placeholder="Exchange"
								onChange={(e) => setExchange(e.target.value)}
							/>
						</div>
						<div className="w-full flex justify-center">
							<button
								className="m-4 w-40 border-2 p-2 border-black rounded-sm font-ubuntu text-lg bg-[#F9DCC4] hover:bg-[#FEC89A] transition-colors"
								onClick={companyFinder}
							>
								Search
							</button>
						</div>
						{companyList.length > 0 && (
							<div className="w-full h-96 flex-col overflow-y-auto border-2 border-black rounded-lg p-4">
								{companyList.map((company) => {
									return (
										<button
											className="w-full mb-1 border-2 p-2 border-black rounded-sm font-ubuntu text-lg bg-[#F9DCC4] hover:bg-[#FEC89A] transition-colors text-left pl-8"
											onClick={() => {
												setCompanyPresent(true);
												setCompany(company.name);
												setSymbol(company.symbol);
											}}
										>
											{company.name}
										</button>
									);
								})}
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default Dashboard;

/*
Set symbol, fetch graph, add date and time feature and add whatsapp n mail sharing and add login and logout
*/
