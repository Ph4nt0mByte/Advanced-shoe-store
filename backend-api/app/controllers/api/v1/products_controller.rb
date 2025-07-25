module Api
    module V1
      class ProductsController < ApplicationController
        skip_before_action :authenticate_request, only: [:index, :show]
        before_action :set_product, only: [:show, :update, :destroy]
        before_action :authorize_admin, only: [:create, :update, :destroy]
  
        def index
          @products = Product.all
          render json: @products
        end
  
        def show
          render json: @product
        end
  
        def create
          @product = Product.new(product_params)
  
          if @product.save
            render json: @product, status: :created
          else
            render json: @product.errors, status: :unprocessable_entity
          end
        end
  
        def update
          if @product.update(product_params)
            render json: @product
          else
            render json: @product.errors, status: :unprocessable_entity
          end
        end
  
        def destroy
          @product.destroy
          head :no_content
        end
  
        private
  
        def set_product
          @product = Product.find(params[:id])
        rescue ActiveRecord::RecordNotFound
          render json: { error: 'Product not found' }, status: :not_found
        end
  
        def product_params
          params.require(:product).permit(:name, :description, :price, :image)
        end
      end
    end
  end