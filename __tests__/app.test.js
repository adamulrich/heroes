
const app = require("../server").app;
const addHeroExample = require('../models/heroes').addHeroExample;

const request = require("supertest");
const exp = require("constants");

describe("Sanity test", () => {
  test("1 should equal 1", () => {
    expect(1).toBe(1);
  });
});

describe("get and put tests", function () {
    test("get all", async () => {
        const res = await request(app)
            .get("/hero-names-and-ids")
        expect(res.statusCode).toEqual(200)
        expect(res.body[0].heroName).toBeDefined()
        expect(res.body[500].heroId).toBeDefined()
    });
    test("get hero", async () => {
        const res = await request(app)
            .get("/hero/38")
        expect(res.statusCode).toEqual(200)
        expect(res.body.heroName).toEqual('Aquaman')
        expect(res.body.biography.place_of_birth).toEqual('Atlantis')
  });

    test("can't create hero, not logged in", async () => {
        const res = await request(app)
            .post("/hero")
            .send(addHeroExample)
        expect(res.statusCode).toEqual(401)
    });

    
});
