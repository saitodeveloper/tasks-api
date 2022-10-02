import chai from 'chai';
import request from 'supertest';
import app from '../../../../app';
import { BoardRepository } from '../../../../routes/board/repository';
import { UserRepository } from '../../../../routes/user/repository';
import { DatabaseHelper } from '../../../../db';
import { BoardFixture, TaskFixture } from './boards.fixtures';
import { UserLoginFixture, UserRegisterFixture } from '../users/users.fixtures';

chai.should();

describe('Boards Services', () => {
    const boardFixture = new BoardFixture();
    const taskFixture = new TaskFixture();
    
    let tokenUser1 = ''
    let tokenUser2 = ''

    before(async () => {
        const fixtureUserLogin = new UserLoginFixture();
        const fixtureUserRegister = new UserRegisterFixture();

        const user = fixtureUserRegister.validObject();
        const userLogin = fixtureUserLogin.validObject();

        await request(app)
            .post('/v1/user')
            .send(user)
            .set('Accept', 'application/json');
        
        user.username = 'jamespotter';
        await request(app)
            .post('/v1/user')
            .send(user)
            .set('Accept', 'application/json');

        const loginUser1Response = await request(app)
            .post('/v1/user/login')
            .send(userLogin)
            .set('Accept', 'application/json');
        
        tokenUser1 = loginUser1Response.body.token;

        userLogin.username = 'jamespotter'
        const loginUser2Response = await request(app)
            .post('/v1/user/login')
            .send(userLogin)
            .set('Accept', 'application/json');

        tokenUser2 = loginUser2Response.body.token;
    })

    after(async () => {
        const db = await DatabaseHelper.requestConnection();
        await db.collection(UserRepository.collection).deleteMany({});
    })

    afterEach(async () => {
        const db = await DatabaseHelper.requestConnection();
        await db.collection(BoardRepository.collection).deleteMany({});
    })

    describe('GET /v1/board', async () => {
        it('should get boards by own user', async () => {
            // Arrange
            const board = boardFixture.validObject();
            await request(app)
                .post('/v1/board')
                .send(board)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${tokenUser1}`);

            // Act
            const response = await request(app)
                .get('/v1/board')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${tokenUser1}`);
            
            // Assert
            response.status.should.equal(200)
            response.body.length.should.equal(1)
        })

        it('should get boards by other user then the owner', async () => {
            // Arrange
            const board = boardFixture.validObject();
            const boardResponse = await request(app)
                .post('/v1/board')
                .send(board)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${tokenUser1}`);
            
            await request(app)
                .patch(`/v1/board/${boardResponse.body.id}/user/jamespotter`)
                .send(board)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${tokenUser1}`);

            // Act
            const response = await request(app)
                .get('/v1/board')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${tokenUser2}`);
            
            // Assert
            response.status.should.equal(200)
            response.body.length.should.equal(1)
        })
    })

    describe('POST /v1/board', async () => {

        it('should create board', async () => {
            // Arrange
            const board = boardFixture.validObject();

            // Act
            const response = await request(app)
                .post('/v1/board')
                .send(board)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${tokenUser1}`);
            
            // Assert
            response.status.should.equal(201)
            response.body.should.have.property('id')
        })

        it('should raise error for missing authorization', async () => {
            // Arrange
            const board = boardFixture.validObject();

            // Act
            const response = await request(app)
                .post('/v1/board')
                .send(board)
                .set('Accept', 'application/json');
            
            // Assert
            response.status.should.equal(401);
        })

        boardFixture.postMandatoryFields().forEach(field => {
            it(`should raise error for missing "${field}" field`, async () => {
                // Arrange
                const board = boardFixture.validObject();
                delete board[`${field}`];

                // Act
                const response = await request(app)
                    .post('/v1/board')
                    .send(board)
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${tokenUser1}`);
                
                // Assert
                response.status.should.equal(400);
            })
        })
    })

    describe('POST /v1/board/:boardId/tasks', () => {

        it('should create a task', async () => {
            // Arrange
            const board = boardFixture.validObject();
            const task = taskFixture.validObject();
            const boardResponse = await request(app)
                .post('/v1/board')
                .send(board)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${tokenUser1}`);
            
            // Act
            const response = await request(app)
                .post(`/v1/board/${boardResponse.body.id}/task`)
                .send(task)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${tokenUser1}`);
            
            // Assert
            response.status.should.equal(200);
            response.body.should.have.property('id');
            response.body.tasks.length.should.equal(1);
            response.body.tasks[0].title.should.equal(task.title);
            response.body.tasks[0].description.should.equal(task.description);
            response.body.tasks[0].status.should.equal(task.status);
        })

        taskFixture.postMandatoryFields().forEach(field => {

            it(`should raise error for missing "${field}" field`, async () => {
                // Arrange
                const board = boardFixture.validObject();
                const task = taskFixture.validObject();
                const boardResponse = await request(app)
                    .post('/v1/boards')
                    .send(board)
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${tokenUser1}`);
                
                // Act
                delete task[`${field}`];
                const response = await request(app)
                    .post(`/v1/board/${boardResponse.body.id}/task`)
                    .send(task)
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${tokenUser1}`);
                
                // Assert
                response.status.should.equal(400);
            })
        })
    })

    describe('PATCH /v1/board/:boardId/users/:username', async () => {
        it('should add user to board', async () => {
            // Arrange
            const board = boardFixture.validObject();
            const boardResponse = await request(app)
                .post('/v1/board')
                .send(board)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${tokenUser1}`);

            // Act
            const response = await request(app)
                .patch(`/v1/board/${boardResponse.body.id}/user/jamespotter`)
                .send(board)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${tokenUser1}`);
            
            // Assert
            response.status.should.equal(200)
            response.body.users.length.should.equal(2)
        })

        it('should raise error for not owned board', async () => {
            // Act
            const response = await request(app)
                .patch(`/v1/board/6338d6a067fb39dc713f9b1c/user/jamespotter`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${tokenUser1}`);
            
            // Assert
            response.status.should.equal(403)
        })
    })

    describe('PATCH /v1/board/:boardId/tasks/:index', () => {

        it('should create a task', async () => {
            // Arrange
            const board = boardFixture.validObject();
            const task = taskFixture.validObject();
            const boardResponse = await request(app)
                .post('/v1/board')
                .send(board)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${tokenUser1}`);
            
            await request(app)
                .post(`/v1/board/${boardResponse.body.id}/task`)
                .send(task)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${tokenUser1}`);
            
            // Act
            task.status = 'In Progress'
            const response = await request(app)
                .patch(`/v1/board/${boardResponse.body.id}/task/0`)
                .send(task)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${tokenUser1}`);
            
            // Assert
            response.status.should.equal(200);
            response.body.should.have.property('id');
            response.body.tasks.length.should.equal(1);
            response.body.tasks[0].title.should.equal(task.title);
            response.body.tasks[0].description.should.equal(task.description);
            response.body.tasks[0].status.should.equal(task.status);
        })

        it('should error user change task from other user', async () => {
            // Arrange
            const board = boardFixture.validObject();
            const task = taskFixture.validObject();
            const boardResponse = await request(app)
                .post('/v1/board')
                .send(board)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${tokenUser1}`);
            
            await request(app)
                .post(`/v1/board/${boardResponse.body.id}/task`)
                .send(task)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${tokenUser1}`);
            
            // Act
            task.status = 'In Progress'
            const response = await request(app)
                .patch(`/v1/board/${boardResponse.body.id}/task/0`)
                .send(task)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${tokenUser2}`);
            
            // Assert
            response.status.should.equal(404);
        })
    })
})