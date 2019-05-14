# TGVmax
*If you’re 16-27 years old and travel at least twice a month with TGV and Intercités, TGVmax is for you. For just €79 per month, you can travel as often as you like.*  

The official definition above used to be true, it was awesome. However it becomes harder and harder to find a TGVmax seat available, especially if you want to travel friday or sunday evening.

The process of booking a TGVmax seat now looks like that : 
- connect to oui.sncf at midnight exactly 30 days before the date you want to travel 🕛  
- if you're lucky, there is a seat available : book it immediatly and you're done ✅  
- Otherwise, a seat may become available at random time during the next 30 days. So you need to connect as often as you can to oui.sncf and hope to find an available seat.

This process is boring and time consuming. There must be a way to automate step 3 with a bot !

## How to automatically find and book a TGVmax seat ?

### solution 1 : using open data
There is an online dataset that is supposed to tell if there a TGVmax seat available for a specific train.

https://www.data.gouv.fr/en/datasets/disponibilite-a-30-jours-de-places-tgvmax-ouvertes-a-la-reservation/

https://ressources.data.sncf.com/explore/dataset/tgvmax/information/?sort=date

However, this dataset is only updated once a day, around 2PM. That's an issue, because if a TGVmax seat is released at 3PM, the bot will not be able to know it before the next day at 2PM. At this time, it is certain that the seat will not anymore be available.

So far, this option looks like a dead-end.


### solution 2 : web scraping
This solution is still to be explored. oui.sncf may have an anti-bot system that would make it complicated.
