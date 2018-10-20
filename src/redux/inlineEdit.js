const LOAD_ITEMS = "timeline-component/inline-edit/LOAD_ITEMS"
const EDIT_ITEM = "timeline-component/inline-edit/EDIT_ITEM"
const SELECT_ITEM = "timeline-component/inline-edit/SELECT_ITEM"

const initialState = {
  items: [],
  editingId: ""
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SELECT_ITEM:
      return { ...state, editingId: action.id }
    case LOAD_ITEMS:
      return { ...state, items: action.data }
    case EDIT_ITEM:
      const updatedItems = state.items.map(item => {
        if (item.id === action.id) {
          return {
            ...item,
            name: action.val
          }
        }
        return item
      })
      return {...state, items: updatedItems}
    default:
      return state
  }
}

/*
 * Util, ActionCreators
 **/
export function select(id) {
    return { type: SELECT_ITEM, id}
}

export function edit(id, val) {
  return { type: EDIT_ITEM, id, val }
}

// TODO: IRL, make a fetch call
export function load(data) {
  return { type: LOAD_ITEMS, data }
}
