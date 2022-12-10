
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Tooltip from '@mui/material/Tooltip';


/**
 * @component
 * Render the SpriteGallery
 * @param {Object} props 
 * @param {Number} props.columns The number of columns
 * @param {Number} props.rows The number of rows
 * @param {Number} props.dimension The number of pixels tall, and wide, for each tile
 * @param {Array.<{sprite: {shiny: Boolean, url: String}, id: String, name: String, tooltip: String}>} props.superSetSpriteList The sprite to display
 */
export default function FilteringSpriteGallery(props) {

    console.log("PokemonImages rendering: ", props);
    // TODO: Get this to shrink when the window gets too small
    return (

        <ImageList cols={props.columns} rows={props.rows} rowHeight={props.dimension}>
            {props.superSetSpriteList.map(spriteListItem => {
                const shinyClass = spriteListItem.sprite?.shiny === true ? "shiny-sprite" : ""

                let subtitle;
                if (spriteListItem.id) {
                    subtitle = `#${spriteListItem.id}`
                }
                return (
                    <Tooltip title={spriteListItem.tooltip}>
                        <ImageListItem className={shinyClass} key={spriteListItem.name}>
                            <img
                                src={`${spriteListItem.sprite?.url}?w=${props.dimension}&h=${props.dimension}&fit=crop&auto=format`}
                                srcSet={`${spriteListItem.sprite?.url}?w=${props.dimension}&h=${props.dimension}&fit=crop&auto=format&dpr=2 2x`}
                                alt={spriteListItem.name}
                                loading="lazy"
                            />
                            <ImageListItemBar
                                title={spriteListItem.name}
                                subtitle={subtitle}
                                position="top"
                            />
                        </ImageListItem>
                    </Tooltip>)
            })
            }
        </ImageList>
    );
}