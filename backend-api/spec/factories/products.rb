FactoryBot.define do
  factory :product do
    sequence(:name) { |n| "Product #{n}" }
    price { rand(10.0..100.0).round(2) }
    description { Faker::Lorem.paragraph }
    image { "product_#{rand(1..10)}.jpg" }
  end
end
