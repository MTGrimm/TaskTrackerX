import { createContext, useContext, useState } from "react";
import { SQLiteDatabase } from "expo-sqlite";

export const DatabaseContext = createContext<SQLiteDatabase | undefined>(
	undefined
);

export const useDatabaseContext = () => {
	const db = useContext(DatabaseContext);

	if (db === undefined) {
		throw new Error("Ya done messed up buddy");
	}

	console.log("working here");

	return db;
};

interface Tasks {
	tasks: Array<{
		id: number;
		name: string;
		description: string;
		tracker_type: number;
		time_goal: number;
		counter_goal: number;
		is_active: number;
	}>;
	setTasks: React.Dispatch<
		React.SetStateAction<
			Array<{
				id: number;
				name: string;
				description: string;
				tracker_type: number;
				time_goal: number;
				counter_goal: number;
				is_active: number;
			}>
		>
	>;
}

export const TasksContext = createContext<Tasks | undefined>(undefined);

// export const TasksProvider = ({ children }: { children: React.ReactNode }) => {
// 	const [tasks, setTasks] = useState<Array<{
// 		id: number;
// 		name: string;
// 		description: string;
// 		tracker_type: string;
// 		days_time_goal: string;
// 		days_counter_goal: string;
// 		is_active: number;
// 	}> | null>([]);
// 	return (
// 		<TasksContext.Provider value={{ tasks, setTasks }}>
// 			{children}
// 		</TasksContext.Provider>
// 	);
// };

export const useTasksContext = () => {
	const tasks = useContext(TasksContext);

	if (tasks === undefined) {
		throw new Error("Ya done messed up buddy");
	}

	return tasks;
};

interface Trackers {
	trackers: Array<{
		id: number;
		date: string;
		time: number;
		count: number;
		task_id: number;
	}>;
	setTrackers: React.Dispatch<
		React.SetStateAction<
			Array<{
				id: number;
				date: string;
				time: number;
				count: number;
				task_id: number;
			}>
		>
	>;
}

export const TrackersContext = createContext<Trackers | undefined>(undefined);

// export const TrackersProvider = ({
// 	children,
// }: {
// 	children: React.ReactNode;
// }) => {
// 	const [trackers, setTrackers] = useState<Array<{
// 		id: number;
// 		date_done_at: string;
// 		time_spent: string;
// 		counter_done: number;
// 		task_id: number;
// 	}> | null>([]);
// 	return (
// 		<TrackersContext.Provider value={{ trackers, setTrackers }}>
// 			{children}
// 		</TrackersContext.Provider>
// 	);
// };

export const useTrackersContext = () => {
	const trackers = useContext(TrackersContext);

	if (trackers === undefined) {
		throw new Error("Ya done messed up buddy");
	}

	return trackers;
};
