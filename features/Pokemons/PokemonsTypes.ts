export type PokemonType = {
  name: string;
  sprite_front_default: string;
  description: string;
  hp: number;
  attack: number;
  defense: number;
  special_attack: number;
  special_defense: number;
  speed: number;
};

export type StateType = {
  pokemons: Array<PokemonType>,
  loading: string,
  numberOfPokemonsFetched: number,
}