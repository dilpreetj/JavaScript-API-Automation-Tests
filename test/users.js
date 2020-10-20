import supertest from 'supertest';
const request = supertest('https://gorest.co.in/public-api/');

import { expect } from 'chai';

const TOKEN =
  'f23c96ab955134d34fb15a05c891320a81c0a6a309c9f481604e380d19bef872';

describe('Users', () => {
  it('GET /users', () => {
    // request.get(`users?access-token=${TOKEN}`).end((err, res) => {
    //   expect(res.body.data).to.not.be.empty;
    //   done();
    // });

    return request.get(`users?access-token=${TOKEN}`).then((res) => {
      expect(res.body.data).to.not.be.empty;
    });
  });

  it('GET /users/:id', () => {
    return request.get(`users/1?access-token=${TOKEN}`).then((res) => {
      expect(res.body.data.id).to.be.eq(1);
    });
  });

  it('GET /users with query params', () => {
    const url = `users?access-token=${TOKEN}&page=5&gender=Female&status=Active`;

    return request.get(url).then((res) => {
      expect(res.body.data).to.not.be.empty;
      res.body.data.forEach((data) => {
        expect(data.gender).to.eq('Female');
        expect(data.status).to.eq('Active');
      });
    });
  });

  it('POST /users', () => {
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
      });
  });

  it('PUT /users/:id', () => {
    const data = {
      status: 'Active',
      name: `Luffy - ${Math.floor(Math.random() * 9999)}`,
    };

    return request
      .put('users/132')
      .set('Authorization', `Bearer ${TOKEN}`)
      .send(data)
      .then((res) => {
        console.log(res.body);
        expect(res.body.data).to.deep.include(data);
      });
  });

  it('DELETE /users/:id', () => {
    return request
      .delete('users/21')
      .set('Authorization', `Bearer ${TOKEN}`)
      .then((res) => {
        console.log(res.body);
        expect(res.body.data).to.be.eq(null);
      });
  });
});
