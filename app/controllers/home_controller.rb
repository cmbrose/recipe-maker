class HomeController < ApplicationController
  def index
    recipes = Recipe.last(10)
    render :locals => { recipes: recipes }
  end
end
