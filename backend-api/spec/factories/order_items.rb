FactoryBot.define do
  factory :order_item do
    order
    product
    quantity { rand(1..5) }
    price { product.price }
  end
end
