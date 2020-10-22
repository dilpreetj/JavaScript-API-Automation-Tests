import supertest from 'supertest';
const request = supertest('https://gorest.co.in/public-api/');

import { expect } from 'chai';

const TOKEN = process.env.USER_TOKEN;

describe('Users', () => {
  let userId;

  describe('POST', () => {
    it('/users', () => {
      const data = {
        email: `test-${Math.floor(Math.random() * 9999)}@mail.ca`,
        name: 'Test name',
        gender: 'Male',
        status: 'Inactive',
      };

      return request
        .post('users')
        .set('Authorization', `Bearer ${TOKEN}`)
        .send(data)
        .then((res) => {
          expect(res.body.data).to.deep.include(data);
          userId = res.body.data.id;
        });
    });
  });

  describe('GET', () => {
    it('/users', () => {
      return request.get(`users?access-token=${TOKEN}`).then((res) => {
        expect(res.body.data).to.not.be.empty;
      });
    });

    it('/users/:id', () => {
      return request
        .get(`users/${userId}?access-token=${TOKEN}`)
        .then((res) => {
          expect(res.body.data.id).to.be.eq(userId);
        });
    });

    it('/users with query params', () => {
      const url = `users?access-token=${TOKEN}&page=5&gender=Female&status=Active`;

      return request.get(url).then((res) => {
        expect(res.body.data).to.not.be.empty;
        res.body.data.forEach((data) => {
          expect(data.gender).to.eq('Female');
          expect(data.status).to.eq('Active');
        });
      });
    });
  });

  describe('PUT', () => {
    it('/users/:id', () => {
      const data = {
        status: 'Active',
        name: `Luffy - ${Math.floor(Math.random() * 9999)}`,
      };

      return request
        .put(`users/${userId}`)
        .set('Authorization', `Bearer ${TOKEN}`)
        .send(data)
        .then((res) => {
          expect(res.body.data).to.deep.include(data);
        });
    });
  });

  describe('DELETE', () => {
    it('/users/:id', () => {
      return request
        .delete(`users/${userId}`)
        .set('Authorization', `Bearer ${TOKEN}`)
        .then((res) => {
          expect(res.body.data).to.be.eq(null);
        });
    });
  });
});
