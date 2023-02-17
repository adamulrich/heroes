import requests
import json


def create_json():

    heroes = []

    # for each id
    for i in range(1,731):
        # get json from request at https://www.superheroapi.com/api.php/10161052329136209/<i>
        url = f'https://www.superheroapi.com/api.php/10161052329136209/{i}'
        r = requests.get(url)

        hero = {}
        
        # remove response:success
        hero = json.loads(r.text)
        del hero['response']

        heroes.append(hero)
        print(f'{i}: {hero["name"]}')
    # save the json to a file
    with open("heroes.json", "w") as outfile:
        outfile.write(json.dumps(heroes))


def update_values():

    with open("json/heroes.json", "r") as jsonfile:
        heroes = json.load(jsonfile)


    # for each id
    for hero in heroes:
        hero['id'] = int(hero['id'])
        if hero['powerstats']['intelligence'] != 'null':
            hero['powerstats']['intelligence'] = int(hero['powerstats']['intelligence'])
        if hero['powerstats']['strength'] != 'null':            
            hero['powerstats']['strength'] = int(hero['powerstats']['strength'])
        if hero['powerstats']['speed'] != 'null':
            hero['powerstats']['speed'] = int(hero['powerstats']['speed'])
        if hero['powerstats']['durability'] != 'null':
            hero['powerstats']['durability'] = int(hero['powerstats']['durability'])
        if hero['powerstats']['power'] != 'null':
            hero['powerstats']['power'] = int(hero['powerstats']['power'])
        if hero['powerstats']['combat'] != 'null':
            hero['powerstats']['combat'] = int(hero['powerstats']['combat'])

    # save the json to a file
    with open("json/heroes_fixed.json", "w") as outfile:
        outfile.write(json.dumps(heroes))


update_values()