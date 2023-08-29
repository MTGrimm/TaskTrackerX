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

	return db;
};

interface Tasks {
	task: Array<{
		id: number;
		name: string;
		description: string;
		trackerType: string;
		days_time_goal: string;
		days_counter_goal: string;
		is_active: number;
	}> | null;
	setTask: React.Dispatch<
		React.SetStateAction<Array<{
			id: number;
			name: string;
			description: string;
			trackerType: string;
			days_time_goal: string;
			days_counter_goal: string;
			is_active: number;
		}> | null>
	>;
}

export const TasksContext = createContext<Tasks | undefined>(undefined);

export const TasksProvider = ({ children }: { children: React.ReactNode }) => {
	const [task, setTask] = useState<Array<{
		id: number;
		name: string;
		description: string;
		trackerType: string;
		days_time_goal: string;
		days_counter_goal: string;
		is_active: number;
	}> | null>(null);
	return (
		<TasksContext.Provider value={{ task, setTask }}>
			{children}
		</TasksContext.Provider>
	);
};

export const useTasksContext = () => {
	const tasks = useContext(TasksContext);

	if (tasks === undefined) {
		throw new Error("Ya done messed up buddy");
	}

	return tasks;
};

interface Trackers {
	tracker: Array<{
		id: number;
		dateDoneAt: string;
		timeSpent: string;
		counterDone: string;
		taskId: number;
	}> | null;
	setTracker: React.Dispatch<
		React.SetStateAction<Array<{
			id: number;
			dateDoneAt: string;
			timeSpent: string;
			counterDone: string;
			taskId: number;
		}> | null>
	>;
}

export const TrackersContext = createContext<Trackers | undefined>(undefined);

export const TrackersProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [tracker, setTracker] = useState<Array<{
		id: number;
		dateDoneAt: string;
		timeSpent: string;
		counterDone: string;
		taskId: number;
	}> | null>(null);
	return (
		<TrackersContext.Provider value={{ tracker, setTracker }}>
			{children}
		</TrackersContext.Provider>
	);
};

export const useTrackersContext = () => {
	const trackers = useContext(TrackersContext);

	if (trackers === undefined) {
		throw new Error("Ya done messed up buddy");
	}

	return trackers;
};
