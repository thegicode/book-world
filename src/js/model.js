
const cloneDeep = x => {
  	return JSON.parse(JSON.stringify(x))
}

const INITIAL_STATE = {
	favorite: [],
	library: '',
}


export default () => {

	const getState = () => {
      	return JSON.parse(localStorage.getItem('BookWorld')) || INITIAL_STATE
	}

	const state = cloneDeep(getState())

	const addFavorite = (isbn) => {
		state.favorite.push(isbn)
		setStorage()
	}

	const deleteFavorite = (isbn) => {
		const index = state.favorite.indexOf(isbn)
    	state.favorite.splice(index, 1)
    	setStorage()
	}

	const setLibrary = (v) => {
		state.library = v
        setStorage()
	}

	const setStorage = () => {
		localStorage.setItem('BookWorld', JSON.stringify(state))
		console.log(state)
	}

	return {
		state,
		addFavorite,
		deleteFavorite,
		setLibrary
	}
} 
