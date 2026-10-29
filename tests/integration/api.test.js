const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../src/app");
const User = require("../../src/models/User");

describe("API Integration Tests", () => {
  let userToken;
  const testUser = {
    name: "Juan",
    email: "juan@test.com",
    password: "12345678",
    role: "user",
  };

  beforeAll(async () => await mongoose.connect(process.env.MONGO_URI));
  afterAll(async () => {
    await User.deleteMany();
    await mongoose.connection.close();
  });

  // 1
  test("POST /api/v1/auth/register - Crea usuario y retorna Token", async () => {
    const res = await request(app).post("/api/v1/auth/register").send(testUser);
    expect(res.statusCode).toBe(201);
  });

  // 2
  test("POST /api/v1/auth/login - Inicia sesión exitosamente", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: testUser.email, password: testUser.password });
    expect(res.statusCode).toBe(200);
    userToken = res.body.token;
  });

  // 3
  test("GET /api/v1/beers - Deniega acceso sin Token (401)", async () => {
    const res = await request(app).get("/api/v1/beers");
    expect(res.statusCode).toBe(401);
  });

  // 4
  test("GET /api/v1/users - Deniega acceso a usuarios sin rol Admin (403)", async () => {
    const res = await request(app)
      .get("/api/v1/users")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(403);
  });

  // 5
  test("POST /api/v1/users/profile-picture - Falla (400/500) si no se envía archivo", async () => {
    const res = await request(app)
      .post("/api/v1/users/profile-picture")
      .set("Authorization", `Bearer ${userToken}`)
      .field("triggerMultipart", "true");

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toMatch(/Debe subir una imagen/i);
  });
});
