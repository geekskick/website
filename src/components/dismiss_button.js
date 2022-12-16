
import Button from '@mui/material/Button'

export default function DismissButton(props) {
    return (<Button onClick={() => props.handleDismiss(props.key)}>Dismiss</Button>)
}
