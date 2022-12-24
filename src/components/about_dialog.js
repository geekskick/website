import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';

export default function AboutDialog(props) {
    return (
        <Dialog
            scroll='paper'
            onClose={props.handleAboutClose}
            open={props.open}
            fullWidth={false}
            maxWidth='xl'>
            <DialogTitle sx={{
                textAlign: 'center',
            }}>{props.title}</DialogTitle>
            <DialogContentText
                sx={{
                    margin: 5
                }}>{props.text}</DialogContentText>
        </Dialog >)
}