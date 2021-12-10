import { filterByKeyword, filterEqual, filterLessEqual, filterNonMatches, findByKey } from './utils/filter.js';
import { alphabeticSort, numericSort } from './utils/sort.js';
import { hide, updateKittenList } from './utils/dom.js';
import debounce from './utils/debounce.js';
import KittenCard from './kittenCard.js';

class KittenList {
    constructor(entries) {
        this.entries = entries;
        this.initListItemsNum = 20;
        this.appliedFilters = [];
        this.currentSortBy = 'age';
        this.currentSortOrder = 'asc';
        this.visibleEntries = numericSort(this.entries, 'age', true);
        this.searchList = document.getElementById('kitten-list');
        this.searchBox = document.getElementById('kitten-search-box');
        this.showMoreButton = document.getElementById('show-more');
        this.radioSortBy = document.querySelectorAll('input[type=radio][name="sort-by"]');
        this.radioSortOrder = document.querySelectorAll('input[type=radio][name="sort-order"]');
        this.checkboxFilter = document.querySelectorAll('input[type=checkbox]');
    }

    init() {
        this.renderVisibleKittens(this.getTopN(this.initListItemsNum, 'age'));
        this.searchBox.addEventListener('input', e => debounce(e => this._onSearch(e), 300)(e));
        this.showMoreButton.addEventListener('click', () => this._onShowMore());
        this.radioSortBy.forEach(radio => {
            radio.checked = radio.value === this.currentSortBy;
            radio.addEventListener('change', e => this._onSortByValueChange(e));
        });
        this.radioSortOrder.forEach(radio => {
            radio.checked = radio.value === this.currentSortOrder;
            radio.addEventListener('change', e => this._onSortOrderValueChange(e));
        });
        this.checkboxFilter.forEach(checkbox => checkbox.addEventListener('change', e => this._onFilterValueChange(e)));
    }

    renderVisibleKittens(kittens) {
        if (this.searchList.hasChildNodes()) this.searchList.innerHTML = '';
        kittens.forEach(kitten => {
            let el = new KittenCard(kitten).createCardcontent();
            this.searchList.innerHTML += el;
        });
        return this;
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

    findEntry(id) {
        return findByKey(this.entries, 'id', id);
    }

    removeEntry(id) {
        this.visibleEntries = filterNonMatches(this.visibleEntries, 'id', id);
        this.entries = filterNonMatches(this.entries, 'id', id);
    }

    getTopN(n, key) {
        let sorted;
        if (key == 'age') sorted = numericSort(this.entries, 'age', true);
        if (key == 'name') sorted = alphabeticSort(this.entries, 'name', true);
        return n <= sorted.length && sorted.slice(0, n);
    }

    _onSearch(e) {
        let keyword = e.target.value.toUpperCase();
        updateKittenList(e.target, () => this._searchByKey('name', keyword));
    }

    _onShowMore() {
        updateKittenList(this.showMoreButton, () => this.visibleEntries);
    }

    _onSortByValueChange(e) {
        this.currentSortBy = e.target.value;
        updateKittenList(e.target, () => this._sortByKey(this.currentSortBy, this.currentSortOrder));
    }

    _onSortOrderValueChange(e) {
        this.currentSortOrder = e.target.value;
        updateKittenList(e.target, () => this._sortByKey(this.currentSortBy, this.currentSortOrder));
    }

    _onFilterValueChange(e) {
        if (e.target.checked) updateKittenList(e.target, () => this._applyFilter(e.target.name, e.target.value));
        else updateKittenList(e.target, () => this._removeFilter(e.target.name, e.target.value));
    }

    _searchByKey(key, keyword) {
        return filterByKeyword(this.visibleEntries, key, keyword);
    }
    
    _sortByKey(key, order) {
        const isAscending = order === 'asc' || !(order === 'desc');
        if (key == 'age') this.visibleEntries = numericSort(this.visibleEntries, 'age', isAscending);
        if (key == 'name') this.visibleEntries = alphabeticSort(this.visibleEntries, 'name', isAscending);
        return this.visibleEntries;
    }

    _applyFilter(key, value) {
        this.appliedFilters.push(key + '-' + value);
        return this._filterByKey(key, value);
    }

    _removeFilter(key, value) {
        const index = this.appliedFilters.indexOf(key + '-' + value);
        if (index === -1) return;
        this.appliedFilters.splice(index, 1);
        return this._applyMultipleFilters();
    }
    
    _filterByKey(key, value) {
        if (key === 'age') this.visibleEntries = filterLessEqual(this.visibleEntries, 'age', value);
        if (key === 'color') this.visibleEntries = filterEqual(this.visibleEntries, 'color', value);
        return this.visibleEntries;
    }

    _applyMultipleFilters() {
        this.visibleEntries = this.entries;
        if (this.appliedFilters.length) this.appliedFilters.forEach(filter => {
            let [ key, value ] = filter.split('-');
            this.visibleEntries = this._filterByKey(key, value);
        });
        this.visibleEntries = this._sortByKey(this.currentSortBy, this.currentSortOrder);
        return this.visibleEntries;
    }
}

export default KittenList;
