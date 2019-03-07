import axios from 'axios';

export function loginUser(credentials) {
  if (credentials.email.toLowerCase() === 'admin@gmail.com' && credentials.password.toLowerCase() === 'admin') {
    return Promise.resolve(credentials);
  }
  return Promise.reject({ error: 'User not found.' });
  // return axios.post('/api/auth/login', credentials)
  //   .then(({ data }) => data);
}

export default { loginUser };
