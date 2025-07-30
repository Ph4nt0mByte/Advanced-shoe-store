module Api
    module V1
      class ProductsController < ApplicationController
        skip_before_action :authenticate_request, only: [:index, :show, :deleted]
        before_action :set_product, only: [:show, :update, :destroy, :restore]
        before_action :authorize_admin, only: [:create, :update, :destroy, :restore, :deleted]
  
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
            render json: { errors: @product.errors.full_messages }, status: :unprocessable_entity
          end
        rescue ActionController::ParameterMissing => e
          render json: { error: e.message }, status: :bad_request
        end
  
        def update
          if @product.update(product_params)
            render json: @product
          else
            render json: { errors: @product.errors.full_messages }, status: :unprocessable_entity
          end
        rescue ActionController::ParameterMissing => e
          render json: { error: e.message }, status: :bad_request
        end
  
        def destroy
          if @product.soft_delete
            render json: { message: 'Product has been soft deleted' }, status: :ok
          else
            render json: { errors: @product.errors.full_messages }, status: :unprocessable_entity
          end
        end
  
        def restore
          @product = Product.only_deleted.find(params[:id])
          if @product.restore
            render json: @product, status: :ok
          else
            render json: { errors: @product.errors.full_messages }, status: :unprocessable_entity
          end
        rescue ActiveRecord::RecordNotFound
          render json: { error: 'Deleted product not found' }, status: :not_found
        end
  
        def deleted
          @products = Product.only_deleted
          render json: @products
        end
  
        private
  
        def set_product
          @product = Product.find(params[:id])
        rescue ActiveRecord::RecordNotFound
          render json: { error: 'Product not found' }, status: :not_found
        end
  
        def product_params
          params.require(:product).permit(
            :name, 
            :description, 
            :price, 
            :image,  # Using 'image' instead of 'image_url' to match the database column
            :brand, 
            :category,
            sizes: [],
            colors: []
          )
        end
      end
    end
  end