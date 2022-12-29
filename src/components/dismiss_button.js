
import Button from '@mui/material/Button'
import CloseIcon from '@mui/icons-material/Close';

export default function DismissButton(props) {
    return (<Button sx={{
        color: 'white'
    }}
        onClick={() => props.handleDismiss(props.key)}>
        <CloseIcon />
    </Button>)
}
