FactoryBot.define do
  factory :order do
    user
    total_price { 0 }
    status { :pending }
    shipping_address { Faker::Address.full_address }
    payment_method { ['credit_card', 'paypal', 'bank_transfer'].sample }
    
    trait :with_items do
      transient do
        items_count { 2 }
      end
      
      after(:create) do |order, evaluator|
        create_list(:order_item, evaluator.items_count, order: order)
        order.update(total_price: order.order_items.sum { |item| item.quantity * item.price })
      end
    end
  end
end
