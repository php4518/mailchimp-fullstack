import mailchimpService from './services/mailchimp.service';

export const addMembers = members => dispatch => mailchimpService.batchSubmit(members);
export const addMailChimpCampaign = body => dispatch => mailchimpService.addMailChimpCampaign(body);
export const updateCampaignContent = (id, body) => dispatch => mailchimpService.updateCampaignContent(id, body);
export const sendCampaign = id => dispatch => mailchimpService.sendCampaign(id);
