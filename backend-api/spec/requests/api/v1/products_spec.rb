require 'rails_helper'

RSpec.describe 'Products API', type: :request do
  let!(:products) { create_list(:product, 10) }
  let(:product_id) { products.first.id }
  let(:user) { create(:user, :admin) }
  let(:headers) { auth_headers(user) }

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
    let(:valid_attributes) { { name: 'New Product', price: 99.99, description: 'A great product', image: 'product.jpg' } }

    context 'when the request is valid and user is admin' do
      before { 
        post '/api/v1/products', 
          params: valid_attributes.to_json, 
          headers: headers 
      }

      it 'creates a product' do
        expect(json_response['name']).to eq('New Product')
      end

      it 'returns status code 201' do
        expect(response).to have_http_status(201)
      end
    end

    context 'when the request is invalid' do
      before { 
        post '/api/v1/products', 
          params: { product: { name: 'Foobar' } }.to_json, 
          headers: headers 
      }

      it 'returns status code 422' do
        expect(response).to have_http_status(422)
      end

      it 'returns a validation failure message' do
        expect(json_response['errors']).to be_present
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
      let(:regular_user) { create(:user) }
      let(:headers) { auth_headers(regular_user) }
      
      before { 
        put "/api/v1/products/#{product_id}", 
          params: valid_attributes.to_json, 
          headers: headers 
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
      let(:regular_user) { create(:user) }
      let(:headers) { auth_headers(regular_user) }
      
      before { 
        delete "/api/v1/products/#{product_id}", 
          headers: headers 
      }
      
      it 'returns status code 403' do
        expect(response).to have_http_status(403)
      end
    end
  end
end
