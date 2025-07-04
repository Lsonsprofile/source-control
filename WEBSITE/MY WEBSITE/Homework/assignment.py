
# This script checks if the 'inflect' library is installed and prints a message inflict is working
import inflect
p=inflect.engine()
print ("inflect is working")
#this is a input script that collects words used to generate a story
person = "Emma"
day = "Thursday"
transport = "aeroplane"
time = "5am"
sound = "gunshots"
verb = "screamed"
noun = "security officer"
plural_noun = "passengers"

"""Emma booked a ride on Thursday, hoping to get an aeroplane leaving at around 5am in the morning. 
As emma arrived at the airport, emma heard gunshots in the distance. 
Startled, emma screamed and looked for a security officer. 
The passengers around began to panic. 
Within minutes, airport staff secured the area and confirmed it was a false alarm. 
Relieved but shaken, emma waited patiently for the next available flight."""
story=

mad_libs_story = f"""
{person} booked a flight on {day}, hoping to get {transport_with_article} leaving at around {time} in the morning. 
As {person.lower()} arrived at the airport, {person.lower()} heard {sound_with_article} in the distance. 
Startled, {person.lower()} {verb} and looked for {noun_with_article}. 
The {plural_noun} around began to panic. 
Within minutes, airport staff secured the area and confirmed it was {p.a('false alarm')}. 
Relieved but shaken, {person.lower()} waited patiently for the next available flight.
"""

print(story)