import { ReactElement, useCallback, useMemo, useRef, useState } from 'react';
import "./paginator.css";
import { getMaxElementsForContainerPage } from './util';

interface PaginatorProps<T> {
	items: T[];
	itemSize: number;
	Element: React.FC<{data: T; idx: number}>;
	hiddenItemFilter?: (item: T, idx: number) => boolean;
}

/**
 * A component that paginates a list of items. It will render the elements in chunks based on the itemSize prop.
 * 
 * NB doesn't listen to window resize. Must refresh page to update.
 * 
 * NB hiddenItemFilter is a function that takes an item and its index
 * and returns true if the item should be **visible**.
 */
export const Paginator = <T extends Record<any, any>>({
	items,
	itemSize,
	Element,
	hiddenItemFilter,
}: PaginatorProps<T>): ReactElement<PaginatorProps<T>> => {
	const listRef = useRef<HTMLUListElement>(null);

	const [currentPage, setCurrentPage] = useState(1);

	const maxItemsPerPage = useMemo(
		() => getMaxElementsForContainerPage(listRef?.current, itemSize) || 0,
		[listRef?.current, itemSize] // eslint-disable-line react-hooks/exhaustive-deps
	);
	const totalPages = useMemo(
		() => {
			const totalVisible = hiddenItemFilter
				? items.filter(hiddenItemFilter).length
				: items.length;

			return totalVisible && maxItemsPerPage
				? Math.ceil(totalVisible / maxItemsPerPage)
				: 0;
		},
		[items, maxItemsPerPage] // eslint-disable-line react-hooks/exhaustive-deps
	);
	const currentItems = useMemo(
		() =>
			items.slice(
				(currentPage - 1) * maxItemsPerPage,
				currentPage * maxItemsPerPage
			),
		[currentPage, items, maxItemsPerPage]
	);

	const firstPage = () => setCurrentPage(1);
	const lastPage = () => setCurrentPage(totalPages);

	const nextPage = useCallback(() => {
		if (!listRef?.current || currentPage * maxItemsPerPage >= items.length)
			return;
		setCurrentPage((cp) => cp + 1);
	}, [currentPage, items.length, maxItemsPerPage]);

	const prevPage = useCallback(() => {
		if (!listRef?.current || currentPage === 1) return;
		setCurrentPage((cp) => cp - 1);
	}, [currentPage]);

	return (
		<div className="paginator">
			<ul className="item-container" ref={listRef}>
				{currentItems.map((data, idx) => (
					<Element data={data} idx={idx} key={data.id || idx} />
				))}
			</ul>
			<div className="paginator-controls">
				<button onClick={firstPage}>First</button>
				<button onClick={prevPage}>Prev</button>
				<div className="page-info">
					<span>{totalPages === 0 ? 0 : currentPage}</span>
					&nbsp;of&nbsp;
					<span>{totalPages}</span>
				</div>
				<button onClick={nextPage}>Next</button>
				<button onClick={lastPage}>Last</button>
			</div>
		</div>
	);
};
