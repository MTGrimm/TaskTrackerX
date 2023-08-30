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
	TrackersProvider,
} from "./context";
import ContextWrapper from "./ContextWrapper";
import Test from "./Test";

const Tab = createBottomTabNavigator();

export default function App() {
	return (
		<TasksProvider>
			<TrackersProvider>
				<ContextWrapper></ContextWrapper>
			</TrackersProvider>
		</TasksProvider>
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
