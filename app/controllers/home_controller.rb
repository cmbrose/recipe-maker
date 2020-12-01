class HomeController < ApplicationController
  def index
    recipes = Recipe.last(10).reverse
    render :locals => { recipes: recipes }
  end
end
