import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import * as SQLite from "expo-sqlite";
import { useState, useEffect } from "react";

export default function App() {
	const db = SQLite.openDatabase("example.db");
	const [isLoading, setIsLoading] = useState(true);
	const [tasks, setTasks] = useState<Array<{ id: number; taskName: string }>>(
		[]
	);
	const [currentTask, setCurrentTask] = useState<string | undefined>(
		undefined
	);

	useEffect(() => {
		db.transaction((tx) => {
			tx.executeSql(
				"CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, taskName TEXT)"
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

		setIsLoading(false);
	}, []);

	if (isLoading) {
		return (
			<View style={styles.container}>
				<Text>Loading Tasks...</Text>
			</View>
		);
	}

	const addTask = () => {
		if (currentTask) {
			console.log(currentTask);
			db.transaction((tx) => {
				tx.executeSql(
					"INSERT INTO tasks (taskName) values (?)",
					[currentTask],
					(
						txObj: SQLite.SQLTransaction,
						resultSet: SQLite.SQLResultSet
					) => {
						let existingTasks = [...tasks];
						existingTasks.push({
							id: resultSet.insertId,
							taskName: currentTask,
						});
						setTasks(existingTasks);
						console.log("uwu");
						setCurrentTask(undefined);
					}
					//(txObj, error) => console.log(error)
				);
			});
		}
	};

	const deleteTask = (id: number) => {
		console.log(id);
		db.transaction((tx) => {
			tx.executeSql(
				"DELETE FROM tasks WHERE id = ?",
				[id],
				(txObj, resultSet) => {
					console.log(resultSet.rowsAffected);
					if (resultSet.rowsAffected > 0) {
						let existingTasks = [...tasks].filter(
							(task) => task.id !== id
						);
						setTasks(existingTasks);
						console.log(id);
					}
				}
				//(txObj, error) => console.log(error)
			);
		});
	};

	const updateTask = (id) => {
		db.transaction((tx) => {
			tx.executeSql(
				"UPDATE tasks SET taskName = ? WHERE id = ?",
				[currentTask, id],
				(txObj, resultSet) => {
					if (resultSet.rowsAffected > 0) {
						if (currentTask) {
							let existingTasks = [...tasks];
							const indexToUpdate = existingTasks.findIndex(
								(task) => task.id === id
							);
							existingTasks[indexToUpdate].taskName = currentTask;
							setTasks(existingTasks);
							setCurrentTask(undefined);
						}
					}
				}
				//(txObj, error) => console.log(error)
			);
		});
	};

	const showTasks = () => {
		return tasks.map((task, index) => {
			return (
				<View key={index} style={styles.row}>
					<Text>{task.taskName}</Text>
					<Button
						title="Update"
						onPress={() => updateTask(task.id)}
					/>
					<Button
						title="Delete"
						onPress={() => deleteTask(task.id)}
					/>
				</View>
			);
		});
	};

	return (
		<View style={styles.container}>
			<Text>Task Tracker X</Text>
			<TextInput
				value={currentTask}
				placeholder="task"
				onChangeText={setCurrentTask}
			/>
			<Button title="Add Task" onPress={addTask} />
			{showTasks()}
			<StatusBar style="auto" />
		</View>
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
