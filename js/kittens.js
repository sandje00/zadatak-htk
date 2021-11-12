import { alphabeticSort, numericSort } from './utils/sort.js';
import { filterByKeyword, filterEqual, filterLessEqual, filterNonMatches } from './utils/filter.js';
import KittenCard from './kittenCard.js';
class Kittens {
    constructor(entries, action) {
        this.entries = entries;
        this.action = action;
        this.visibleEntries = this.sortByKey('age', 'asc');
        this.previouslyVisibleEntries = [[...this.visibleEntries]];
    }
    
    sortByKey(key, order) {
        const isAscending = order === 'asc' || !(order === 'desc');
        if (key == 'age') return this._sortByAge(isAscending);
        if (key == 'name') return this._sortByName(isAscending);
    }
    
    filterByKey(key, value) {
        this.previouslyVisibleEntries.push([...this.visibleEntries]);
        if (key === 'age') this.visibleEntries = this._filterByAge(value);
        if (key === 'color') this.visibleEntries = this._filterByColor(value);
        return this.visibleEntries;
    }
    
    searchByKey(key, keyword) {
        return filterByKeyword(this.visibleEntries, key, keyword);
    }

    getTopN(n, key) {
        const sorted = this.sortByKey(key);
        return n <= sorted.length && sorted.slice(0, n);
    }

    renderVisibleKittens(items) {
        const kittens = items || this.visibleEntries;
        const searchList = document.getElementById('kitten-search-list');
        if (searchList.hasChildNodes()) searchList.innerHTML = '';
        kittens.forEach(kitten => {
            let el = new KittenCard(kitten, this.action).renderCard();
            searchList.appendChild(el);
        });
    }

    removeEntry(id) {
        this.visibleEntries = filterNonMatches(this.visibleEntries, 'id', id);
        this.entries = filterNonMatches(this.entries, 'id', id);
    }
    
    removeFilter() {
        this.visibleEntries = this.previouslyVisibleEntries.pop();
        return this.visibleEntries;
    }
    
    _sortByAge(isAscending) {
        return numericSort(this.entries, 'age', isAscending);
    }

    _sortByName(isAscending) {
        return alphabeticSort(this.entries, 'name', isAscending);
    }

    _filterByAge(value) {
        return filterLessEqual(this.visibleEntries, 'age', value);
    }

    _filterByColor(value) {
        return filterEqual(this.visibleEntries, 'color', value);
    }
    
}

export default Kittens;
