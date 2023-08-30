import { TasksProvider, TrackersProvider } from "./context";
import ContextWrapper from "./ContextWrapper";
import ContextWrapperV2 from "./ContextWrapperV2";

export default function App() {
	return (
		<TasksProvider>
			<TrackersProvider>
				<ContextWrapperV2></ContextWrapperV2>
			</TrackersProvider>
		</TasksProvider>
	);
}
