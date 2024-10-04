import {
	Button,
	Flex,
	FormControl,
	FormLabel,
	IconButton,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Textarea,
	useDisclosure,
	useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { BASE_URL } from "../App";

function EditModal({ setUsers, user }) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [isLoading, setIsLoading] = useState(false);
	const [inputs, setInputs] = useState({
		name: user.name,
		role: user.role,
		description: user.description,
		Email: user.Email,
		IgUn: user.Ig_un,
		fbUn: user.fb_un,
		phone: user.phone,
	});
	const toast = useToast();

	// Handle form submission to edit the user
	const handleEditUser = async (e) => {
		//e.preventDefault();
		setIsLoading(true);
		try {
			const res = await fetch(BASE_URL + "/friends/" + user.id, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(inputs),
			});
			const data = await res.json();
			if (!res.ok) {
				throw new Error(data.error);
			}
			// Update the user in the list
			setUsers((prevUsers) =>
				prevUsers.map((u) => (u.id === user.id ? data : u))
			);
			toast({
				status: "success",
				title: "Friend updated successfully!",
				duration: 2000,
				position: "top",
			});
			onClose();
		} catch (error) {
			toast({
				status: "error",
				title: "Error",
				description: error.message,
				duration: 4000,
				position: "top",
			});
		} finally {
			setIsLoading(false);
		}
	};

	// Handle input changes
	const handleChange = (e) => {
		const { name, value } = e.target;
		setInputs((prev) => ({ ...prev, [name]: value }));
	};

	return (
		<>
			<IconButton
				onClick={onOpen}
				variant='ghost'
				colorScheme='blue'
				aria-label='Edit user'
				size={"sm"}
				icon={<BiEditAlt size={20} />}
			/>

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<form onSubmit={handleEditUser}>
					<ModalContent>
						<ModalHeader>Edit Friend</ModalHeader>
						<ModalCloseButton />
						<ModalBody pb={6}>
							{/* Name and Role */}
							<Flex alignItems={"center"} gap={4}>
								<FormControl>
									<FormLabel>Full Name</FormLabel>
									<Input
										name="name"
										placeholder="John Doe"
										value={inputs.name}
										onChange={handleChange}
									/>
								</FormControl>

								<FormControl>
									<FormLabel>Role</FormLabel>
									<Input
										name="role"
										placeholder="Software Engineer"
										value={inputs.role}
										onChange={handleChange}
									/>
								</FormControl>
							</Flex>

							{/* Description */}
							<FormControl mt={4}>
								<FormLabel>Description</FormLabel>
								<Textarea
									name="description"
									resize={"none"}
									placeholder="Enter a description"
									value={inputs.description}
									onChange={handleChange}
								/>
							</FormControl>

							{/* Email */}
							<FormControl mt={4}>
								<FormLabel>Email</FormLabel>
								<Input
									name="Email"
									placeholder="example@gmail.com"
									value={inputs.Email}
									onChange={handleChange}
								/>
							</FormControl>

							{/* Instagram Username */}
							<FormControl mt={4}>
								<FormLabel>Instagram Username</FormLabel>
								<Input
									name="IgUn"
									placeholder="ig_username"
									value={inputs.IgUn}
									onChange={handleChange}
								/>
							</FormControl>

							{/* Facebook Username */}
							<FormControl mt={4}>
								<FormLabel>Facebook Username</FormLabel>
								<Input
									name="fbUn"
									placeholder="fb_username"
									value={inputs.fbUn}
									onChange={handleChange}
								/>
							</FormControl>

							{/* Phone */}
							<FormControl mt={4}>
								<FormLabel>Phone</FormLabel>
								<Input
									name="phone"
									placeholder="Enter phone number"
									value={inputs.phone}
									onChange={handleChange}
								/>
							</FormControl>
						</ModalBody>

						{/* Modal Footer with Update and Cancel Buttons */}
						<ModalFooter>
							<Button
								colorScheme='blue'
								type='submit'
								isLoading={isLoading}
								mr={3}
							>
								Update
							</Button>
							<Button onClick={onClose}>Cancel</Button>
						</ModalFooter>
					</ModalContent>
				</form>
			</Modal>
		</>
	);
}

export default EditModal;
