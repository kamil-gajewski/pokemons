import PokemonDetailedCard from "../../features/Pokemons/components/Pokemon/PokemonDetailedCard";
import { useRouter } from "next/dist/client/router";
import styles from "/features/Pokemons/components/Pokemon/Pokemon.module.css";
import Link from "next/link";
import { RemoveScrollBar } from "react-remove-scroll-bar";

export default function Pokemon() {
  const router = useRouter();
  const name = router.query.slug;

  if(typeof(name) !== "string"){
    return;
  }

  return (
    <>
      <RemoveScrollBar />
      <div className={styles.slugContainer}>
        <div className={styles.homeButton}>
          <Link href="/">
            <button className={styles.button}>Home</button>
          </Link>
        </div>
        <PokemonDetailedCard name={name} />
      </div>
    </>
  );
}
