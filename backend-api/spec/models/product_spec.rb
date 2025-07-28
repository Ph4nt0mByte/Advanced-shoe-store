require 'rails_helper'

RSpec.describe Product, type: :model do
  it 'is valid with valid attributes' do
    product = build(:product)
    expect(product).to be_valid
  end

  it 'is not valid without a name' do
    product = build(:product, name: nil)
    expect(product).not_to be_valid
    expect(product.errors[:name]).to include("can't be blank")
  end

  it 'is not valid without a price' do
    product = build(:product, price: nil)
    expect(product).not_to be_valid
    expect(product.errors[:price]).to include("can't be blank")
  end

  it 'is not valid with a negative price' do
    product = build(:product, price: -1)
    expect(product).not_to be_valid
    expect(product.errors[:price]).to include('must be greater than 0')
  end

  it 'is not valid without a description' do
    product = build(:product, description: nil)
    expect(product).not_to be_valid
    expect(product.errors[:description]).to include("can't be blank")
  end

  it 'is not valid without an image' do
    product = build(:product, image: nil)
    expect(product).not_to be_valid
    expect(product.errors[:image]).to include("can't be blank")
  end

  it 'has many cart_items' do
    product = create(:product)
    cart_item1 = create(:cart_item, product: product)
    cart_item2 = create(:cart_item, product: product)
    
    expect(product.cart_items).to include(cart_item1, cart_item2)
  end

  it 'has many order_items' do
    product = create(:product)
    order_item1 = create(:order_item, product: product)
    order_item2 = create(:order_item, product: product)
    
    expect(product.order_items).to include(order_item1, order_item2)
  end
end
