import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import { Button } from 'reactstrap';
import csv from 'csvtojson';
import { LIST_ID } from '../../helpers/constants';
import { addMembers } from '../../modules/mailChimp';
import SpinnerLoader from '../../components/spinnerLoader';

class CSVUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      csvContent: null,
      uploadingData: false
    };
  }

  handleCSVFile = (event) => {
    const csvFile = event.target.files[0];

    const fileReader = new FileReader();
    fileReader.readAsText(csvFile);
    fileReader.onloadend = this.handleFileContent;
  };

  handleFileContent = (e) => {
    this.setState({ csvContent: e.target.result });
  };

  handleUpload = () => {
    const { csvContent } = this.state;
    const { addMembers, gotoAddCampaignDetails } = this.props;

    if (!csvContent) {
      alert('Please select file first.');
    } else {
      this.setState({ uploadingData: true });

      csv().fromString(csvContent)
        .then((fetchedMembers) => {
          const members = fetchedMembers.map(m => ({
            method: 'post',
            path: `/lists/${LIST_ID}/members`,
            body: JSON.stringify({
              email_address: m['Email Address'],
              status: 'subscribed',
              merge_fields: {
                FNAME: m['First Name'],
                LNAME: m['Last Name'],
                COMPANY: m.Company
              }
            })
          }));
          addMembers(members)
            .then(gotoAddCampaignDetails)
            .catch((error) => {
              console.log('error uploading csv data', error);
              alert('error uploading csv data');
            })
            .finally(() => {
              this.setState({ uploadingData: false });
            });
        })
        .catch((error) => {
          console.log('Error while reading csv file', error);
          alert('Error while reading csv file, please try again.');
          this.setState({ uploadingData: false });
        });
    }
  };

  render() {
    const { uploadingData } = this.state;
    return (
      <div className="container">
        <br />
        <h3>Select a CSV file:</h3>
        <br />
        <input type="file" name="file" accept=".csv" onChange={this.handleCSVFile} />
        <br />
        <br />
        <Button className="btn btn-primary" color="primary" onClick={this.handleUpload}>Upload Members</Button>
        <SpinnerLoader isVisible={uploadingData} />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  addMembers,
  gotoAddCampaignDetails: () => push('/addCampaignDetails')
}, dispatch);

export default connect(
  null,
  mapDispatchToProps
)(CSVUpload);
