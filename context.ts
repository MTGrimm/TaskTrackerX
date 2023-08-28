import { createContext, useContext} from "react";
import {SQLiteDatabase} from "expo-sqlite"

export const TaskContext = createContext<SQLiteDatabase | undefined>(undefined);

export const useTaskContext = () => {
    const db = useContext(TaskContext);

    if (db === undefined) {
        throw new Error("Ya done messed up buddy");
    }

    return db;
}

export const TasksContext = createContext<Array<{
    id: number;
    name: string;   
    description: string;
    days_time_goal: string;
    days_counter_goal: string;
    is_active:  number;
}>>([])
