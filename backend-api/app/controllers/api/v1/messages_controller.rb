module Api
  module V1
    class MessagesController < ApplicationController
      # Skip authentication for the create action to allow unauthenticated submissions
      skip_before_action :authenticate_request, only: [:create]

      def create
        @message = Message.new(message_params)
        
        if @message.save
          render json: { status: 'success', message: 'Message sent successfully' }, status: :created
        else
          render json: { status: 'error', errors: @message.errors.full_messages }, status: :unprocessable_entity
        end
      end
      
      private
      
      def message_params
        params.require(:message).permit(:name, :email, :subject, :message)
      end
    end
  end
end
