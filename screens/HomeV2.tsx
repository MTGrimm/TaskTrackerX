import {
	StyleSheet,
	Text,
	View,
	TextInput,
	Button,
	SafeAreaView,
} from "react-native";

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
		});
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.topBar}>
				<Text style={{ fontSize: 30 }}>WELCOME</Text>
				<CustomButton
					name="+"
					onPress={() => console.log("Pressed Add")}
				></CustomButton>
			</View>
			<View style={styles.mainView}>
				<View>
					<Text style={{ fontSize: 25 }}>TASKS</Text>
				</View>
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
