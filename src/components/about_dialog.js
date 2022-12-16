import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';

export default function AboutDialog(props) {
    return (<Dialog onClose={props.handleAboutClose} open={props.open}>
        <DialogTitle>About</DialogTitle>
        <DialogContentText>Hello</DialogContentText>
    </Dialog>)
}