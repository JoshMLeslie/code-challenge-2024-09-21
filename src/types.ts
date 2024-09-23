
export enum TaskState {
	deleted,
	in_progress,
	completed,
}

export interface Task {
	id: number;
	title: string;
	state: TaskState;
}

export type TaskFunction = (task: Task) => void;
