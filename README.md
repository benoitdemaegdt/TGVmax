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
Another solution is to build a web scraper that will periodically go to oui.sncf, fill the form and extract TGVmax availabilities.

This solution was partly implemented in this project. You can find the code [here](https://github.com/benoitdemaegdt/TGVmax/releases/tag/0.1.0).

However, this is not very convenient and raises quite a lot of problems :
- difficult to maintain (if one id changes, it doesn't work anymore)
- it is extremely slow (oui.sncf uses a huge amount of scripts which slow down selenium)
- it isn't robust (it can easily fail for quite a lot of different reasons)

This solution could work better with some efforts put on error handling. However solution 3 looks much simpler and more robust.

### solution 3 : reverse engineering oui.sncf
When a user clicks on "find" after filling a travel form, oui.sncf fetches the needed data from its servers using API calls.
Everyone can see and analyze those API calls using the network tab of a browser console.

Once the interesting API calls are identified, another program can run the exact same queries and fetch the data in order to find available TGVmax seats.

So which API endpoints should be called ?

#### Option 1 : the calendar endpoint

This endpoint is used to fetch the data needed when displaying the calendar with the lowest price per day between two dates.

Example : get the lowest price per day for trains from Paris to Marseille between 19/07/2019 and 21/07/2019
```
GET https://www.oui.sncf/apim/calendar/train/v4/FRPAR/FRMRS/2019-07-19/2019-07-21/12-HAPPY_CARD/2/fr?extendedToLocality=true&additionalFields=hours&currency=EUR
```

This request returns :
```json
[
  {
    "date": "2019-07-19",
    "price": 7200,
    "hours": [ "06:12" ],
    "convertedPrice": 7200
  },
  {
    "date": "2019-07-20",
    "price": 0,
    "hours": [ "18:37", "19:37", "20:37" ],
    "convertedPrice": 0
  },
  {
    "date": "2019-07-21",
    "price": 0,
    "hours": [ "08:37", "10:37", "15:07", "18:19", "18:37", "19:37" ],
    "convertedPrice": 0
  }
]
```
From this response, we know that :
- there is no TGVmax seat available on 2019-07-19 (lowest price is 72€00)
- there are 3 TGVmax seats available on 2019-07-20 (trains leaving Paris at 18:37 ; 19:37 and 20:37)
- there are 6 TGVmax seats available on 2019-07-21 (trains leaving Paris at 08:37 ; 10:37 ; 15:07 ; ...)

This is awesome ... Except that for some reasons, this endpoint does not return accurate data. This is also an issue on the oui.sncf application. Sometime the calendar displays 0€00 for a day, but in fact there is no TGVmax seat that can be booked for this day.

#### Option 2 : the travel endpoint

This endpoint is used to fetch the data needed when displaying the price of each train.

Example : get the price of trains traveling from Paris to Marseille on the 23/07/2019.

```
POST https://www.oui.sncf/proposition/rest/travels/outward/train
with body :
{
  "wish": {
    "mainJourney": {
      "origin": {
        "code": "FRPAR",
      },
      "destination": {
        "code": "FRMRS",
      },
    },
    "schedule": {
      "outward": "2019-07-23T06:00:00",
    },
    "travelClass": "SECOND",
    "passengers": [
      {
        "typology": "YOUNG",
        "discountCard": {
          "code": "HAPPY_CARD",
          "number": "HC000036781",
          "dateOfBirth": "1995-08-03"
        },
      }
    ],
    "salesMarket": "fr-FR",
  }
}
```

This request returns a huge amount of useless data. After removing a lot of fields, it looks like :
```json
{
  "travelProposals": [
    {
      "departureDate": "2019-07-23T06:07:00",
      "arrivalDate": "2019-07-23T09:42:00",
      "minPrice": 69,
    },
    {
      "departureDate": "2019-07-23T06:12:00",
      "arrivalDate": "2019-07-23T09:26:00",
      "minPrice": 45,
    },
    {
      "departureDate": "2019-07-23T08:37:00",
      "arrivalDate": "2019-07-23T11:59:00",
      "minPrice": 0,
    }
  ]
}
```

This is accurate and usefull data. However the API only returns 5 trains by 5 trains. So we need to call the API several times to get all the data.

Even if oui.sncf calls it a REST API, the pagination design is far from being RESTful. In order to get the next trains, one should call this URL with this body :

```
POST https://www.oui.sncf/proposition/rest/travels/outward/train/next
with body :
{
  "context": {
      "paginationContext": {
          "travelSchedule": {
              "departureDate": "2019-07-23T08:37:00",
          }
      }
  },
  "wish": {
    "mainJourney": {
      "origin": {
        "code": "FRPAR",
      },
      "destination": {
        "code": "FRMRS",
      },
    },
    "schedule": {
      "outward": "2019-07-23T06:00:00",
    },
    "travelClass": "SECOND",
    "passengers": [
      {
        "typology": "YOUNG",
        "discountCard": {
          "code": "HAPPY_CARD",
          "number": "HC000036781",
          "dateOfBirth": "1995-08-03"
        },
      }
    ],
    "salesMarket": "fr-FR",
  }
}
```

It returns the same data format than before.

oui.sncf uses a custom "code" to reference a train station.
These codes can be found using following URL :

```
GET https://www.oui.sncf/booking/autocomplete-d2d?uc=fr-FR&searchField=origin&searchTerm=<YOUR_TRAIN_STATION>
```

exemple :
```
GET https://www.oui.sncf/booking/autocomplete-d2d?uc=fr-FR&searchField=origin&searchTerm=lyon
```

## How to use this project ?

### Prerequisites

1/ Install [NodeJS (version >= 10.16.0)]((https://nodejs.org/))

2/ Install database [PostgreSQL](https://www.postgresql.org/)

### Start applicaion

1/ Launch your local PostgreSQL server.

2/ Install NodeJS dependancies
```bash
npm install
```

3/ Open src/index.ts and enter your travel details
- origin train station code
- destination train station code
- earliest departure time
- latest departure time
- tgvmax number

4/ Run
```bash
npm start
```

It should print the TGVmax availability with the hours (if applicable).