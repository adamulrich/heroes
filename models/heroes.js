const mongoose = require('mongoose');
const heroSchema = new mongoose.Schema (
    {
        heroId: { type: Number, required: true },
        heroName: { type: String, required: true },
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
        }
      },
        { retainKeyOrder: true })


module.exports = mongoose.model('Heroes',heroSchema, 'heroes')