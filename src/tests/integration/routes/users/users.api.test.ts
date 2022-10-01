import chai from 'chai';
import request from 'supertest';
import app from '../../../../app';
import { UserRepository } from '../../../../routes/user/repository';
import { DatabaseHelper } from '../../../../db';
import { UserRegisterFixture, UserLoginFixture } from './users.fixtures';

chai.should();

describe('Users Services', () => {
    const userRegisterFixture = new UserRegisterFixture();
    const userLoginFixture = new UserLoginFixture();

    afterEach(async () => {
        const db = await DatabaseHelper.requestConnection();
        await db.collection(UserRepository.collection).deleteMany({});
    })

    describe('POST /v1/user', async () => {

        it('should create a user', async () => {
            // Arrange
            const user = userRegisterFixture.validObject();
            
            // Act
            const response = await request(app)
                .post('/v1/user')
                .send(user)
                .set('Accept', 'application/json');
            
            // Assert
            response.status.should.equal(201);
            response.body.should.have.property('id');
        })

        userRegisterFixture.madatoryFields().forEach(field => {
            it(`should raise error for missing "${field}" field`, async () => {
                // Arrange
                const user = userRegisterFixture.validObject();
                const json: any = { ...user }
                delete json[`${field}`];
                
                // Act
                const response = await request(app)
                    .post('/v1/user')
                    .send(json)
                    .set('Accept', 'application/json');
                
                response.status.should.equal(400);
            })
        })
    })

    describe('POST v1/user/login', async () => {
       
        it('should create a login', async () => {
            // Arrange
            const user = userRegisterFixture.validObject();
            const userLogin = userLoginFixture.validObject();

            await request(app)
                .post('/v1/user')
                .send(user)
                .set('Accept', 'application/json');

            // Act
            const loginCreateResponse = await request(app)
                .post('/v1/user/login')
                .send(userLogin)
                .set('Accept', 'application/json');
            
            // Assert
            loginCreateResponse.status.should.equal(200);
            loginCreateResponse.body.should.have.property('token');
        })

        userLoginFixture.madatoryFields().forEach(field => {
            it(`should raise error for missing "${field}" field`, async () => {
                // Arrange
                const user = userRegisterFixture.validObject();
                const json: any = { ...user }
                delete json[`${field}`];
                
                // Act
                const response = await request(app)
                    .post('/v1/user/login')
                    .send(json)
                    .set('Accept', 'application/json');
                
                response.status.should.equal(400);
            })
        })
    })
})