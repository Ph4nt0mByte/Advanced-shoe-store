class OrderItem < ApplicationRecord
  belongs_to :order
  belongs_to :product

  validates :quantity, presence: true, numericality: { only_integer: true, greater_than: 0 }
  validates :price, presence: true, numericality: { greater_than: 0 }

  def total_price
    price * quantity
  end

  private

  def price_cannot_be_greater_than_product_price
    if price && product && price > product.price
      errors.add(:price, "cannot be greater than product's current price")
    end
  end
end
