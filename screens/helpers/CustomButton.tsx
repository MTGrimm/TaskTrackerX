import {
	StyleSheet,
	Text,
	View,
	TextInput,
	Button,
	SafeAreaView,
	TouchableWithoutFeedback,
} from "react-native";

interface Props {
	name: string;
	onPress: () => void;
}

const CustomButton = ({ name, onPress }: Props) => {
	return (
		<TouchableWithoutFeedback
			style={styles.buttonContainer}
			onPress={onPress}
		>
			<Text style={styles.textStyle}>{name}</Text>
		</TouchableWithoutFeedback>
	);
};

const styles = StyleSheet.create({
	buttonContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		alignSelf: "flex-end",
	},

	textStyle: {
		backgroundColor: "#E3EAE9",
		fontSize: 30,
		marginTop: 10,
		marginBottom: 10,
		marginRight: 10,
		paddingLeft: 15,
		paddingRight: 15,
		paddingTop: 5,
		paddingBottom: 5,
	},
});

export default CustomButton;
