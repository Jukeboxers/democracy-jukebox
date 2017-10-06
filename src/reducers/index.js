import { combineReducers } from 'redux'

import Accounts from './AccountsReducer'
import Playlist from './PlaylistReducer'
import Search from './SearchReducer'

export default combineReducers({
  Accounts,
  Playlist,
  Search
})
