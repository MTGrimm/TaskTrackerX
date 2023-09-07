import {
	StyleSheet,
	Text,
	View,
	TextInput,
	Button,
	SafeAreaView,
	ColorValue,
} from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { useState, useEffect, useContext } from "react";
import * as SQLite from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import {
	BackgroundColor,
	useDatabaseContext,
	useTasksContext,
	useTrackersContext,
} from "../context";
import CustomButton from "./helpers/CustomButton";

const HomeV2 = ({ navigation }: { navigation: any }) => {
	const db = useDatabaseContext();
	const { tasks, setTasks } = useTasksContext();
	const { trackers, setTrackers } = useTrackersContext();
	// const [currentDate, setCurrentDate] = useState("");
	const backgroundColor = useContext(BackgroundColor);

	const [taskType, setTaskType] = useState(0);
	const taskTypes = [
		{ key: 0, value: "Active" },
		{ key: 1, value: "Inactive" },
		{ key: 2, value: "All" },
	];

	const styles = getStyles(backgroundColor);

	// getting the date
	const getCurrentDate = () => {
		const date = new Date();

		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		const year = date.getFullYear();

		const formattedDate = `${month}/${day}/${year}`;
		return formattedDate;
	};

	const updateTask = (task: any, taskID: number) => {};
	const deleteTask = (task: any, taskID: number) => {};
	const addTrackerValue = (
		task: any,
		trackerID: number,
		tracker_type: number
	) => {
		if (tracker_type === 1) {
			db.transaction((tx) => {
				tx.executeSql(
					"UPDATE trackers SET count = ? WHERE id = ?",
					[trackers[trackerID].count + 1, trackers[trackerID].id],
					(txObj, resultSet) => {
						let existingTrackers = [...trackers];
						existingTrackers[trackerID].count += 1;
						setTrackers(existingTrackers);
					},
					(txObj, error) => {
						console.log(error);
						return true;
					}
				);
			});
		}

		if (tracker_type === 2) {
			db.transaction((tx) => {
				tx.executeSql(
					"UPDATE trackers SET time = ? WHERE id = ?",
					[trackers[trackerID].time + 1, trackers[trackerID].id],
					(txObj, resultSet) => {
						let existingTrackers = [...trackers];
						existingTrackers[trackerID].time += 1;
						setTrackers(existingTrackers);
					},
					(txObj, error) => {
						console.log(error);
						return true;
					}
				);
			});
		}
	};
	const removeTracerValue = (
		task: any,
		trackerID: number,
		tracker_type: number
	) => {
		if (tracker_type === 1) {
			db.transaction((tx) => {
				tx.executeSql(
					"UPDATE trackers SET count = ? WHERE id = ?",
					[trackers[trackerID].count - 1, trackers[trackerID].id],
					(txObj, resultSet) => {
						let existingTrackers = [...trackers];
						existingTrackers[trackerID].count -= 1;
						setTrackers(existingTrackers);
					},
					(txObj, error) => {
						console.log(error);
						return false;
					}
				);
			});
		}

		if (tracker_type === 2) {
			db.transaction((tx) => {
				tx.executeSql(
					"UPDATE trackers SET time = ? WHERE id = ?",
					[trackers[trackerID].time - 1, trackers[trackerID].id],
					(txObj, resultSet) => {
						let existingTrackers = [...trackers];
						existingTrackers[trackerID].time -= 1;
						setTrackers(existingTrackers);
					},
					(txObj, error) => {
						console.log(error);
						return true;
					}
				);
			});
		}
	};

	const valueButton = (
		task: any,
		trackerID: number,
		tracker_type: number
	) => {
		return (
			<View style={styles.taskContentContainer}>
				<Text
					onPress={() =>
						addTrackerValue(task, trackerID, tracker_type)
					}
					style={{ color: "#793FDF" }}
				>
					+
				</Text>
				<Text
					onPress={() =>
						removeTracerValue(task, trackerID, tracker_type)
					}
					style={{ color: "#793FDF" }}
				>
					-
				</Text>
			</View>
		);
	};

	const showTasks = () => {
		// going through all the takss and displays all the relevent information
		const currentDate = getCurrentDate();

		return tasks.map((task) => {
			if (
				(task.is_active === 1 &&
					(taskTypes[Number(taskType)].key === 0 ||
						taskTypes[Number(taskType)].key === 2)) ||
				(task.is_active === 0 &&
					(taskTypes[Number(taskType)].key === 1 ||
						taskTypes[Number(taskType)].key === 2))
			) {
				let trackerID = -1;
				// checking that tracker is not empty
				if (trackers.length !== 0) {
					trackerID = trackers.findIndex((tracker) => {
						return (
							tracker.task_id === task.id &&
							tracker.date === currentDate
						);
					});

					// checking that there is a corresponding tracker for each task
					if (trackerID !== -1) {
						const hours = Math.floor(trackers[trackerID].time / 60);
						const minutes = trackers[trackerID].time - hours * 60;
						return (
							<View key={task.id}>
								<View style={styles.taskTitleContainer}>
									<Text
										style={styles.taskText}
										onPress={() =>
											navigation.navigate("Task", {
												task: task,
											})
										}
									>
										{task.name}
									</Text>
								</View>

								{task.tracker_type === 1 && (
									<View style={styles.taskContentContainer}>
										<Text style={{ color: "#F0F0F0" }}>
											{trackers[trackerID].count}
										</Text>
										{valueButton(task, trackerID, 1)}
									</View>
								)}

								{task.tracker_type === 2 && (
									<View style={styles.taskContentContainer}>
										<Text style={{ color: "#F0F0F0" }}>
											{trackers[trackerID].time}
										</Text>
										{valueButton(task, trackerID, 2)}
									</View>
								)}

								{task.tracker_type === 3 && (
									<View
										style={[
											{ flexDirection: "row" },
											{ width: "100%" },
										]}
									>
										<View
											style={styles.taskContentContainer}
										>
											<Text style={{ color: "#F0F0F0" }}>
												{trackers[trackerID].count}
											</Text>
											{valueButton(task, trackerID, 1)}
										</View>
										<View
											style={styles.taskContentContainer}
										>
											<Text style={{ color: "#F0F0F0" }}>
												{trackers[trackerID].time}
											</Text>
											{valueButton(task, trackerID, 2)}
										</View>
									</View>
								)}

								{/* <View style={styles.taskContentContainer}>
									{(task.tracker_type === 1 ||
										task.tracker_type === 3) && (
										<Text style={{ color: "#F0F0F0" }}>
											{trackers[trackerID].count}
										</Text>
									)}
									{(task.tracker_type === 2 ||
										task.tracker_type === 3) && [
										<Text style={{ color: "#F0F0F0" }}>
											Hours: {hours}
										</Text>,
										<Text style={{ color: "#F0F0F0" }}>
											Minutes: {minutes}
										</Text>,
									]}
									{task.tracker_type === 3 && [
										valueButton(task, trackerID, 1),
										valueButton(task, trackerID, 2),
									]}
									{(task.tracker_type === 1 ||
										task.tracker_type === 2) &&
										valueButton(
											task,
											trackerID,
											task.tracker_type
										)}
								</View>*/}
							</View>
						);
					}
				}
			}
		});
	};

	const emptyRender = () => {
		if (taskTypes !== undefined) {
			if (taskTypes[Number(taskType)] !== undefined) {
				if (Number(taskType) === 3 && tasks.length === 0) {
					return <Text style={{ color: "#F0F0F0" }}>No Tasks!</Text>;
				}
				return (
					<Text style={{ color: "#F0F0F0" }}>
						No Tasks in {taskTypes[taskType].value}!
					</Text>
				);
			}
		}
		return null;
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.topBar}>
				<Text style={{ fontSize: 30 }}></Text>
				<CustomButton
					name="+"
					onPress={() => navigation.navigate("New Task")}
				></CustomButton>
			</View>
			<View style={styles.mainView}>
				<View style={styles.taskTopBar}>
					<Text style={[{ fontSize: 25 }, { color: "#F0F0F0" }]}>
						TASKS
					</Text>
					<SelectList
						setSelected={setTaskType}
						data={taskTypes}
						search={false}
						inputStyles={{ color: "#F0F0F0" }}
						dropdownTextStyles={{ color: "#F0F0F0" }}
						defaultOption={{ key: 0, value: "Active" }}
					/>
				</View>
				{/*emptyRender()*/}
				<View style={styles.mainView}>{showTasks()}</View>
				<Button
					title="show info"
					onPress={() => {
						console.log(tasks);
						console.log(trackers);
					}}
					color="#313638"
				/>
				<Button
					title="delete all trackers"
					onPress={() => {
						db.transaction((tx) => {
							tx.executeSql(
								"DELETE from trackers",
								undefined,
								(txObj, resultSet) => {
									setTrackers([]);
								},
								(txObj, error) => {
									console.log(error);
									return true;
								}
							);
						});
					}}
					color="#313638"
				/>
			</View>
			<StatusBar style="auto" />
		</SafeAreaView>
	);
};

