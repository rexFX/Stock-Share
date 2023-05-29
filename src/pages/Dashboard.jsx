import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";

import { ReactComponent as Spinner } from "../spinner.svg";

import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Filler,
	Legend,
} from "chart.js";

import { Line, getElementAtEvent } from "react-chartjs-2";
import { googleLogout } from "@react-oauth/google";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Filler,
	Legend
);

const ChartRender = ({ stockData, priceDate }) => {
	const chartRef = useRef(null);

	const handlePointClick = (event) => {
		if (!chartRef.current) return null;
		let clickedPoint = getElementAtEvent(chartRef.current, event)[0];
		if (clickedPoint) {
			let index = clickedPoint.index;
			priceDate(
				stockData[0].labels[index],
				stockData[0].datasets[0].data[index],
				stockData[1].currency
			);
		}
	};

	const options = {
		scales: {
			y: {
				beginAtZero: true,
			},
		},
		aspectRatio: 2,
	};

	if (!stockData) return null;

	return (
		<div className="mt-20 w-full md:w-[80%] lg:w-[60%] flex justify-center">
			<Line
				ref={chartRef}
				data={stockData[0]}
				options={options}
				onClick={handlePointClick}
			/>
		</div>
	);
};

const Dashboard = () => {
	const [companyPresent, setCompanyPresent] = useState(false);
	const [company, setCompany] = useState("");
	const [exchange, setExchange] = useState("");
	const [price, setPrice] = useState("");
	const [currency, setCurrency] = useState("");
	const [companyList, setCompanyList] = useState([]);
	const [data, setData] = useState(null);
	const [date, setDate] = useState("");
	const [token, setToken] = useState(localStorage.getItem("token"));
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	if (token === null) {
		return (
			<div>
				<h1>Not Logged In</h1>
			</div>
		);
	}

	const dateAndPriceSetter = (Date, Price, Currency) => {
		setDate(Date);
		setPrice(Price);
		setCurrency(Currency);
	};

	const companyFinder = async () => {
		if (company.length > 0 && exchange.length > 0) {
			setLoading(true);
			await fetch(`${process.env.REACT_APP_BACKEND}/api/findCompany`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					company: company,
					exchange: exchange,
				}),
			})
				.then((res) => res.json())
				.then((data) => {
					setLoading(false);
					setCompanyList(data);
				})
				.catch((err) => {
					setLoading(false);
					console.log(err);
				});
		}
	};

	const stockDetails = async (symbol) => {
		await fetch(`${process.env.REACT_APP_BACKEND}/api/getStocks`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ symbol: symbol }),
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				setData(data);
			})
			.catch((err) => console.log(err));
	};

	const logoutHandler = async () => {
		googleLogout();
		localStorage.removeItem("token");
		await fetch(`${process.env.REACT_APP_BACKEND}/api/logout`, {
			method: "POST",
			headers: {
				authorization: `Bearer ${token}`,
			},
		}).then(() => navigate("/"));
	};

	return (
		<div className="h-full w-full overflow-y-auto">
			<nav className="w-full flex-row">
				<button
					className="m-4 w-20 border-2 p-2 border-black rounded-sm font-ubuntu bg-[#F9DCC4] hover:bg-[#FEC89A] transition-colors"
					onClick={logoutHandler}
				>
					Logout
				</button>
				{companyPresent && (
					<button
						className="m-4 w-20 border-2 p-2 border-black rounded-sm font-ubuntu bg-[#F9DCC4] hover:bg-[#FEC89A] transition-colors"
						onClick={() => {
							setCompanyPresent(false);
							setPrice("");
							setDate("");
							setData(null);
						}}
					>
						Back
					</button>
				)}
			</nav>

			<div className="w-full flex-col overflow-y-auto">
				{data && (
					<div className="h-[60%] w-full flex justify-center overflow-x-auto">
						<ChartRender
							stockData={data}
							priceDate={dateAndPriceSetter}
						/>
					</div>
				)}
				{companyPresent && !data && (
					<div className="mt-20 w-full h-1/3 flex justify-center items-center">
						<Spinner />
					</div>
				)}

				<div
					className={`w-full text-center ${
						companyPresent
							? "h-auto"
							: "h-[50%] flex justify-center items-center"
					}`}
				>
					{companyPresent ? (
						<>
							{date.length > 0 ? (
								<h2 className="mt-8 md:mt-14 text-sm md:text-2xl lg:text-4xl font-ubuntu text-left md:text-center p-3">
									The stock price of{" "}
									<span className="text-blue-800">
										{company}
									</span>{" "}
									on{" "}
									<span className="text-red-700">{date}</span>{" "}
									is{" "}
									<span className="text-green-700">
										{currency} {price}
									</span>
								</h2>
							) : (
								<h2 className="mt-8 md:mt-14 text-sm md:text-2xl lg:text-4xl font-ubuntu p-3">
									Select a date from the graph
								</h2>
							)}
							{date.length > 0 && (
								<div>
									<button
										className="m-4 w-30 border-2 p-2 border-black rounded-sm font-ubuntu bg-[#F9DCC4] hover:bg-[#FEC89A] transition-colors"
										onClick={() => {
											window.open(
												`mailto:?subject=Stock Price of ${company}&body=The stock price of ${company} on ${date} is ${currency} ${price}`,
												"_blank"
											);
										}}
									>
										Share via email
									</button>
									<button
										className="m-4 w-30 border-2 p-2 border-black rounded-sm font-ubuntu bg-[#F9DCC4] hover:bg-[#FEC89A] transition-colors"
										onClick={() => {
											window.open(
												`https://api.whatsapp.com/send?text=The stock price of ${company} on ${date} is ${currency} ${price}`,
												"_blank"
											);
										}}
									>
										Share via Whatsapp
									</button>
								</div>
							)}
						</>
					) : (
						<div className="h-full w-[80%] md:w-[75%] lg:w-1/3 flex-col justify-center items-center mt-36">
							<h2 className="font-ubuntu text-center text-lg lg:text-4xl">
								Company Search
							</h2>
							<div className="flex justify-evenly items-center">
								<input
									className="border-2 border-black rounded-sm p-2 mt-4 mr-2 w-28 md:w-44 lg:w-52 font-ubuntu"
									type="text"
									value={company}
									placeholder="Company"
									onChange={(e) => setCompany(e.target.value)}
								/>
								<input
									className="border-2 border-black rounded-sm p-2 mt-4 w-28 md:w-44 lg:w-52 font-ubuntu"
									type="text"
									value={exchange}
									placeholder="Exchange"
									onChange={(e) =>
										setExchange(e.target.value)
									}
								/>
							</div>
							<div className="w-full flex justify-center">
								<button
									className="m-4 w-40 border-2 p-2 border-black rounded-sm font-ubuntu text-lg bg-[#F9DCC4] hover:bg-[#FEC89A] transition-colors"
									onClick={companyFinder}
								>
									{loading ? (
										<div className="flex justify-center items-center">
											<Spinner />
										</div>
									) : (
										"Search"
									)}
								</button>
							</div>
							{companyList.length > 0 && (
								<div className="w-full max-h-64 flex-col overflow-y-auto border-2 border-black rounded-lg p-4">
									{companyList.map((company) => {
										return (
											<button
												key={company.symbol}
												className="w-full mb-1 border-2 p-2 border-black rounded-sm font-ubuntu text-lg bg-[#F9DCC4] hover:bg-[#FEC89A] transition-colors text-left pl-8"
												onClick={() => {
													setCompany(company.name);
													setCompanyPresent(true);
													stockDetails(
														company.symbol
													);
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
		</div>
	);
};

export default Dashboard;
