import React, { useEffect } from "react";
import type { PokemonType } from "./PokemonsTypes";
import { fetchPokemons, selectAllPokemons } from "./pokemonSlice";
import styles from "./components/Pokemon/Pokemon.module.css";
import { BottomScrollListener } from "react-bottom-scroll-listener";
import { resetState } from "./pokemonSlice";
import Grid from "@mui/material/Grid";
import PokemonOverviewCard from "./components/Pokemon/PokemonOverviewCard";
import { useAppSelector, useAppDispatch } from './hooks/reduxHooks'

export default function PokemonsFacade() {
  const dispatch = useAppDispatch()
  const pokemons = useAppSelector(selectAllPokemons);

  const handleOnDocumentBottom = () => {
    dispatch(fetchPokemons({howManyToFetch : 10}));
  };

  if (!pokemons || pokemons.length === 0) {
    return null;
  }

  return (
    <>
      <div>
        <button
          className={styles.button}
          onClick={() => {
            dispatch(resetState());
            dispatch(fetchPokemons({howManyToFetch : 20}));
          }}
        >
          Reset
        </button>
      </div>
      <div>
        <Grid container spacing={2}>
          {pokemons.map((pokemon: PokemonType) => {
            return (
              <PokemonOverviewCard key={pokemon.name} name={pokemon.name} />
            );
          })}
        </Grid>
      </div>
      <BottomScrollListener onBottom={handleOnDocumentBottom} />
    </>
  );
}
