# TGVmax
*If you’re 16-27 years old and travel at least twice a month with TGV and Intercités, TGVmax is for you. For just €79 per month, you can travel as often as you like.*  

The official definition above used to be true, it was awesome. However it becomes harder and harder to find a TGVmax seat available, especially for people who want to travel friday or sunday evening.

The process of booking a TGVmax seat now looks like that : 
- Connect to oui.sncf at midnight exactly 30 days before the date you want to travel 🕛  
- If you're lucky, there is a seat available : book it immediatly and you're done ✅  
- Otherwise, a seat may become available at random time during the next 30 days. So you need to connect as often as you can to oui.sncf and hope to find an available seat.

This process is boring and time consuming. There must be a way to automate step 3 with a bot !

## How to automatically find and book a TGVmax seat ?

### solution 1 : using open data
There is an online dataset that is supposed to tell if there is a TGVmax seat available for a specific train.

https://www.data.gouv.fr/en/datasets/disponibilite-a-30-jours-de-places-tgvmax-ouvertes-a-la-reservation/

https://ressources.data.sncf.com/explore/dataset/tgvmax/information/?sort=date

However, this dataset is only updated once a day, around 2PM. That's an issue, because if a TGVmax seat is released at 3PM, the bot will not be able to know it before the next day at 2PM. At this time, it is certain that the seat will not anymore be available.

So far, this option looks like a dead-end.

### solution 2 : web scraping
Another solution is to build a web scraper that will periodically go to oui.sncf, fill the form and extract TGVmax availabilities. This project is an attempt to do that.

## How to use this project ?

### Install locally
1/ Install Python (version >= 3.6.5)
2/ Create a python virtual environment
```
python3 -m venv env
```
3/ activate the virtual environment
```
source env/bin/activate
```
4/ Install dependencies using pip3 :
```
pip3 install -r requirements.txt
```

### Launch the app
First, you have to edit the `app.py` file with the travel you want the bot to look for.
If you want to activate the notification feature, you also have to create the two env variables described in `config.py`.
When this is done, you can run the app with the command :
```
python3 app.py
```
### Launch tests
unit tests :
```
python3 -m unittest
```

linter :
```
find src -iname "*.py" | xargs pylint
```
