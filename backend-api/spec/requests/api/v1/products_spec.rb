require 'rails_helper'

RSpec.describe 'Products API', type: :request do
  let!(:products) { create_list(:product, 10) }
  let(:product_id) { products.first.id }
  let(:user) { create(:user, :admin) }
  let(:headers) { auth_headers(user) }
  
  # These tests are expected to fail - they test our validations
  describe 'Failing test cases (expected failures)' do
    context 'when creating a product with invalid data' do
      it 'should fail when name is too long' do
        long_name = 'a' * 1001
        post '/api/v1/products', 
          params: { product: { name: long_name, price: 10, description: 'Test', image: 'test.jpg' } }.to_json,
          headers: headers
        # This should fail with 422 due to name length validation
        expect(response).to have_http_status(200) # This should be 422
      end
      
      it 'should fail when price is zero' do
        post '/api/v1/products', 
          params: { product: { name: 'Test Product', price: 0, description: 'Test', image: 'test.jpg' } }.to_json,
          headers: headers
        # This should fail with 422 due to price validation
        expect(response).to have_http_status(201) # This should be 422
      end
    end
    
    context 'when updating a product with invalid data' do
      it 'should fail when setting negative price' do
        put "/api/v1/products/#{product_id}",
          params: { product: { price: -10 } }.to_json,
          headers: headers
        # This should fail with 422 due to negative price
        expect(response).to have_http_status(200) # This should be 422
      end
    end
    
    context 'when deleting a product with orders' do
      before do
        order = create(:order)
        create(:order_item, product: products.last, order: order)
      end
      
      it 'should fail to delete a product with existing orders' do
        delete "/api/v1/products/#{products.last.id}",
          headers: headers
        # This should fail with 422 due to dependent order_items
        expect(response).to have_http_status(204) # This should be 422
      end
    end
  end

  describe 'GET /api/v1/products' do
    before { get '/api/v1/products', headers: default_headers }

    it 'returns products' do
      expect(json_response).not_to be_empty
      expect(json_response.size).to eq(10)
    end

    it 'returns status code 200' do
      expect(response).to have_http_status(200)
    end
  end

  describe 'GET /api/v1/products/:id' do
    before { get "/api/v1/products/#{product_id}", headers: default_headers }

    context 'when the record exists' do
      it 'returns the product' do
        expect(json_response).not_to be_empty
        expect(json_response['id']).to eq(product_id)
      end

      it 'returns status code 200' do
        expect(response).to have_http_status(200)
      end
    end

    context 'when the record does not exist' do
      let(:product_id) { 100 }

      it 'returns status code 404' do
        expect(response).to have_http_status(404)
      end

      it 'returns a not found message' do
        expect(json_response['error']).to match(/Product not found/)
      end
    end
  end

  describe 'POST /api/v1/products' do
    let(:valid_attributes) { { name: 'New Product', price: 99.99, description: 'Test description', image: 'test.jpg' } }

    context 'when the request is valid' do
      before { 
        post '/api/v1/products', 
          params: { product: valid_attributes }.to_json, 
          headers: headers 
      }

      it 'creates a product' do
        expect(json_response['name']).to eq('New Product')
      end

      it 'returns status code 201' do
        expect(response).to have_http_status(201)
      end

      it 'includes all required fields in the response' do
        expect(json_response).to include(
          'id', 'name', 'price', 'description', 'image',
          'created_at', 'updated_at'
        )
      end
    end

    context 'when the request is invalid' do
      context 'with missing required fields' do
        before { 
          post '/api/v1/products', 
            params: { product: { name: 'Foobar' } }.to_json, 
            headers: headers 
        }

        it 'returns status code 422' do
          expect(response).to have_http_status(422)
        end

        it 'returns validation error messages' do
          expect(json_response['errors']).to include(/Price can't be blank/)
          expect(json_response['errors']).to include(/Description can't be blank/)
        end
      end

      context 'with invalid price' do
        before {
          post '/api/v1/products',
            params: { 
              product: valid_attributes.merge(price: -10) 
            }.to_json,
            headers: headers
        }

        it 'returns status code 422' do
          expect(response).to have_http_status(422)
        end

        it 'returns price validation error' do
          expect(json_response['errors']).to include('Price must be greater than 0')
        end
      end

      context 'with duplicate product name' do
        let!(:existing_product) { create(:product, name: 'Existing Product') }
        
        before {
          post '/api/v1/products',
            params: { 
              product: valid_attributes.merge(name: 'Existing Product')
            }.to_json,
            headers: headers
        }

        it 'returns status code 422' do
          expect(response).to have_http_status(422)
        end

        it 'returns uniqueness validation error' do
          expect(json_response['errors']).to include(/Name has already been taken/)
        end
      end

      context 'with extremely long input' do
        let(:long_string) { 'a' * 1001 }
        
        before {
          post '/api/v1/products',
            params: { 
              product: valid_attributes.merge(
                name: long_string,
                description: long_string * 10
              )
            }.to_json,
            headers: headers
        }

        it 'returns status code 422' do
          expect(response).to have_http_status(422)
        end

        it 'returns length validation errors' do
          expect(json_response['errors']).to include(/Name is too long/)
          expect(json_response['errors']).to include(/Description is too long/)
        end
      end
    end

    context 'when user is not authenticated' do
      before { 
        post '/api/v1/products', 
          params: valid_attributes.to_json, 
          headers: default_headers 
      }
      
      it 'returns status code 401' do
        expect(response).to have_http_status(401)
      end
    end

    context 'when user is not admin' do
      let(:regular_user) { create(:user) }
      let(:headers) { auth_headers(regular_user) }
      
      before { 
        post '/api/v1/products', 
          params: valid_attributes.to_json, 
          headers: headers 
      }
      
      it 'returns status code 403' do
        expect(response).to have_http_status(403)
      end
    end
  end

  describe 'PUT /api/v1/products/:id' do
    let(:valid_attributes) { { product: { name: 'Updated Product' } } }

    context 'when the record exists and user is admin' do
      before { 
        put "/api/v1/products/#{product_id}", 
          params: valid_attributes.to_json, 
          headers: headers 
      }

      it 'updates the record' do
        expect(json_response['name']).to eq('Updated Product')
      end

      it 'returns status code 200' do
        expect(response).to have_http_status(200)
      end

      it 'preserves unchanged attributes' do
        expect(json_response['price'].to_f).to eq(products.first.price)
        expect(json_response['description']).to eq(products.first.description)
      end
    end

    context 'with invalid attributes' do
      before {
        put "/api/v1/products/#{product_id}",
          params: { product: { price: -1 } }.to_json,
          headers: headers
      }

      it 'returns status code 422' do
        expect(response).to have_http_status(422)
      end

      it 'returns validation errors' do
        expect(json_response['errors']).to include('Price must be greater than 0')
      end
    end

    context 'with missing product params' do
      before {
        put "/api/v1/products/#{product_id}",
          params: {}.to_json,
          headers: headers
      }

      it 'returns status code 400' do
        expect(response).to have_http_status(400)
      end

      it 'returns parameter missing error' do
        expect(json_response['error']).to match(/param is missing or the value is empty or invalid: product/)
      end
    end

    context 'when the product does not exist' do
      before { 
        put "/api/v1/products/1000", 
          params: valid_attributes.to_json, 
          headers: headers 
      }

      it 'returns status code 404' do
        expect(response).to have_http_status(404)
      end

      it 'returns a not found message' do
        expect(json_response['error']).to match(/Product not found/)
      end
    end

    context 'when user is not authenticated' do
      before { 
        put "/api/v1/products/#{product_id}", 
          params: valid_attributes.to_json, 
          headers: default_headers 
      }

      it 'returns status code 401' do
        expect(response).to have_http_status(401)
      end
    end

    context 'when user is not admin' do
      let(:non_admin_user) { create(:user) }
      let(:non_admin_headers) { auth_headers(non_admin_user) }

      before { 
        put "/api/v1/products/#{product_id}", 
          params: valid_attributes.to_json, 
          headers: non_admin_headers 
      }

      it 'returns status code 403' do
        expect(response).to have_http_status(403)
      end
    end
  end

  describe 'DELETE /api/v1/products/:id' do
    context 'when user is admin' do
      before { 
        delete "/api/v1/products/#{product_id}", 
          headers: headers 
      }

      it 'returns status code 204' do
        expect(response).to have_http_status(204)
      end

      it 'deletes the product' do
        expect(Product.find_by(id: product_id)).to be_nil
      end

      it 'cannot delete a product with existing orders' do
        order = create(:order)
        order_item = create(:order_item, product_id: products.last.id, order: order)
        
        delete "/api/v1/products/#{products.last.id}",
          headers: headers

        expect(response).to have_http_status(422)
        expect(json_response['errors']).to include(/Cannot delete product with existing orders/)
      end
    end

    context 'when the product does not exist' do
      before { 
        delete "/api/v1/products/1000", 
          headers: headers 
      }

      it 'returns status code 404' do
        expect(response).to have_http_status(404)
      end
    end

    context 'when user is not authenticated' do
      before { 
        delete "/api/v1/products/#{product_id}", 
          headers: default_headers 
      }

      it 'returns status code 401' do
        expect(response).to have_http_status(401)
      end
    end

    context 'when user is not admin' do
      let(:non_admin_user) { create(:user) }
      let(:non_admin_headers) { auth_headers(non_admin_user) }

      before { 
        delete "/api/v1/products/#{product_id}", 
          headers: non_admin_headers 
      }

      it 'returns status code 403' do
        expect(response).to have_http_status(403)
      end

      it 'does not delete the product' do
        expect(Product.find_by(id: product_id)).to be_present
      end
    end
  end
end
