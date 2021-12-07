import { filterByKeyword, filterEqual, filterLessEqual, filterNonMatches } from './utils/filter.js';
import { alphabeticSort, numericSort } from './utils/sort.js';
import { hide, updateKittenList } from './utils/dom.js';
import debounce from './utils/debounce.js';
import KittenCard from './kittenCard.js';

class KittenList {
    constructor(entries, action) {
        this.entries = entries;
        this.action = action;
        this.searchList = document.getElementById('kitten-list');
        this.searchBox = document.getElementById('kitten-search-box');
        this.showMoreButton = document.getElementById('show-more');
        this.radioSortBy = document.querySelectorAll('input[type=radio][name="sort-by"]');
        this.radioSortOrder = document.querySelectorAll('input[type=radio][name="sort-order"]');
        this.checkboxFilter = document.querySelectorAll('input[type=checkbox]');
        this.initListItemsNum = 20;
        this.appliedFilters = [];
        this.history = [];
        this.visibleEntries = numericSort(this.entries, 'age', true);
        this.currentSortBy = 'age';
        this.currentSortOrder = 'asc';
    }

    init() {
        this._updateHistory([...this.visibleEntries], null);
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
    
    sortByKey(key, order) {
        const isAscending = order === 'asc' || !(order === 'desc');
        if (key == 'age') this.visibleEntries = numericSort(this.visibleEntries, 'age', isAscending);
        if (key == 'name') this.visibleEntries = alphabeticSort(this.visibleEntries, 'name', isAscending);
        return this.visibleEntries;
    }
    
    filterByKey(key, value) {
        this._updateHistory([...this.visibleEntries], key + '-' + value);
        if (key === 'age') this.visibleEntries = filterLessEqual(this.visibleEntries, 'age', value);
        if (key === 'color') this.visibleEntries = filterEqual(this.visibleEntries, 'color', value);;
        return this.visibleEntries;
    }
    
    searchByKey(key, keyword) {
        return filterByKeyword(this.visibleEntries, key, keyword);
    }

    getTopN(n, key) {
        let sorted;
        if (key == 'age') sorted = numericSort(this.entries, 'age', true);
        if (key == 'name') sorted = alphabeticSort(this.entries, 'name', true);
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
    
    removeFilter(key, value) {
        const index = this.appliedFilters.lastIndexOf(key + '-' + value);
        if (index === -1) return;
        if (index === this.appliedFilters.length - 1) this._removeLastFilter();
        else this._removeInnerFilter(index);
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

    _onSortByValueChange(e) {
        this.currentSortBy = e.target.value;
        updateKittenList(e.target, () => this.sortByKey(this.currentSortBy, this.currentSortOrder));
    }

    _onSortOrderValueChange(e) {
        this.currentSortOrder = e.target.value;
        updateKittenList(e.target, () => this.sortByKey(this.currentSortBy, this.currentSortOrder));
    }

    _onFilterValueChange(e) {
        if (e.target.checked) updateKittenList(e.target, () => this.filterByKey(e.target.name, e.target.value));
        else updateKittenList(e.target, () => this.removeFilter(e.target.name, e.target.value));
    }

    _updateHistory(items, filterName) {
        this.history.push(items);
        this.appliedFilters.push(filterName);
    }

    _removeLastFilter() {
        this.appliedFilters.pop();
        this.visibleEntries = this.history.pop();
    }

    _removeInnerFilter(index) {
        this.history.splice(index);
        this.visibleEntries = this.history[this.history.length - 1];
        const rest = this.appliedFilters.splice(index);
        rest.shift();
        const filters = [];
        rest.forEach(it => {
            let filter = {};
            let keyValue = it.split('-');
            filter.key = keyValue[0];
            filter.value = keyValue[1];
            filters.push(filter);
        });
        this._applyMultipleFilters(filters);
    }

    _applyMultipleFilters(filters) {
        filters.forEach(({ key, value }) => { this.visibleEntries = this.filterByKey(key, value); });
        this.visibleEntries = this.sortByKey(this.currentSortBy, this.currentSortOrder);
        this.renderVisibleKittens(this.visibleEntries);
    }
}

export default KittenList;
