class SkinnyTaste::Type2
  def self.can_use(document)
    !SkinnyTaste::Type2.find_root_path(document).nil?
  end

  def initialize(document)
    @document = document
    @root_path = SkinnyTaste::Type2.find_root_path(document)
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

  private
    def self.find_root_path(document)
      root_options = [
        "/body/div[@class='container']/div[@class='wrapper']/div[@id='content']/div[@class='post']/div/div[@class='wprm-recipe']"
      ]

      root_options.find { |path| !document.xpath(path).empty? }
    end

    def root
      @document.xpath(@root_path)
    end

    def name
      root.xpath("/div/h2[@class='wprm-recipe-name']").text
    end

    def preview_url
    end

    def servings
    end

    def prep_time
    end

    def cook_time
    end

    def total_time
    end

    def ingredients
    end

    def directions
    end
end