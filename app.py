"""
App
"""
from src.core.scraper import Scraper
from src.core.notifier import Notifier

try:
  scraper = Scraper('<ORIGIN>', '<DESTINATION>', '<DATE>', '<TGVMAX_NUMBER>', '<BIRTHDATE>')
  tgvmax_seats = scraper.scrape_tgvmax_seats()
  if tgvmax_seats != []:
    notifier = Notifier('<ORIGIN>', '<DESTINATION>', '<DATE>')
    notifier.send_availability_email('<EMAIL_TO_ALERT>', tgvmax_seats)

except ValueError as value_error:
  notifier = Notifier('<ORIGIN>', '<DESTINATION>', '<DATE>')
  notifier.send_client_error_email('<EMAIL_TO_ALERT>', value_error.args[0])

except Exception as e:
  notifier = Notifier('<ORIGIN>', '<DESTINATION>', '<DATE>')
  notifier.send_admin_error_email(e.args[0])
