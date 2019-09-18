/**
 * this script aims at fetching as many train stations (and related codes) from oui.sncf
 */
'use strict';
const fs = require('fs');
const request = require('superagent');
const _ = require('lodash');

const URL = 'https://www.oui.sncf/booking/autocomplete-d2d?uc=fr-FR&searchField=origin&searchTerm='
const stations = require('./stations.json');

const REGIONS = [
  ' (Grand Est)',
  ' (Occitanie)',
  ' (Nouvelle-Aquitaine)',
  ' (Île-de-France)',
  ' (Auvergne-Rhône-Alpes)',
  ' (Bourgogne-Franche-Comté)',
  ' (Hauts-de-France)',
  ' (Normandie)',
  ' (Provence-Alpes-Côte d\'Azur)',
  ' (Bretagne)',
  ' (Pays de la Loire)',
  ' (Centre-Val de Loire)'
]

var delay = async(ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

(async() => {
  let cleaned = [];
  for (let station of stations) {
    await delay(100);
    let res;
    try {
      res = await request.get(`${URL}${station.name}&uc=fr-FR&fromcaptcha=1`)
    } catch(err) {
      console.log(err);
      continue;
    }

    for (let item of res.body) {
      if (item.category === 'station') {
        for (let region of REGIONS) {
          if (item.label.includes(region)) {
            item.label = item.label.replace(region, '');
            break;
          }
        }
        cleaned.push({
          name: item.label,
          code: item.id,
        });
      }
    }
  }

  cleaned = _.uniqBy(cleaned, 'code');

  let data = JSON.stringify(cleaned);
  fs.writeFileSync('codes.json', data);

})()
.catch((err) => {
  console.log(err);
})