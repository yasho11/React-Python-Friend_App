import {
	Avatar,
	Box,
	Card,
	CardBody,
	CardHeader,
	Flex,
	Heading,
	IconButton,
	Text,
	useToast,
	Stack,
	HStack,
} from "@chakra-ui/react";
import { BiTrash } from "react-icons/bi";
import EditModal from "./EditModal"; // Assuming you have an EditModal component
import { BASE_URL } from "../App"; // Ensure BASE_URL is correctly imported

const UserCard = ({ user, setUsers }) => {
	const toast = useToast();

	// Function to handle user deletion
	const handleDeleteUser = async () => {
		try {
			const res = await fetch(BASE_URL + "/friends/" + user.id, {
				method: "DELETE",
			});
			const data = await res.json();
			if (!res.ok) {
				throw new Error(data.error);
			}
			// Update users list after successful deletion
			setUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id));
			toast({
				status: "success",
				title: "Success",
				description: "Friend deleted successfully.",
				duration: 2000,
				position: "top",
			});
		} catch (error) {
			toast({
				title: "An error occurred",
				description: error.message,
				status: "error",
				duration: 4000,
				isClosable: true,
				position: "top",
			});
		}
	};

	return (
		<Card shadow="md" borderRadius="lg" borderWidth={1} p={4} mb={4}>
			<CardHeader>
				<Flex justifyContent="space-between" alignItems="center">
					{/* Avatar and User Details */}
					<HStack spacing={4} flex="1">
						<Avatar src={user.imgUrl} size="lg" />
						<Box>
							<Heading size="md">{user.name}</Heading>
							<Text color="gray.600">{user.role}</Text>
							<Text fontSize="sm" color="gray.500">{user.Email || "N/A"}</Text>
						</Box>
					</HStack>

					{/* Edit and Delete Buttons */}
					<Flex gap={2}>
						<EditModal user={user} setUsers={setUsers} />
						<IconButton
							variant="ghost"
							colorScheme="red"
							size="sm"
							aria-label="Delete Friend"
							icon={<BiTrash size={20} />}
							onClick={handleDeleteUser}
						/>
					</Flex>
				</Flex>
			</CardHeader>

			<CardBody>
				<Stack spacing={2}>
					{/* Description */}
					<Text>{user.description || "No description provided."}</Text>

					{/* Additional Information */}
					<Text fontSize="sm" color="gray.600">
						<strong>Phone:</strong> {user.phone || "N/A"}
					</Text>
					<Text fontSize="sm" color="gray.600">
						<strong>Instagram:</strong> {user.igUn || "N/A"}
					</Text>
					<Text fontSize="sm" color="gray.600">
						<strong>Facebook:</strong> {user.fbUn || "N/A"}
					</Text>
				</Stack>
			</CardBody>
		</Card>
	);
};

export default UserCard;
