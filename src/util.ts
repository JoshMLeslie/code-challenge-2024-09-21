import { Task } from './types';

export const moveTaskToBottomByIndex = (
	tasks: Task[],
	targetTaskIndex: number
): Task[] => {
	if (targetTaskIndex < 0 || targetTaskIndex >= tasks.length) {
		console.error('trying to move a task out of range!');
		return tasks;
	}

	const [targetTask] = tasks.splice(targetTaskIndex, 1);
	console.log([...tasks, targetTask]);
	return [...tasks, targetTask];
};

/**
 * @param container - the parent container
 * @param elementHeight - the height of the item in pixels, including expected margin e.g. gap value
 */
export const getMaxElementsForContainerPage = (
	container: HTMLElement | null,
	elementHeight: number
): number => {
	if (!container) return 0;
	return Math.floor(container.clientHeight / elementHeight);
};
