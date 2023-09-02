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
import { TouchableOpacity } from "react-native-gesture-handler";

const NewTaskV2 = ({ navigation }: { navigation: any }) => {
	const [taskName, setTaskName] = useState("");
	const [taskDescription, setTaskDescription] = useState("");
	const [selectedTracker, setSelectedTracker] = useState(1);
	const [timeGoalHour, setTimeGoalHour] = useState("");
	const [timeGoalMinute, setTimeGoalMinute] = useState("");
	const [countGoal, setCountGoal] = useState("");
	const [error, setError] = useState<string | null>(null);

	const displayTime = () => {
		return (
			<View style={{ flex: 0.7 }}>
				<Text style={styles.inputText}>Time Goal: </Text>
				<View style={[{ flexDirection: "row" }]}>
					<View
						style={[
							{ flex: 1 },
							{ flexDirection: "row" },
							{ alignContent: "center" },
						]}
					>
						<Text
							style={[
								{ flex: 1 },
								{ textAlignVertical: "center" },
								{ textAlign: "center" },
							]}
						>
							Hours:{" "}
						</Text>
						<TextInput
							value={timeGoalHour}
							keyboardType="numeric"
							placeholder="Hours"
							onChangeText={setTimeGoalHour}
							style={[{ flex: 1 }]}
						/>
					</View>
					<View
						style={[
							{ flex: 1 },
							{ flexDirection: "row" },
							{ alignContent: "center" },
						]}
					>
						<Text
							style={[
								{ flex: 1 },
								{ textAlignVertical: "center" },
								{ textAlign: "center" },
							]}
						>
							Minutes:{" "}
						</Text>
						<TextInput
							value={timeGoalMinute}
                            {}
							keyboardType="numeric"
							placeholder="Minutes"
							onChangeText={setTimeGoalMinute}
							style={{ flex: 1 }}
						/>
					</View>
				</View>
			</View>
		);
	};

	const displayCounter = () => {
		return (
			<View style={[{ flex: 0.5 }, { flexDirection: "row" }]}>
				<Text style={styles.inputText}>Counter Goal: </Text>
				<View>
					<TextInput
						value={countGoal}
						keyboardType="numeric"
						placeholder="Count"
						onChangeText={setCountGoal}
						style={{ flex: 1 }}
					/>
				</View>
			</View>
		);
	};

	const displayTrackerGoal = () => {
		if (selectedTracker === 1) {
			return displayCounter();
		} else if (selectedTracker === 2) {
			return displayTime();
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

	const handleTracker = (trackerID: number) => {
		setSelectedTracker(trackerID);
	};

	const convertTime = () => {
		return Number(timeGoalHour) * 60 + Number(timeGoalMinute);
	};

	const checkInputs = () => {
		const timeGoal = convertTime();
		if (taskName !== "") {
			if (taskDescription !== "") {
				if (selectedTracker === 1) {
					if (
						Number(countGoal) > 0 &&
						Math.floor(Number(countGoal)) === Number(countGoal)
					) {
						setError("");
						addTask();
					} else
						setError(
							"Count value has to be a whole number greater than 0"
						);
				}
				if (selectedTracker === 2) {
					if (
						timeGoal > 0 &&
						Number(timeGoalHour) >= 0 &&
						Number(timeGoalMinute) >= 0 &&
						Math.floor(Number(timeGoalHour)) !==
							Number(timeGoalHour) &&
						Math.floor(Number(timeGoalMinute)) !==
							Number(timeGoalMinute)
					) {
						setError("");
						addTask();
					} else setError("Time valeus must be greater than 0");
				}
				if (selectedTracker === 2) {
					if (Number(countGoal) >= 0) {
						if (
							timeGoal > 0 &&
							Number(timeGoalHour) >= 0 &&
							Number(timeGoalMinute) >= 0 &&
							Math.floor(Number(timeGoalHour)) !==
								Number(timeGoalHour) &&
							Math.floor(Number(timeGoalMinute)) !==
								Number(timeGoalMinute)
						) {
							setError("");
							addTask();
						} else
							setError(
								"Time values must be whole numbers greater than 0"
							);
					} else
						setError(
							"Count value has to be a whole number greater than 0"
						);
				}
			} else setError("Description cannot be empty");
		} else setError("Name cannot be empty");
	};

	const addTask = () => {};

	return (
		<View style={styles.container}>
			<View style={styles.topBar}>
				<CustomButton
					name="<"
					onPress={() => navigation.navigate("Home")}
				></CustomButton>
				<View style={styles.mainView}>
					<Text
						style={[
							styles.textStyle,
							error !== null
								? [{ marginBottom: 0 }, { marginTop: 0 }]
								: null,
						]}
					>
						Create New Task
					</Text>
					{error !== null ? (
						<Text
							style={[
								styles.textStyle,
								{ fontSize: 15 },
								{ color: "red" },
								{ marginTop: 0 },
								{ marginBottom: 5 },
							]}
						>
							{error}
						</Text>
					) : null}
				</View>
			</View>
			<View style={styles.mainView}>
				<View style={styles.inputRow}>
					<Text style={styles.inputText}>Name</Text>
					<TextInput
						value={taskName}
						placeholder="Name"
						onChangeText={setTaskName}
						style={styles.inputBox}
					/>
				</View>
				<View style={[styles.inputRow, { flex: 2 }]}>
					<Text style={styles.inputText}>Description</Text>
					<TextInput
						value={taskDescription}
						placeholder="Description"
						onChangeText={setTaskDescription}
						style={styles.inputBox}
					/>
				</View>
				<View style={styles.inputRow}>
					<Text style={styles.inputText}>Tracker Type</Text>
					<View style={[styles.trackerType, { flex: 0.7 }]}>
						<TouchableOpacity
							activeOpacity={1}
							style={[
								styles.trackerTouch,
								selectedTracker === 1
									? { backgroundColor: "#86D2C6" }
									: null,
							]}
							onPress={() => handleTracker(1)}
						>
							<Text style={[styles.trackerText]}>Count</Text>
						</TouchableOpacity>
						<TouchableOpacity
							activeOpacity={1}
							style={[
								styles.trackerTouch,
								selectedTracker === 2
									? { backgroundColor: "#86D2C6" }
									: null,
							]}
							onPress={() => handleTracker(2)}
						>
							<Text style={styles.trackerText}>Time</Text>
						</TouchableOpacity>
						<TouchableOpacity
							activeOpacity={1}
							style={[
								styles.trackerTouch,
								selectedTracker === 3
									? { backgroundColor: "#86D2C6" }
									: null,
							]}
							onPress={() => handleTracker(3)}
						>
							<Text style={styles.trackerText}>Both</Text>
						</TouchableOpacity>
					</View>
				</View>
				<View style={[styles.inputRow]}>{displayTrackerGoal()}</View>
				<View style={[styles.inputRow, { height: "100%" }]}>
					<CustomButton
						name="ADD TASK"
						onPress={() => checkInputs()}
					/>
				</View>
			</View>
		</View>
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

	trackerType: {
		flex: 1,
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		backgroundColor: "#BDDED9",
	},

	trackerTouch: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},

	trackerText: {
		textAlign: "center",
		paddingLeft: 35,
		paddingRight: 35,
		fontSize: 20,
	},

	inputBox: {
		flex: 1,
		backgroundColor: "#BDDED9",
		width: "100%",
	},

	inputText: {
		fontSize: 20,
	},

	inputRow: {
		flex: 1,
		flexDirection: "column",
		padding: 5,
		width: "100%",
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
		paddingLeft: 30,
		paddingRight: 30,
	},

	row: {
		flexDirection: "row",
		alignItems: "center",
		alignSelf: "stretch",
		justifyContent: "space-between",
		margin: 8,
	},

	textStyle: {
		fontSize: 33,
		marginTop: 10,
		marginBottom: 15,
		marginRight: 10,
		paddingLeft: 10,
		paddingRight: 10,
		paddingTop: 0,
		paddingBottom: 0,
	},
});

export default NewTaskV2;
