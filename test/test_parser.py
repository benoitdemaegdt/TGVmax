"""
Test Parser
"""
import unittest
import datetime
from pathlib import Path
from src.core.scraper import Scraper

base_path = Path(__file__).parent
result_with_tgvmax_path = (base_path / '../test/data/result_with_tgvmax.html').resolve()
result_with_warning_path = (base_path / '../test/data/result_with_warning.html').resolve()
result_without_fake_id_path = (base_path / '../test/data/result_with_fake_id.html').resolve()
form_error_path = (base_path / '../test/data/form_error.html').resolve()

with open(result_with_tgvmax_path, 'r') as f:
  result_with_tgvmax = f.read()

with open(result_without_fake_id_path, 'r') as f:
  # changed div class="search-travel-results" <-> class="search-travel-resultss"
  # this is an import test because one day or another sncf will change id or class name
  result_with_fake_id = f.read()

with open(result_with_warning_path, 'r') as f:
  result_with_warning = f.read()

with open(form_error_path, 'r') as f:
  form_error = f.read()

class ParserTest(unittest.TestCase):
  """
  This class contains tests for bs4 parsing
  """
  def test_parsing_001(self):
    """
    Find TGVmax seats
    """
    self.assertEqual(Scraper.find_tgvmax_seats(Scraper, result_with_tgvmax), ['7h27', '9h12'])

  def test_parsing_002(self):
    """
    Form error
    """
    with self.assertRaises(ValueError) as message:
      Scraper.find_form_error(form_error)
    self.assertEqual(str(message.exception), 'Les erreurs suivantes ont été détectées lors de la recherche de votre TGVmax Merci de sélectionner une ville de départ dans la liste proposée.; Merci de sélectionner une ville d\'arrivée dans la liste proposée.')

  def test_parsing_003(self):
    """
    Warning : Aucun TGVmax disponible à la date demandée
    """
    self.assertEqual(Scraper.find_tgvmax_seats(Scraper, result_with_warning), [])

  def test_parsing_004(self):
    """
    Test a class name change
    """
    with self.assertRaises(Exception) as message:
      today = datetime.date.today()
      departure_date = datetime.datetime.strftime(today + datetime.timedelta(days = 1), '%d-%m-%Y')
      birthdate = datetime.datetime.strftime(today - datetime.timedelta(days = 20*365), '%d-%m-%Y')
      scraper = Scraper('paris', 'lyon part dieu', departure_date, '000035432', birthdate)
      scraper.find_tgvmax_seats(result_with_fake_id)
    self.assertEqual(str(message.exception), f'Aucun train entre paris et lyon part dieu le {departure_date}.')
