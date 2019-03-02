import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import { Button } from 'reactstrap';
import { updateCampaignContent, sendCampaign } from '../../modules/mailChimp';
import SpinnerLoader from '../../components/spinnerLoader';

class Template extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      campaignId: props.location.state.id,
      htmlContent: null,
      uploadingData: false
    };
  }

  handleFile = (event) => {
    const htmlFile = event.target.files[0];

    const fileReader = new FileReader();
    fileReader.readAsText(htmlFile);
    fileReader.onloadend = this.handleFileContent;
  };

  handleFileContent = e => this.setState({ htmlContent: e.target.result });

  handleUpload = () => {
    const { campaignId, htmlContent } = this.state;
    const { updateCampaignContent, sendCampaign, gotoHomePage } = this.props;
    this.setState({ uploadingData: true });
    updateCampaignContent(campaignId, { html: htmlContent })
      .then(() => {
        sendCampaign(campaignId)
          .then(() => {
            alert('campaign sent successfully!!!');
            gotoHomePage();
          })
          .catch((error) => {
            console.log('Error sending mail', error);
            alert('Error sending mail, Please try again.');
          })
          .finally(() => this.setState({ uploadingData: false }));
      })
      .catch((error) => {
        this.setState({ uploadingData: false });
        console.log('Error uploading template', error);
        alert('Error uploading template, Please try again.');
      });
  };

  render() {
    const { uploadingData } = this.state;
    return (
      <div className="container">
        <br />
        <h3>Select a email template:</h3>
        <br />
        <input type="file" name="file" accept=".html" onChange={this.handleFile} className="centered mt-10 ml-10 mr-10" />
        <br />
        <br />
        <Button className="btn btn-primary" color="primary" onClick={this.handleUpload}>Send</Button>
        <SpinnerLoader isVisible={uploadingData} />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  updateCampaignContent,
  sendCampaign,
  gotoHomePage: () => push('/')
}, dispatch);

export default connect(
  null,
  mapDispatchToProps
)(Template);
