import React from "react";
import CardActions from "@mui/material/CardActions";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { useSelector, useDispatch } from "react-redux";
import {
  selectSpecificPokemon,
  changeSpecificPokemon,
} from "../../pokemonSlice";
import { useState } from "react";
import Button from "@mui/material/Button";
import { Card, CardContent } from "@mui/material";
import { useSpring, animated } from "react-spring";
import Box from "@mui/material/Box";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import Confetti from "react-dom-confetti";
import styles from "./Pokemon.module.css";
import { ConfettiConfig } from "react-dom-confetti";

export default function PokemonCard( {name} : {name : string} ) {
  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [explode, setExplode] = useState(false);
  const { height, width } = useWindowDimensions();

 
  const springProps = useSpring({
    from: {
      transform: "translateY(0px)",
      opacity: 1,
    },
    to: async (next) => {
      if (clicked) {
        await next({
          transform: `translateY(${height! / 2}px)`,
          opacity: 0,
        });
        await next({
          transform: "translateY(0px)",
          opacity: 0,
        });
        await next({
          opacity: 1,
        });
        setExplode(true);
        setClicked(false);
      }
    },
  });

  const dispatch = useDispatch();

  const handleClick = () => {
    setClicked(true);
    setExplode(false);
  };

  function GetPokemonDetail(name: string) {
    const pokemonDetails = useSelector((state) =>
      selectSpecificPokemon(state, name)
    );
    return pokemonDetails;
  }

  let pokemon = GetPokemonDetail(name);
  if (!pokemon || pokemon.length === 0) {
    return null;
  }

  pokemon = pokemon[0];
  let pokemonEdited = { ...pokemon };
  const config: ConfettiConfig = {
    angle: 44,
    spread: 341,
    startVelocity: 54,
    elementCount: 139,
    dragFriction: 0.25,
    duration: 5670,
    stagger: 3,
    width: "15px",
    height: "15px",
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
  };

  return (
    <div>
      <div className={styles.centered}>
        <Confetti active={explode} config={config} />
      </div>

      <Box className={styles.centered}>
        <animated.div style={springProps}>
          <Card>
            <CardMedia
              component="img"
              alt={name}
              height="140"
              width="140"
              src={pokemon.sprite_front_default}
              sx={{ objectFit: "contain" }}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {name}
              </Typography>
              <Typography
                component={"span"}
                variant="body2"
                color="text.secondary"
              >
                <div className="Stats">
                  <table>
                    <tbody>
                      <tr>
                        <th>Name</th>
                        <th>Base value</th>
                      </tr>

                      {isBeingEdited ? (
                        <>
                          <tr>
                            <td>{"hp"}</td>
                            <td>
                              <input
                                type="number"
                                defaultValue={pokemon.hp}
                                onChange={(e) =>
                                  (pokemonEdited.hp = parseInt(e.target.value))
                                }
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>{"attack"}</td>
                            <td>
                              <input
                                type="number"
                                defaultValue={pokemon.attack}
                                onChange={(e) =>
                                  (pokemonEdited.attack = parseInt(
                                    e.target.value
                                  ))
                                }
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>{"defense"}</td>
                            <td>
                              <input
                                type="number"
                                defaultValue={pokemon.defense}
                                onChange={(e) =>
                                  (pokemonEdited.defense = parseInt(
                                    e.target.value
                                  ))
                                }
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>{"special attack"}</td>
                            <td>
                              <input
                                type="number"
                                defaultValue={pokemon.special_attack}
                                onChange={(e) =>
                                  (pokemonEdited.special_attack = parseInt(
                                    e.target.value
                                  ))
                                }
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>{"special defense"}</td>
                            <td>
                              <input
                                type="number"
                                defaultValue={pokemon.special_defense}
                                onChange={(e) =>
                                  (pokemonEdited.special_defense = parseInt(
                                    e.target.value
                                  ))
                                }
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>{"speed"}</td>
                            <td>
                              <input
                                type="number"
                                defaultValue={pokemon.speed}
                                onChange={(e) =>
                                  (pokemonEdited.speed = parseInt(
                                    e.target.value
                                  ))
                                }
                              />
                            </td>
                          </tr>
                        </>
                      ) : (
                        <>
                          <tr>
                            <td>{"hp"}</td>
                            <td>{pokemon.hp}</td>
                          </tr>
                          <tr>
                            <td>{"attack"}</td>
                            <td>{pokemon.attack}</td>
                          </tr>
                          <tr>
                            <td>{"defense"}</td>
                            <td>{pokemon.defense}</td>
                          </tr>
                          <tr>
                            <td>{"special attack"}</td>
                            <td>{pokemon.special_attack}</td>
                          </tr>
                          <tr>
                            <td>{"special defense"}</td>
                            <td>{pokemon.special_defense}</td>
                          </tr>
                          <tr>
                            <td>{"speed"}</td>
                            <td>{pokemon.speed}</td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </Typography>
            </CardContent>
            <CardActions>
              {!isBeingEdited ? (
                <Button
                  size="small"
                  onClick={() => setIsBeingEdited(!isBeingEdited)}
                >
                  Edit
                </Button>
              ) : (
                <>
                  <Button
                    size="small"
                    onClick={() => {
                      setIsBeingEdited(!isBeingEdited);
                      dispatch(changeSpecificPokemon(pokemonEdited));
                      handleClick();
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    size="small"
                    onClick={() => setIsBeingEdited(!isBeingEdited)}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </CardActions>
          </Card>
        </animated.div>
      </Box>
    </div>
  );
}
