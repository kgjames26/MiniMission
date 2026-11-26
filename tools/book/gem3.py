"""Les 30 pages des héros (c{ville}{héros}) : une scène centrée (la page seule montre le milieu de l'image).
Usage : python3 tools/book/gem3.py <dossier>"""
import sys, os, json
sys.path.insert(0, os.path.dirname(__file__))
import ref
H = ("Wide children's picture-book illustration in a glossy, thick-outline cartoon style. Draw the characters of image 1 exactly like them, keeping their relative sizes. "
     "One single scene, with all the important action in the CENTRE of the picture (the sides will be cropped). ")
E = " Rich colours, detailed background, expressive faces, no text."
MON = ['herisson', 'limon', 'golem', 'chauvesouris']
CITY = ['Paris, Haussmann buildings and the Eiffel Tower in the distance', 'New York, skyscrapers and yellow taxis', 'Tokyo at night, neon lights and paper lanterns',
        'Rio de Janeiro, hot sunny day, palm trees and Sugarloaf Mountain', 'Cairo, sandy streets with the pyramids in the distance', 'London, red double-decker buses and Big Ben',
        'Venice, canals, gondolas and little stone bridges', 'Sydney, the harbour and the Opera House', 'Marrakech market full of spices and colourful carpets', 'Beijing, red roofs and the Great Wall on the mountains']
P = {'ziggy': 'on a big avenue', 'filou': 'on the rooftops', 'titan': 'at a construction site with cranes, beams and bricks'}
S = {
 'c0ziggy': "Ziggy zooms down the avenue faster than the wind, bringing back a basket of stolen croissants; he blows a little purple cloud away and the little monsters smile.",
 'c0filou': "Filou leaps between chimneys with a magic web, catching little grumpy monsters, then shares his snack with them on the roof.",
 'c0titan': "Titan, holding a steel beam on one shoulder, cuts croissants into equal pieces for a circle of little monsters who stop arguing.",
 'c1ziggy': "Little monsters peek out from under yellow taxis; Ziggy kneels gently and breathes with them, pretending to smell a flower.",
 'c1filou': "On top of a skyscraper in the wind, Filou has woven a soft web hammock and the little monsters snuggle in it, calm.",
 'c1titan': "Titan has switched off a big noisy machine and sits with the scared little monsters, talking softly to them.",
 'c2ziggy': "In a street full of lights, Ziggy runs with a line of lost little monsters following him, bringing them back one by one.",
 'c2filou': "From a rooftop, Filou throws a long web like a path down to lost little monsters so they can find their friends.",
 'c2titan': "Titan carries a little lost monster on his shoulders, found behind a pile of bricks; the little monster smiles with relief.",
 'c3ziggy': "Under a blazing sun, Ziggy hands out glasses of cool water to tired little monsters, who drink and feel better.",
 'c3filou': "On hot rooftops, Filou stretches big webs to make shade; little monsters sleep peacefully underneath, smiling.",
 'c3titan': "Titan has put down his work and raises a hand to say stop; tired little monsters lie down to rest on sacks of sand.",
 'c4ziggy': "Two little monsters who were pulling on the same ball now take turns throwing it, Ziggy cheering in a flash of speed.",
 'c4filou': "On a rooftop with a view of the pyramids, Filou has spun a big web bench and all the little monsters sit side by side.",
 'c4titan': "Titan smiles and hands a single shovel from one little monster to the next: they take turns digging and build together.",
 'c5ziggy': "In front of a red double-decker bus, Ziggy counts on his fingers with the little monsters, who climb aboard one by one.",
 'c5filou': "On London rooftops, Filou sings while the little monsters wait their turn in a line to slide down his web.",
 'c5titan': "Titan has drawn a line on the ground; the little monsters queue neatly to climb into a crane, counting bricks.",
 'c6ziggy': "By a canal, Ziggy hands a handkerchief to a crying little monster and opens his arms for a hug.",
 'c6filou': "Filou leans over a little bridge and catches a red balloon floating on the canal with his web.",
 'c6titan': "Titan sits on a pile of sand next to a sad little monster and gives it a gentle hug with his big arms.",
 'c7ziggy': "Angry red little monsters stamp their feet; Ziggy shows them how to blow hard as if into a big balloon, and they calm down.",
 'c7filou': "Filou gives a fluffy web cushion to an angry little monster who squeezes it tightly, the anger fading away.",
 'c7titan': "Titan closes his eyes and breathes slowly with the little monsters, everyone calm and peaceful.",
 'c8ziggy': "A shy little monster peeks out from under a carpet; Ziggy stops and greets it with a big smile and a wave.",
 'c8filou': "On a rooftop, Filou plays a name game with shy little monsters, throwing a web ball from one to the next.",
 'c8titan': "Titan waves hello and introduces himself; little monsters answer shyly, one after the other, smiling.",
 'c9ziggy': "Two little monsters who turned their backs on each other hug and say sorry, Ziggy helping them, happy.",
 'c9filou': "Filou has spun a web bridge between two roofs; two little monsters meet in the middle and make up.",
 'c9titan': "Titan helps two little monsters who made up build an even taller tower of bricks together.",
}
def run(out):
    os.makedirs(out, exist_ok=True); jobs = {}
    for k, sc in S.items():
        i, h = int(k[1]), k[2:]
        name = k + '-w1'
        ref.board(os.path.join(out, name + '-ref.png'), MON + [h])
        jobs[name] = {'rose': False, 'prompt': H + f"{CITY[i]}, {P[h]}. " + sc + E}
    json.dump(jobs, open(os.path.join(out, 'jobs3.json'), 'w'), ensure_ascii=False, indent=1); print(len(jobs))
if __name__ == '__main__': run(sys.argv[1])
