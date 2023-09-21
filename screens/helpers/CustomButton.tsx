import {
	StyleSheet,
	Text,
	View,
	TextInput,
	Button,
	SafeAreaView,
	TouchableWithoutFeedback,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

interface Props {
	name: string;
	onPress: () => void;
	backgroundColor?: any;
	color?: any;
}

const CustomButton = ({ name, onPress, backgroundColor, color }: Props) => {
	return (
		<TouchableOpacity
			style={[
				styles.buttonContainer,
				backgroundColor === undefined
					? null
					: { backgroundColor: backgroundColor },
			]}
			onPress={onPress}
		>
			<Text
				style={[
					styles.textStyle,
					color === undefined ? null : { color: color },
				]}
			>
				{name}
			</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	buttonContainer: {
		justifyContent: "center",
		padding: 2,
		alignItems: "center",
		alignSelf: "center",
		borderRadius: 20,
	},

	textStyle: {
		color: "#793FDF",
		fontSize: 50,
		marginRight: 10,
		paddingLeft: 10,
		paddingBottom: 0,
	},
});

export default CustomButton;
