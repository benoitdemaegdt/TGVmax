"""
Test Validation
"""
import unittest
import datetime
from src.core.scraper import Scraper

class ValidationTest(unittest.TestCase):
  """
  This class contains tests for validation functions
  """
  def test_validation_departure_date_001(self):
    """
    Invalid format: 'hey'
    """
    with self.assertRaises(ValueError) as message:
      Scraper.validate_departure_date('hey')
    self.assertEqual(str(message.exception), 'Date de départ (hey) invalide. Merci de respecter le format jj-mm-aaaa')

  def test_validation_departure_date_002(self):
    """
    Invalid format: 'dd-mm'
    """
    today = datetime.date.today()
    departure_date = datetime.datetime.strftime(today + datetime.timedelta(days = 1), '%d-%m')
    with self.assertRaises(ValueError) as message:
      Scraper.validate_departure_date(departure_date)
    self.assertEqual(str(message.exception), f'Date de départ ({departure_date}) invalide. Merci de respecter le format jj-mm-aaaa')

  def test_validation_departure_date_003(self):
    """
    Invalid date: today + 31 days
    """
    today = datetime.date.today()
    str_today: str = datetime.datetime.strftime(today, '%d-%m-%Y')
    max_date = today + datetime.timedelta(days = 30)
    str_max_date: str = datetime.datetime.strftime(max_date, '%d-%m-%Y')
    departure_date = datetime.datetime.strftime(today + datetime.timedelta(days = 31), '%d-%m-%Y')
    with self.assertRaises(ValueError) as message:
      Scraper.validate_departure_date(departure_date)
    self.assertEqual(str(message.exception), f'Date de départ ({departure_date}) invalide. Merci d\'indiquer une date comprise entre {str_today} et {str_max_date}')

  def test_validation_departure_date_004(self):
    """
    Valid date
    """
    today = datetime.date.today()
    departure_date = datetime.datetime.strftime(today + datetime.timedelta(days = 1), '%d-%m-%Y')
    try:
      Scraper.validate_departure_date(departure_date)
    except:
      self.fail('test_validation_departure_date_004 failed unexpectedly')

  def test_validation_departure_hour_001(self):
    """
    Invalid format - not a string
    """
    with self.assertRaises(ValueError) as message:
      Scraper.validate_departure_hour('hey')
    self.assertEqual(str(message.exception), 'Heure de départ (hey) invalide. Merci de sélectionner un entier entre 0 et 23')

  def test_validation_departure_hour_002(self):
    """
    Invalid format - out of range
    """
    with self.assertRaises(ValueError) as message:
      Scraper.validate_departure_hour('24')
    self.assertEqual(str(message.exception), 'Heure de départ (24) invalide. Merci de sélectionner un entier entre 0 et 23')

  def test_validation_departure_hour_003(self):
    """
    Valid hour
    """
    try:
      Scraper.validate_departure_hour('12')
    except:
      self.fail('test_validation_departure_hour_003 failed unexpectedly')

  def test_validation_birthdate_001(self):
    """
    Invalid format: 'hey'
    """
    with self.assertRaises(ValueError) as message:
      Scraper.validate_birthdate(Scraper, 'hey')
    self.assertEqual(str(message.exception), 'Date de naissance (hey) invalide. Merci de respecter le format jj-mm-aaaa')

  def test_validation_birthdate_002(self):
    """
    Invalid format: 'dd-mm'
    """
    today = datetime.date.today()
    departure_date = datetime.datetime.strftime(today + datetime.timedelta(days = 1), '%d-%m')
    with self.assertRaises(ValueError) as message:
      Scraper.validate_birthdate(Scraper, departure_date)
    self.assertEqual(str(message.exception), f'Date de naissance ({departure_date}) invalide. Merci de respecter le format jj-mm-aaaa')

  def test_validation_birthdate_003(self):
    """
    Invalid birthdate: older than 28 years
    """
    birthdate = '03-08-1978'
    today = datetime.date.today()
    birthday = datetime.datetime.strptime('03-08-1978', '%d-%m-%Y').date()
    age = today.year - birthday.year - ((today.month, today.day) < (birthday.month, birthday.day))
    with self.assertRaises(ValueError) as message:
      Scraper.validate_birthdate(Scraper, birthdate)
    self.assertEqual(str(message.exception), f'Date de naissance ({birthdate} ; {age} ans) invalide. Vous devez avoir entre 16 et 27 ans pour créer une alerte TGVmax.')

  def test_validation_birthdate_004(self):
    """
    Valid birthdate
    """
    today = datetime.date.today()
    birthdate = datetime.datetime.strftime(today - datetime.timedelta(days = 6570), '%d-%m-%Y')
    try:
      Scraper.validate_birthdate(Scraper, birthdate)
    except:
      self.fail('test_validation_birthdate_004 failed unexpectedly')

  def test_validation_tgvmax_001(self):
    """
    Invalid format: 'hey'
    """
    with self.assertRaises(ValueError) as message:
      Scraper.validate_tgvmax_number('hey')
    self.assertEqual(str(message.exception), 'Numéro TGVmax (hey) invalide. Merci d\'indiquer un numéro à 9 chiffres.')

  def test_validation_tgvmax_002(self):
    """
    Invalid type: 1
    """
    with self.assertRaises(ValueError) as message:
      Scraper.validate_tgvmax_number(1)
    self.assertEqual(str(message.exception), 'Numéro TGVmax (1) invalide. Merci d\'indiquer un numéro à 9 chiffres.')

  def test_validation_tgvmax_003(self):
    """
    Valid TGVmax number
    """
    try:
      Scraper.validate_tgvmax_number('087654312')
    except:
      self.fail('test_validation_tgvmax_002 failed unexpectedly')
