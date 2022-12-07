
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Tooltip from '@mui/material/Tooltip';

export default function PokemonImages(props) {

    console.log("PokemonImages rendering :", props);
    // TODO: Get this to shrink when the window gets too small

    return (

        <ImageList cols={props.cols} rows={props.rows} rowHeight={props.dim}>
            {props.pokemonList.map(pokemon => {
                const shinyClass = pokemon.sprite?.shiny === true ? "shiny-sprite" : ""
                return (
                    <Tooltip title={pokemon.tooltip}>
                        <ImageListItem className={shinyClass} key={pokemon.name}>
                            <img
                                src={`${pokemon.sprite?.url}?w=${props.dim}&h=${props.dim}&fit=crop&auto=format`}
                                srcSet={`${pokemon.sprite?.url}?w=${props.dim}&h=${props.dim}&fit=crop&auto=format&dpr=2 2x`}
                                alt={pokemon.name}
                                loading="lazy"
                            />
                            <ImageListItemBar
                                title={pokemon.name}
                                subtitle={`#${pokemon?.id}`}
                                position="top"
                            />
                        </ImageListItem>
                    </Tooltip>)
            })
            }
        </ImageList>
    );
}