class HomeController < ApplicationController

  skip_before_action :verify_authenticity_token

  def index
    recipes = Recipe.last(10).reverse
    render :locals => { recipes: recipes }
  end

  def search
    redirect_to url_for(action: 'results', name: params[:name])
  end

  def results
    name = params[:name]
    recipes = Recipe.search name
    render :locals => { recipes: recipes }
  end
end
