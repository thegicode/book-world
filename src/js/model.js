
const INITIAL_STATE = {
	favorite: [],
	library: {},
}

const getState = () => {
	if (localStorage.getItem('BookWorld') === null) {
		localStorage.setItem('BookWorld', JSON.stringify(INITIAL_STATE))
	}
  	return JSON.parse(localStorage.getItem('BookWorld'))
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
	if (state.favorite == undefined ) {
		return
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
	localStorage.setItem('BookWorld', JSON.stringify(state))
	console.table(JSON.parse(localStorage.getItem('BookWorld')))
}

	
export default {
	state,
	addFavorite,
	deleteFavorite,
	includesFavorite,
	addLibrary,
	deleteLibrary,
	includesLibrary
}


