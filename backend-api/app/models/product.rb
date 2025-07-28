class Product < ApplicationRecord
  has_many :cart_items, dependent: :restrict_with_error
  has_many :carts, through: :cart_items
  has_many :order_items, dependent: :restrict_with_error
  has_many :orders, through: :order_items

  validates :name, 
    presence: true, 
    uniqueness: { case_sensitive: false },
    length: { maximum: 1000 }
    
  validates :price, 
    presence: true, 
    numericality: { greater_than: 0 }
    
  validates :description, 
    presence: true,
    length: { maximum: 10_000 }
    
  validates :image, 
    presence: true,
    length: { maximum: 255 }
    
  # Custom validation to prevent deletion if there are associated orders
  def ensure_no_associated_orders
    if order_items.any?
      errors.add(:base, 'Cannot delete product with existing orders')
      throw :abort
    end
  end
  
  before_destroy :ensure_no_associated_orders
end
