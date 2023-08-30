import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import * as SQLite from "expo-sqlite";
import { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Home from "./screens/Home";
import NewTask from "./screens/NewTask";
import {
	DatabaseContext,
	TasksContext,
	TasksProvider,
	useTasksContext,
	useTrackersContext,
} from "./context";

const Tab = createBottomTabNavigator();

export default function ContextWrapper() {
	const db = SQLite.openDatabase("TaskTracker.db", "1.0");

	const [isLoading, setIsLoading] = useState(true);
	const { tasks, setTasks } = useTasksContext();
	const { trackers, setTrackers } = useTrackersContext();

	const handleTaskUpdate = (
		newTask: {
			id: number;
			name: string;
			description: string;
			trackerType: string;
			days_time_goal: string;
			days_counter_goal: string;
			is_active: number;
		}[]
	) => {
		setTasks(newTask);
	};

	const handleTrackerUpdate = (
		newTracker: {
			id: number;
			dateDoneAt: string;
			timeSpent: string;
			counterDone: number;
			taskId: number;
		}[]
	) => {
		setTrackers(newTracker);
	};

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
				 tracker_type TEXT NOT NULL,
                 days_time_goal TEXT NOT NULL,
                 days_counter_goal TEXT NOT NULL,
                 is_active INTEGER)`
			);
		});

		db.transaction((tx) => {
			tx.executeSql(
				`CREATE TABLE IF NOT EXISTS trackers (
                 id INTEGER PRIMARY KEY AUTOINCREMENT,
                 date_done_at TEXT NOT NULL,
                 time_spent TEXT NOT NULL,
                 counter_done INTEGER NOT NULL,
                 task_id TEXT NOT NULL,
                 FOREIGN KEY (task_id) REFERENCES tasks(id))`
			);
		});

		db.transaction((tx) => {
			tx.executeSql(
				"SELECT * FROM tasks",
				null,
				(txObj, resultSet) => {
					setTasks(resultSet.rows._array);
				},
				(txObj, error) => console.log(error)
			);
		});

		db.transaction((tx) => {
			tx.executeSql(
				"SELECT * FROM trackers",
				null,
				(txObj, resultSet) => setTrackers(resultSet.rows._array),
				(txObj, error) => console.log(error)
			);
		});
		setIsLoading(false);
	}, []);

	if (isLoading) {
		return (
			<View style={styles.container}>
				<Text>Loading Data...</Text>
			</View>
		);
	}

	// const addTask = () => {
	// 	if (currentTask) {
	// 		console.log(currentTask);
	// 		db.transaction((tx) => {
	// 			tx.executeSql(
	// 				"INSERT INTO tasks (taskName) values (?)",
	// 				[currentTask],
	// 				(
	// 					txObj: SQLite.SQLTransaction,
	// 					resultSet: SQLite.SQLResultSet
	// 				) => {
	// 					let existingTasks = [...tasks];
	// 					existingTasks.push({
	// 						id: resultSet.insertId,
	// 						taskName: currentTask,
	// 					});
	// 					setTasks(existingTasks);
	// 					console.log("uwu");
	// 					setCurrentTask(undefined);
	// 				},
	// 				(txObj, error) => console.log(error)
	// 			);
	// 		});
	// 	}
	// };

	// const deleteTask = (id: number) => {
	// 	console.log(id);
	// 	db.transaction((tx) => {
	// 		tx.executeSql(
	// 			"DELETE FROM tasks WHERE id = ?",
	// 			[id],
	// 			(txObj, resultSet) => {
	// 				console.log(resultSet.rowsAffected);
	// 				if (resultSet.rowsAffected > 0) {
	// 					let existingTasks = [...tasks].filter(
	// 						(task) => task.id !== id
	// 					);
	// 					setTasks(existingTasks);
	// 					console.log(id);
	// 				}
	// 			},
	// 			(txObj, error) => console.log(error)
	// 		);
	// 	});
	// };

	// const updateTask = (id) => {
	// 	db.transaction((tx) => {
	// 		tx.executeSql(
	// 			"UPDATE tasks SET taskName = ? WHERE id = ?",
	// 			[currentTask, id],
	// 			(txObj, resultSet) => {
	// 				if (resultSet.rowsAffected > 0) {
	// 					if (currentTask) {
	// 						let existingTasks = [...tasks];
	// 						const indexToUpdate = existingTasks.findIndex(
	// 							(task) => task.id === id
	// 						);
	// 						existingTasks[indexToUpdate].taskName = currentTask;
	// 						setTasks(existingTasks);
	// 						setCurrentTask(undefined);
	// 					}
	// 				}
	// 			},
	// 			(txObj, error) => console.log(error)
	// 		);
	// 	});
	// };

	// const showTasks = () => {
	// 	return tasks.map((task, index) => {
	// 		return (
	// 			<View key={index} style={styles.row}>
	// 				<Text>{task.taskName}</Text>
	// 				<Button
	// 					title="Update"
	// 					onPress={() => updateTask(task.id)}
	// 				/>
	// 				<Button
	// 					title="Delete"
	// 					onPress={() => deleteTask(task.id)}
	// 				/>
	// 			</View>
	// 		);
	// 	});
	// };

	return (
		<DatabaseContext.Provider value={db}>
			<View style={styles.container}>
				<NavigationContainer>
					<Tab.Navigator>
						<Tab.Screen name="Home" component={Home} />
						<Tab.Screen name="New Task" component={NewTask} />
						{/*<TextInput
				value={currentTask}
				placeholder="task"
				onChangeText={setCurrentTask}
			/>
  
			<Button title="Add Task" onPress={addTask} />
  showTasks()*/}
					</Tab.Navigator>
				</NavigationContainer>
			</View>
		</DatabaseContext.Provider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},

	row: {
		flexDirection: "row",
		alignItems: "center",
		alignSelf: "stretch",
		justifyContent: "space-between",
		margin: 8,
	},
});
