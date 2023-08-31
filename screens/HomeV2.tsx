import { StyleSheet, Text, View, TextInput, Button } from "react-native";

import { useState, useEffect } from "react";
import * as SQLite from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import {
	useDatabaseContext,
	useTasksContext,
	useTrackersContext,
} from "../context";

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
		setCurrentDate(formattedDate);
	};

	getCurrentDate();

	const updateTask = (taskID: number) => {};
	const deleteTask = (taskID: number) => {};
	const addCount = (trackerID: number) => {};
	const removeCount = (trackerID: number) => {};

	const showTasks = () => {
		// going through all the takss and displays all the relevent information
		return tasks.map((task, index) => {
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

	return <View style={styles.container}>{showTasks()}</View>;
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
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
