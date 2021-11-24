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
        this.initListItemsNum = 4;
        this.appliedTransformations = [];
        this.history = [];
        this.visibleEntries = this._sortByAge(this.entries, true);
        this.currentSortBy = 'age';
        this.currentSortOrder = 'asc';
    }

    init() {
        this._updateHistory('sort-age-asc', [...this.visibleEntries]);
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
        this._updateHistory('sort-' + key + '-' + order, [...this.visibleEntries]);
        const isAscending = order === 'asc' || !(order === 'desc');
        if (key == 'age') this.visibleEntries = this._sortByAge(this.visibleEntries, isAscending);
        if (key == 'name') this.visibleEntries = this._sortByName(this.visibleEntries, isAscending);
        return this.visibleEntries;
    }
    
    filterByKey(key, value) {
        this._updateHistory('filter-' + key + '-' + value, [...this.visibleEntries]);
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
        console.log(this.appliedTransformations);
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
        const index = this.appliedTransformations.lastIndexOf('filter-' + key + '-' + value);
        this._removeTransformation(index);
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

    _updateHistory(transformationName, items) {
        this.appliedTransformations.push(transformationName);
        this.history.push(items);
    }

    _removeTransformation(index) {
        if (index === -1) return;
        if (index === this.appliedTransformations.length - 1) {
            this.appliedTransformations.pop();
            this.visibleEntries = this.history.pop();
        }
        else {
            this.history.splice(index);
            this.visibleEntries = this.history[this.history.length - 1];
            const rest = this.appliedTransformations.splice(index);
            rest.shift();
            const transformations = [];
            rest.forEach(it => {
                let transformation = {};
                let typeKeyValue = it.split('-');
                transformation.transformationType = typeKeyValue[0];
                transformation.key = typeKeyValue[1];
                transformation.value = typeKeyValue[2];
                transformations.push(transformation);
            });
            this._applyMultipleTransformations(transformations);
        }
    }

    _applyMultipleTransformations(transformations) {
        transformations.forEach(({ transformationType, key, value }) => {
            if (transformationType === 'sort') this.visibleEntries = this.sortByKey(key, value);
            if (transformationType === 'filter') this.visibleEntries = this.filterByKey(key, value);
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
