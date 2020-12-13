class ErrorsController < ApplicationController
    def exception
      render :locals => { exception: params[:exception] }
    end
  end
  