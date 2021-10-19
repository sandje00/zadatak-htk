class Kittens {
    constructor(entries) {
        this.entries = entries;
        this.visibleEntries = this.sortByKey('age', 'asc');
        this.previouslyVisibleEntries = [[...this.visibleEntries]];
    }
    
    sortByKey(key, order) {
        const isAscending = order === 'asc' || !(order === 'desc');
        if (key == 'age') return this._sortByAge(isAscending);
        if (key == 'name') return this._sortByName(isAscending);
    }

    getTopN(n, key) {
        const sorted = this.sortByKey(key);
        return n <= sorted.length && sorted.slice(0, n);
    }

    filterByKey(key, value) {
        this.previouslyVisibleEntries.push([...this.visibleEntries]);
        if (key === 'age') this.visibleEntries = this._filterByAge(value);
        if (key === 'color') this.visibleEntries = this._filterByColor(value);
        return this.visibleEntries;
    }

    removeFilter() {
        this.visibleEntries = this.previouslyVisibleEntries.pop();
        return this.visibleEntries;
    }
    
    _sortByAge(isAscending) {
        return this.entries.slice().sort((a, b) => {
            return isAscending ? a.age - b.age : b.age - a.age;
        });
    }

    _sortByName(isAscending) {
        return this.entries.slice().sort((a, b) => {
            let nameA = a.name.toUpperCase();
            let nameB = b.name.toUpperCase();
            if (nameA < nameB) return isAscending ? -1 : 1;
            if (nameA > nameB) return isAscending ? 1 : -1;
            return 0;
        });
    }

    _filterByAge(value) {
        return this.visibleEntries.filter(it => it.age <= value);
    }

    _filterByColor(value) {
        return this.visibleEntries.filter(it => it.color === value);
    }
    
}

export default Kittens;
