import mongoose, { Schema } from 'mongoose';

const heroSchema = new Schema (
    {
        heroId: { type: Number, required: true },
        heroName: { type: String, required: true},
        powerstats: {
          intelligence: { type: Number, required: true },
          strength: { type: Number, required: true },
          speed: { type: Number, required: true },
          durability: { type: Number, required: true },
          power: { type: Number, required: true },
          combat: { type: Number, required: true }
        },
        biography: {
          full_name: { type: String, required: true },
          alter_egos: { type: String, required: true },
          aliases: [{ type: String, required: true }],
          place_of_birth: { type: String, required: true },
          first_appearance: { type: String, required: true },
          publisher: { type: String, required: true },
          alignment: { type: String, required: true }
        },
        appearance: {
          gender: { type: String, required: true },
          race: { type: String, required: true },
          height: [{ type: String, required: true }, { type: String, required: true }],
          weight: [{ type: String, required: true }, { type: String, required: true }],
          eye_color: { type: String, required: true },
          hair_color: { type: String, required: true }
        },
        work: { occupation: { type: String, required: true },
                base: { type: String, required: true } },
        connections: {
          group_affiliation: { type: String, required: true },
          relatives: { type: String, required: true }
        },
        image: {
          url: { type: String, required: true }
        },
        example: { required: false}
    },
)

const addHeroExample =
  {
    heroName: "Baby Yoda",
    powerstats: {
      intelligence: 40,
      strength: 30,
      speed: 33,
      durability: 25,
      power: 50,
      combat: 50
    },
    biography: {
      full_name: "Baby Yoda",
      alter_egos: "No alter egos found.",
      aliases: ["The Child"],
      place_of_birth: "-",
      first_appearance: "The Mandalorian (2019)",
      publisher: "George Lucas",
      alignment: "good"
    },
    appearance: {
      gender: "Male",
      race: "Yoda's species",
      height: ["1'1", "34 cm"],
      weight: ["19 lb", "17 kg"],
      eye_color: "Brown",
      hair_color: "White"
    },
    work: { occupation: "-", "base": "-" },
    connections: {
      group_affiliation: "-",
      relatives: "-"
    },
    image: {
      url: "https://static.wikia.nocookie.net/starwars/images/4/43/TheChild-Fathead.png/revision/latest?cb=20201031231040"
    }
  }

const heroModel = mongoose.model('hero', heroSchema, 'heroes');

export const example = addHeroExample;
export const schema = heroModel.schema;
export default heroModel;

