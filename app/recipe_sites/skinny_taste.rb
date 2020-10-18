class SkinnyTaste
  def initialize(document)
    if SkinnyTaste::Type1.can_use(document)
      @inner = SkinnyTaste::Type1.new(document)
    elsif SkinnyTaste::Type2.can_use(document)
      @inner = SkinnyTaste::Type2.new(document)
    else
      raise 'Cannot parse recipe html'
    end
  end

  def populate_recipe(recipe)
    recipe.name = name
    recipe.prep_time = prep_time
    recipe.cook_time = cook_time
    recipe.total_time = total_time
    recipe.servings = servings
    recipe.preview_url = preview_url
    recipe.ingredients = ingredients
    recipe.directions = directions
  end

  def method_missing(method_name, *args, &block)
    @inner.send(method_name, *args)
  end
end