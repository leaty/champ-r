import produce from 'immer';

import config from 'src/native/config';
import { Actions } from 'src/share/actions';

export * from 'src/share/actions';

export const initialState = {
  fetchingSources: [],
  fetchedSources: [],
  fetching: [],
  fetched: [],
  version: null,
  itemMap: null,
  selectedSources: config.get(`selectedSources`),
  keepOld: config.get('keepOldItems'),
  importerInstances: {},
  importPage: {
    success: [],
    fail: [],
  },
  dataSourceVersions: {},
};

export const init = (payload) => payload;

export default produce((draft, action) => {
  const { type, payload } = action;

  switch (type) {
    case Actions.UPDATE_LOL_VERSION: {
      draft.version = payload;
      break;
    }

    case Actions.ADD_FETCHING: {
      draft.fetching.push(payload);
      break;
    }

    case Actions.ADD_FETCHED: {
      draft.fetching = draft.fetching.filter((i) => i.$identity !== payload.$identity);
      draft.fetched.push(payload);
      break;
    }

    case Actions.CLEAR_FETCH: {
      draft.fetched = [];
      draft.fetching = [];
      break;
    }

    case Actions.FETCHING_SOURCE: {
      draft.fetchingSources = payload;
      break;
    }

    case Actions.FETCH_SOURCE_DONE: {
      draft.fetchingSources = draft.fetchingSources.filter((i) => i !== payload);
      draft.fetchedSources.push(payload);
      break;
    }

    case Actions.UPDATE_ITEM_MAP:
      draft.itemMap = payload;
      break;

    case Actions.INIT_REDUCER:
      draft = init(payload);
      break;

    case Actions.PREPARE_REIMPORT:
      draft.fetched = [];
      draft.fetching = [];
      draft.fetchingSources = [];
      draft.fetchedSources = [];
      break;

    case Actions.UPDATE_SELECT_SOURCES:
      draft.selectedSources = payload;
      break;

    case Actions.UPDATE_APP_CONFIG: {
      const [k, v] = payload;
      draft[k] = v;
      break;
    }

    case Actions.SET_IMPORTER_INSTANCE: {
      const [k, v] = payload;
      draft.importerInstances[k] = v;
      break;
    }

    case Actions.IMPORT_BUILD_SUCCEED: {
      const source = payload;
      if (!draft.importPage.success.includes(source)) {
        draft.importPage.success.push(source);
      }
      break;
    }

    case Actions.IMPORT_BUILD_FAILED: {
      const source = payload;
      if (!draft.importPage.fail.includes(source)) {
        draft.importPage.fail.push(source);
      }
      break;
    }

    case Actions.SET_DATA_SOURCE_VERSION: {
      const [k, v] = payload;
      draft.dataSourceVersions[k] = v;
      break;
    }

    default:
      return draft;
  }
});
