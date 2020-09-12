class RecipesController < ApplicationController
  skip_before_action :verify_authenticity_token

  def show
    recipe = Recipe.find(params[:id])
    render :locals => { recipe: recipe }
  end

  def new
    recipe = Recipe.new
    render :locals => { recipe: recipe }
  end

  def create
    url = params[:recipe][:url]

    recipe = Recipe.create(url: url)
    recipe.fetch!

    redirect_to "/recipes/#{recipe.id}", locals: { recipe: recipe }
  end
end
