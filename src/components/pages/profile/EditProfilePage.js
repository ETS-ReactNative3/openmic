import React, { Component } from 'react';
import { Container, Row, Col } from 'react-grid-system';
import classNames from 'classnames';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import UserManager from '../../singletons/UserManager.js';
import BackendManager from '../../singletons/BackendManager.js';

const root = {
  margin: 20,
}

const textFieldStyle = {
  color: "#222225",
  fontFamily: "Lato",
  marginTop: 10,
}

const titleStyle = {
  color: "#222225",
  font: "Lato",
  textAlign: "left",
}

const bigAvatar = {
  marginLeft: 40,
  marginTop: 20,
  marginBottom: 20,
  width: 100,
  height: 100,
}

const useStyles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: 'auto',
  },
  margin: {
    margin: 50,
  },
  textField: {
    flexBasis: 200,
  },
});

class EditProfilePage extends Component {

  componentDidMount() {
    if (localStorage.getItem('id') != null) {
      this.setState({
        firstName: localStorage.getItem('first_name'),
        lastName: localStorage.getItem('last_name'),
        username: localStorage.getItem('username'),
        bio: localStorage.getItem('bio'),
        profilePicture: localStorage.getItem('profile_picture'),
      })
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      firstName: "",
      lastName: "",
      username: "",
      profilePicture: "",
      validUsername: false,
      bio: "",
      selectedFile: null,
      file: null,
    }

    this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
    this.handleLastNameChange = this.handleLastNameChange.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handleBioChange = this.handleBioChange.bind(this);
    this.renderProfilePicture = this.renderProfilePicture.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
  }

  handleFirstNameChange(e) {
    this.setState({
      firstName: e.target.value
    });
    console.log(e.target.value);
  }

  handleLastNameChange(e) {
    this.setState({
      lastName: e.target.value
    });
  }

  handleUsernameChange(e) {
    this.setState({
      username: e.target.value
    });
    BackendManager.makeQuery('users/check/username', JSON.stringify({
      username: this.state.username,
    }))
    .then(data => {
      this.setState({validUsername: data.success});
    });
  }

  handleBioChange(e) {
    this.setState({
      bio: e.target.value
    });
  }

  fileSelectedHandler = event => {
    this.setState({
      selectedFile: event.target.files[0],
      file: URL.createObjectURL(event.target.files[0]),
    });
    console.log(event.target.files[0]);
  }

  renderBasicInfo() {
    return (
      <div style={root}>
        <TextField label="First Name"
          floatingLabelText="First Name"
          style={textFieldStyle}
          fullWidth
          value={this.state.firstName}
          onChange={this.handleFirstNameChange}/>
        <TextField
          label="Last Name"
          floatingLabelText="Last Name"
          style={textFieldStyle}
          fullWidth
          value={this.state.lastName}
          onChange={this.handleLastNameChange}/>
        <TextField
          label="Username"
          floatingLabelText="Email"
          style={textFieldStyle}
          fullWidth
          value={this.state.username}
          onChange={this.handleUsernameChange}/>
      </div>
    );
  }

  renderProfilePicture() {
    if (this.state.selectedFile != null) {
      return (
        <Avatar src={this.state.file} style={bigAvatar} />
      );
    } else {
      return (
        <Avatar src={this.state.profilePicture} style={bigAvatar} />
      );
    }
  }

  updateProfile() {
    if (this.state.selectedFile != null) {
      var d = new Date();
      var seconds = d.getTime() / 1000;
      var fileName = UserManager.id + "_" + seconds;
      var ext = ".jpg";
      if (this.state.selectedFile.type == "image/png") {
        url += ".png";
      } else {
        url += ".jpg";
      }

      var url = "https://s3-us-west-2.amazonaws.com/pokadotmedia/";
      const formData = new FormData();
      formData.append('file', this.state.selectedFile);
      axios.post(`https://api.mypokadot.com/pp/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(data => {
  			if (data.data.success) {
          var imageUrl = url + data.data.title.split(' ').join('+');
          BackendManager.makeQuery('users/profile/update', JSON.stringify({
            first_name: this.state.firstName,
            last_name: this.state.lastName,
            username: this.state.username,
            bio: this.state.bio,
            profile_picture: imageUrl,
            id: UserManager.id,
          }))
          .then(data => {
            localStorage.setItem('first_name', this.state.firstName);
            localStorage.setItem('last_name', this.state.lastName);
            localStorage.setItem('username', this.state.username);
            localStorage.setItem('bio', this.state.bio);
            localStorage.setItem('profile_picture', imageUrl);
            this.props.showToast("Done!");
            this.setState({validUsername: data.success});
          });
  			}
      }).catch(error => {
        // handle your error
      });
    } else {
      BackendManager.makeQuery('users/profile/update', JSON.stringify({
        first_name: this.state.firstName,
        last_name: this.state.lastName,
        username: this.state.username,
        bio: this.state.bio,
        profile_picture: this.props.profilePicture,
        id: UserManager.id,
      }))
      .then(data => {
        localStorage.setItem('first_name', this.state.firstName);
        localStorage.setItem('last_name', this.state.lastName);
        localStorage.setItem('username', this.state.username);
        localStorage.setItem('bio', this.state.bio);
        this.props.showToast("Done!");
        this.setState({validUsername: data.success});
      });
    }
  }

  render() {
    const classes = useStyles();
		return (
      <div style={root}>
        <Container>
          <h2 style={titleStyle}>Edit your profile</h2>
          <Paper elevation={1} style={{backgroundColor: 'white'}}>
            <Row>
              {this.renderProfilePicture()}
              <label class="custom-file-upload">
                <input type="file" onChange={this.fileSelectedHandler} accept=".jpg,.png,.jpeg"/>
                Upload a profile picture
              </label>
            </Row>
          </Paper>
          <Paper elevation={1} style={{backgroundColor: 'white'}}>
            {this.renderBasicInfo()}
            <div style={{marginLeft: 10, marginRight: 10, marginBottom: 20}}>
              <TextField
                id="outlined-adornment-amount"
                label="Write your bio"
                multiline
                fullWidth
                rows="4"
                className={classNames(classes.margin, classes.textField)}
                value={this.state.bio}
                onChange={this.handleBioChange}
                margin="normal"
                variant="outlined"
              />
            </div>
          </Paper>
          <button className='button-rounded' onClick={() => this.updateProfile()}>Done!</button>
        </Container>
      </div>
    )
  }
}

export default withStyles(useStyles)(EditProfilePage);
