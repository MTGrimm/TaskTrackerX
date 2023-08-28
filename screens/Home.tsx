import { StyleSheet, Text, View, TextInput, Button } from "react-native";

import { useState, useEffect } from "react";
import * as SQLite from "expo-sqlite";
import { StatusBar } from "expo-status-bar";

const Home = ({ navigation }: { navigation: any }) => {
	const db = SQLite.openDatabase("Tasks.db");
	const [isLoading, setIsLoading] = useState(true);
	const [tasks, setTasks] = useState<
		Array<{
			id: number;
			name: string;
			description: string;
			days_time_goal: string;
			days_counter_goal: string;
			is_active: number;
		}>
	>([]);

	const [trackers, setTrackers] = useState<
		Array<{
			id: number;
			trackerType: string;
			dateDoneAt: string;
			timeSpent: string;
			counterDone: string;
			taskId: number;
		}>
	>([]);

	const [currentTask, setCurrentTask] = useState<string | undefined>(
		undefined
	);

	useEffect(() => {
		db.transaction((tx) => {
			tx.executeSql(
				`CREATE TABLE IF NOT EXISTS tasks (
                 id INTEGER PRIMARY KEY AUTOINCREMENT,
                 name TEXT,
                 description TEXT,
                 days_time_goal TEXT NOT NULL,
                 days_counter_goal TEXT NOT NULL,
                 is_active INTEGER)`
			);

			tx.executeSql(
				`CREATE TABLE IF NOT EXISTS trackers (
                 id INTEGER PRIMARY KEY AUTOINCREMENT,
                 tracker_type TEXT NOT NULL,
                 date_done_at TEXT NOT NULL,
                 time_spent TEXT NOT NULL,
                 counter_done INTEGER NOT NULL,
                 task_id TEXT NOT NULL,
                 FOREIGN KEY (task_id) REFERENCES tasks(id))`
			);

			tx.executeSql(
				"SELECT * FROM tasks",
				null,
				(txObj, resultSet) => setTasks(resultSet.rows._array),
				(txObj, error) => console.log(error)
			);

			tx.executeSql(
				"SELECT * FROM trackers",
				null,
				(txObj, resultSet) => setTasks(resultSet.rows._array),
				(txObj, error) => console.log(error)
			);
		});

		db.transaction((tx) => {});

		setIsLoading(false);
	}, [db]);
	return (
		<View style={styles.container}>
			<View style={styles.topBar}>
				<Text>TaskTrackerX</Text>
				<Button title="+" onPress={navigation.navigate("New Task")} />
			</View>
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
		alignItems: "center",
		justifyContent: "space-between",
	},
});

export default Home;
