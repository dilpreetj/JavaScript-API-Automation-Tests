import local from './local';
const supertest = require('supertest');
const request = supertest(local.baseUrl);

export default request;
