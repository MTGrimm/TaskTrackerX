import {
	StyleSheet,
	Text,
	View,
	TextInput,
	Button,
	TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import * as SQLite from "expo-sqlite";
import {
	useDatabaseContext,
	useTasksContext,
	useTrackersContext,
} from "../context";

const NewTask = ({ navigation }: { navigation: any }) => {
	const [taskName, setTaskName] = useState("");
	const [taskDescription, setTaskDescription] = useState("");
	const [selectedTracker, setSelectedTracker] = useState(0);
	const [timeGoalHour, setTimeGoalHour] = useState("");
	const [timeGoalMinute, setTimeGoalMinute] = useState("");
	const [timeGoalSecond, setTimeGoalSecond] = useState("");
	const [countGoal, setCountGoal] = useState("");
	const [loginError, setLoginError] = useState("");
	const db = useDatabaseContext();
	const { tasks, setTasks } = useTasksContext();
	const { trackers, setTrackers } = useTrackersContext();

	const handleSelectedTracker = (tracker: number) => {
		setSelectedTracker(tracker);
	};

	const newTask = () => {
		const currentDate = new Date();

		const month = String(currentDate.getMonth() + 1).padStart(2, "0");
		const day = String(currentDate.getDate()).padStart(2, "0");
		const year = currentDate.getFullYear();

		const formattedDate = `${month}/${day}/${year}`;

		console.log(selectedTracker);
		if (selectedTracker === 1) {
			console.log("checkpoint 1");
			db.transaction((tx) => {
				console.log("before transaction");
				tx.executeSql(
					`INSERT INTO tasks (
						name,
						description,
						tracker_type,
						days_time_goal,
						days_counter_goal,
						is_active
					) VALUES (?, ?, ?, ?, ?, ?)`,
					[
						taskName,
						taskDescription,
						selectedTracker.toString(),
						0,
						countGoal,
						1,
					],
					(txaObj, resultSet) => {
						console.log("checkpoint 2");
						const taskID = resultSet.insertId;
						if (tasks !== null) {
							console.log("checkpoint 2");
							let existingTasks = [...tasks];
							if (taskID !== undefined) {
								console.log("checkpoint1.1");
								existingTasks.push({
									id: taskID,
									name: taskName,
									description: taskDescription,
									tracker_type: selectedTracker.toString(),
									days_time_goal: "0",
									days_counter_goal: countGoal,
									is_active: 1,
								});
							}
							console.log("checkpoint1.2");
							try {
								setTasks(existingTasks);
							} catch (error) {
								console.log(error);
								console.log("ruh oh");
							}
							console.log("checkpoint1.3");
						} else {
							console.log("checkpoint 3");
							setTasks(resultSet.rows._array);
						}
						console.log("checkpoint 2.5");
						if (taskID !== undefined) {
							console.log("checkpoint 4");
							tx.executeSql(
								`INSERT INTO trackers (
									date_done_at,
									time_spent,
									counter_done,
									task_id
								) VALUES (?, ?, ?, ?)`,
								[formattedDate, "0", 0, taskID],
								(_txObj, trackerResultSet) => {
									console.log("checkpoint 5");
									const trackerID = trackerResultSet.insertId;
									if (trackers !== null) {
										let existingTrackers = [...trackers];
										if (trackerID !== undefined) {
											existingTrackers.push({
												id: trackerID,
												date_done_at: formattedDate,
												time_spent: "0",
												counter_done: 0,
												task_id: taskID,
											});
										}
										setTrackers(existingTrackers);
									} else {
										console.log("checkpoint 6");
										setTrackers(
											trackerResultSet.rows._array
										);
									}
								},
								(_txObj, error) => {
									console.log("failed tracker");
									console.log(error);
									return true;
								}
							);
						}
					},
					(_txObj, error) => {
						console.log("failed task");
						console.log(error);
						return true;
					}
				);
			});
		}
		navigation.navigate("Home");
	};

	const displayTime = () => {
		return (
			<View style={[{ flex: 1 }, { flexDirection: "row" }]}>
				<Text style={{ flex: 1 }}>Time Goal: </Text>
				<TextInput
					value={timeGoalHour}
					keyboardType="numeric"
					placeholder="Hours"
					onChangeText={setTimeGoalHour}
					style={{ flex: 1 }}
				/>
				<TextInput
					value={timeGoalMinute}
					keyboardType="numeric"
					placeholder="Minutes"
					onChangeText={setTimeGoalMinute}
					style={{ flex: 1 }}
				/>
				<TextInput
					value={timeGoalSecond}
					keyboardType="numeric"
					placeholder="Seconds"
					onChangeText={setTimeGoalSecond}
					style={{ flex: 1 }}
				/>
			</View>
		);
	};

	const displayCounter = () => {
		return (
			<View style={[{ flex: 1 }, { flexDirection: "row" }]}>
				<Text style={{ flex: 1 }}>Counter Goal: </Text>
				<TextInput
					value={countGoal}
					keyboardType="numeric"
					placeholder="Count"
					onChangeText={setCountGoal}
					style={{ flex: 1 }}
				/>
			</View>
		);
	};

	const displayTrackerGoal = () => {
		if (selectedTracker === 0) {
			return displayTime();
		} else if (selectedTracker === 1) {
			return displayCounter();
		} else {
			return (
				<View style={[{ flex: 1 }, { flexDirection: "column" }]}>
					<View style={[{ flexDirection: "row" }]}>
						{displayTime()}
					</View>
					<View style={[{ flexDirection: "row" }]}>
						{displayCounter()}
					</View>
				</View>
			);
		}
	};

	const confirmSubmission = () => {
		if (taskName !== "") {
			if (taskDescription !== "") {
				if (selectedTracker === 0) {
					if (
						Number(timeGoalHour) +
							Number(timeGoalMinute) +
							Number(timeGoalSecond) !==
						0
					) {
						console.log("Success");
						console.log("");
						return;
					}
				} else if (selectedTracker === 1) {
					if (Number(countGoal) !== 0) {
						console.log("Success");
						newTask(
							taskName,
							taskDescription,
							selectedTracker,
							"0",
							countGoal,
							navigation,
							db,
							tasks,
							setTasks,
							trackers,
							setTrackers
						);
						return;
					}
				} else {
					if (
						Number(timeGoalHour) +
							Number(timeGoalMinute) +
							Number(timeGoalSecond) !==
							0 &&
						Number(countGoal) !== 0
					) {
						console.log("Success");
						return;
					}
				}
			}
		}
		setLoginError("EMPTY FIELD(S)");
	};

	return (
		<View style={styles.container}>
			<Text>
				Create New Task{" "}
				<Text style={{ color: "red" }}>{loginError}</Text>
			</Text>
			<View style={styles.entryRow}>
				<Text style={{ flex: 1 }}>Task Name: </Text>
				<TextInput
					value={taskName}
					placeholder="Enter Task Name"
					onChangeText={setTaskName}
					style={{ flex: 1 }}
				/>
			</View>
			<View style={styles.entryRow}>
				<Text style={{ flex: 1 }}>Task Description: </Text>
				<TextInput
					value={taskDescription}
					placeholder="Enter Task Description"
					onChangeText={setTaskDescription}
					style={{ flex: 1 }}
				/>
			</View>
			<View style={styles.entryRow}>
				<Text style={{ flex: 1 }}>Tracker Type: </Text>
				<View style={[{ flex: 1 }, { flexDirection: "row" }]}>
					<TouchableOpacity
						style={{
							backgroundColor:
								selectedTracker === 0 ? "skyblue" : "white",
						}}
						onPress={() => handleSelectedTracker(0)}
					>
						<Text> Time </Text>
					</TouchableOpacity>
					<Text> | </Text>
					<TouchableOpacity
						style={{
							backgroundColor:
								selectedTracker === 1 ? "skyblue" : "white",
						}}
						onPress={() => handleSelectedTracker(1)}
					>
						<Text> Count </Text>
					</TouchableOpacity>
					<Text> | </Text>
					<TouchableOpacity
						style={{
							backgroundColor:
								selectedTracker === 2 ? "skyblue" : "white",
						}}
						onPress={() => handleSelectedTracker(2)}
					>
						<Text> Both </Text>
					</TouchableOpacity>
				</View>
			</View>
			<View style={styles.entryRow}>{displayTrackerGoal()}</View>
			<View style={[{ marginTop: 20 }]}>
				<Button title="SUBMIT" onPress={confirmSubmission} />
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "flex-start",
	},

	topBar: {
		flex: 1,
		flexDirection: "row",
		alignItems: "flex-start",
		justifyContent: "center",
	},

	entryRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginTop: 20,
	},
});

export default NewTask;
