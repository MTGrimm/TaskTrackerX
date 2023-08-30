import { StatusBar } from "expo-status-bar";
import {
	StyleSheet,
	Text,
	View,
	TextInput,
	Button,
	Platform,
} from "react-native";
import * as SQLite from "expo-sqlite";
import { useState, useEffect } from "react";

const ContextWrapperV2 = () => {
	const db = SQLite.openDatabase("example3.db");
	const [isLoading, setIsLoading] = useState(true);
	const [tasks, setTasks] = useState<
		Array<{
			id: number;
			name: string;
			description: string;
			count_goal: number;
			is_active: number;
		}>
	>([]);
	const [trackers, setTrackers] = useState<
		Array<{
			id: number;
			count: number;
			task_id: number;
		}>
	>([]);
	const [currentTask, setCurrentTask] = useState("");
	const [currentDescription, setCurrentDescription] = useState("");
	const [currentCountGoal, setCurrentCountGoal] = useState("");

	useEffect(() => {
		db.transaction((tx) => {
			tx.executeSql(
				"CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT, count_goal INTEGER, is_active INTEGER)"
			);
		});

		db.transaction((tx) => {
			tx.executeSql(
				"CREATE TABLE IF NOT EXISTS trackers (id INTEGER PRIMARY KEY AUTOINCREMENT, count INTEGER, task_id INTEGER, FOREIGN KEY (task_id) REFERENCES tasks(id))"
			);
		});

		db.transaction((tx) => {
			tx.executeSql(
				"SELECT * FROM tasks",
				null,
				(txObj, resultSet) => setTasks(resultSet.rows._array),
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

		db.transaction((tx) => {
			tx.executeSql(
				"DELETE FROM tasks WHERE id = ?",
				[3],
				(txObj, resultSet) => console.log("success"),
				(txObj, error) => {
					console.log(error);
					return true;
				}
			);
		});

		setIsLoading(false);
	}, []);

	if (isLoading) {
		return (
			<View style={styles.container}>
				<Text>Loading names...</Text>
			</View>
		);
	}

	const addTask = () => {
		db.transaction((tx) => {
			tx.executeSql(
				"INSERT INTO tasks (name, description, count_goal, is_active) VALUES (?, ?, ?, ?)",
				[currentTask, currentDescription, Number(currentCountGoal), 1],
				(txObj, resultSet) => {
					const newTaskId = resultSet.insertId;
					let existingTasks = [...tasks];
					if (newTaskId !== undefined) {
						existingTasks.push({
							id: newTaskId,
							name: currentTask,
							description: currentDescription,
							count_goal: Number(currentCountGoal),
							is_active: 1,
						});
					}
					setTasks(existingTasks);
					setCurrentTask("");
					if (newTaskId !== undefined) {
						tx.executeSql(
							"INSERT INTO trackers (count, task_id) VALUES (?, ?)",
							[0, newTaskId],
							(txObj, resultSetTrackers) => {
								const trackerID = resultSetTrackers.insertId;
								let existingTrackers = [...trackers];
								if (
									trackerID !== undefined &&
									newTaskId !== undefined
								) {
									existingTrackers.push({
										id: trackerID,
										count: 0,
										task_id: newTaskId,
									});
								}
								setTrackers(existingTrackers);
							},
							(txObj, error) => {
								console.log(error);
								return true;
							}
						);
					}
				},
				(txObj, error) => {
					console.log(error);
					return true;
				}
			);
		});
	};

	const deleteTask = (id: number) => {
		db.transaction((tx) => {
			tx.executeSql(
				"DELETE FROM tasks WHERE id = ?",
				[id],
				(txObj, resultSet) => {
					if (resultSet.rowsAffected > 0) {
						let existingTasks = [...tasks].filter(
							(task) => task.id !== id
						);
						setTasks(existingTasks);
					}
				},
				(txObj, error) => {
					console.log(error);
					return true;
				}
			);
		});
	};

	const updateTask = (id: number) => {
		db.transaction((tx) => {
			tx.executeSql(
				"UPDATE tasks SET name = ? WHERE id = ?",
				[currentTask, id],
				(txObj, resultSet) => {
					if (resultSet.rowsAffected > 0) {
						let existingTasks = [...tasks];
						const indexToUpdate = existingTasks.findIndex(
							(task) => task.id === id
						);
						existingTasks[indexToUpdate].name = currentTask;
						setTasks(existingTasks);
						setCurrentTask("");
					}
				},
				(txObj, error) => {
					console.log(error);
					return true;
				}
			);
		});
	};

	const addCount = (trackerID: number) => {
		const newCount = trackers[trackerID].count + 1;
		console.log(newCount);
		console.log(trackerID);
		db.transaction((tx) => {
			tx.executeSql(
				"UPDATE trackers SET count = ? WHERE id = ?",
				[newCount, trackers[trackerID].id],
				(_txObj, resultSet) => {
					// Update the count in the trackers array after successful update in the database
					let updatedTrackers = [...trackers];
					updatedTrackers[trackerID].count = newCount;
					setTrackers(updatedTrackers);
				},
				(txObj, error) => {
					console.log(error);
					return true;
				}
			);
		});
	};

	const removeCount = (trackerID: number) => {
		const newCount = trackers[trackerID].count - 1;
		console.log(newCount);
		db.transaction((tx) => {
			tx.executeSql(
				"UPDATE trackers SET count = ? WHERE id = ?",
				[newCount, trackers[trackerID].id],
				(_txObj, resultSet) => {
					// Update the count in the trackers array after successful update in the database
					let updatedTrackers = [...trackers];
					updatedTrackers[trackerID].count = newCount;
					setTrackers(updatedTrackers);
				},
				(txObj, error) => {
					console.log(error);
					return true;
				}
			);
		});
	};

	const showTasks = () => {
		return tasks.map((task, index) => {
			let trackerID = -1;
			if (trackers.length !== 0) {
				console.log(tasks);
				console.log(trackers);
				console.log(task.id);
				trackerID = trackers.findIndex((tracker) => {
					return tracker.task_id === task.id;
				});

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
							<Button
								title="Delete"
								onPress={() => deleteTask(task.id)}
							/>
							<Button
								title="Update"
								onPress={() => updateTask(task.id)}
							/>
						</View>
					);
				}
			}
		});
	};

	const showInfo = () => {
		console.log(tasks);
		console.log(trackers);
	};

	return (
		<View style={styles.container}>
			<TextInput
				value={currentTask}
				placeholder="task"
				onChangeText={setCurrentTask}
			/>
			<TextInput
				value={currentDescription}
				placeholder="description"
				onChangeText={setCurrentDescription}
			/>
			<TextInput
				value={currentCountGoal}
				keyboardType="numeric"
				placeholder="count_goal"
				onChangeText={setCurrentCountGoal}
			/>
			<Button title="Add Task" onPress={addTask} />
			<Button title="Show Info" onPress={showInfo} />
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

export default ContextWrapperV2;
