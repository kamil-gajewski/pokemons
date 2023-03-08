import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectSpecificPokemon } from "../../pokemonSlice";
import { styled } from "@mui/system";
import { CardActionArea } from "@mui/material";
import { useRouter } from "next/router";
import styles from "./Pokemon.module.css";
import cx from "classnames";

const { styl } = styles;

export default function PokemonOverviewCard({ name }: {name : string}) {
  function GetPokemonDetail(name: string) {
    const pokemonDetails = useSelector((state) =>
      selectSpecificPokemon(state, name)
    );
    return pokemonDetails;
  }

  const pokemon = GetPokemonDetail(name);

  const OverviewCard = styled(Card)(() => ({
    position: "relative",
    transition: "all 0.3s ease-out",
    cursor: "pointer",
    "&:hover": {
      boxShadow: `0 8px 16px rgba(0, 0, 255, .2)`,
      transform: "scale(1.1) translateY(-50px)",
    },
    maxWidth: 345,
    border: 1,
    borderRadius: "16px",
  }));
  const router = useRouter();

  return (
    <div className={cx(styl)}>
      <OverviewCard >
        <CardActionArea onClick={() => router.push(`pokemons/${name}`)}>
          <CardMedia
            component="img"
            alt={name}
            height="140"
            width="140"
            src={pokemon[0].sprite_front_default}
            sx={{ objectFit: "contain" }}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {pokemon[0].description}
            </Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: "center" }}>
            <Link href={"pokemons/" + name}>
              <Button size="small">Go to pokemon page</Button>
            </Link>
          </CardActions>
        </CardActionArea>
      </OverviewCard>
    </div>
  );
}
