import {
	StyleSheet,
	Text,
	View,
	TextInput,
	Button,
	SafeAreaView,
} from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { useState, useEffect, SetStateAction } from "react";
import * as SQLite from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import {
	useDatabaseContext,
	useTasksContext,
	useTrackersContext,
} from "../context";
import CustomButton from "./helpers/CustomButton";
import { TouchableOpacity } from "react-native-gesture-handler";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LineChart } from "react-native-gifted-charts";

interface Props {
	navigation: any;
	route: any;
}

const Graph = ({ navigation, route }: Props) => {
	const [error, setError] = useState<string | null>(null);
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());
	const [showStartDate, setShowStartDate] = useState(false);
	const [showEndDate, setShowEndDate] = useState(false);
	const [dataArray, changeDataArray] = useState([]);

	useEffect(() => {}, [dataArray]);

	const changeDate = (
		event: any,
		selectedDate: Date | undefined,
		setDate: React.Dispatch<SetStateAction<Date>>,
		type: number
	) => {
		if (selectedDate !== undefined) {
			setDate(selectedDate);
			if (type === 1) {
				setShowStartDate(false);
			} else {
				setShowEndDate(false);
			}
		}
	};

	const getFormattedDate = (date: Date) => {
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		const year = date.getFullYear();

		const formattedDate = `${month}/${day}/${year}`;
		return formattedDate;
	};

	const generateDates = () => {
		let currentDate = new Date(startDate);
		let tempData = [];
		console.log(currentDate);
		while (currentDate <= endDate) {
			tempData.push(currentDate);
			currentDate.setDate(currentDate.getDate() + 1);
		}
		console.log(tempData);
	};

	return (
		<View style={styles.container}>
			<View style={styles.topBar}>
				<CustomButton
					name="<"
					onPress={() => navigation.navigate("Home")}
				></CustomButton>
				<View style={styles.mainView}>
					<Text
						style={[
							styles.textStyle,
							error !== null
								? [{ marginBottom: 0 }, { marginTop: 0 }]
								: null,
						]}
						numberOfLines={1}
						ellipsizeMode="tail"
					>
						{route.params.task.name}
					</Text>
					{error !== null ? (
						<Text
							style={[
								styles.textStyle,
								{ fontSize: 15 },
								{ color: "red" },
								{ marginTop: 0 },
								{ marginBottom: 5 },
							]}
						>
							{error}
						</Text>
					) : null}
				</View>
			</View>
			<View style={styles.mainView}>
				<View style={styles.taskTopBar}>
					<View>
						<Button
							title="select start date"
							onPress={() => setShowStartDate(true)}
						/>
						{showStartDate && (
							<DateTimePicker
								testID="dateTimePicker"
								value={startDate}
								onChange={(event, selectedDate) =>
									changeDate(
										event,
										selectedDate,
										setStartDate,
										1
									)
								}
							/>
						)}
						<Text style={[{ fontSize: 30 }, { color: "white" }]}>
							{getFormattedDate(startDate)}
						</Text>
					</View>
					<View>
						<Button
							title="select end date"
							onPress={() => setShowEndDate(true)}
						/>
						{showEndDate && (
							<DateTimePicker
								testID="dateTimePicker"
								value={endDate}
								onChange={(event, selectedDate) =>
									changeDate(
										event,
										selectedDate,
										setEndDate,
										2
									)
								}
							/>
						)}
						<Text style={[{ fontSize: 30 }, { color: "white" }]}>
							{getFormattedDate(endDate)}
						</Text>
					</View>
				</View>
				<Button
					title="generate dates"
					onPress={() => generateDates()}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#141414",
	},

	trackerType: {
		flex: 1,
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		backgroundColor: "#141414",
	},

	trackerTouch: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#303030",
	},

	trackerText: {
		textAlign: "center",
		color: "#D0D0D0",
		paddingLeft: 35,
		paddingRight: 35,
		fontSize: 20,
	},

	trackerOverride: {
		backgroundColor: "#793FDF",
	},

	inputBox: {
		flex: 1,
		backgroundColor: "#252525",
		textAlign: "center",
		color: "#E0E0E0",
		width: "100%",
	},

	inputText: {
		fontSize: 20,
		color: "white",
	},

	inputRow: {
		flex: 1,
		flexDirection: "column",
		padding: 5,
		width: "100%",
	},

	taskTopBar: {
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-between",
		flex: 1,
	},

	topBar: {
		width: "90%",
		flexDirection: "row",
		justifyContent: "space-between",
		paddingLeft: 20,
		alignItems: "center",
		borderColor: "#3F3F3F",
		borderBottomWidth: 0.5,
		borderRadius: 20,
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0,
	},

	mainView: {
		flex: 1,
		width: "100%",
		alignItems: "flex-start",
		justifyContent: "flex-start",
		paddingTop: 10,
		paddingLeft: 30,
		paddingRight: 30,
	},

	row: {
		flexDirection: "row",
		alignItems: "center",
		alignSelf: "stretch",
		justifyContent: "space-between",
		margin: 8,
	},

	textStyle: {
		color: "white",
		fontSize: 33,
		marginTop: 10,
		marginBottom: 15,
		marginRight: 10,
		paddingLeft: 10,
		paddingRight: 10,
		paddingTop: 0,
		paddingBottom: 0,
	},
});

export default Graph;
