import { FixedSizeGrid as Grid } from "react-window"
import AutoSizer from "react-virtualized-auto-sizer"
import type { FunctionalComponent } from "preact"
import { useMemo, useState, useCallback } from "preact/hooks"
import { searchboxWrapper } from "./SearchBox.css"
import SortIcon from '~icons/bx/sort'
import SearchIcon from '~icons/bx/search'
import type { ChangeEvent } from "react-dom/src"
import { shuffleFilter } from "./ShuffleFilters.css"

interface Sorter {
    value: string
    order: string
    title: string
}

interface Filter {
    value?: string
    values?: string[][]
    title: string
    type: 'select' | 'checkbox'
}

interface Props {
    items: string[]
    search?: string
    sort?: Sorter[]
    filter?: Filter[]
    className?: string
}

/**
 * Provides a virtualized window displaying elements in a grid.
 * 
 * The items should be an array of HTML strings.
 * 
 * Also allows for optional filters.
 * 
 * @param items Array of HTML strings to display as grid items
 * @param search Whether to display a search box (used as placeholder)
 * @param sort Array of sorters
 * @param filter Array of filters
 * @param className optional class to add

 */
const ReactWindow: FunctionalComponent<Props> = ({ items, search, sort, filter, className = '' }) => {
    const colCount = window.innerWidth < 768 ? 1 : window.innerWidth < 921 ? 4 : 6;

    const [searchValue, setSearch] = useState('')
    const [filters, setFilters] = useState([] as string[])
    const [selectFilters, setSelectFilters] = useState({})
    const [sortValue, setSort] = useState('title')
    const [sortOrder, setSortOrder] = useState(1)

    // Turn inputted array of HTML strings into an array of HTML elements
    const htmlElements = useMemo(() => items.map((item) => {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = item;
        return wrapper.children[0] as HTMLElement;
    }), [items])

    // Combines the results of all filters and filters the items
    const filterItem = useCallback((item: HTMLElement, searchValue: string, filters: string[], selectFilters: {}) => {
        const lowerSearch = searchValue.toLowerCase();
        const searchResult = item.innerText.toLowerCase().includes(lowerSearch)
        const itemCategories = item.dataset.category?.split(",")
        const combinedFilters = [...filters, ...Object.values(selectFilters)] as string[]
        const filterResult = combinedFilters.length > 0 ? combinedFilters.some((filter) => itemCategories && itemCategories.includes(filter)) : true
        return searchResult && filterResult
    }, [])

    // Toggle a filter on and off
    const toggleFilter = useCallback((value: string) => {
        if (filters.includes(value)) {
            setFilters(filters.filter((currentFilter) => currentFilter !== value))
        } else {
            setFilters([...filters, value])
        }
    }, [filters])

    // Used for select filters
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

    // Filter items based on search input (case-insensitive)
    const filteredItems = useMemo(() => htmlElements
        .filter((item) => filterItem(item, searchValue, filters, selectFilters))
        .sort((a, b) => {
            const sortA = a.dataset[sortValue] || ''
            const sortB = b.dataset[sortValue] || ''
            const aNumber = parseInt(sortA)
            const bNumber = parseInt(sortB)

            if (typeof aNumber === 'number') {
                return (aNumber - bNumber) * sortOrder
            } else {
                return sortA.localeCompare(sortB)
            }
        }), [searchValue, filters, selectFilters, sortValue])

    // Calculates the contents of each cell 
    const Cell = ({ columnIndex, rowIndex, style }) => {
        const itemIndex = rowIndex * colCount + columnIndex
        const item = filteredItems[itemIndex]
        if (item) {
            return <div style={{ ...style }} dangerouslySetInnerHTML={{ __html: item.outerHTML }}></div>
        } else {
            return ''
        }
    }

    return (
        <div class={`${className}`} style={{ height: '100vh', overflow: 'hidden' }}>
            <div class={shuffleFilter}>
                {search && <label class={`${searchboxWrapper} fixedBottomMobile flex`}>
                    <SearchIcon class="hideMobile" />
                    <input type="search" placeholder={search} onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.currentTarget?.value)} />
                </label>}
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
                {filter?.map((filter) =>
                (filter.type !== 'select'
                    ?
                    <label>
                        <input name={filter.value} value={filter.value} type={filter.type} onChange={(e: ChangeEvent<HTMLInputElement>) => toggleFilter(e.currentTarget.value)} />
                        {filter.title}
                    </label>
                    :
                    <label class="hideMobile flex">
                        {filter.title}
                        <select name={filter.title} onChange={(e: ChangeEvent<HTMLSelectElement>) => selectFilter(filter.title, e.currentTarget.value)} >
                            <option value="">All</option>
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
            </div>
            <AutoSizer>
                {({ height, width }) =>
                    <Grid
                        height={height}
                        width={width}
                        rowCount={Math.round(items.length / colCount) + 4}
                        rowHeight={35}
                        columnCount={colCount}
                        columnWidth={Math.floor(width / colCount) - 4}
                    >
                        {Cell}
                    </Grid>
                }
            </AutoSizer>
        </div>
    )
}

export default ReactWindow