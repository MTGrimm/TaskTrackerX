import { StyleSheet, Text, View, TextInput, Button } from "react-native";

import { useState, useEffect } from "react";
import * as SQLite from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import {
	useDatabaseContext,
	useTasksContext,
	useTrackersContext,
} from "../context";

const Home = ({ navigation }: { navigation: any }) => {
	const db = useDatabaseContext();
	const { tasks, setTasks } = useTasksContext();
	const { trackers, setTrackers } = useTrackersContext();

	useEffect(() => {
		console.log("uwu");
		console.log(tasks);
		console.log(trackers);
		db.transaction((tx) => {
			tx.executeSql("DELETE FROM tasks WHERE id = ?", [7]);
		});
		db.transaction((tx) => {
			tx.executeSql("DELETE FROM trackers WHERE id = ?", [1]);
		});
	}, []);

	const showTasks = () => {
		return tasks?.map((task, index) => {
			let trackerID = -1;
			console.log(tasks);
			console.log(trackers);
			if (trackers !== null) {
				trackerID = trackers.findIndex(
					(tracker) => Math.floor(tracker.task_id) === task.id
				);
				console.log(task.id);
				console.log(Math.floor(trackers[0].task_id));
				console.log("uwu", tasks);

				console.log();
			}
			console.log(trackerID);
			if (trackerID !== -1 && trackers !== null) {
				return (
					<View key={index} style={{ flex: 1 }}>
						<Text>{task.name}</Text>
						<Text>{trackers[trackerID].counter_done}</Text>
					</View>
				);
			}
		});
	};

	return (
		<View style={styles.container}>
			<View style={styles.topBar}>
				<Text>TaskTrackerX</Text>
				<Button
					title="+"
					onPress={() => navigation.navigate("New Task", {})}
				/>
			</View>
			{showTasks()}
			<StatusBar style="auto" />
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
		marginBottom: -10,
	},
});

export default Home;
