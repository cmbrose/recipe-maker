class RecipesController < ApplicationController
  include ActionController::Live

  skip_before_action :verify_authenticity_token

  def live
    id = params[:id].to_i
    LiveModel::LiveModel.stream_updates 'recipe_update', :recipe, id, response
  end

  def show
    recipe = Recipe.find(params[:id])
    render locals: { recipe: recipe }
  end

  def index
    query_params =
      if params.has_key?(:query)
        params_from_query(params[:query])
      else
        params.permit(:query, :name, :url, :tag)
      end

    open_single = parse_boolean params[:openSingle]

    used_params = query_params.slice(:name, :url, :tag).to_h
    recipes = Recipe.filter used_params

    if open_single && recipes.count == 1
      return redirect_to "/recipes/#{recipes.first.id}", locals: { recipe: recipes.first }
    end

    query_str = params_to_query(used_params)
    render locals: { recipes: recipes, query: query_str }
  end

  def new
    recipe = Recipe.new
    render locals: { recipe: recipe }
  end

  def edit
    recipe = Recipe.find(params[:id])
    render locals: { recipe: recipe }
  end

  def update
    recipe = Recipe.find(params[:id])
    recipe.update(recipe_params)
  end

  def destroy
    recipe = Recipe.destroy(params[:id])
  end

  def create_from_url
    url = params[:recipe][:url]

    existing = Recipe.filter_by_url(url)
    return redirect_to "/recipes/#{existing.first.id}", locals: { recipe: existing.first } unless existing.length == 0

    recipe = Recipe.new(source: url, source_kind: 'url')
    CreateRecipeJob.perform_now(recipe, false)
    recipe.save

    redirect_to "/recipes/#{recipe.id}", locals: { recipe: recipe }
  end

  def create_empty
    recipe = Recipe.create!(source_kind: 'manual', name: 'Empty Recipe', preview_url: 'Preview Image Url')

    redirect_to "/recipes/#{recipe.id}/edit", locals: { recipe: recipe }
  end

  def recipe_params
    params.require(:recipe).permit!
  end

  private

  def params_from_query(query)
    query_fields = {}
    query.split(' ').each do |part|
      if part.include?(':')
        key = part.split(':')[0].to_sym
        value = part.split(':')[1]
      else
        key = :name
        value = part
      end

      delim = key == :name ? ' ' : ','
      query_fields[key] = (query_fields[key].to_s + delim if query_fields.has_key?(key)).to_s + value
    end

    query_fields
  end

  def params_to_query(parameters)
    pairs = parameters.map do |k, v|
      "#{k}:#{v}"
    end

    pairs.join(' ')
  end
end
