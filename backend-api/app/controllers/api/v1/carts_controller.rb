module Api
  module V1
    class CartsController < ApplicationController
      before_action :set_cart, only: [:show]
      before_action :set_cart_for_items, only: [:add_item, :update_item, :remove_item, :clear]

      def show
        render json: @cart, include: { cart_items: { include: :product } }
      end

      def add_item
        @cart_item = @cart.cart_items.find_or_initialize_by(product_id: cart_item_params[:product_id])
        
        if @cart_item.persisted?
          @cart_item.quantity += (cart_item_params[:quantity].to_i || 1)
        else
          @cart_item.quantity = cart_item_params[:quantity].to_i || 1
        end

        if @cart_item.save
          render json: @cart.reload, include: { cart_items: { include: :product } }, status: :ok
        else
          render json: { errors: @cart_item.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update_item
        @cart_item = @cart.cart_items.find_by(id: params[:id])
        
        if @cart_item.update(cart_item_params)
          render json: @cart.reload, include: { cart_items: { include: :product } }, status: :ok
        else
          render json: { errors: @cart_item.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def remove_item
        @cart_item = @cart.cart_items.find_by(id: params[:id])
        
        if @cart_item&.destroy
          render json: @cart.reload, include: { cart_items: { include: :product } }, status: :ok
        else
          render json: { error: 'Item not found' }, status: :not_found
        end
      end

      def clear
        @cart.cart_items.destroy_all
        
        render json: { message: 'Cart cleared successfully' }, status: :ok
      end

      private

      def set_cart
        @cart = current_user.cart || current_user.create_cart
      end
      
      def set_cart_for_items
        @cart = current_user.cart || current_user.create_cart
      end

      def cart_item_params
        params.require(:cart_item).permit(:product_id, :quantity)
      end
    end
  end
end
