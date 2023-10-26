import {
	StyleSheet,
	Text,
	View,
	TextInput,
	FlatList,
	Button,
	SafeAreaView,
	Platform,
} from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { useState, useEffect, SetStateAction } from "react";
import * as SQLite from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import {
	useDatabaseContext,
	useTasksContext,
	useTrackersContext,
} from "../context";
import CustomButton from "./helpers/CustomButton";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import DateTimePicker from "@react-native-community/datetimepicker";

interface Props {
	navigation: any;
	route: any;
}

const Graph = ({ navigation, route }: Props) => {
	type itemProps = {
		count: any;
		date: string;
	};
	const db = useDatabaseContext();
	const [error, setError] = useState<string | null>(null);
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());
	const [showStartDate, setShowStartDate] = useState(false);
	const [showEndDate, setShowEndDate] = useState(false);
	const [dataArray, setDataArray] = useState<itemProps[]>([]);
	const [dateArray, setDateArray] = useState<string[]>([]);
	const [mean, setMean] = useState(0);
	const [nzMean, setNzMean] = useState(0);
	const [median, setMedian] = useState(0);
	const [nzMedian, setNzMedian] = useState(0);
	const [mode, setMode] = useState(0);
	const [nzMode, setNzMode] = useState(0);
	const [spacing, setSpacing] = useState(0);
	const [spacingScale, setSpacingScale] = useState(1);

	const handleCountMode = () => {
		db.transaction((tx) => {
			tx.executeSql(
				`
				SELECT t.count
				FROM trackers t
				WHERE t.task_id = ? AND t.date IN (${dateArray.map(() => "?").join(", ")})
				GROUP BY t.count
				ORDER BY COUNT(*) DESC
				LIMIT 1
				`,
				[route.params.task.id, ...dateArray],
				(txObj, resultSet) => {
					console.log(resultSet.rows._array);
				},
				(txObj, error) => {
					console.log(error);
					return false;
				}
			);
		});
	};

	const handleNzCountMode = () => {
		db.transaction((tx) => {
			tx.executeSql(
				`
				SELECT t.count
				FROM trackers t
				WHERE t.count != 0 AND t.task_id = ? AND t.date IN (${dateArray
					.map(() => "?")
					.join(", ")})
				GROUP BY t.count
				ORDER BY COUNT(*) DESC
				LIMIT 1
				`,
				[route.params.task.id, ...dateArray],
				(txObj, resultSet) => {
					console.log(resultSet.rows._array);
					if (resultSet.rows._array.length !== 0) {
						setNzMode(resultSet.rows._array[0].count);
					}
				},
				(txObj, error) => {
					console.log(error);
					return false;
				}
			);
		});
	};

	const handleCountMedian = () => {
		db.transaction((tx) => {
			tx.executeSql(
				`
				SELECT t.count
				FROM trackers t
				WHERE t.task_id = ? AND t.date IN (${dateArray.map(() => "?").join(", ")})
				ORDER BY t.count desc
				LIMIT 1
				OFFSET (
					SELECT COUNT(*)/2
					FROM trackers t2
					WHERE t2.task_id = ? AND t2.date IN (${dateArray.map(() => "?").join(", ")})
				)
				`,
				[
					route.params.task.id,
					...dateArray,
					route.params.task.id,
					...dateArray,
				],
				(txObj, resultSet) => {
					console.log(resultSet.rows._array);
				},
				(txObj, error) => {
					console.log(error);
					return false;
				}
			);
		});
	};

	const handleNzCountMedian = () => {
		db.transaction((tx) => {
			tx.executeSql(
				`
				SELECT t.count
				FROM trackers t
				WHERE t.count != 0 AND t.task_id = ? AND t.date IN (${dateArray
					.map(() => "?")
					.join(", ")})
				ORDER BY t.count desc
				LIMIT 1
				OFFSET (
					SELECT COUNT(*)/2
					FROM trackers t2
					WHERE t2.count != 0 AND t2.task_id = ? AND t2.date IN (${dateArray
						.map(() => "?")
						.join(", ")})
				)
				`,
				[
					route.params.task.id,
					...dateArray,
					route.params.task.id,
					...dateArray,
				],
				(txObj, resultSet) => {
					console.log(resultSet.rows._array);
					if (resultSet.rows._array.length !== 0) {
						setNzMedian(resultSet.rows._array[0].count);
					}
				},
				(txObj, error) => {
					console.log(error);
					return false;
				}
			);
		});
	};

	const handleTimeMean = () => {
		db.transaction((tx) => {
			tx.executeSql(
				`
				SELECT t.time
				from trackers t
				WHERE t.task_id = ? AND t.date IN (${dateArray.map(() => "?").join(", ")})
				`,
				[route.params.task.id, ...dateArray],
				(txObj, resultSet) => {
					console.log(resultSet.rows._array);
				},
				(txObj, error) => {
					console.log(error);
					return false;
				}
			);
		});
	};

	const handleNzTimeMean = () => {
		db.transaction((tx) => {
			tx.executeSql(
				`
				SELECT t.time
				from trackers t
				WHERE t.time != 0 AND t.task_id = ? AND t.date IN (${dateArray
					.map(() => "?")
					.join(", ")})
				`,
				[route.params.task.id, ...dateArray],
				(txObj, resultSet) => {
					console.log(resultSet.rows._array);
				},
				(txObj, error) => {
					console.log(error);
					return false;
				}
			);
		});
	};

	const handleCountMean = () => {
		db.transaction((tx) => {
			tx.executeSql(
				`
				SELECT AVG(t.count)
				FROM trackers t
				WHERE t.task_id = ? AND t.date IN (${dateArray.map(() => "?").join(", ")})
				`,
				[route.params.task.id, ...dateArray],
				(txobj, resultSet) => {
					console.log(resultSet.rows._array);
				},
				(txObj, error) => {
					console.log(error);
					return false;
				}
			);
		});
	};

	const handleNzMean = () => {
		db.transaction((tx) => {
			tx.executeSql(
				`
				SELECT AVG(t.count)
				FROM trackers t
				WHERE t.count != 0 AND t.task_id = ? AND t.date IN (${dateArray
					.map(() => "?")
					.join(", ")})
				`,
				[route.params.task.id, ...dateArray],
				(txObj, resultSet) => {
					console.log(resultSet.rows._array);
				},
				(txObj, error) => {
					console.log(error);
					return false;
				}
			);
		});
	};

	useEffect(() => {
		db.transaction((tx) => {
			tx.executeSql(
				`
				SELECT count, date
				FROM trackers
				WHERE task_id = ? AND date IN (${dateArray.map(() => "?").join(", ")})
				`,
				[route.params.task.id, ...dateArray],
				(txObj, resultSet) => {
					console.log(resultSet.rows._array);
					const tempResults = resultSet.rows._array;
					const tempData = [];
					let resultIndex = 0;
					for (let i = 0; i < dateArray.length; i++) {
						if (
							resultIndex >= tempResults.length ||
							dateArray[i] !== tempResults[resultIndex].date
						) {
							tempData.push({
								count: 0,
								date: dateArray[i],
							});
						} else {
							tempData.push({
								count: tempResults[resultIndex].count,
								date: dateArray[i],
							});
							resultIndex++;
						}
						console.log(resultIndex);
					}

					handleCountMean();
					handleNzMean();
					handleCountMedian();
					handleNzCountMedian();
					handleCountMode();
					handleNzCountMode();
					setDataArray(tempData);
				},
				(txObj, error) => {
					console.log("nope ya done messed up");
					return false;
				}
			);
		});
	}, [dateArray]);

	const changeDate = (
		event: any,
		selectedDate: Date | undefined,
		setDate: React.Dispatch<SetStateAction<Date>>,
		type: number
	) => {
		if (selectedDate !== undefined) {
			setDate(selectedDate);
			if (type === 1) {
				setShowStartDate(false);
			} else {
				setShowEndDate(false);
			}
		}
	};

	const getFormattedDate = (date: Date) => {
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		const year = date.getFullYear();

		const formattedDate = `${month}/${day}/${year}`;
		return formattedDate;
	};

	const generateDates = () => {
		let currentDate = new Date(startDate);
		let tempData = [];
		console.log(currentDate);
		while (currentDate <= endDate) {
			tempData.push(getFormattedDate(new Date(currentDate)));
			currentDate.setDate(currentDate.getDate() + 1);
		}
		console.log(tempData);
		setDateArray(tempData);
	};

	const handleDateSelection = () => {
		if (Platform.OS === "ios") {
			return (
				<View style={styles.taskTopBar}>
					<View>
						<Text
							style={[
								styles.inputText,
								{ textAlign: "center" },
								{ backgroundColor: "#252525" },
							]}
						>
							Start Date
						</Text>
						<DateTimePicker
							testID="dateTimePicker"
							value={startDate}
							onChange={(event, selectedDate) =>
								changeDate(event, selectedDate, setStartDate, 1)
							}
							style={styles.datePicker}
						/>
					</View>
					<View style={{ marginLeft: 10 }}>
						<Text
							style={[
								styles.inputText,
								{ textAlign: "center" },
								{ backgroundColor: "#252525" },
							]}
						>
							End Date
						</Text>
						<DateTimePicker
							testID="dateTimePicker"
							value={endDate}
							onChange={(event, selectedDate) =>
								changeDate(event, selectedDate, setEndDate, 2)
							}
							style={styles.datePicker}
						/>
					</View>
					<View style={[{ flex: 1 }]}>
						<CustomButton
							name="GRAPH"
							onPress={() => generateDates()}
							fontSize={20}
						/>
					</View>
				</View>
			);
		}
		return (
			<View style={styles.taskTopBar}>
				<View>
					<Button
						title="select start date"
						onPress={() => setShowStartDate(true)}
					/>
					{showStartDate && (
						<DateTimePicker
							testID="dateTimePicker"
							value={startDate}
							onChange={(event, selectedDate) =>
								changeDate(event, selectedDate, setStartDate, 1)
							}
						/>
					)}
					<Text style={[{ fontSize: 30 }, { color: "white" }]}>
						{getFormattedDate(startDate)}
					</Text>
				</View>
				<View>
					<Button
						title="select end date"
						onPress={() => setShowEndDate(true)}
					/>
					{showEndDate && (
						<DateTimePicker
							testID="dateTimePicker"
							value={endDate}
							onChange={(event, selectedDate) =>
								changeDate(event, selectedDate, setEndDate, 2)
							}
						/>
					)}
					<Text style={[{ fontSize: 30 }, { color: "white" }]}>
						{getFormattedDate(endDate)}
					</Text>
				</View>
				<CustomButton
					name="GRAPH"
					onPress={() => generateDates()}
					fontSize={20}
				/>
			</View>
		);
	};

	const Item = ({ count, date }: itemProps) => {
		return (
			<View style={styles.itemView}>
				<View style={styles.tableTextView}>
					<Text style={styles.tableText}>{date}</Text>
				</View>
				<View style={styles.tableTextView}>
					<Text style={styles.tableText}>{count}</Text>
				</View>
			</View>
		);
	};

	const itemSeperator = () => {
		return (
			<View
				style={[
					{ height: 1 },
					{ width: "100%" },
					{ backgroundColor: "#CCC" },
				]}
			/>
		);
	};

	const listHeader = () => {
		return (
			<View style={styles.headerView}>
				<View style={styles.tableHeaderView}>
					<Text style={styles.tableText}>{"Date"}</Text>
				</View>
				<View style={styles.tableHeaderView}>
					<Text style={styles.tableText}>{"Count"}</Text>
				</View>
			</View>
		);
	};

	const generateTable = () => {
		return (
			<SafeAreaView style={styles.table}>
				<FlatList
					ListHeaderComponent={listHeader}
					stickyHeaderIndices={[0]}
					data={dataArray}
					renderItem={({ item }) => (
						<Item count={item.count} date={item.date} />
					)}
					keyExtractor={(item) => item.date}
					ItemSeparatorComponent={itemSeperator}
				/>
			</SafeAreaView>
		);
	};

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
						numberOfLines={1}
						ellipsizeMode="tail"
					>
						{route.params.task.name}
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
				{handleDateSelection()}
				{dataArray.length !== 0 && (
					<View
						style={[{ width: "90%" }, { backgroundColor: "#fff" }]}
					></View>
				)}
				{dataArray.length !== 0 && (
					<View style={[{ flex: 5 }, { width: "100%" }]}>
						<View style={styles.tableView}>{generateTable()}</View>
						<View style={styles.statView}>
							<View style={styles.statContainer}>
								<View style={styles.statTextView}>
									<Text
										style={[styles.statText, { flex: 1 }]}
									>
										Mean: {mean}
									</Text>
								</View>
								<View style={styles.statTextView}>
									<Text
										style={[styles.statText, { flex: 1 }]}
									>
										Non 0 Mean: {nzMean}
									</Text>
								</View>
							</View>
							<View style={styles.statContainer}>
								<View style={styles.statTextView}>
									<Text
										style={[styles.statText, { flex: 1 }]}
									>
										Median: {median}
									</Text>
								</View>

								<View style={styles.statTextView}>
									<Text
										style={[styles.statText, { flex: 1 }]}
									>
										Non 0 Median: {nzMedian}
									</Text>
								</View>
							</View>
							<View style={styles.statContainer}>
								<View style={styles.statTextView}>
									<Text
										style={[styles.statText, { flex: 1 }]}
									>
										Mode: {mode}
									</Text>
								</View>

								<View style={styles.statTextView}>
									<Text
										style={[styles.statText, { flex: 1 }]}
									>
										Non 0 Mode: {nzMode}
									</Text>
								</View>
							</View>
						</View>
					</View>
				)}
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
		backgroundColor: "#141414",
	},

	statView: {
		flex: 1,
		backgroundColor: "#501caa",
		justifyContent: "center",
		alignItems: "center",
	},

	statContainer: {
		flex: 1,
		flexDirection: "row",
		backgroundColor: "#8f5fe4",
		justifyContent: "center",
		alignItems: "center",
		margin: 5,
		borderRadius: 0,
	},

	statTextView: {
		flex: 1,
		justifyContent: "center",
	},

	statText: {
		flex: 1,
		fontSize: 20,
		paddingLeft: 10,
		textAlignVertical: "center",
	},

	headerView: {
		flex: 1,
		flexDirection: "row",
		borderWidth: 1,
	},

	itemView: {
		backgroundColor: "#8f5fe4",
		flex: 1,
		flexDirection: "row",
		margin: 2,
		borderRadius: 7,
		borderWidth: 1.5,
	},

	tableView: {
		flex: 2,
		borderRadius: 10,
		width: "100%",
	},

	table: {
		backgroundColor: "#5E22C9",
		flex: 1,
	},

	tableTextView: {
		padding: 5,
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},

	tableHeaderView: {
		backgroundColor: "#793FDF",
		padding: 5,
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},

	tableText: {
		color: "white",
		flex: 1,
		textAlign: "center",
		textAlignVertical: "center",
		fontSize: 18,
	},

	datePicker: {
		alignSelf: "center",
		backgroundColor: "#793FDF",
	},

	graphView: {
		flex: 1,
	},

	trackerType: {
		flex: 1,
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		backgroundColor: "#141414",
	},

	trackerTouch: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#303030",
	},

	trackerText: {
		textAlign: "center",
		color: "#D0D0D0",
		paddingLeft: 35,
		paddingRight: 35,
		fontSize: 20,
	},

	trackerOverride: {
		backgroundColor: "#793FDF",
	},

	inputBox: {
		flex: 1,
		backgroundColor: "#252525",
		textAlign: "center",
		color: "#E0E0E0",
		width: "100%",
	},

	inputText: {
		fontSize: 20,
		color: "white",
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
		justifyContent: "flex-start",
		flex: 1,
	},

	topBar: {
		width: "90%",
		flexDirection: "row",
		justifyContent: "space-between",
		paddingLeft: 20,
		alignItems: "center",
		borderColor: "#3F3F3F",
		borderBottomWidth: 0.5,
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
		color: "white",
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

export default Graph;
