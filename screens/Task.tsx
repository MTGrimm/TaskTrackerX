import {
	StyleSheet,
	Text,
	View,
	TextInput,
	Button,
	SafeAreaView,
} from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { useState, useEffect } from "react";
import * as SQLite from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import {
	useDatabaseContext,
	useTasksContext,
	useTrackersContext,
} from "../context";
import CustomButton from "./helpers/CustomButton";
import { TouchableOpacity } from "react-native-gesture-handler";

interface Props {
	navigation: any;
	/*task?: {
		id: number;
		name: string;
		description: string;
		tracker_type: number;
		time_goal: number;
		counter_goal: number;
		is_active: number;
	};*/
	route: any;
}

const Task = ({ navigation, route }: Props) => {
	const [taskName, setTaskName] = useState(route.params.task.name);
	const [taskDescription, setTaskDescription] = useState(
		route.params.task.description
	);
	const [selectedTracker, setSelectedTracker] = useState(
		route.params.task.tracker_type
	);
	const [timeGoalHour, setTimeGoalHour] = useState(
		Math.floor(route.params.task.time_goal / 60).toString()
	);

	const [timeGoalMinute, setTimeGoalMinute] = useState(
		(route.params.task.time_goal - Number(timeGoalHour) * 60).toString()
	);

	const [countGoal, setCountGoal] = useState(
		route.params.task.count_goal.toString()
	);

	const [error, setError] = useState<string | null>(null);
	const db = useDatabaseContext();
	const { tasks, setTasks } = useTasksContext();
	const { trackers, setTrackers } = useTrackersContext();

	const displayTime = () => {
		return (
			<View style={{ flex: 1 }}>
				<Text style={[styles.inputText, { textAlign: "center" }]}>
					Time Goal:{" "}
				</Text>
				<View
					style={[
						{ flex: 1 },
						{ flexDirection: "column" },
						{ justifyContent: "center" },
						{ alignItems: "center" },
					]}
				>
					<View
						style={[
							{ flex: 1 },
							{ flexDirection: "row" },
							{ alignContent: "center" },
							{ backgroundColor: "#202020" },
						]}
					>
						<Text
							style={[
								{ flex: 1 },
								{ textAlign: "center" },
								{ textAlignVertical: "center" },
								{ alignSelf: "center" },
								{ color: "#E0E0E0" },
							]}
						>
							Hours:
						</Text>
						<TextInput
							value={timeGoalHour}
							keyboardType="numeric"
							placeholder={timeGoalHour}
							placeholderTextColor={"#C0C0C0"}
							onChangeText={setTimeGoalHour}
							style={[styles.inputBox, { flexGrow: 2 }]}
						/>
					</View>
					<View
						style={[
							{ flex: 1 },
							{ flexDirection: "row" },
							{ alignContent: "center" },
							{ justifyContent: "center" },
							{ backgroundColor: "#202020" },
						]}
					>
						<Text
							style={[
								{ flex: 1 },
								{ textAlignVertical: "center" },
								{ textAlign: "center" },
								{ alignSelf: "center" },
								{ color: "#E0E0E0" },
							]}
						>
							Minutes:{" "}
						</Text>
						<TextInput
							value={timeGoalMinute}
							keyboardType="numeric"
							placeholder={timeGoalMinute}
							placeholderTextColor={"#C0C0C0"}
							onChangeText={setTimeGoalMinute}
							style={[styles.inputBox, { flexGrow: 2 }]}
						/>
					</View>
				</View>
			</View>
		);
	};

	const displayCounter = () => {
		return (
			<View style={[{ flex: 1 }, { flexDirection: "column" }]}>
				<Text style={[styles.inputText, { textAlign: "center" }]}>
					Counter Goal
				</Text>
				<View
					style={[
						{ flex: 1 },
						{ justifyContent: "center" },
						{ alignItems: "center" },
					]}
				>
					<TextInput
						value={countGoal}
						keyboardType="numeric"
						placeholder={countGoal}
						placeholderTextColor={"#C0C0C0"}
						onChangeText={setCountGoal}
						style={styles.inputBox}
					/>
				</View>
			</View>
		);
	};

	const displayTrackerGoal = () => {
		if (selectedTracker === 1) {
			return <View style={[{ flex: 0.8 }]}>{displayCounter()}</View>;
		} else if (selectedTracker === 2) {
			return <View style={[{ flex: 0.8 }]}>{displayTime()}</View>;
		} else {
			return (
				<View style={[{ flex: 0.8 }, { flexDirection: "row" }]}>
					<View
						style={[
							{ flex: 0.69 },
							{ flexDirection: "row" },
							{ marginRight: 3 },
						]}
					>
						{displayCounter()}
					</View>
					<View style={[{ flex: 1 }, { flexDirection: "column" }]}>
						{displayTime()}
					</View>
				</View>
			);
		}
	};

	const handleTracker = (trackerID: number) => {
		setSelectedTracker(trackerID);
	};

	const convertTime = () => {
		return Number(timeGoalHour) * 60 + Number(timeGoalMinute);
	};

	// getting the date
	const getCurrentDate = () => {
		const date = new Date();

		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		const year = date.getFullYear();

		const formattedDate = `${month}/${day}/${year}`;
		return formattedDate;
	};

	const checkInputs = () => {
		const timeGoal = convertTime();
		if (taskName !== "") {
			if (taskDescription !== "") {
				if (selectedTracker === 1) {
					if (
						Number(countGoal) > 0 &&
						Math.floor(Number(countGoal)) === Number(countGoal)
					) {
						setError("");
						updateTask(Number(countGoal), 0);
					} else
						setError(
							"Count value has to be a whole number greater than 0"
						);
				}
				if (selectedTracker === 2) {
					if (
						timeGoal > 0 &&
						Number(timeGoalHour) >= 0 &&
						Number(timeGoalMinute) >= 0 &&
						Math.floor(Number(timeGoalHour)) ===
							Number(timeGoalHour) &&
						Math.floor(Number(timeGoalMinute)) ===
							Number(timeGoalMinute)
					) {
						setError("");
						updateTask(0, Number(timeGoal));
					} else setError("Time values must be greater than 0");
				}
				if (selectedTracker === 3) {
					if (Number(countGoal) > 0) {
						if (
							timeGoal > 0 &&
							Number(timeGoalHour) >= 0 &&
							Number(timeGoalMinute) >= 0 &&
							Math.floor(Number(timeGoalHour)) ===
								Number(timeGoalHour) &&
							Math.floor(Number(timeGoalMinute)) ===
								Number(timeGoalMinute)
						) {
							setError("");
							updateTask(Number(countGoal), Number(timeGoal));
						} else
							setError(
								"Time values must be whole numbers greater than 0"
							);
					} else
						setError(
							"Count value has to be a whole number greater than 0"
						);
				}
			} else setError("Description cannot be empty");
		} else setError("Name cannot be empty");
	};

	const addNewTracker = (tx: SQLite.SQLTransaction, taskID: number) => {
		const currentDate = getCurrentDate();
		tx.executeSql(
			"INSERT INTO trackers (date, time, count, task_id) VALUES (?, ?, ?, ?)",
			[currentDate, 0, 0, taskID],
			(txObj, resultSet) => {
				const trackerID = resultSet.insertId;
				if (resultSet.rowsAffected !== 0 && trackerID !== undefined) {
					let existingTrackers = [...trackers];
					existingTrackers.push({
						id: trackerID,
						date: currentDate,
						time: 0,
						count: 0,
						task_id: taskID,
					});
					setTrackers(existingTrackers);
					navigation.navigate("Home");
				}
			},
			(txObj, error) => {
				console.log(error);
				return true;
			}
		);
	};

	const updateTask = (count: number, time: number) => {
		db.transaction((tx) => {
			tx.executeSql(
				"UPDATE tasks SET name = ?, description = ?, tracker_type = ?, time_goal = ?, count_goal = ?, is_active = ? WHERE id = ?",
				[
					taskName,
					taskDescription,
					Number(selectedTracker),
					time,
					count,
					1,
					route.params.task.id,
				],
				(txObj, resultSet) => {
					console.log(resultSet.rowsAffected);
					if (resultSet.rowsAffected !== 0) {
						let existingTasks = [...tasks];
						const taskIndex = tasks.findIndex((tempTask) => {
							return tempTask === route.params.task;
						});
						/*console.log(
							route.params.task.id,
							taskName,
							taskDescription,
							Number(selectedTracker),
							time,
							count
						);*/
						existingTasks[taskIndex] = {
							id: route.params.task.id,
							name: taskName,
							description: taskDescription,
							tracker_type: Number(selectedTracker),
							time_goal: time,
							count_goal: count,
							is_active: 1,
						};
						setTasks(existingTasks);
						navigation.navigate("Home");
					}
				},
				(txObj, error) => {
					console.log(error);
					return true;
				}
			);
		});
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
				<View style={[styles.inputRow, { flex: 0.8 }]}>
					<Text style={[styles.inputText]}>Name</Text>
					<TextInput
						value={taskName}
						placeholder={route.params.task.name}
						onChangeText={setTaskName}
						style={[
							styles.inputBox,
							{ textAlign: "left" },
							{ paddingHorizontal: 10 },
						]}
					/>
				</View>
				<View style={[styles.inputRow, { flex: 1.2 }]}>
					<Text style={styles.inputText}>Description</Text>
					<TextInput
						value={taskDescription}
						placeholder={route.params.task.description}
						onChangeText={setTaskDescription}
						style={[
							styles.inputBox,
							{ textAlign: "left" },
							{ paddingHorizontal: 10 },
						]}
					/>
				</View>
				<View style={styles.inputRow}>
					<Text style={styles.inputText}>Tracker Type</Text>
					<View style={[styles.trackerType, { flex: 0.7 }]}>
						<TouchableOpacity
							activeOpacity={1}
							style={[
								styles.trackerTouch,
								selectedTracker === 1
									? styles.trackerOverride
									: null,
							]}
							onPress={() => handleTracker(1)}
						>
							<Text
								style={[
									styles.trackerText,
									selectedTracker === 1
										? { color: "black" }
										: null,
								]}
							>
								Count
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							activeOpacity={1}
							style={[
								styles.trackerTouch,
								selectedTracker === 2
									? styles.trackerOverride
									: null,
							]}
							onPress={() => handleTracker(2)}
						>
							<Text
								style={[
									styles.trackerText,
									selectedTracker === 2
										? { color: "black" }
										: null,
								]}
							>
								Time
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							activeOpacity={1}
							style={[
								styles.trackerTouch,
								selectedTracker === 3
									? styles.trackerOverride
									: null,
							]}
							onPress={() => handleTracker(3)}
						>
							<Text
								style={[
									styles.trackerText,
									selectedTracker === 3
										? { color: "black" }
										: null,
								]}
							>
								Both
							</Text>
						</TouchableOpacity>
					</View>
				</View>
				<View style={[styles.inputRow]}>{displayTrackerGoal()}</View>
				<View style={[styles.inputRow, { height: "100%" }]}>
					<CustomButton
						name="UPDATE TASK"
						onPress={() => checkInputs()}
					/>
				</View>
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

export default Task;
