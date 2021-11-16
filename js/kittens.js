import { filterByKeyword, filterEqual, filterLessEqual, filterNonMatches } from './utils/filter.js';
import { alphabeticSort, numericSort } from './utils/sort.js';
import { hide, updateKittenList } from './utils/dom.js';
import debounce from './utils/debounce.js';
import KittenCard from './kittenCard.js';
class Kittens {
    constructor(entries, action) {
        this.entries = entries;
        this.action = action;
        this.visibleEntries = this.sortByKey('age', 'asc');
        this.previouslyVisibleEntries = [[...this.visibleEntries]];
        this.searchList = document.getElementById('kitten-search-list');
        this.searchBox = document.getElementById('kitten-search-box');
        this.showMoreButton = document.getElementById('show-more');
    }

    init() {
        const INIT_LIST_ITEMS_NUM = 4;
        const initKittens = this.getTopN(INIT_LIST_ITEMS_NUM, 'age');
        this.renderVisibleKittens(initKittens);
        this.searchBox.addEventListener('input', e => debounce(e => this._onSearch(e), 300)(e));
        this.showMoreButton.addEventListener('click', () => this._onShowMore());
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
        return filterByKeyword(this.visibleEntries, key, keyword);
    }

    getTopN(n, key) {
        const sorted = this.sortByKey(key);
        return n <= sorted.length && sorted.slice(0, n);
    }

    renderVisibleKittens(kittens) {
        if (this.searchList.hasChildNodes()) this.searchList.innerHTML = '';
        kittens.forEach(kitten => {
            let el = new KittenCard(kitten, this.action).renderCard();
            this.searchList.appendChild(el);
        });
        return this;
    }

    removeEntry(id) {
        this.visibleEntries = filterNonMatches(this.visibleEntries, 'id', id);
        this.entries = filterNonMatches(this.entries, 'id', id);
    }
    
    removeFilter() {
        this.visibleEntries = this.previouslyVisibleEntries.pop();
        return this.visibleEntries;
    }

    hideShowMoreButton() {
        let executed = false;
        return () => {
            if (!executed) {
                executed = true;
                hide(this.showMoreButton);
            }
        }
    }

    _onSearch(e) {
        let keyword = e.target.value.toUpperCase();
        updateKittenList(e.target, () => this.searchByKey('name', keyword));
    }

    _onShowMore() {
        updateKittenList(this.showMoreButton, () => this.visibleEntries);
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
