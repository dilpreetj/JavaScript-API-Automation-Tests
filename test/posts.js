require('dotenv').config();
const faker = require('faker');

import request from '../config/supertest';
import { expect } from 'chai';

const {
  createRandomUser,
  createRandomUserWithFaker,
} = require('../helper/user');

const TOKEN = process.env.USER_TOKEN;

describe.only('Posts', () => {
  let user, postId;

  before(async () => {
    // user = await createRandomUser();
    user = await createRandomUserWithFaker();
  });

  after(() => {
    // clean up
    // delete a user
  });

  describe('POST', () => {
    it('/posts', async () => {
      const data = {
        user_id: user.id,
        title: faker.lorem.sentence(),
        body: faker.lorem.paragraphs(),
      };

      const res = await request
        .post('posts')
        .set('Authorization', `Bearer ${TOKEN}`)
        .send(data);

      expect(res.body.data).to.deep.include(data);
      postId = res.body.data.id;
    });

    // dependent on previous test
    it('posts/:id', async () => {
      if (postId) {
        await request
          .get(`posts/${postId}`)
          .set('Authorization', `Bearer ${TOKEN}`)
          .expect(200);
      } else {
        throw new Error(`postId is invalid - ${postId}`);
      }
    });
  });

  describe('Negative Tests', () => {
    it('422 Data validation failed', async () => {
      const data = {
        user_id: user.id,
        title: '',
        body: faker.lorem.paragraphs(),
      };

      const res = await request
        .post(`posts`)
        .set('Authorization', `Bearer ${TOKEN}`)
        .send(data);

      expect(res.body.code).to.eq(422);
      expect(res.body.data[0].message).to.eq("can't be blank");
    });

    it('401 Authentication failed', async () => {
      const data = {
        user_id: user.id,
        title: faker.lorem.sentence(),
        body: faker.lorem.paragraphs(),
      };

      const res = await request.post(`posts`).send(data);

      expect(res.body.code).to.eq(401);
      expect(res.body.data.message).to.eq('Authentication failed');
    });
  });
});
