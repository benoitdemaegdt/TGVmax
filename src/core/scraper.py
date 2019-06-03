"""
Selenium & BeautifulSoup web scraper
"""
import re
import time
import json
from typing import List
from pathlib import Path
from datetime import date, datetime, timedelta
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

base_path = Path(__file__).parent
sncf_ids_path = (base_path / '../data/ids.json').resolve()
months_path = (base_path / '../data/months.json').resolve()

with open(sncf_ids_path) as f:
  sncf_ids: object = json.load(f)

with open(months_path) as f:
  months: object = json.load(f)

class Scraper:
  """
  Scrape oui.sncf website looking for available TGVmax seats
  """

  def __init__(self, origin: str, destination: str, departure_date: str, departure_hour: str, tgvmax_number: str, birthdate: str) -> None:
    # format validation
    self.validate_departure_date(departure_date)
    self.validate_departure_hour(departure_hour)
    self.validate_birthdate(birthdate)
    self.validate_tgvmax_number(tgvmax_number)
    # instantiate properties
    self.origin = origin
    self.destination = destination
    self.departure_date = departure_date
    self.departure_hour = departure_hour
    self.tgvmax_number = tgvmax_number
    self.birthdate = birthdate

  def scrape_tgvmax_seats(self) -> List[str]:
    """
    1. fill form on oui.sncf
    2. parse html page containing trains departure time and price
      and return the departure times of trains containing at least one tgvmax seat
    """
    travels_web_page: str = self.fill_form()
    return self.find_tgvmax_seats(travels_web_page)

  def fill_form(self) -> str:
    """
    fill form on oui.sncf
    return stringified html page containing trains departure time and price
    """
    driver: webdriver = webdriver.Firefox()
    driver.implicitly_wait(5)

    try:
      # go to oui.sncf website
      driver.get(sncf_ids['URL'])

      # fill origin and destination train stations inputs
      origin_input = driver.find_element_by_id(sncf_ids['ORIGIN_INPUT_ID'])
      origin_input.send_keys(self.origin)
      time.sleep(1)
      origin_input.send_keys(Keys.RETURN)

      destination_input = driver.find_element_by_id(sncf_ids['DESTINATION_INPUT_ID'])
      destination_input.send_keys(self.destination)
      time.sleep(1)
      destination_input.send_keys(Keys.RETURN)

      # fill departure time
      date_picker_button = driver.find_element_by_id(sncf_ids['DATE_PICKER_BUTTON_ID'])
      date_picker_button.click()
      time.sleep(1)
      departure_day_button = driver.find_element_by_id(sncf_ids['DEPARTURE_DAY_BUTTON_ID'] + self.departure_date)
      departure_day_button.click()
      time.sleep(1)
      departure_hour_select = driver.find_element_by_id(sncf_ids['DEPARTURE_HOUR_SELECTOR_ID'])
      departure_hour_select = Select(departure_hour_select)
      departure_hour_select.select_by_value(self.departure_hour)
      time.sleep(1)
      date_picker_submit_button = driver.find_element_by_id(sncf_ids['DATE_PICKER_SUBMIT_BUTTON_ID'])
      date_picker_submit_button.click()
      time.sleep(1)

      # fill passenger and TGVmax informations
      passenger_age_select = driver.find_element_by_id(sncf_ids['PASSENGER_AGE_SELECTOR_ID'])
      self._scroll_to_element(driver, passenger_age_select)
      passenger_age_select = Select(passenger_age_select)
      passenger_age_select.select_by_value(sncf_ids['PASSENGER_AGE_SELECTOR_VALUE_12_25' if self.get_age(self.birthdate) < 26
                                                    else 'PASSENGER_AGE_SELECTOR_VALUE_26_59'])

      passenger_discount_card_select = driver.find_element_by_id(sncf_ids['PASSENGER_DISCOUNT_CARD_SELECTOR_ID'])
      passenger_discount_card_select = Select(passenger_discount_card_select)
      passenger_discount_card_select.select_by_value(sncf_ids['PASSENGER_DISCOUNT_CARD_SELECTOR_VALUE'])

      passenger_discount_input = driver.find_element_by_id(sncf_ids['PASSENGER_DISCOUNT_INPUT_ID'])
      passenger_discount_input.send_keys(self.tgvmax_number)

      passenger_birthday_input = driver.find_element_by_name(sncf_ids['PASSENGER_BIRTHDAY_INPUT_NAME'])
      passenger_birthday_input.send_keys(self.birthdate[:2])

      passenger_birthmonth_input = driver.find_element_by_name(sncf_ids['PASSENGER_BIRTHMONTH_INPUT_NAME'])
      passenger_birthmonth_input.send_keys(self.birthdate[3:5])

      passenger_birthyear_input = driver.find_element_by_name(sncf_ids['PASSENGER_BIRTHYEAR_INPUT_NAME'])
      passenger_birthyear_input.send_keys(self.birthdate[6:])

      # submit form
      submit_button = driver.find_element_by_id(sncf_ids['SUBMIT_BUTTON_ID'])
      self._scroll_to_element(driver, submit_button)
      submit_button.click()
      time.sleep(1)

      # wait for the result page to load
      try:
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CLASS_NAME, sncf_ids['SEARCH_CONTAINER_CLASS_NAME'])))
        result_page = driver.page_source
        driver.close()
        return result_page
      # if the page does not load, there is a probably an input mistake
      except TimeoutException:
        if driver.current_url == sncf_ids['URL']:
          error_page = driver.page_source
          self.find_form_error(error_page)
        raise
    except:
      driver.close()
      raise

  def find_tgvmax_seats(self, html_page: str) -> List[str]:
    """
    parse html page containing trains departure time and price
    return the departure times of trains containing at least one tgvmax seat
    """
    soup = BeautifulSoup(html_page, 'html.parser')

    # Check warnings
    warning = soup.find('div', {'class': sncf_ids['WARNING_MESSAGE_CLASS']})
    if warning and re.match(r'Aucun TGVmax disponible', warning.find('span', recursive=False).text):
      return []

    if warning and re.match(r'Il y a comme un hic avec votre abonnement TGVmax', warning.find('span', recursive=False).text):
      raise ValueError(f'Numero de TGVmax ({self.tgvmax_number}) et date de naissance ({self.birthdate}) incompatibles.')

    # find TGVmax seats
    tgvmax_availabilities: List[str] = []
    day_results = soup.find_all('div', {'class': sncf_ids['SEARCH_TRAVEL_RESULTS_CLASS']})
    if day_results == []:
      raise Exception(f'Aucun train entre {self.origin} et {self.destination} le {self.departure_date}.')
    for day_result in day_results:
      # get the train departure time
      hour = self.convert_hour(day_result.find('span', {'class': sncf_ids['SR_ONLY_CLASS']}).text)
      # get all prices for that train (prem's, tgvmax, 2nd class, 1st class)
      for price in day_result.find_all('span', {'class': sncf_ids['PRICE_CLASS']}):
        if price.text[0:4] == "0,00":
          tgvmax_availabilities.append(hour)
          break
    return tgvmax_availabilities

  @staticmethod
  def find_form_error(html_page: str) -> List[str]:
    """
    parse html page containing sncf validation error(s)
    return a list of validation errors
    """
    soup = BeautifulSoup(html_page, 'html.parser')
    error_list = soup.find('div', {'class': sncf_ids['ERROR_MESSAGE_CLASS']}).find('ul', recursive=False)
    form_errors: List[str] = []
    for err in error_list.find_all('li'):
      form_errors.append(err.text)

    form_errors_text: str = '; '.join(form_errors)
    raise ValueError(f'Les erreurs suivantes ont été détectées lors de la recherche de votre TGVmax {form_errors_text}')

  @staticmethod
  def _scroll_to_element(driver, element) -> None:
    """
    scroll to center the given element
    """
    viewport_height = 'var viewPortHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);'
    element_top = 'var elementTop = arguments[0].getBoundingClientRect().top;'
    scroll_script = 'window.scrollBy(0, elementTop-(viewPortHeight/2));'
    driver.execute_script(f'{viewport_height}{element_top}{scroll_script}', element)
    time.sleep(1)

  @staticmethod
  def validate_departure_date(departure_date: str) -> None:
    """
    validate departure_date format and logic
    """
    # validate format
    try:
      datetime.strptime(departure_date, '%d-%m-%Y')
    except ValueError:
      raise ValueError(f'Date de départ ({departure_date}) invalide. Merci de respecter le format jj-mm-aaaa')
    # validate logic : today <= departure_date <= today + 30 days
    today = date.today()
    max_date = today + timedelta(days=30)
    is_valid = today <= datetime.strptime(departure_date, '%d-%m-%Y').date() <= max_date
    if not is_valid:
      str_today: str = datetime.strftime(today, '%d-%m-%Y')
      str_max_date: str = datetime.strftime(max_date, '%d-%m-%Y')
      raise ValueError(f'Date de départ ({departure_date}) invalide. ' +
                       f'Merci d\'indiquer une date comprise entre {str_today} et {str_max_date}')

  @staticmethod
  def validate_departure_hour(departure_hour: str):
    """
    validate departure_hour format
    """
    try:
      hour: int = int(departure_hour)
      if not 0 <= hour <= 23:
        raise ValueError
    except ValueError:
      raise ValueError(f'Heure de départ ({departure_hour}) invalide. Merci de sélectionner un entier entre 0 et 23')

  def validate_birthdate(self, birthdate: str) -> None:
    """
    validate birthdate format and logic
    """
    # validate format
    try:
      datetime.strptime(birthdate, '%d-%m-%Y')
    except ValueError:
      raise ValueError(f'Date de naissance ({birthdate}) invalide. Merci de respecter le format jj-mm-aaaa')
    # validate logic : this year - 27 <= birthyear <= this year - 16
    age: int = self.get_age(birthdate)
    is_valid: bool = 16 <= age <= 27
    if not is_valid:
      raise ValueError(f'Date de naissance ({birthdate} ; {age} ans) invalide. ' +
                       'Vous devez avoir entre 16 et 27 ans pour créer une alerte TGVmax.')

  @staticmethod
  def validate_tgvmax_number(tgvmax_number: str) -> None:
    """
    validate tgvmax_number format
    """
    # validate format
    if not isinstance(tgvmax_number, str) or not re.match(r'[\d]{9}', tgvmax_number):
      raise ValueError(f'Numéro TGVmax ({tgvmax_number}) invalide. Merci d\'indiquer un numéro à 9 chiffres.')

  @staticmethod
  def convert_date(sncf_date: str) -> str:
    """
    convert "sam. 25 mai" to 25-05
    """
    french_month: str = sncf_date.split()[2]
    return sncf_date[5:7] + "-" + months[french_month]

  @staticmethod
  def convert_hour(sncf_hour: str) -> str:
    """
    convert "6 heures 19 minutes" to 6h19
    """
    splitted_hour: List[str] = sncf_hour.split()
    return splitted_hour[0] + "h" + splitted_hour[2]

  @staticmethod
  def get_age(birthdate: str) -> int:
    """
    get age from a birthdate : 03-03-2000 -> 19
    """
    today: date = date.today()
    birthday: date = datetime.strptime(birthdate, '%d-%m-%Y').date()
    age: int = today.year - birthday.year - ((today.month, today.day) < (birthday.month, birthday.day))
    return age
