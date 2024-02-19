/* eslint-disable no-undef */
/**
 * eslint-disable no-undef
 *
 * @format
 */

/**
 * eslint-disable no-undef
 *
 * @format
 */

/**
 * eslint-disable no-undef
 *
 * @format
 */

const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index");

chai.use(chaiHttp);

const user = {
  name: "Peter Borrow",
  username: "peter_123",
  email: "peter_123@test.com",
  password: "123",
};
const user_login = {
  userInfo: "peter_123@test.com",
  password: "123",
};
let userObj = "";
let token = "";

describe("User APIs testing", () => {
  // beforeEach(async () => {
  //   await User.deleteMany({});
  // });

  // afterEach(async () => {
  //   await User.deleteMany({});
  // });

  /**
   * Register
   */
  it("/register", (done) => {
    chai
      .request(server)
      .post("/api/user/register")
      .send(user)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.have.an("object");
        res.body.user.should.have.an("object");
        res.body.should.have.property("token");
        res.body.user.should.have.property("_id");
        res.body.user.should.have.property("name");
        res.body.user.should.have.property("username");
        res.body.user.should.have.property("password");
        done();
      });
  });

  /**
   * Login
   */
  it("/login", (done) => {
    chai
      .request(server)
      .post("/api/user/login")
      .send(user_login)
      .end((err, res) => {
        userObj = res.body.user;
        token = res.body.token;
        res.should.have.status(200);
        res.body.should.have.an("object");
        res.body.user.should.have.an("object");
        res.body.should.have.property("token");
        res.body.user.should.have.property("_id");
        res.body.user.should.have.property("name");
        res.body.user.should.have.property("username");
        res.body.user.should.have.property("password");
        done();
      });
  });

  /**
   * Get user profile
   */
  it("/:id", (done) => {
    chai
      .request(server)
      .get(`/api/user/${userObj._id}`)
      .set("x-access-token", token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property("_id");
        res.body.should.have.property("name");
        res.body.should.have.property("username");
        res.body.should.have.property("email");
        res.body.should.not.have.property("password");
        done();
      });
  });

  /**
   * Update user name
   */
  it("/:id", (done) => {
    chai
      .request(server)
      .put(`/api/user/update/profile/name`)
      .set("x-access-token", token)
      .send({ name: "JHON KANE" })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.user.should.have.property("_id");
        res.body.user.should.have.property("name");
        res.body.user.should.have.property("username");
        res.body.user.should.have.property("email");
        done();
      });
  });
});
