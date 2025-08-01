class CartItem < ApplicationRecord
  belongs_to :cart
  belongs_to :product

  validates :quantity, presence: true, numericality: { only_integer: true, greater_than: 0 }
  validate :product_in_stock

  def total_price
    product.price * quantity
  end

  private

  def product_in_stock
    errors.add(:product, 'is not available') unless product
  end
end
