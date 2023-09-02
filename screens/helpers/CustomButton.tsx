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
}

const CustomButton = ({ name, onPress }: Props) => {
	return (
		<TouchableOpacity
			style={styles.buttonContainer}
			activeOpacity={1}
			onPress={onPress}
		>
			<Text style={styles.textStyle}>{name}</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	buttonContainer: {
		justifyContent: "center",
		alignItems: "center",
		alignSelf: "center",
	},

	textStyle: {
		backgroundColor: "#86D2C6",
		fontSize: 40,
		marginTop: 10,
		marginBottom: 10,
		marginRight: 10,
		paddingLeft: 10,
		paddingRight: 10,
		paddingTop: 0,
		paddingBottom: 0,
	},
});

export default CustomButton;
