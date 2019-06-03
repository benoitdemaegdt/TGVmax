"""
Notifier for TGVmax alerts
"""
import smtplib
from typing import List
from unidecode import unidecode
from src.config import Config

class Notifier:
  """
  Send alert email
  """
  def __init__(self, origin: str, destination: str, day: str) -> None:
    self.server = smtplib.SMTP('smtp.gmail.com', 587)
    self.admin_email: str = Config.ADMIN_EMAIL
    self.from_email: str = Config.ALERT_EMAIL
    self.password: str = Config.PASSWORD
    self.origin: str = origin
    self.destination: str = destination
    self.day: str = day
    self.server.starttls()
    self.server.login(self.from_email, self.password)

  def send_availability_email(self, to_email: str, hour: List[str]) -> None:
    """
    Send an availability email when a TGVmax is found
    """
    message: str = f'Bonne nouvelle ! TGVmax disponible entre {self.origin} et {self.destination} le {self.day} a {hour}'
    self.server.sendmail(self.from_email, to_email, unidecode(message))
    self.server.quit()

  def send_client_error_email(self, to_email: str, error: str) -> None:
    """
    Send an error email when an error occurs
    """
    message: str = f'Ouuups. {error}'
    self.server.sendmail(self.from_email, to_email, unidecode(message))
    self.server.quit()

  def send_admin_error_email(self, error: str) -> None:
    """
    Send an error email when an error occurs
    """
    message: str = f'Ouuups. Une erreur technique est survenue {error}'
    self.server.sendmail(self.from_email, self.admin_email, unidecode(message))
    self.server.quit()
