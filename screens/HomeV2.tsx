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

const HomeV2 = ({ navigation }: { navigation: any }) => {
	console.log("oh no");
	const db = useDatabaseContext();
	const { tasks, setTasks } = useTasksContext();
	const { trackers, setTrackers } = useTrackersContext();
	const [currentDate, setCurrentDate] = useState("");
	const [taskType, setTaskType] = useState("Active");
	const taskTypes = [
		{ key: 0, value: "Active" },
		{ key: 1, value: "Inactive" },
		{ key: 2, value: "All" },
	];

	// getting the date
	const getCurrentDate = () => {
		const date = new Date();

		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		const year = date.getFullYear();

		const formattedDate = `${month}/${day}/${year}`;
		return formattedDate;
	};

	const updateTask = (taskID: number) => {};
	const deleteTask = (taskID: number) => {};
	const addCount = (trackerID: number) => {};
	const removeCount = (trackerID: number) => {};

	const showTasks = () => {
		// going through all the takss and displays all the relevent information
		return tasks.map((task, index) => {
			if (
				(task.is_active === 1 &&
					(taskTypes[Number(taskType)].key === 0 ||
						taskTypes[Number(taskType)].key === 2)) ||
				(task.is_active === 0 &&
					(taskTypes[Number(taskType)].key === 1 ||
						taskTypes[Number(taskType)].key === 2))
			) {
				setCurrentDate(getCurrentDate());
				let trackerID = -1;
				// checking that tracker is not empty
				if (trackers.length !== 0) {
					trackerID = trackers.findIndex((tracker) => {
						console.log("uwu");
						return (
							tracker.task_id === task.id &&
							tracker.date === currentDate
						);
					});

					// checking that there is a corresponding tracker for each task
					if (trackerID !== -1) {
						return (
							<View key={index} style={styles.row}>
								<Text>{task.name}</Text>
								<Text>{trackers[trackerID].count}</Text>
								<Button
									title="+"
									onPress={() => addCount(trackerID)}
								/>
								<Button
									title="+"
									onPress={() => removeCount(trackerID)}
								/>
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
				if (Number(taskType) === 2) {
					return <Text>No Tasks!</Text>;
				}
				return (
					<Text>
						No Tasks in {taskTypes[Number(taskType)].value}!
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
					<Text style={{ fontSize: 25 }}>TASKS</Text>
					<SelectList
						setSelected={setTaskType}
						data={taskTypes}
						search={false}
						defaultOption={{ key: 1, value: "Active" }}
					/>
				</View>
				{emptyRender()}
			</View>
			<Text>{showTasks()}</Text>
			<StatusBar style="auto" />
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#E3EAE9",
	},

	taskTopBar: {
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-between",
		flex: 1,
	},

	topBar: {
		width: "100%",
		flexDirection: "row",
		backgroundColor: "#BDDED9",
		justifyContent: "space-between",
		paddingLeft: 20,
		alignItems: "center",
		borderBottomWidth: 2,
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
		paddingLeft: 10,
	},

	row: {
		flexDirection: "row",
		alignItems: "center",
		alignSelf: "stretch",
		justifyContent: "space-between",
		margin: 8,
	},
});

export default HomeV2;
