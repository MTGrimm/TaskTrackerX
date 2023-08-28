import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import { useState, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import * as SQLite from "expo-sqlite";

interface Props {}

const NewTask = ({ navigation }: { navigation: any }) => {
	const [taskName, setTaskName] = useState("");
	const [taskDescription, setTaskDescription] = useState("");
	const [selectedTracker, setSelectedTracker] = useState(0);
	const [timeGoalHour, setTimeGoalHour] = useState("");
	const [timeGoalMinute, setTimeGoalMinute] = useState("");
	const [timeGoalSecond, setTimeGoalSecond] = useState("");
	const [countGoal, setCountGoal] = useState("");
	const [loginError, setLoginError] = useState("");

	const handleSelectedTracker = (tracker: number) => {
		setSelectedTracker(tracker);
	};

	const displayTime = () => {
		return (
			<View style={[{ flex: 1 }, { flexDirection: "row" }]}>
				<Text style={{ flex: 1 }}>Time Goal: </Text>
				<TextInput
					value={timeGoalHour}
					keyboardType="numeric"
					placeholder="Hours"
					onChangeText={setTimeGoalHour}
					style={{ flex: 1 }}
				/>
				<TextInput
					value={timeGoalMinute}
					keyboardType="numeric"
					placeholder="Minutes"
					onChangeText={setTimeGoalMinute}
					style={{ flex: 1 }}
				/>
				<TextInput
					value={timeGoalSecond}
					keyboardType="numeric"
					placeholder="Seconds"
					onChangeText={setTimeGoalSecond}
					style={{ flex: 1 }}
				/>
			</View>
		);
	};

	const displayCounter = () => {
		return (
			<View style={[{ flex: 1 }, { flexDirection: "row" }]}>
				<Text style={{ flex: 1 }}>Counter Goal: </Text>
				<TextInput
					value={countGoal}
					keyboardType="numeric"
					placeholder="Count"
					onChangeText={setCountGoal}
					style={{ flex: 1 }}
				/>
			</View>
		);
	};

	const displayTrackerGoal = () => {
		if (selectedTracker === 0) {
			return displayTime();
		} else if (selectedTracker === 1) {
			return displayCounter();
		} else {
			return (
				<View style={[{ flex: 1 }, { flexDirection: "column" }]}>
					<View style={[{ flexDirection: "row" }]}>
						{displayTime()}
					</View>
					<View style={[{ flexDirection: "row" }]}>
						{displayCounter()}
					</View>
				</View>
			);
		}
	};

	const confirmSubmission = () => {
		if (taskName !== "") {
			if (taskDescription !== "") {
				if (selectedTracker === 0) {
					if (
						Number(timeGoalHour) +
							Number(timeGoalMinute) +
							Number(timeGoalSecond) !==
						0
					) {
						console.log("Success");
						return;
					}
				} else if (selectedTracker === 1) {
					if (Number(countGoal) !== 0) {
						console.log("Success");
						return;
					}
				} else {
					if (
						Number(timeGoalHour) +
							Number(timeGoalMinute) +
							Number(timeGoalSecond) !==
							0 &&
						Number(countGoal) !== 0
					) {
						console.log("Success");
						return;
					}
				}
			}
		}
		setLoginError("EMPTY FIELD(S)");
	};

	return (
		<View style={styles.container}>
			<Text>
				Create New Task{" "}
				<Text style={{ color: "red" }}>{loginError}</Text>
			</Text>
			<View style={styles.entryRow}>
				<Text style={{ flex: 1 }}>Task Name: </Text>
				<TextInput
					value={taskName}
					placeholder="Enter Task Name"
					onChangeText={setTaskName}
					style={{ flex: 1 }}
				/>
			</View>
			<View style={styles.entryRow}>
				<Text style={{ flex: 1 }}>Task Description: </Text>
				<TextInput
					value={taskDescription}
					placeholder="Enter Task Description"
					onChangeText={setTaskDescription}
					style={{ flex: 1 }}
				/>
			</View>
			<View style={styles.entryRow}>
				<Text style={{ flex: 1 }}>Tracker Type: </Text>
				<View style={[{ flex: 1 }, { flexDirection: "row" }]}>
					<Text
						style={{
							backgroundColor:
								selectedTracker === 0 ? "skyblue" : "white",
						}}
						onPress={() => handleSelectedTracker(0)}
					>
						{" "}
						Time{" "}
					</Text>
					<Text> | </Text>
					<Text
						style={{
							backgroundColor:
								selectedTracker === 1 ? "skyblue" : "white",
						}}
						onPress={() => handleSelectedTracker(1)}
					>
						{" "}
						Count{" "}
					</Text>
					<Text> | </Text>
					<Text
						style={{
							backgroundColor:
								selectedTracker === 2 ? "skyblue" : "white",
						}}
						onPress={() => handleSelectedTracker(2)}
					>
						{" "}
						Both{" "}
					</Text>
				</View>
			</View>
			<View style={styles.entryRow}>{displayTrackerGoal()}</View>
			<View style={[{ marginTop: 20 }]}>
				<Button title="SUBMIT" onPress={confirmSubmission} />
			</View>
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

export default NewTask;
