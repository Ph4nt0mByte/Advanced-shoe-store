class Order < ApplicationRecord
  include AASM
  
  belongs_to :user
  has_many :order_items, dependent: :destroy
  has_many :products, through: :order_items

  validates :total_price, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :status, presence: true
  validates :shipping_address, presence: true
  validates :payment_method, presence: true

  aasm column: 'status' do
    state :pending, initial: true
    state :processing, :shipped, :delivered, :cancelled

    event :process do
      transitions from: :pending, to: :processing
    end

    event :ship do
      transitions from: :processing, to: :shipped
    end

    event :deliver do
      transitions from: :shipped, to: :delivered
    end

    event :cancel do
      transitions from: [:pending, :processing], to: :cancelled
    end
  end

  def self.create_from_cart(cart, order_params)
    order = nil
    
    ActiveRecord::Base.transaction do
      order = cart.user.orders.create!(
        total_price: cart.total_price,
        shipping_address: order_params[:shipping_address],
        payment_method: order_params[:payment_method],
        status: 'pending'
      )
      
      cart.cart_items.each do |item|
        order.order_items.create!(
          product: item.product,
          quantity: item.quantity,
          price: item.product.price
        )
        
        item.product.decrement!(:stock, item.quantity)
      end
      
      cart.cart_items.destroy_all
    end
    
    order
  rescue ActiveRecord::RecordInvalid => e
    raise e
  end
  
  def cancelable?
    pending? || processing?
  end
end
