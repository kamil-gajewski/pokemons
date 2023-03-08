import {configureStore } from "@reduxjs/toolkit";
import pokemonReducer from "./pokemonSlice";
import thunk from "redux-thunk";
import { createWrapper, HYDRATE } from "next-redux-wrapper";
import { Action, AnyAction, ThunkAction } from "@reduxjs/toolkit";



const masterReducer = (
  state: ReturnType<typeof pokemonReducer>,
  action: AnyAction
) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state,
      ...action.payload, 
    };
    return nextState;
  } else {
    return pokemonReducer(state, action);
  }
};

const makeConfiguredStore = (reducer : ReturnType<typeof masterReducer>) =>
  configureStore({
    reducer,
    middleware: [thunk],
    devTools: process.env.NODE_ENV !== "production",
  });

export const makeStore = () => {
  const isServer = typeof window === "undefined";

  if (isServer) {
    return makeConfiguredStore(masterReducer);
  } else {
    const { persistStore, persistReducer } = require("redux-persist");
    const storage = require("redux-persist/lib/storage").default;

    const persistConfig = {
      key: "root",
      storage,
    };

    const persistedReducer = persistReducer(persistConfig, masterReducer);
    const store = makeConfiguredStore(persistedReducer);
    // @ts-ignore
    store.__persistor = persistStore(store);

    return store;
  }
};

export type Store = ReturnType<typeof makeStore>;
export type AppDispatch = Store["dispatch"];
export type RootState = ReturnType<Store["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
export const wrapper = createWrapper(makeStore, { debug: false });