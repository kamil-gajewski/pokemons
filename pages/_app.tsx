import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import {} from 'redux-persist';
import { PersistGate } from "redux-persist/integration/react";
import { wrapper  } from "../features/Pokemons/store";
import { FC } from "react";
import  {fetchPokemons} from "../features/Pokemons/pokemonSlice"
import { useEffect } from "react";
import type {} from 'redux-thunk/extend-redux'


const App: FC<AppProps> = ({ Component, ...rest}) => {
  const { store, props } = wrapper.useWrappedStore(rest);
  const pageProps = props.pageProps

  useEffect(() => {
  if(store.getState().numberOfPokemonsFetched == 0){
    store.dispatch(fetchPokemons({howManyToFetch : 20}))
  }
  }, [store]);

// @ts-ignore
  const persistor = store.__persistor
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Component {...pageProps} />
        </PersistGate>
      </Provider>
    </>
  );
}

export default App;