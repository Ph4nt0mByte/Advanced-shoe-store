require 'json'

class Product < ApplicationRecord
  has_many :cart_items, dependent: :destroy
  has_many :carts, through: :cart_items
  has_many :order_items, dependent: :nullify
  has_many :orders, through: :order_items

  default_scope -> { where(deleted_at: nil) }
  scope :with_deleted, -> { unscope(where: :deleted_at) }
  scope :only_deleted, -> { with_deleted.where.not(deleted_at: nil) }

  class ArrayType < ActiveRecord::Type::Value
    def type
      :array
    end

    def cast(value)
      return [] if value.blank?
      value.is_a?(Array) ? value : JSON.parse(value || '[]')
    end

    def serialize(value)
      value.to_json
    end
  end

  ActiveRecord::Type.register(:array, ArrayType)

  attribute :sizes, :array, default: -> { [] }
  attribute :colors, :array, default: -> { [] }

  validates :name, 
    presence: true, 
    uniqueness: { case_sensitive: false, conditions: -> { with_deleted } },
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
    
  validates :brand, 
    presence: true,
    length: { maximum: 255 }
    
  validates :category,
    presence: true,
    length: { maximum: 255 }

  def soft_delete
    update(deleted_at: Time.current)
  end

  def restore
    update(deleted_at: nil)
  end

  def deleted?
    deleted_at.present?
  end
  
  def destroy
    run_callbacks(:destroy) do
      soft_delete
    end
  end
  
  def real_destroy
    super
  end
end
