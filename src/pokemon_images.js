
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

export default function PokemonImages(props) {

    console.log("PokemonImages rendering :", props);
    // TODO: Get this to shrink when the window gets too small
    return (
        <ImageList cols={props.cols} rowHeight={props.dim}>
            {props.pokemonList.map(pokemon => {
                return (<ImageListItem key={pokemon.name}>
                    <img
                        src={`${pokemon.sprite}?w=${props.dim}&h=${props.dim}&fit=crop&auto=format`}
                        srcSet={`${pokemon.sprite}?w=${props.dim}&h=${props.dim}&fit=crop&auto=format&dpr=2 2x`}
                        alt={pokemon.name}
                        loading="lazy"
                    />
                </ImageListItem>)
            })
            }
        </ImageList>
    );
}