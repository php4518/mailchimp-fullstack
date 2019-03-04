import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import { Button } from 'reactstrap';
import EmailEditor from 'react-email-editor';
import { updateCampaignContent, sendCampaign } from '../../modules/mailChimp';
import SpinnerLoader from '../../components/spinnerLoader';

class Template extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      campaignId: props.location.state ? props.location.state.id : '',
      htmlContent: null,
      uploadingData: false
    };
  }

  exportTemplate = () => {
    this.editor.exportHtml((data) => {
      const { html } = data;
      this.handleUpload(html);
    });
  };

  handleUpload = (htmlContent) => {
    const { campaignId } = this.state;
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
        <div>
          <EmailEditor
            ref={editor => this.editor = editor}
          />
        </div>
        <br />
        <Button className="btn btn-primary" color="primary" onClick={this.exportTemplate}>Send</Button>
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
