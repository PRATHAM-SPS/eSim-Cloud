// Main Layout for Schemaic Editor page.
/* eslint-disable react/prop-types */
import React, { useEffect } from 'react'
import {
  Button,
  Typography,
  Dialog,
  DialogContent,
  Grid,
  Paper,
  Tooltip,
  Snackbar,
  TextField,
  DialogActions,
  List,
  ListItem
} from '@material-ui/core'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import LayoutMain from '../components/Shared/LayoutMain'
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import LoadGrid from '../components/SchematicEditor/Helper/ComponentDrag.js'
import '../components/SchematicEditor/Helper/SchematicEditor.css'
import { fetchSchematic, loadGallery, reportPublication, makeCopy } from '../redux/actions/index'
import { useDispatch, useSelector } from 'react-redux'
import SimulationProperties from '../components/SchematicEditor/SimulationProperties'
import ZoomInIcon from '@material-ui/icons/ZoomIn'
import ZoomOutIcon from '@material-ui/icons/ZoomOut'
import SettingsOverscanIcon from '@material-ui/icons/SettingsOverscan'
import MuiAlert from '@material-ui/lab/Alert';
import { ZoomIn, ZoomOut, ZoomAct, GenerateCompList } from '../components/SchematicEditor/Helper/ToolbarTools'
import ReportComponent from '../components/Project/ReportComponent';
import ChangeStatus from '../components/Project/ChangeStatus';
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    minHeight: '30vh',

  },
  toolbar: {
    minHeight: '20px'
  }
}))

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});


