"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = __importDefault(require("chai"));
const chai_http_1 = __importDefault(require("chai-http"));
require("mocha");
chai_1.default.use(chai_http_1.default);
const expect = chai_1.default.expect;
const should = chai_1.default.should();
const baseUrl = "/api/v1";
const server = "localhost:3000";
const invalidToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NTAwMjQ1MzgsImV4cCI6MTY1MDAyNTQzOCwic3ViIjoiMDAwZDFlMTQtNjE3ZS00MjNlLThhMWEtZjYzZDRmYTVhZjZhIn0.b0U-__cRpH8YBsAtZEtClr0fAj4t9IOwDAcI2R3j-qk';
// this variable will store the token that results from the correct login
let token = '';
describe("Test edit profile", () => {
    // before testing the route we need to login to get the token
    beforeEach((done) => {
        chai_1.default
            .request(server)
            .post(baseUrl + "/login")
            .send({
            email: "consumer@consumer.com",
            password: "Teste#",
        })
            .end((err, res) => {
            token = `Bearer ${res.body.token}`;
            res.should.have.status(200);
            done();
        });
    });
    describe('- No token', () => {
        it('Should return invalid token error', () => {
            return chai_1.default
                .request(server)
                .put(baseUrl + '/profile')
                .then(res => {
                res.should.have.status(401);
                chai_1.default.expect(res.body).to.have.property("Error");
            });
        });
    });
    describe('- Invalid token', () => {
        it('Should return invalid token error', () => {
            return chai_1.default
                .request(server)
                .put(baseUrl + '/profile')
                .set("Authorization", invalidToken)
                .then(res => {
                res.should.have.status(401);
                chai_1.default.expect(res.body).to.have.property("Error");
            });
        });
    });
    describe('- Edit user profile without body', () => {
        it('Should return incomplete body error', () => {
            return chai_1.default
                .request(server)
                .put(baseUrl + '/profile')
                .set("Authorization", token)
                .then(res => {
                res.should.have.status(500);
            });
        });
    });
    describe('- Edit user profile with a campus that doesnt exist', () => {
        it('Should return campus error', () => {
            return chai_1.default
                .request(server)
                .put(baseUrl + '/profile')
                .set("Authorization", token)
                .send({
                preferredCampus: "13be23c1-2e9b-43fc-acaa-839c6b3573b",
                preferredBar: "a91aa933-440b-4c80-beef-f4cadd1aefff",
                imgUrl: "teste123"
            })
                .then(res => {
                res.should.have.status(500);
            });
        });
    });
    describe('- Edit user profile with a bar that doesnt exist', () => {
        it('Should return bar error', () => {
            return chai_1.default
                .request(server)
                .put(baseUrl + '/profile')
                .set("Authorization", token)
                .send({
                preferredCampus: "13be23c1-2e9b-43fc-acaa-839c6b3573bc",
                preferredBar: "a91aa933-440b-4c80-beef-f4cadd1aeff",
                imgUrl: "teste123"
            })
                .then(res => {
                res.should.have.status(500);
            });
        });
    });
    describe('- Edit user profile with a bar that doesnt belongs to the campus', () => {
        it('Should return bar campus error', () => {
            return chai_1.default
                .request(server)
                .put(baseUrl + '/profile')
                .set("Authorization", token)
                .send({
                preferredCampus: "13be23c1-2e9b-43fc-acaa-839c6b3573bc",
                preferredBar: "ec3b5a78-16c4-4cfc-b7b5-efc64ddc0c70",
                imgUrl: "teste123"
            })
                .then(res => {
                res.should.have.status(500);
            });
        });
    });
    describe('- Edit user profile correctly', () => {
        it('Should return the user profile edited', () => {
            return chai_1.default
                .request(server)
                .put(baseUrl + '/profile')
                .set("Authorization", token)
                .send({
                preferredCampus: "13be23c1-2e9b-43fc-acaa-839c6b3573bc",
                preferredBar: "a91aa933-440b-4c80-beef-f4cadd1aefff",
                imgUrl: "teste"
            })
                .then(res => {
                res.should.have.status(200);
                // verificar se é um object
                chai_1.default.expect(res.body).to.be.an("object");
                chai_1.default.expect(res.body).to.have.property("preferredcampus");
                chai_1.default.expect(res.body).to.have.property("preferredbar");
                chai_1.default.expect(res.body).to.have.property("imgurl");
                chai_1.default.expect(res.body['preferredcampus']).to.be.a("string");
                chai_1.default.expect(res.body['preferredbar']).to.be.a("string");
                if (res.body['imgurl'] != null) {
                    chai_1.default.expect(res.body['imgurl']).to.be.a("string");
                }
            });
        });
    });
});
//# sourceMappingURL=editProfileTest.js.map