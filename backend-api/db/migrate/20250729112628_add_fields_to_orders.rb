class AddFieldsToOrders < ActiveRecord::Migration[8.0]
  def change
    add_column :orders, :shipping_address, :string
    add_column :orders, :payment_method, :string
  end
end
