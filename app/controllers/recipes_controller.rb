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

  def edit
    recipe = Recipe.find(params[:id])
    render :locals => { recipe: recipe }
  end

  def update
    recipe = Recipe.find(params[:id])
    recipe.update(recipe_params)

    # This is only called from ajax so no need to do anything
    # redirect_to "/recipe/#{recipe.id}", locals: { recipe: recipe }
  end

  def create_from_url
    url = params[:recipe][:url]

    recipe = Recipe.new(source: url, source_kind: "url")
    CreateRecipeJob.perform_now(recipe, false)
    recipe.save

    redirect_to "/recipes/#{recipe.id}", locals: { recipe: recipe }
  end

  def recipe_params
    params.require(:recipe).permit!
  end
end
