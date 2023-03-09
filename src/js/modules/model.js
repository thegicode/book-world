const cloneDeep = (obj) => {
	return JSON.parse(JSON.stringify(obj))
}

const initialState = {
	favoriteBooks: [],
	libraries: {}
}

const storageKey = 'BookWorld'

const saveState = (newState) => {
	try {
		localStorage.setItem(storageKey, JSON.stringify(newState))
	} catch (error) {
		console.error(error)
	}
	console.log([...newState.favoriteBooks])
	console.log([...Object.values(newState.libraries)])
}

const loadState = () => {
	try {
		const storedState = localStorage.getItem(storageKey)
		if (storedState == null) {	
			saveState(initialState)
			return initialState
		}
		return cloneDeep(JSON.parse(storedState))
	} catch (error) {
		console.error(error)
		throw new Error('Failed to get state from localStrage.')
	}
}

const state = loadState()


const addFavoriteBook = (isbn) => {
	state.favoriteBooks.push(isbn)
	saveState(state)
}

const removeFavoriteBook = (isbn) => {
	const index = state.favoriteBooks.indexOf(isbn)
	if (index !== -1) {
		state.favoriteBooks.splice(index, 1)
		saveState(state)
	}
}

const isFavoriteBook = (isbn) => {
	return state.favoriteBooks.includes(isbn)
}

const addLibrary = (code, name) => {
	state.libraries[code] = name
	saveState(state)
}

const removeLibrary = (code) => {
	delete state.libraries[code]
	saveState(state)
}

const hasLibrary = (code) => {
	return state.libraries.hasOwnProperty(code)
}

export {
	state,
	// loadState,
	addFavoriteBook,
	removeFavoriteBook,
	isFavoriteBook,
	addLibrary,
	removeLibrary,
	hasLibrary
}
