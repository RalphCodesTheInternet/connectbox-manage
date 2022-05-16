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
 * Get a list of courses
 *
 * @return {Promise} The JSON response
 */
lms.get_courses = async () => {
  if (!lms.can_make_request()) {
    return 'You need to set the url and token!';
  }

  const params = {
    'wstoken': lms.token,
    'wsfunction': 'core_course_get_courses',
    'moodlewsrestformat': 'json'
  };
  const response = await axios.post(lms.url, null, {params: params});
  return response.data;
};
/**
 * Get a specific course
 *
 * @param  {integer}  id  The id of the course
 * @return {Promise}      The JSON response
 */
lms.get_course = async (id) =>  {
  if (!lms.can_make_request()) {
    return 'You need to set the url and token!';
  }
  if (!id) {
    return 'You must supply a vaild id!';
  }

  const params = {
    'wstoken': lms.token,
    'wsfunction': 'core_course_get_courses_by_field',
    'moodlewsrestformat': 'json',
    'field': 'id',
    'value': id,
  };
  const response = await axios.post(lms.url, null, {params: params});
  return response.data;
}
/**
 * Delete the requested course
 *
 * @param  {integer}  id  The id of the course
 * @return {Promise}      The JSON response
 */
lms.delete_course = async (id)  => {
  if (!lms.can_make_request()) {
    return 'You need to set the url and token!';
  }
  if (!id) {
    return 'You must supply a vaild id!';
  }

  const params = {
    'wstoken': lms.token,
    'wsfunction': 'core_course_delete_courses',
    'moodlewsrestformat': 'json',
    'courseids[0]': id,
  };
  const response = await axios.post(lms.url, null, {params: params});
  if (response.data.warnings.length == 0) {
    return 'The course has been deleted.';
  }
  return response.data;
}
/**
 * Get a list of students enrolled in a class
 *
 * @param  {integer}  id  The id for the course
 * @return {Promise}      The JSON response
 */
lms.get_course_roster = async (id)  =>  {
  if (!lms.can_make_request()) {
    return 'You need to set the url and token!';
  }
  if (!id) {
    return 'You must supply a vaild id!';
  }

  const params = {
    'wstoken': lms.token,
    'wsfunction': 'core_enrol_get_enrolled_users',
    'moodlewsrestformat': 'json',
    'courseid': id,
  };
  const response = await axios.post(lms.url, null, {params: params});
  return response.data;
};
/**
 * Enroll the user from the course. Always enrolls as a student.
 *
 * @param  {integer}  courseid  The course id
 * @param  {integer}  userid    The user id
 * @return {Promise}  The response
 */
lms.enroll_course_roster_user = async (courseid, userid)  =>  {
  if (!lms.can_make_request()) {
    return 'You need to set the url and token!';
  }
  if (!courseid) {
    return 'You must supply a vaild course id!';
  }
  if (!userid) {
    return 'You must supply a vaild user id!';
  }

  const params = {
    'wstoken': lms.token,
    'wsfunction': 'enrol_manual_enrol_users',
    'moodlewsrestformat': 'json',
    'enrolments[0][courseid]': courseid,
    'enrolments[0][userid]': userid,
    'enrolments[0][roleid]': 5,
  };
  const response = await axios.post(lms.url, null, {params: params});
  if (!response.data) {
    return 'The user has been enrolled in the course.';
  }
  return response.data;
};
/**
 * Unenroll the user from the course.
 *
 * @param  {integer}  courseid  The course id
 * @param  {integer}  userid    The user id
 * @return {Promise}  The response
 */
