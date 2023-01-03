import chai from 'chai';
import chaiHttp from 'chai-http';
import 'mocha';

chai.use(chaiHttp);
const expect = chai.expect;
const should = chai.should();
const baseUrl = "/api/v1/consumer"
const server = "localhost:3000"
const invalidToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NTAwMjQ1MzgsImV4cCI6MTY1MDAyNTQzOCwic3ViIjoiMDAwZDFlMTQtNjE3ZS00MjNlLThhMWEtZjYzZDRmYTVhZjZhIn0.b0U-__cRpH8YBsAtZEtClr0fAj4t9IOwDAcI2R3j-qk'

// this variable will store the token that results from the correct login
let token=''

describe("Test see trades from consumer", () => {
    // before testing the route we need to login to get the token
    beforeEach((done) => {
      chai
        .request(server)
        .post("/api/v1/login")
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
        return chai
        .request(server)
        .get(baseUrl+'/trades')
        .then(res => {
          res.should.have.status(401)
          chai.expect(res.body).to.have.property("Error")
        })
      })
    })
  
    describe('- Invalid token', () => {
      it('Should return invalid token error', () => {
        return chai
        .request(server)
        .get(baseUrl+'/trades')
        .set("Authorization", invalidToken)
        .then(res => {
          res.should.have.status(401)
            chai.expect(res.body).to.have.property("Error")
        })
      })
    })

    describe('- see trades from a consumer', () => {
        it('Should return tardes from a consumer', () => {
          return chai
          .request(server)
          .get(baseUrl+'/trades')
          .set("Authorization", token)
          .then(res => {
            res.should.have.status(200)
            // verificar se é um object

            chai.expect(res.body).to.be.an("array")

            chai.expect(res.body[0]).to.be.an("object")
    
            chai.expect(res.body[0]).to.have.property("ticketid")
            chai.expect(res.body[0]).to.have.property("isconfirmed")
            chai.expect(res.body[0]).to.have.property("proposaldate")
            chai.expect(res.body[0]).to.have.property("confirmationdate")
            chai.expect(res.body[0]).to.have.property("receptordecision")
            chai.expect(res.body[0]).to.have.property("isdeleted")



            chai.expect(res.body[0]['ticketid']).to.be.a("string")
            chai.expect(res.body[0]['isconfirmed']).to.be.a("boolean")
            chai.expect(res.body[0]['proposaldate']).to.be.a("string")
            chai.expect(res.body[0]['confirmationdate']).to.be.a("string")
            chai.expect(res.body[0]['receptordecision']).to.be.a("number")
            chai.expect(res.body[0]['isdeleted']).to.be.a("boolean")

  
          })
        })
    })
})