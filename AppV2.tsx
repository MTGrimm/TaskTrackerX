import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { DatabaseContext, TasksContext, TrackersContext } from "./context";
import ContextWrapper from "./ContextWrapper";
import ContextWrapperV2 from "./ContextWrapperV2";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import * as SQLite from "expo-sqlite";
import HomeV2 from "./screens/HomeV2";

const Stack = createStackNavigator();

export default function App() {
	// initiallizing database
	const db = SQLite.openDatabase("example4.db");
	const [isLoading, setIsLoading] = useState(true);
	const [currentDate, setCurrentDate] = useState("");
	console.log("init");

	const [tasks, setTasks] = useState<
		Array<{
			id: number;
			name: string;
			description: string;
			tracker_type: number;
			time_goal: number;
			counter_goal: number;
			is_active: number;
		}>
	>([]);

	const [trackers, setTrackers] = useState<
		Array<{
			id: number;
			date: string;
			time: number;
			count: number;
			task_id: number;
		}>
	>([]);

	useEffect(() => {
		console.log("initial useEffects");
		const date = new Date();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		const year = date.getFullYear();
		const formattedDate = `${month}/${day}/${year}`;

		// creating tables if they do not already exist
		db.transaction((tx) => {
			tx.executeSql(
				"CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT, tracker_type INTEGER, time_goal INTEGER, count_goal INTEGER, is_active INTEGER )"
			);
		});

		db.transaction((tx) => {
			tx.executeSql(
				"CREATE TABLE IF NOT EXISTS trackers (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, time INTEGER, count INTEGER, task_id INTEGER, FOREIGN KEY (task_id) REFERENCES tasks(id))"
			);
		});

		console.log("checkpoint 1");

		// getting all the tasks and trackers from the database
		db.transaction((tx) => {
			tx.executeSql(
				"SELECT * FROM tasks",
				[null],
				(txObj, resultSet) => setTasks(resultSet.rows._array),
				(txObj, error) => {
					console.log(error);
					return true;
				}
			);
		});

		db.transaction((tx) => {
			tx.executeSql(
				"SELECT * FROM trackers",
				[null],
				(txObj, resultSet) => setTrackers(resultSet.rows._array),
				(txObj, error) => {
					console.log(error);
					return true;
				}
			);
		});

		if (trackers.length > 0) {
			console.log(formattedDate);
			db.transaction((tx) => {
				// getting all the trackers that have today's date
				tx.executeSql(
					"SELECT * FROM trackers WHERE date = ?",
					["08/30/2023"],
					(txObj, resultSet) => {
						// checking if there are any trackers with today's date, if there aRe, that means trackers have been updated already today, if there aren't add new trackers
						if (resultSet.rows.length === 0) {
							// going through all the tasks and if they are active, adding a new tracker for the day
							for (let i = 0; i < tasks.length; i++) {
								if (tasks[i].is_active) {
									tx.executeSql(
										"INSERT INTO trackers (date, time, count, task_id) VALUES (?, ?, ?, ?)",
										["08/30/2023", 0, 0, tasks[i].id],
										(txObj, resultSet) => {
											// adding the tracker to the tracker useState
											if (
												resultSet.insertId !== undefined
											) {
												trackers.push({
													id: resultSet.insertId,
													date: "08/30/2023",
													time: 0,
													count: 0,
													task_id: tasks[i].id,
												});
												console.log(
													"added today's tracker for " +
														tasks[i].name
												);
											}
										},
										(txObj, error) => {
											console.log(error);
											return true;
										}
									);
								}
							}
						}
					},
					(txObj, error) => {
						console.log(error);
						return true;
					}
				);
			});
		}
		setIsLoading(false);
	}, []);

	// loading display
	if (isLoading) {
		return (
			<View style={styles.container}>
				<Text>Loading names...</Text>
			</View>
		);
	}

	return (
		<TasksContext.Provider value={{ tasks, setTasks }}>
			<TrackersContext.Provider value={{ trackers, setTrackers }}>
				<DatabaseContext.Provider value={db}>
					<NavigationContainer>
						<Stack.Navigator>
							<Stack.Screen name={"Home"} component={HomeV2} />
						</Stack.Navigator>
					</NavigationContainer>
					<ContextWrapperV2></ContextWrapperV2>
				</DatabaseContext.Provider>
			</TrackersContext.Provider>
		</TasksContext.Provider>
	);
}

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