function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
export default function PublicationPage(props) {
  const classes = useStyles()
  const gridRef = React.createRef()
  const dispatch = useDispatch()
  const [snackbarOpen, setSnackbarOpen] = React.useState(false)
  const [simulateOpen, setSimulateOpen] = React.useState(false)
  const [reportOpen, setReportOpen] = React.useState(false)
  const [reportDescription, setDescription] = React.useState(null)
  const publication = useSelector(state => state.publicationReducer)
  const auth = useSelector(state => state.authReducer)

  const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography variant="h6">{children}</Typography>
        {onClose ? (
          <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    );
  });
  const handleSimulateOpen = () => {
    setSimulateOpen(!simulateOpen)
  }
  const handleReportOpen = () => {
    setReportOpen(!reportOpen)
  }
  const handleChangeDescription = (e) => {
    setDescription(e.target.value)
  }
  const onClick = (type) => {
    const query = new URLSearchParams(props.location.search)
    var save_id = query.get('save_id')
    var publication_id = query.get('publication_id')
    switch (type) {
      case "Report":
        dispatch(reportPublication(reportDescription, publication_id))
        handleReportOpen()
        break;
      case "Make copy":
        dispatch(makeCopy(save_id))
        setSnackbarOpen(true)
        break;
      default:
        break;
    }
  }




  useEffect(() => {
    var container = gridRef.current
    LoadGrid(container, null, null)
    if (props.location.search !== '') {
      const query = new URLSearchParams(props.location.search)
      var saveID = query.get('save_id')
      if (saveID.substr(0, 7) === 'gallery') {
        // Loading Gallery schemaic.
        dispatch(loadGallery(saveID.substr(7, saveID.length)))
      } else {
        // Loading User on-cloud saved schemaic.
        dispatch(fetchSchematic(saveID))
      }
    }
    console.log(GenerateCompList())
    // eslint-disable-next-line
  }, [props.location, dispatch])
  return (
    <div className={classes.root}>
      <LayoutMain>
        {publication.details !== "400" ?
          <Grid container>
            <Grid item xs={1} />
            <Grid item xs={10}>
              <div className={classes.toolbar} />
              <Typography>
                {publication.details && <h1 style={{ marginBottom: '0' }}>{publication.details.title}</h1>}
                {publication.details && <h4 style={{ marginTop: '0' }}>By: {publication.details.author_name} </h4>}
              </Typography>
              {publication.reports && publication.details.is_reported &&
                <ReportComponent publication={publication} location={props.location} />
              }
              {publication.details && !publication.details?.is_reported && publication.details?.author_name !== auth.user?.username &&
                <ChangeStatus publication={publication} />
              }
              <Typography>
                <h3>{publication.details?.description}</h3>
                {publication.details && publication.details?.fields && publication.details.fields.map(item => (
                  <p>
                    <h2 style={{ marginTop: '0' }}>{item.name}</h2>
                    <h3 style={{ marginTop: '0' }}>{item.text}</h3>
                  </p>
                ))}
              </Typography>


              <Dialog
                open={simulateOpen}
                onClose={handleSimulateOpen}
              >
                <DialogTitle onClose={handleSimulateOpen}>Simulate Circuit</DialogTitle>
                <DialogContent style={{ padding: '3%' }}>
                  <SimulationProperties />
                </DialogContent>
              </Dialog>
              <Dialog
                open={reportOpen}
                onClose={handleReportOpen}
                fullWidth={true}
                maxWidth={'md'} >
                <DialogTitle>Report this publication</DialogTitle>
                <DialogContent style={{ padding: '3%' }}>
                  <TextField
                    multiline
                    variant="outlined"
                    label="Report Description"
                    style={{ width: '100%' }}
                    value={reportDescription}
                    error={!reportDescription}
                    helperText={"Please enter description"}
                    onChange={handleChangeDescription}
                    rows={8} />
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => onClick("Report")}>Report</Button>
                  <Button onClick={handleReportOpen}>Cancel</Button>
                </DialogActions>
              </Dialog>

              <h1>Circuit Diagram:
        <Button variant="contained" style={{ float: 'right', backgroundColor: 'red', color: 'white', marginTop: '.5%' }} onClick={() => handleReportOpen()}>Report</Button>
                <Button variant="contained" color="primary" style={{ float: 'right', margin: '.5% .5% 0 0%' }} onClick={() => onClick("Make copy")}>Make a Copy</Button>
                <Button style={{ float: 'right', backgroundColor: 'lightgreen', margin: '.5% .5% 0 0' }} variant="contained" onClick={() => handleSimulateOpen()}>
                  <PlayCircleOutlineIcon />Simulate
          </Button>
              </h1>
              <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
              >
                <Alert onClose={() => setSnackbarOpen(false)} severity="success">
                  Successfully made a copy!
          </Alert>
              </Snackbar>
              <Grid container>
                <Grid item xs={1}>
                  <Paper style={{ width: '30px' }}>
                    <div>
                      <Tooltip title="Zoom In">
                        <IconButton color="inherit" className={classes.tools} size="small" onClick={ZoomIn}>
                          <ZoomInIcon />
                        </IconButton>
                      </Tooltip>
                    </div>
                    <div>
                      <Tooltip title="Zoom Out">
                        <IconButton color="inherit" className={classes.tools} size="small" onClick={ZoomOut}>
                          <ZoomOutIcon />
                        </IconButton>
                      </Tooltip>
                    </div>
                    <div>
                      <Tooltip title="Default Size">
                        <IconButton color="inherit" className={classes.tools} size="small" onClick={ZoomAct}>
                          <SettingsOverscanIcon />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </Paper>
                </Grid>
                <Grid item xs={10}>
                  <div className="grid-container A4-L" ref={gridRef} id="divGrid" />
                </Grid>
                <Grid item xs={1} />

                <Grid item xs={12} sm={12}>
                  <Paper style={{ padding: '2%', marginTop: '3%' }}>
                    <List>
                      <h3>History of this Project</h3>
                      {publication.details?.history[0] ?
                        <>
                          {publication.details.history.slice(0).reverse().map((item, index) => (
                            <ListItem>
                              <p style={{ margin: '0%' }}>{index + 1}. {item.from_state_name} to {item.to_state_name}
                                <br />
                                <h5>-On {item.transition_time} by {item.transition_author}</h5>
                                {item.reviewer_notes && <h5>-Notes: {item.reviewer_notes}</h5>}
                              </p>
                            </ListItem>
                          ))}</>
                        : <h4>No history of this project.</h4>
                      }
                    </List>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={1} />
          </Grid>
          :
          <>
          Not Authorized
          </>}

      </LayoutMain>
      {/* Grid for drawing and designing circuits */}

    </div>
  )
}
