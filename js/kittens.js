import { alphabeticSort, numericSort } from './utils/sort.js';
import { filterByKeyword, filterEqual, filterLessEqual, filterNonMatches } from './utils/filter.js';
import KittenCard from './kittenCard.js';
class Kittens {
    constructor(entries, action) {
        this.entries = entries;
        this.action = action;
        this.visibleEntries = this.sortByKey('age', 'asc');
        this.previouslyVisibleEntries = [[...this.visibleEntries]];
        this.searchList = document.getElementById('kitten-search-list');
    }
    
    sortByKey(key, order) {
        const isAscending = order === 'asc' || !(order === 'desc');
        if (key == 'age') this.visibleEntries = this._sortByAge(isAscending);
        if (key == 'name') this.visibleEntries = this._sortByName(isAscending);
        return this.visibleEntries;
    }
    
    filterByKey(key, value) {
        this.previouslyVisibleEntries.push([...this.visibleEntries]);
        if (key === 'age') this.visibleEntries = this._filterByAge(value);
        if (key === 'color') this.visibleEntries = this._filterByColor(value);
        return this.visibleEntries;
    }
    
    searchByKey(key, keyword) {
        this.visibleEntries = filterByKeyword(this.visibleEntries, key, keyword);
        return this.visibleEntries;
    }

    getTopN(n, key) {
        const sorted = this.sortByKey(key);
        return n <= sorted.length && sorted.slice(0, n);
    }

    renderVisibleKittens(items) {
        const kittens = items || this.visibleEntries;
        if (this.searchList.hasChildNodes()) this.searchList.innerHTML = '';
        kittens.forEach(kitten => {
            let el = new KittenCard(kitten, this.action).renderCard();
            this.searchList.appendChild(el);
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
