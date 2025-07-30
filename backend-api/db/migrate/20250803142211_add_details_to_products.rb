class AddDetailsToProducts < ActiveRecord::Migration[8.0]
  def change
    add_column :products, :brand, :string
    add_column :products, :category, :string
    add_column :products, :sizes, :text
    add_column :products, :colors, :text
  end
end
