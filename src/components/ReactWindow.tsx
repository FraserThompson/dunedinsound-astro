/**
 * Provides a virtualized window for displaying elements in a grid.
 * 
 * Use this if you have many many DOM elements which you want to be scrollable
 * without killing performance.
 * 
 * It also supports searching, sorting, and filtering defined by props which
 * fit the same definition as those used by ShuffleFilters.astro
 * 
 * @param items String of HTML elements to display as grid items
 * @param rowHeight Row height in pixels
 * @param grid Grid object for responsively setting column count
 * @param search Whether to display a search box (used as placeholder)
 * @param sort Array of sorters
 * @param filter Array of filters
 * @param className optional class to add
 * @param id optional ID to add
 */

import { FixedSizeGrid as Grid } from "react-window"
import AutoSizer from "react-virtualized-auto-sizer"
import type { FunctionalComponent } from "preact"
import { useMemo, useState, useCallback, useEffect, useRef } from "preact/hooks"
import { searchboxWrapper } from "./SearchBox.css"
import SortIcon from '~icons/iconoir/sort'
import SearchIcon from '~icons/iconoir/search'
import GlobeIcon from '~icons/iconoir/globe'
import type { ChangeEvent } from "react-dom/src"
import { shuffleFilter } from "./ShuffleFilters.css"
import { filtersWrapper, reactWindowWrapper } from "./ReactWindow.css"
import type { Filter, Sorter } from "./ShuffleFilters.astro"
import type { Grid as GridDefinition } from 'src/components/GridChild.astro'

interface Props {
    items: string
    rowHeight: number
    grid?: GridDefinition
    search?: string
    sort?: Sorter[]
    filter?: Filter[]
    className?: string
    id?: string
}

