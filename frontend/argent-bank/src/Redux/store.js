import { configureStore, createSlice } from "@reduxjs/toolkit";

const userInitialState = {
  connected: false,
  fetchData: {
    fetching: "void",
    fetchedResponseStatus: null,
    error: null,
  },
  fullProfile: false,
  lastUpdate: null,
  data: {
    firstName: null,
    lastName: null,
    id: null,
    token: null,
  },
};

const userSlice = createSlice({
  name: "user",
  initialState: userInitialState,
  reducers: {
    disconnectUser: () => userInitialState,
    attributeToken: (state, action) => {
      state.data.token = action.payload;
    },
    fetching: (state) => {
      state.fetchData.fetching = "fetching";
      state.fetchData.error = null;
      state.fetchData.fetchedResponseStatus = null;
    },
    loginFetchingResolved: (state, action) => {
      state.fetchData.fetching = "resolved";
      state.fetchData.error = false;
      state.fetchData.fetchedResponseStatus = action.payload.status;
      state.connected = true;
      state.data.token = action.payload.body.token;
    },
    fetchingRejected: (state, action) => {
      state.fetchData.fetching = "rejected";
      state.fetchData.error = true;
      state.fetchData.fetchedResponseStatus = action.payload.status;
    },
    getUserInfo: (state, action) => {
      const fetchedData = action.payload;
      state.fetchData.fetching = "resolved";
      state.fetchData.error = false;
      state.fetchData.fetchedResponseStatus = fetchedData.status;
      state.connected = true;
      state.data.token = fetchedData.token;
      state.data.firstName = fetchedData.body.firstName;
      state.data.lastName = fetchedData.body.lastName;
      state.data.id = fetchedData.body.id;
      state.fullProfile = true;
      state.lastUpdate = Date.now();
    },
    editUser: (state, action) => {
      const fetchedData = action.payload;
      state.fetchData.fetching = "resolved";
      state.fetchData.error = false;
      state.fetchData.fetchedResponseStatus = fetchedData.status;
      state.data.firstName = fetchedData.body.firstName;
      state.data.lastName = fetchedData.body.lastName;
      state.lastUpdate = Date.now();
    },
  },
});

const editUserSlice = createSlice({
  name: "editUser",
  initialState: {
    active: false,
  },
  reducers: {
    toogleEditing: (state) => {
      state.active = !state.active;
    },
  },
  extraReducers: (builder) =>
    builder.addCase("user/disconnectUser", (state) => {
      // back to original state if user logout
      state.active = false;
    }),
});

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    editUser: editUserSlice.reducer,
  },
});
