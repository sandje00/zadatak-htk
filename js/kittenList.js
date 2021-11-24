import { filterByKeyword, filterEqual, filterLessEqual, filterNonMatches } from './utils/filter.js';
import { alphabeticSort, numericSort } from './utils/sort.js';
import { hide, updateKittenList } from './utils/dom.js';
import debounce from './utils/debounce.js';
import KittenCard from './kittenCard.js';

class KittenList {
    constructor(entries, action) {
        this.entries = entries;
        this.action = action;
        this.searchList = document.getElementById('kitten-search-list');
        this.searchBox = document.getElementById('kitten-search-box');
        this.showMoreButton = document.getElementById('show-more');
        this.radioSortBy = document.querySelectorAll('input[type=radio][name="sort-by"]');
        this.radioSortOrder = document.querySelectorAll('input[type=radio][name="sort-order"]');
        this.checkboxFilter = document.querySelectorAll('input[type=checkbox]');
        this.appliedFilters = [];
        this.history = [];
        this.visibleEntries = this._sortByAge(this.entries, true);
        this.currentSortBy = 'age';
        this.currentSortOrder = 'asc';
    }

    init() {
        this.appliedFilters.push('sort-age-asc');
        this.history.push([...this.visibleEntries]);
        const INIT_LIST_ITEMS_NUM = 4;
        const initKittens = this.getTopN(INIT_LIST_ITEMS_NUM, 'age');
        this.renderVisibleKittens(initKittens);
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
        this.appliedFilters.push('sort-' + key + '-' + order);
        this.history.push([...this.visibleEntries]);
        const isAscending = order === 'asc' || !(order === 'desc');
        if (key == 'age') this.visibleEntries = this._sortByAge(this.visibleEntries, isAscending);
        if (key == 'name') this.visibleEntries = this._sortByName(this.visibleEntries, isAscending);
        return this.visibleEntries;
    }
    
    filterByKey(key, value) {
        this.appliedFilters.push('filter-' + key + '-' + value);
        this.history.push([...this.visibleEntries]);
        if (key === 'age') this.visibleEntries = this._filterByAge(value);
        if (key === 'color') this.visibleEntries = this._filterByColor(value);
        return this.visibleEntries;
    }
    
    searchByKey(key, keyword) {
        return filterByKeyword(this.visibleEntries, key, keyword);
    }

    getTopN(n, key) {
        let sorted;
        if (key == 'age') sorted = this._sortByAge(this.entries, true);
        if (key == 'name') sorted = this._sortByName(this.entries, true);
        return n <= sorted.length && sorted.slice(0, n);
    }

    renderVisibleKittens(kittens) {
        console.log(this.appliedFilters);
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
        const index = this.appliedFilters.lastIndexOf('filter-' + key + '-' + value);

        if (index === -1) return;
        if (index === this.appliedFilters.length - 1) {
            this.appliedFilters.pop();
            this.visibleEntries = this.history.pop();
        } else {
            this.history.splice(index);
            this.visibleEntries = this.history[this.history.length - 1];
            const rest = this.appliedFilters.splice(index);
            rest.shift();

            const actions = [];
            rest.forEach(it => {
                let action = {};
                let typeKeyValue = it.split('-');
                action.actionType = typeKeyValue[0];
                action.key = typeKeyValue[1];
                action.value = typeKeyValue[2];
                actions.push(action);
            });
            this._applyMultipleActions(actions);
        }
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

    _applyMultipleActions(actions) {
        actions.forEach(({ actionType, key, value }) => {
            if (actionType === 'sort') this.visibleEntries = this.sortByKey(key, value);
            if (actionType === 'filter') this.visibleEntries = this.filterByKey(key, value);
        });
        this.renderVisibleKittens(this.visibleEntries);
    }
    
    _sortByAge(array, isAscending) {
        return numericSort(array, 'age', isAscending);
    }

    _sortByName(array, isAscending) {
        return alphabeticSort(array, 'name', isAscending);
    }

    _filterByAge(value) {
        return filterLessEqual(this.visibleEntries, 'age', value);
    }

    _filterByColor(value) {
        return filterEqual(this.visibleEntries, 'color', value);
    }
}

export default KittenList;