const ReactWindow: FunctionalComponent<Props> = ({ items, search, sort, rowHeight, filter, grid, className = '', id = '' }) => {

    const [searchValue, setSearch] = useState('')
    const [filters, setFilters] = useState([] as string[])
    const [selectFilters, setSelectFilters] = useState({})
    const [sortValue, setSort] = useState('')
    const [sortOrder, setSortOrder] = useState(1)

    const gridRef = useRef()

    const onScroll = useCallback(() => {
        const event = new Event('react-window-scroll')
        window.dispatchEvent(event)
    }, [])

    useEffect(() => {
        // Expose to window so vanilla JS can call it
        // @ts-ignore
        window.scrollToItem = (columnIndex, rowIndex) => {
            // @ts-ignore
            gridRef.current?.scrollToItem({
                align: "start",
                columnIndex: columnIndex,
                rowIndex: rowIndex
            });
            onScroll()
        };
    }, []);

    // Turn inputted HTML string into an array of HTML elements
    const htmlElements = useMemo(() => {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = items;
        return Array.from(wrapper.children) as HTMLElement[]
    }, [items])

    // Combines the results of all filters and determines whether an item should be filtered
    const filterItem = useCallback((item: HTMLElement, searchValue: string, filters: string[], selectFilters: {}) => {
        const lowerSearch = searchValue.toLowerCase();
        const searchResult = item.innerText.toLowerCase().includes(lowerSearch)
        const itemCategories = item.dataset.category?.split(",")
        const combinedFilters = [...filters, ...Object.values(selectFilters)] as string[]
        const filterResult = combinedFilters.length > 0 ? combinedFilters.every((filter) => itemCategories && itemCategories.includes(filter)) : true
        return searchResult && filterResult
    }, [])

    // Toggle a checkbox filter on and off
    const toggleFilter = useCallback((value: string) => {
        if (filters.includes(value)) {
            setFilters(filters.filter((currentFilter) => currentFilter !== value))
        } else {
            setFilters([...filters, value])
        }
    }, [filters])

    // Set a select filter
    const selectFilter = useCallback((title: string, value: string) => {
        const newFilters = { ...selectFilters }
        if (!value) {
            delete newFilters[title]
            setSelectFilters
        } else {
            newFilters[title] = value
        }
        setSelectFilters(newFilters)
    }, [selectFilters])

    const onChange = useCallback((list: HTMLElement[], filteredList: HTMLElement[]) => {
        const event = new CustomEvent('react-window-filter', {
            detail: {
                items: list,
                filteredItems: filteredList
            }
        })
        window.dispatchEvent(event)
    }, [])

    // Filter and sort items based on current filters and sorts
    const filteredItems = useMemo(() => {

        const filtered = htmlElements.filter((item) => filterItem(item, searchValue, filters, selectFilters))

        // Scroll to top on filtering
        // @ts-ignore
        gridRef.current?.scrollToItem({
            align: "start",
            columnIndex: 0,
            rowIndex: 0
        });

        onChange(htmlElements, filtered)

        if (sortValue) {
            return filtered.sort((a, b) => {
                const sortA = a.dataset[sortValue] || ''
                const sortB = b.dataset[sortValue] || ''
                const aNumber = parseInt(sortA)
                const bNumber = parseInt(sortB)

                if (typeof aNumber === 'number') {
                    return (aNumber - bNumber) * sortOrder
                } else {
                    return sortA.localeCompare(sortB)
                }
            })
        } else {
            return filtered
        }

    }, [searchValue, filters, selectFilters, sortValue])

    // Column width calculation (on desktop needs to compensate for scrollbar)
    const colWidth = useCallback((width: number, colCount: number) => Math.floor(width / colCount) - (window.innerWidth > 768 ? (16 / colCount) : 0), [])

    // Row count calculation (plus bottom padding)
    const rowCount = useCallback((colCount: number) => Math.round(filteredItems.length / colCount) + 2, [filteredItems])

    // Calculate column count based on inputted grid object and window width
    const colCount = useMemo(() => {
        const cols = 12

        const processedGrid = {
            xs: grid?.xs || cols,
            md: grid?.md || grid?.xs || cols,
            lg: grid?.lg || grid?.md || grid?.xs || cols
        }

        const windowWidth = window.innerWidth
        return windowWidth < 768 ? cols / processedGrid.xs
            : windowWidth < 992 ? cols / processedGrid.md
                : windowWidth < 1600 ? cols / processedGrid.lg
                    : cols / processedGrid.lg

    }, [grid])

    // Calculates the contents of each cell 
    const Cell = useCallback(({ columnIndex, rowIndex, style }) => {
        const itemIndex = rowIndex * colCount + columnIndex
        const item = filteredItems[itemIndex]
        if (item) {
            return <div style={{ ...style }} dangerouslySetInnerHTML={{ __html: item.outerHTML }}></div>
        } else {
            return ''
        }
    }, [filteredItems])

    // Hardcoded map of icons to strings we can pass in from astro
    const getIcon = useCallback((name: string) => {
        switch (name) {
            case 'globe':
                return <GlobeIcon />
        }
    }, [])

    return (
        <div id={id} className={`${className} ${reactWindowWrapper}`}>
            {(search || sort || filter) && <div class={shuffleFilter}>
                {search &&
                    <label class={`${searchboxWrapper} fixedBottomMobile flex`}>
                        <SearchIcon class="hideMobile" />
                        <input type="search" placeholder={search} onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.currentTarget?.value)} />
                    </label>
                }
                {sort &&
                    <label>
                        <SortIcon aria-label="Sort by" />
                        <select onChange={(e: ChangeEvent<HTMLSelectElement>) => { setSort(e.currentTarget?.value); setSortOrder(e.currentTarget.dataset.order === "asc" ? 1 : -1) }}>
                            {sort.map((sort) =>
                                <option value={sort.value} data-order={sort.order}>
                                    {sort.title}
                                </option>
                            )}
                        </select>
                    </label>
                }
                {filter && <div className={filtersWrapper}>
                    {filter?.map((filter) =>
                    (filter.type !== 'select'
                        ?
                        <label style={{ cursor: "pointer" }}>
                            <input name={filter.value} value={filter.value} type={filter.type} onChange={(e: ChangeEvent<HTMLInputElement>) => toggleFilter(e.currentTarget.value)} />
                            <span className={filter.checkedTitle ? 'whenUnchecked' : ''}>{filter.icon ? getIcon(filter.icon) : filter.title}</span>
                            {filter.checkedTitle && <span className='whenChecked'>{filter.checkedTitle}</span>}
                        </label>
                        :
                        <label class="flex">
                            <span className="flex">{filter.icon ? getIcon(filter.icon) : filter.title}</span>
                            <select name={filter.title} onChange={(e: ChangeEvent<HTMLSelectElement>) => selectFilter(filter.title, e.currentTarget.value)} >
                                <option value="">All {filter.title}</option>
                                {
                                    filter.values?.map(([title, value]) => (
                                        <option value={value}>
                                            {title}
                                        </option>
                                    ))
                                }
                            </select>
                        </label>)
                    )
                    }
                </div>}
            </div>}
            <AutoSizer>
                {({ height, width }) =>
                    <Grid
                        ref={gridRef}
                        height={height}
                        width={width}
                        rowCount={rowCount(colCount)}
                        rowHeight={rowHeight}
                        columnCount={colCount}
                        columnWidth={colWidth(width, colCount)}
                        onScroll={(e) => onScroll()}
                    >
                        {Cell}
                    </Grid>
                }
            </AutoSizer>
        </div>
    )
}

export default ReactWindow