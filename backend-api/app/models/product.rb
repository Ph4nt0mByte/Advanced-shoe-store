require 'json'

class Product < ApplicationRecord
  # Associations
  has_many :cart_items, dependent: :destroy
  has_many :carts, through: :cart_items
  has_many :order_items, dependent: :nullify
  has_many :orders, through: :order_items

  # Scopes
  default_scope -> { where(deleted_at: nil) }
  scope :with_deleted, -> { unscope(where: :deleted_at) }
  scope :only_deleted, -> { with_deleted.where.not(deleted_at: nil) }

  # Define custom types for array serialization
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

  # Register the type
  ActiveRecord::Type.register(:array, ArrayType)

  # Define attributes with custom type
  attribute :sizes, :array, default: -> { [] }
  attribute :colors, :array, default: -> { [] }

  # Validations
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

  # Soft delete method
  def soft_delete
    update(deleted_at: Time.current)
  end

  # Restore method
  def restore
    update(deleted_at: nil)
  end

  # Check if product is deleted
  def deleted?
    deleted_at.present?
  end
  
  # Override destroy to use soft delete
  def destroy
    run_callbacks(:destroy) do
      soft_delete
    end
  end
  
  # Real destroy (use with caution)
  def real_destroy
    super
  end
end
