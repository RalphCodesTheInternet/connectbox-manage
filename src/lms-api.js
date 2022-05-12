const axios = require('axios').default;
/**
 * Our LMS object that handles interaction with the LMS.  This script currently supports
 * Moodle's API.
 *
 * @type {Object}
 */
const lms = {};
lms.url = '';
lms.token = '';
/**
 * Do we have everything to make a request?
 *
 * @return {boolean}  yes|no
 */
lms.can_make_request = () =>  {
  return ((lms.token !== '') && (lms.url !== ''));
};
/**
 * Get all the users of the LMS.
 *
 * @return {Promise} The JSON response
 */
lms.get_users = async ()  =>  {
  if (!lms.can_make_request()) {
    return 'You need to set the url and token!';
  }

  var params = {
    'wstoken': lms.token,
    'wsfunction': 'core_user_get_users',
    'moodlewsrestformat': 'json',
    'criteria[0][key]': 'lastname',
    'criteria[0][value]': '%',
  };
  const response = await axios.post(lms.url, null, {params: params});
  return response.data;
};
/**
 * Get the user based on the given id
 * @param  {integer}  id  The user id
 * @return {Promise}  The JSON response
 */
lms.get_user = async (id) =>  {
  if (!lms.can_make_request()) {
    return 'You need to set the url and token!';
  }
  if (!id) {
    return 'You must supply a vaild id!';
  }

  var params = {
    'wstoken': lms.token,
    'wsfunction': 'core_user_get_users_by_field',
    'moodlewsrestformat': 'json',
    'field': 'id',
    'values': [id],
  };
  const response = await axios.post(lms.url, null, {params: params});
  return response.data;
}

module.exports = lms;
