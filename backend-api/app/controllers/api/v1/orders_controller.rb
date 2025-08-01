module Api
  module V1
    class OrdersController < ApplicationController
      before_action :set_order, only: [:show, :cancel]

      def index
        @orders = current_user.orders.includes(order_items: :product).order(created_at: :desc)
        render json: @orders, include: { order_items: { include: :product } }
      end

      def show
        render json: @order, include: { order_items: { include: :product } }
      end

      def create
        cart = current_user.cart
        
        if cart.cart_items.empty?
          return render json: { error: 'Cannot create order with an empty cart' }, status: :unprocessable_entity
        end
        
        ActiveRecord::Base.transaction do
          @order = current_user.orders.build(
            status: 'pending',
            total_price: cart.total_price,
            shipping_address: order_params[:shipping_address],
            payment_method: order_params[:payment_method]
          )
          
          cart.cart_items.each do |item|
            @order.order_items.build(
              product: item.product,
              quantity: item.quantity,
              price: item.product.price
            )
            
            item.product.decrement!(:stock, item.quantity)
          end
          
          @order.save!
          cart.cart_items.destroy_all
        end
        
        render json: @order, status: :created, include: { order_items: { include: :product } }
        
      rescue ActiveRecord::RecordInvalid => e
        render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
      end

      def cancel
        if @order.may_cancel?
          @order.cancel!
          render json: @order, include: { order_items: { include: :product } }
        else
          render json: { error: 'Cannot cancel this order' }, status: :unprocessable_entity
        end
      end

      private

      def set_order
        @order = current_user.orders.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Order not found' }, status: :not_found
      end

      def order_params
        params.require(:order).permit(:shipping_address, :payment_method)
      end
    end
  end
end
