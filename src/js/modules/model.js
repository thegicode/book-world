
const initialState = {
	favorite: [],
	library: {}
}

const storageName = 'BookWorld'

const getState = () => {
	try {
		const storedState = localStorage.getItem(storageName)
		if (!storedState) {
			localStorage.setItem(storageName, JSON.stringify(initialState))
		}
		return JSON.parse(storedState || JSON.stringify(initialState))
	} catch (error) {
		console.error(error)
		return initialState
	}
}

let state = getState()

const addFavorite = (isbn) => {
	state.favorite.push(isbn)
	setStorage()
}

const deleteFavorite = (isbn) => {
	const index = state.favorite.indexOf(isbn)
	state.favorite.splice(index, 1)
	setStorage()
}

const includesFavorite = (isbn) => {
	if (!state.favorite) {
		return false
	}
	return state.favorite.includes(isbn)
}

const addLibrary = (libCode, libName) => {
	state.library[libCode] = libName
    setStorage()
}

const deleteLibrary = (libCode) => {
	delete state.library[libCode]
    setStorage()
}

const includesLibrary = (libCode) => {
	return state.library.hasOwnProperty(libCode)
}

const setStorage = () => {
	try {
		localStorage.setItem(storageName, JSON.stringify(state))
		console.log(JSON.parse(localStorage.getItem(storageName)))
	} catch (error) {
		console.errer(error)
	}
}
	
export {
	state,
	addFavorite,
	deleteFavorite,
	includesFavorite,
	addLibrary,
	deleteLibrary,
	includesLibrary
}