lms.unenroll_course_roster_user = async (courseid, userid)  =>  {
  if (!lms.can_make_request()) {
    return 'You need to set the url and token!';
  }
  if (!courseid) {
    return 'You must supply a vaild course id!';
  }
  if (!userid) {
    return 'You must supply a vaild user id!';
  }

  const params = {
    'wstoken': lms.token,
    'wsfunction': 'enrol_manual_unenrol_users',
    'moodlewsrestformat': 'json',
    'enrolments[0][courseid]': courseid,
    'enrolments[0][userid]': userid,
  };
  const response = await axios.post(lms.url, null, {params: params});
  if (!response.data) {
    return 'The user has been unenrolled in the course.';
  }
  return response.data;
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

  const params = {
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

  const params = {
    'wstoken': lms.token,
    'wsfunction': 'core_user_get_users_by_field',
    'moodlewsrestformat': 'json',
    'field': 'id',
    'values': [id],
  };
  const response = await axios.post(lms.url, null, {params: params});
  return response.data;
}
/**
 * Create a new user in the LMS
 *
 * @param  {object}  data The JSON object of data for the new user
 * @return {Promise}      The JSON response
 */
lms.post_user = async (data)  =>  {
  if (!lms.can_make_request()) {
    return 'You need to set the url and token!';
  }
  if ((!('username' in data)) || (data.username === '')) {
    return 'You must supply a valid username!';
  }
  if ((!('firstname' in data)) || (data.firstname === '')) {
    return 'You must supply a valid firstname!';
  }
  if ((!('lastname' in data)) || (data.lastname === '')) {
    return 'You must supply a valid lastname!';
  }
  if ((!('email' in data)) || (data.email === '')) {
    return 'You must supply a valid email!';
  }
  if (
    ((!('password' in data)) || (data.password === '')) &&
    ((!('createpassword' in data)) || (data.createpassword !== 1))
  ) {
    return 'You must supply a valid password or createpassword!';
  }

  // Check provided data
  const params = {
    'wstoken': lms.token,
    'wsfunction': 'core_user_create_users',
    'moodlewsrestformat': 'json',
    'users[0][username]': data.username,
    'users[0][firstname]': data.firstname,
    'users[0][lastname]': data.lastname,
    'users[0][email]': data.email,
  };
  if ('password' in data) {
    params['users[0][password]'] = data.password;
  } else if ('createpassword' in data) {
    params['users[0][createpassword]'] = 1;
  } else {
    return 'You must supply a valid password or createpassword!';
  }
  const optionals = [
    'maildisplay', 'city', 'country', 'timezone', 'description', 'middlename',
    'alternatename', 'url', 'icq', 'skype', 'aim', 'yahoo', 'msn', 'institution', 'department',
    'phone1', 'phone2', 'address', 'lang', 'mailformat', 'interests'
  ];
  optionals.filter((field) => (field in data)).forEach((field) => params['users[0]['+field+']'] = data[field]);
  const response = await axios.post(lms.url, null, {params: params});
  return response.data;
};
/**
 * Update the gven user
 *
 * @param  {integer}  id    The user's id
 * @param  {object}   data  The data to be updated
 * @return {Promise}        The JSON response
 */
lms.put_user = async (id, data) =>  {
  const whitelist = [
    'username', 'maildisplay', 'city', 'country', 'timezone', 'description', 'middlename',
    'alternatename', 'url', 'icq', 'skype', 'aim', 'yahoo', 'msn', 'institution', 'department',
    'phone1', 'phone2', 'address', 'lang', 'mailformat', 'suspended', 'password', 'firstname',
    'lastname', 'email', 'interests'
  ];
  if (!lms.can_make_request()) {
    return 'You need to set the url and token!';
  }
  if (!id) {
    return 'You must provide a valid id.';
  }
  const params = {
    'wstoken': lms.token,
    'wsfunction': 'core_user_update_users',
    'moodlewsrestformat': 'json',
    'users[0][id]': id,
  };
  whitelist.filter((field) => (field in data)).forEach((field) => params['users[0]['+field+']'] = data[field]);
  const response = await axios.post(lms.url, null, {params: params});
  if (!response.data) {
    return 'The user has been updated.';
  }
  return response.data;
};
/**
 * Delete a given user
 *
 * @param  {integer}  id  The id of the user to delete.
 * @return {Promise}      The JSON response
 */
lms.delete_user = async (id)  =>  {
  if (!lms.can_make_request()) {
    return 'You need to set the url and token!';
  }
  if (!id) {
    return 'You must supply a vaild id!';
  }

  const params = {
    'wstoken': lms.token,
    'wsfunction': 'core_user_delete_users',
    'moodlewsrestformat': 'json',
    'userids': [id],
  };
  const response = await axios.post(lms.url, null, {params: params});
  if (!response.data) {
    return 'The user has been deleted.';
  }
  return response.data;
};

module.exports = lms;
