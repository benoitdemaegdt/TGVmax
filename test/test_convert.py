"""
Test Conversion
"""
import unittest
from datetime import date, datetime, timedelta
from src.core.scraper import Scraper

class ConvertTest(unittest.TestCase):
  """
  This class contains tests for convert functions
  """
  def test_convert_date(self):
    """
    should properly convert a date
    """
    self.assertEqual(Scraper.convert_date('sam. 25 mai'), '25-05')

  def test_convert_hour(self):
    """
    should properly convert a departure hour
    """
    self.assertEqual(Scraper.convert_hour('6 heures 19 minutes'), '6h19')

  def test_get_age(self):
    """
    should properly get an age from a birthdate
    """
    today = date.today()
    birthdate = today - timedelta(days=19 * 365 + 30)
    birthdate = datetime.strftime(birthdate, '%d-%m-%Y')
    self.assertEqual(Scraper.get_age(birthdate), 19)
