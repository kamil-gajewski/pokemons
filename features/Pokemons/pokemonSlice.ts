import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PokemonType, StateType } from "./PokemonsTypes";
import { AppDispatch, RootState } from "./store";

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const fetchPokemons = createAsyncThunk.withTypes<{
  state: RootState;
  dispatch: AppDispatch;
}>()(
  "pokemons/fetchPokemons",
  async (payload: { howManyToFetch: number }, thunkAPI) => {
    const loading = thunkAPI.getState().loading;
    if (loading !== "pending") {
      return;
    }

    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${
        payload.howManyToFetch
      }&offset=${thunkAPI.getState().numberOfPokemonsFetched}`
    );
    const data = await response.json();

    const pokemonsPromiseArray = await data.results.map(
      (value: { url: string }) => fetch(value.url)
    );
    const pokemonsResponseArray = await Promise.all(pokemonsPromiseArray);
    const pokemonsResponseJsonArray = pokemonsResponseArray.map(
      async (value) => await value.json()
    );
    const pokemonsResultsArray = await Promise.all(pokemonsResponseJsonArray);

    const speciesPromiseArray = pokemonsResultsArray.map((value) =>
      fetch(value.species.url)
    );
    const speciesResponseArray = await Promise.all(speciesPromiseArray);
    const speciesResponseJsonArray = speciesResponseArray.map(
      async (value) => await value.json()
    );
    const speciesResultsArray = await Promise.all(speciesResponseJsonArray);
    let output: PokemonType[] = [];

    const getDescription = (data: { flavor_text_entries: any }) => {
      let decscription = "";
      for (const entry of data.flavor_text_entries) {
        if (entry.language.name === "en") {
          decscription = entry.flavor_text.replace("\f", " ");
          break;
        }
      }
      return decscription;
    };

    pokemonsResultsArray.forEach((value, index) => {
      output.push({
        name: capitalizeFirstLetter(value.name),
        sprite_front_default: value.sprites.front_default,
        description: getDescription(speciesResultsArray[index]),
        hp: value.stats[0].base_stat,
        attack: value.stats[1].base_stat,
        defense: value.stats[2].base_stat,
        special_attack: value.stats[3].base_stat,
        special_defense: value.stats[4].base_stat,
        speed: value.stats[5].base_stat,
      });
    });

    return { output: output, howManyToFetch: payload.howManyToFetch };
  }
);
const initialState = {
  pokemons: [],
  loading: "idle",
  numberOfPokemonsFetched: 0,
};

const pokemonSlice = createSlice({
  name: "pokemons",
  initialState,
  reducers: {
    pokemonAdded(state : StateType, action: PayloadAction<PokemonType[]>) {
      state.pokemons.push(...action.payload);
      state.numberOfPokemonsFetched += 10;
    },
    changeSpecificPokemon(state: StateType, action: PayloadAction<PokemonType>) {
      state.pokemons[
        state.pokemons.findIndex((el : PokemonType) => el.name === action.payload.name)
      ] = action.payload;
    },
    resetState(state: StateType) {
      state.pokemons = [];
      state.numberOfPokemonsFetched = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPokemons.pending, (state, action) => {
        if (state.loading === "idle") {
          state.loading = "pending";
        }
      })
      .addCase(fetchPokemons.rejected, (state, action) => {
        if (state.loading === "pending") {
          state.loading = "idle";
        }
      })
      .addCase(fetchPokemons.fulfilled, (state : StateType, action) => {
        if (state.loading === "pending") {
          state.pokemons.push(...action.payload!.output);
          state.numberOfPokemonsFetched += action.payload!.howManyToFetch;
          state.loading = "idle";
        }
      })
      ;
  },
});

export const { pokemonAdded, changeSpecificPokemon, resetState } =
  pokemonSlice.actions;

export const selectAllPokemons = (state: RootState) => state.pokemons;

export const selectSpecificPokemon = (state: RootState, providedName: string) =>
  state.pokemons.filter(
    (value: { name: string }) => value.name === providedName
  );

export const selectNumberOfPokemonsFetched = (state: RootState) =>
  state.numberOfPokemonsFetched;

export default pokemonSlice.reducer;
