class RecipesController < ApplicationController
  include ActionController::Live

  skip_before_action :verify_authenticity_token

  def live
    id = params[:id].to_i
    LiveModel::LiveModel.stream_updates 'recipe_update', :recipe, id, response
  end

  def show
    recipe = Recipe.find(params[:id])

    recipe.last_viewed = DateTime.current
    recipe.save!

    render locals: { recipe: recipe }
  end

  def get
    recipe = Recipe.find(params[:id])
    render json: recipe
  end

  def index
    query_params =
      if params.has_key?(:query)
        params_from_query(params[:query].strip)
      else
        keys = params.keys.filter do |key|
          Recipe.fiter_types.include? key.downcase.to_sym || key == 'sort'
        end
        params.permit(keys).transform_keys(&:downcase)
      end

    open_single = parse_boolean params[:openSingle]

    used_params = query_params.slice(*Recipe.fiter_types).to_h
    recipes = Recipe.filter used_params

    if open_single && recipes.count == 1
      return redirect_to "/recipes/#{recipes.first.id}", locals: { recipe: recipes.first }
    end

    sort_mode = query_params[:sort] || "last_viewed-desc"
    recipes = recipes.sort_on sort_mode
    # Only persist the sort in the query if the sort was actually specified
    used_params[:sort] = query_params[:sort] if query_params[:sort]

    query_str = params_to_query(used_params)
    render locals: { recipes: recipes, query: query_str }
  end

  def new
    recipe = Recipe.new(source_kind: 'manual')
    render locals: { recipe: recipe }
  end

  def edit
    recipe = Recipe.find(params[:id])

    recipe.last_viewed = DateTime.current
    recipe.save!

    render locals: { recipe: recipe }
  end

  def update
    recipe = Recipe.find(params[:id])
    recipe.update(recipe_params)
  end

  def destroy
    recipe = Recipe.destroy(params[:id])

    menus = Menu.where_has_recipe(params[:id].to_i)
    menus.each do |menu|
      menu.recipes.delete(params[:id].to_i)
      menu.save
    end
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

  def create
    recipe = Recipe.new(recipe_params)
    if recipe.save
      redirect_to "/recipes/#{recipe.id}", locals: { recipe: recipe }
    else
      render :new, locals: { recipe: recipe }
    end
  end

  def recipe_params
    params.require(:recipe).permit!
  end

  private

  def params_from_query(query)
    query_fields = {}
    query.split(' ').each do |part|
      if part.include?(':')
        key = part.split(':')[0].downcase.to_sym
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
