import { StyleSheet, Text, View, TextInput, Button } from "react-native";

import { useState, useEffect } from "react";
import * as SQLite from "expo-sqlite";
import { StatusBar } from "expo-status-bar";

const Home = ({ navigation }: { navigation: any }) => {
	return (
		<View style={styles.container}>
			<View style={styles.topBar}>
				<Text>TaskTrackerX</Text>
				<Button
					title="+"
					onPress={() => navigation.navigate("New Task", {})}
				/>
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
		alignItems: "flex-start",
		justifyContent: "center",
	},
});

export default Home;
