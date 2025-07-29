class Cart < ApplicationRecord
  belongs_to :user
  has_many :cart_items, dependent: :destroy
  has_many :products, through: :cart_items

  def add_product(product, quantity = 1)
    item = cart_items.find_or_initialize_by(product: product)
    item.quantity = (item.quantity || 0) + quantity.to_i
    item.save
  end

  def remove_product(product)
    cart_items.where(product: product).destroy_all
  end

  def total_price
    cart_items.sum { |item| item.quantity * item.product.price }
  end

  def item_count
    cart_items.sum(:quantity)
  end
end
