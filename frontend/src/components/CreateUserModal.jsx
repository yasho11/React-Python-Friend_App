import {
	Button,
	Flex,
	FormControl,
	FormLabel,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Radio,
	RadioGroup,
	Textarea,
	useDisclosure,
	useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { BiAddToQueue } from "react-icons/bi";
import { BASE_URL } from "../App";

const CreateUserModal = ({ setUsers }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [isLoading, setIsLoading] = useState(false);
	const [inputs, setInputs] = useState({
		name: "",
		role: "",
		description: "",
		gender: "",
		Email: "",
		IgUn: "",
		fbUn: "",
		phone: "",
	});
	const toast = useToast();

	const handleCreateUser = async (e) => {
		//e.preventDefault(); // prevent page refresh
		setIsLoading(true);
		try {
			const res = await fetch(BASE_URL + "/friends", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(inputs),
			});

			const data = await res.json();
			if (!res.ok) {
				throw new Error(data.error);
			}

			toast({
				status: "success",
				title: "Yayy! 🎉",
				description: "Friend created successfully.",
				duration: 2000,
				position: "top",
			});
			onClose();
			setUsers((prevUsers) => [...prevUsers, data]);

			// Clear the input fields
			setInputs({
				name: "",
				role: "",
				description: "",
				gender: "",
				Email: "",
				IgUn: "",
				fbUn: "",
				phone: "",
			});
		} catch (error) {
			toast({
				status: "error",
				title: "An error occurred.",
				description: error.message,
				duration: 4000,
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<Button onClick={onOpen} colorScheme="blue">
				<BiAddToQueue size={20} />
			</Button>

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<form onSubmit={handleCreateUser}>
					<ModalContent>
						<ModalHeader>Add a New Friend</ModalHeader>
						<ModalCloseButton />
						<ModalBody>
							<FormControl>
								<FormLabel>Full Name</FormLabel>
								<Input
									placeholder="John Doe"
									value={inputs.name}
									onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
								/>
							</FormControl>

							<FormControl mt={4}>
								<FormLabel>Role</FormLabel>
								<Input
									placeholder="Software Engineer"
									value={inputs.role}
									onChange={(e) => setInputs({ ...inputs, role: e.target.value })}
								/>
							</FormControl>

							<FormControl mt={4}>
								<FormLabel>Description</FormLabel>
								<Textarea
									placeholder="Describe the friend..."
									value={inputs.description}
									onChange={(e) => setInputs({ ...inputs, description: e.target.value })}
								/>
							</FormControl>

							<FormControl mt={4}>
								<FormLabel>Email</FormLabel>
								<Input
									placeholder="example@gmail.com"
									value={inputs.Email}
									onChange={(e) => setInputs({ ...inputs, Email: e.target.value })}
								/>
							</FormControl>

							<FormControl mt={4}>
								<FormLabel>Instagram Username</FormLabel>
								<Input
									placeholder="ig_username"
									value={inputs.IgUn}
									onChange={(e) => setInputs({ ...inputs, IgUn: e.target.value })}
								/>
							</FormControl>

							<FormControl mt={4}>
								<FormLabel>Facebook Username</FormLabel>
								<Input
									placeholder="fb_username"
									value={inputs.fbUn}
									onChange={(e) => setInputs({ ...inputs, fbUn: e.target.value })}
								/>
							</FormControl>

							<FormControl mt={4}>
								<FormLabel>Phone</FormLabel>
								<Input
									placeholder="+1234567890"
									value={inputs.phone}
									onChange={(e) => setInputs({ ...inputs, phone: e.target.value })}
								/>
							</FormControl>

							<RadioGroup mt={4}>
								<Flex gap={5}>
									<Radio
										value="male"
										onChange={(e) => setInputs({ ...inputs, gender: e.target.value })}
									>
										Male
									</Radio>
									<Radio
										value="female"
										onChange={(e) => setInputs({ ...inputs, gender: e.target.value })}
									>
										Female
									</Radio>
								</Flex>
							</RadioGroup>
						</ModalBody>

						<ModalFooter>
							<Button colorScheme="blue" mr={3} type="submit" isLoading={isLoading}>
								Add Friend
							</Button>
							<Button onClick={onClose}>Cancel</Button>
						</ModalFooter>
					</ModalContent>
				</form>
			</Modal>
		</>
	);
};

export default CreateUserModal;
