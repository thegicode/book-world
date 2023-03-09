const cloneDeep = (obj) => {
	return JSON.parse(JSON.stringify(obj))
}

const initialState = {
	favoriteBooks: [],
	libraries: {}
}

const storageKey = 'BookWorld'

const setState = (newState) => {
	try {
		localStorage.setItem(storageKey, JSON.stringify(newState))
	} catch (error) {
		console.error(error)
	}
	console.log([...newState.favoriteBooks])
	console.log([...Object.values(newState.libraries)])
}

const getState = () => {
	try {
		const storedState = localStorage.getItem(storageKey)
		if (storedState == null) {	
			setState(initialState)
			return initialState
		}
		return cloneDeep(JSON.parse(storedState))
	} catch (error) {
		console.error(error)
		throw new Error('Failed to get state from localStrage.')
	}
}

const state = getState()


const addFavoriteBook = (isbn) => {
	state.favoriteBooks.push(isbn)
	setState(state)
}

const removeFavoriteBook = (isbn) => {
	const index = state.favoriteBooks.indexOf(isbn)
	if (index !== -1) {
		state.favoriteBooks.splice(index, 1)
		setState(state)
	}
}

const isFavoriteBook = (isbn) => {
	return state.favoriteBooks.includes(isbn)
}

const addLibrary = (code, name) => {
	state.libraries[code] = name
	setState(state)
}

const removeLibrary = (code) => {
	delete state.libraries[code]
	setState(state)
}

const hasLibrary = (code) => {
	return state.libraries.hasOwnProperty(code)
}

export {
	state,
	getState,
	addFavoriteBook,
	removeFavoriteBook,
	isFavoriteBook,
	addLibrary,
	removeLibrary,
	hasLibrary
}
