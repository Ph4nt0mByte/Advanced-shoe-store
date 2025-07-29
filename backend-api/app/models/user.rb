class User < ApplicationRecord
  has_secure_password
  
  has_many :carts
  has_many :orders
  
  validates :name, presence: true
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password_digest, presence: true, length: { minimum: 6 }, allow_nil: true
end
