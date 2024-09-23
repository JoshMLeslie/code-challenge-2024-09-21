import axios from 'axios';
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import './App.css';
import { Paginator } from './Paginator';
import { TodoTile } from './TodoTile';
import { Task, TaskState } from './types';
import { moveTaskToBottomByIndex } from './util';

const App: React.FC = () => {
	const taskUpdateRef = useRef<HTMLDialogElement>(null);

	const [tasks, setTasks] = useState<Task[]>([]);
	const [newTaskText, setNewTaskText] = useState<string>('');
	const [taskUpdateText, setTaskUpdateText] = useState<string>('');

	useEffect(() => {
		// Load existing user data, if any
		const closeModal = updateTask('Loading user data', true);
		axios
			.get('https://jsonplaceholder.typicode.com/todos')
			.then((res) => {
				setTasks(res?.data || []);
			})
      .catch(err => {
        console.error(err);
        updateTask('Failed to load tasks');
        return [];
      })
			.finally(closeModal);
	}, []);

	const taskTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewTaskText(e.target.value);
	};

	const updateTask = (updateText: string, callerWillClose = false) => {
		if (!taskUpdateRef.current) {
			return;
		}

		setTaskUpdateText(updateText);
		taskUpdateRef.current?.showModal(); // or "show()" to use without bg

		if (callerWillClose) {
			return () => taskUpdateRef.current!.close();
		}

		// TODO grab setTimeout ID and clear it if user closes modal manually
		setTimeout(() => {
			taskUpdateRef.current?.close();
			setNewTaskText('');
		}, 2000);
	};

	/**
	 * event is optional since this is triggered by
	 * button click or via form submit + enter key
	 */
	const addTask = (e?: FormEvent) => {
		e?.preventDefault();

		const useText = newTaskText.trim();
		if (useText) {
			const newTask: Task = {
				id: Date.now(),
				title: useText,
				state: TaskState.in_progress,
			};
			setTasks((oldTasks) => [...oldTasks, newTask]);
			setNewTaskText('');
		}
	};

	const completeTask = (task: Task, index: number) => {
		if (task.state !== TaskState.completed) return;

		const prettyDate = new Date(task.id)
			.toISOString()
			.split('T')[0]
			.replace(/-/g, '.');
		updateTask(`Congrats on completing the task you started on ${prettyDate}!`);

		const newTasks = moveTaskToBottomByIndex(tasks, index);
		console.log(newTasks);
		setTasks(newTasks);
	};

	const deleteTask = (target: Task) => {
		setTasks((oldTasks) => {
			const updatedTasks = oldTasks.filter((task) => task.id !== target.id);
			const newTaskList = [...updatedTasks, target];

			console.log('soft-deleted task: ' + target.id, newTaskList);
			updateTask('Deleted task');

			return newTaskList;
		});
	};

	const DisplayTile = ({data, idx}: {data: Task; idx: number}) =>
		data.state !== TaskState.deleted ? (
			<TodoTile
				key={data.id}
				data={data}
				onComplete={(task) => completeTask(task, idx)}
				onDelete={deleteTask}
			/>
		) : null;

	return (
		<div id="app-container">
			<div id="app-header">
				<h1>TODO App</h1>
				<form id="add-task-form" onSubmit={addTask}>
					<input
						type="text"
						value={newTaskText}
						onChange={taskTextChange}
						placeholder="Add a new task"
					/>
					<button onClick={addTask}>Add Task</button>
				</form>
			</div>

			<Paginator
				items={tasks}
				itemSize={88}
				Element={DisplayTile}
				hiddenItemFilter={(item, _) => item.state !== TaskState.deleted}
			/>

			<dialog id="task-update-dialog" ref={taskUpdateRef}>
				<div className="task-update-content">
					<h2>Task Updated</h2>
					<p>{taskUpdateText}</p>
					<button type="button" onClick={(_) => taskUpdateRef.current?.close()}>
						Close
					</button>
				</div>
			</dialog>
		</div>
	);
};

export default App;
