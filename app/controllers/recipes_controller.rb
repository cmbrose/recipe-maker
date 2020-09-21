class RecipesController < ApplicationController
  include ActionController::Live

  skip_before_action :verify_authenticity_token

  def live
    id = params[:id].to_i
    LiveModel::LiveModel.stream_updates 'recipe_update', :recipe, id, response
  end

  def show
    recipe = Recipe.find(params[:id])
    render :locals => { recipe: recipe }
  end

  def new
    recipe = Recipe.new
    render :locals => { recipe: recipe }
  end

  def create_from_url
    url = params[:recipe][:url]

    recipe = Recipe.create(source: url, source_kind: "url")
    CreateRecipeJob.perform_later(recipe)

    redirect_to "/recipes/#{recipe.id}", locals: { recipe: recipe }
  end
end
