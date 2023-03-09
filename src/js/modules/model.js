const cloneDeep = (obj) => {
	return JSON.parse(JSON.stringify(obj))
}

const initialState = {
	favoriteBooks: [],
	libraries: {}
}

const storageKey = 'BookWorld'

const saveState = (newState) => {
	console.log([...newState.favoriteBooks])
	console.log([...Object.values(newState.libraries)])
	try {
		localStorage.setItem(storageKey, JSON.stringify(newState))
	} catch (error) {
		console.error(error)
	}
}

const loadState = () => {
	try {
		const storedState = localStorage.getItem(storageKey)
		if (storedState == null) {	// storedState === null || storedState === undefined 둘 다 해당
			saveState(initialState)
			return initialState
		}
		return cloneDeep(JSON.parse(storedState))
	} catch (error) {
		console.error(error)
		throw new Error('Failed to get state from localStrage.')
	}
}

let state = loadState()

const addFavoriteBook = (isbn) => {
	const newState = cloneDeep(state)
	newState.favoriteBooks.push(isbn)
	saveState(newState)
}

const removeFavoriteBook = (isbn) => {
	const newState = cloneDeep(state)
	newState.favoriteBooks = newState.favoriteBooks.filter(item => item !== isbn)
	saveState(newState)
}

const isFavoriteBook = (isbn) => {
	// state.favoriteBooks가 undefined인 경우 고려
	if (!Array.isArray(state.favoriteBooks)) {
		return false
	}
	return state.favoriteBooks.includes(isbn)
}

const addLibrary = (code, name) => {
	const newState = cloneDeep(state)
	newState.libraries[code] = name
	saveState(newState)
}

const removeLibrary = (code) => {
	const newState = cloneDeep(state)
	delete newState.libraries[code]
	saveState(newState)
}

const hasLibrary = (code) => {
	return state.libraries.hasOwnProperty(code)
}

export {
	state,
	addFavoriteBook,
	removeFavoriteBook,
	isFavoriteBook,
	addLibrary,
	removeLibrary,
	hasLibrary
}
