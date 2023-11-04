import { Box, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react';
import {
	FormControl,
	FormLabel,
	Select,
	Input,
} from "@chakra-ui/react";
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";


const AddTodo = ({ isOpen, onClose, editTask }) => {
	const [task, setTask] = useState("");
	const [priority, setPriority] = useState("");
	const [selectedDate, setSelectedDate] = useState(new Date());
	const PriorityOptions = ["High", "Medium", "Low"];
	const [error, setError] = useState('');

	const handleDateChange = (date) => {
		setSelectedDate(date);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const userDetail = JSON.parse(localStorage.getItem('loggedInUser'))
		if (!(task.trim().length > 5)) {
			setError('Add some more detail');
			return;
		} else if (priority === '') {
			setError('Please set priority');
			return;
		} else if (selectedDate < new Date()) {
			setError('Please add valid due date');
			return;
		} else {
			let allTasks = JSON.parse(localStorage.getItem('allTasks'));
			if (editTask) {
				editTask = { ...editTask, selectedDate, priority, task };
				if (allTasks && allTasks.length !== 0) {
					let itemIndex = '';
					allTasks.forEach((item, index) => {
						if (item.id === editTask.id) {
							itemIndex = index
						}
					})
					allTasks[itemIndex] = editTask;
					localStorage.setItem('allTasks', JSON.stringify(allTasks));
					onClose();
				}
			} else {
				const newTask = {
					id: Math.floor(Math.random() * (1000 - 1 + 1)) + 1,
					user: userDetail.id,
					priority,
					deadline: selectedDate,
					task,
					completed: false
				}
				if (allTasks && allTasks.length !== 0) {
					allTasks.push(newTask);
					localStorage.setItem('allTasks', JSON.stringify(allTasks));
					onClose();
				} else {
					localStorage.setItem('allTasks', JSON.stringify([newTask]));
					onClose();
				}
			}
		}
		setTimeout(() => {
			setError('')
		}, 4000);

	};

	useEffect(() => {
		if (editTask) {
			setPriority(editTask.priority);
			setSelectedDate(new Date(editTask.deadline));
			setTask(editTask.task)
		}
	}, [editTask])


	return (
		<Modal isOpen={isOpen} onClose={onClose} >
			<ModalOverlay />
			<ModalContent padding={'3rem'}>
				<ModalHeader>Modal Title</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Box p={4}>
						<form onSubmit={handleSubmit}>
							<FormControl>
								<FormLabel>Task</FormLabel>
								<Input
									type="text"
									placeholder="Enter your task"
									value={task}
									onChange={(e) => setTask(e.target.value)}
								/>
							</FormControl>

							<FormControl mt={4}>
								<FormLabel>Priority</FormLabel>
								<Select
									placeholder="Select priority"
									value={priority}
									onChange={(e) => setPriority(e.target.value)}
								>
									{PriorityOptions.map((option) => (
										<option key={option} value={option}>
											{option}
										</option>
									))}
								</Select>
							</FormControl>

							<FormControl mt={4}>
								<FormLabel>Date</FormLabel>
								<ReactDatePicker
									selected={selectedDate}
									minDate={new Date()}
									onChange={handleDateChange} //only when value has changed
								/>
							</FormControl>
							{error !== '' ? <span style={{ color: 'red' }}>{error}</span> : null}
							<button className='todoButton'>Submit</button>
						</form>
					</Box>
				</ModalBody>
			</ModalContent>
		</Modal>
	)
}

export default AddTodo