const getStyles = (bgColor: ColorValue) =>
	StyleSheet.create({
		container: {
			flex: 1,
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center",
			backgroundColor: "#141414",
		},

		taskText: {
			padding: 10,
			paddingLeft: 25,
			width: "100%",
			color: "#E0E0E0",
			fontSize: 20,
		},

		taskContentContainer: {
			backgroundColor: "#202020",
			width: "30%",
			borderBottomLeftRadius: 30,
			borderBottomRightRadius: 30,
			flexDirection: "row",
			alignItems: "center",
			alignSelf: "stretch",
			justifyContent: "space-around",
			margin: 8,
			marginTop: 0,
		},

		taskTitleContainer: {
			backgroundColor: "#252525",
			width: "100%",
			borderRadius: 40,
			borderTopRightRadius: 0,
			borderBottomLeftRadius: 0,
			flexDirection: "row",
			alignItems: "center",
			alignSelf: "stretch",
			justifyContent: "space-between",
			margin: 8,
			marginBottom: 0,
		},

		taskTopBar: {
			width: "100%",
			alignSelf: "center",
			flexDirection: "row",
			justifyContent: "space-between",
			flex: 0.1,
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
			width: "90%",
			alignItems: "flex-start",
			justifyContent: "flex-start",
			paddingTop: 10,
			paddingLeft: 10,
		},

		row: {},
	});

export default HomeV2;
