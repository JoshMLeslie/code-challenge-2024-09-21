import React, { useRef } from 'react';
import './App.css';
import './todo-tile.css';
import { Task, TaskFunction, TaskState } from './types';

export const TodoTile: React.FC<{
	data: Task;
	onComplete: TaskFunction;
	onDelete: TaskFunction;
}> = ({data, onComplete, onDelete}) => {
	const taskRef = useRef<HTMLLIElement>(null);

	const handleComplete = () => {
		data.state = TaskState.completed;
		onComplete(data);
	};

	const handleDelete = () => {
		data.state = TaskState.deleted;
		onDelete(data);
	};

	const className =
		'todo-tile' + (data.state === TaskState.completed ? ' completed' : '');

	return (
		<li className={className} ref={taskRef}>
			<span>{data.title}</span>
			<div className="todo-tile-actions">
				{data.state !== TaskState.completed && (
					<button
						type="button"
						className="complete-button"
						onClick={handleComplete}
					>
						Complete
					</button>
				)}
				<button type="button" className="delete-button" onClick={handleDelete}>
					Delete
				</button>
			</div>
		</li>
	);
};
