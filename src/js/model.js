
const cloneDeep = x => {
  	return JSON.parse(JSON.stringify(x))
}

const INITIAL_STATE = {
	favorite: []
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

	const setStorage = () => {
		localStorage.setItem('BookWorld', JSON.stringify(state))
	}

	return {
		state,
		addFavorite,
		deleteFavorite
	}
} 