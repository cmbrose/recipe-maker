class BudgetBytes
  def initialize(document)
    @document = document
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
    def root
      @document.xpath("/html/body/div[contains(@class, 'container')]/div[contains(@class, 'wrapper')]/div/article/div[contains(@class, 'wprm-recipe-container')]/div[contains(@class, 'wprm-recipe')]")
    end

    def name
      root.xpath(".//h2[contains(@class, 'wprm-recipe-name')]").text
    end

    def preview_url
      elem = root.xpath(".//div[contains(@class, 'wprm-recipe-image-container')]/div[contains(@class, 'wprm-recipe-image')]/img")        
      if elem.nil? || elem.length == 0
        elem = root.xpath(".//div[contains(@class, 'wprm-container-float-right')]/div[contains(@class, 'wprm-recipe-image')]/img")
      end

      url = elem.attribute('src')
      if url.nil? || !url.text.starts_with?('http')
        url = elem.attribute('data-lazy-src')
      end

      url.text
    end

    def servings
      root.xpath(".//div[contains(@class, 'wprm-recipe-servings-container')]/span[contains(@class, 'wprm-recipe-servings-adjustable-text')]").text
    end

    def prep_time
      get_time('prep')
    end

    def cook_time
      get_time('cook')
    end

    def total_time
      nil
    end

    def ingredients
      groups = []
      
      group_elems = root.xpath(".//div[contains(@class, 'wprm-recipe-ingredients-container')]/div[contains(@class, 'wprm-recipe-ingredient-group')]")
      group_elems.each do |group_elem|
        group_name = group_elem.xpath(".//h4").text

        ingredients = []

        ingredient_elems = group_elem.xpath('.//ul')
        ingredient_elems.children.each do |ingredient_elem|
          name = ingredient_elem.xpath(".//span[contains(@class, 'wprm-recipe-ingredient-name')]").text.strip
          amount = ingredient_elem.xpath(".//span[contains(@class, 'wprm-recipe-ingredient-amount')]").text&.strip || ""
          unit = ingredient_elem.xpath(".//span[contains(@class, 'wprm-recipe-ingredient-unit')]").text&.strip || ""

          ingredients << "#{name} #{amount} #{unit}".strip
        end

        groups << { 'name' => group_name, 'ingredients' => ingredients }
      end

      groups
    end

    def directions
      list = []
      
      container = root.xpath(".//div[contains(@class, 'wprm-recipe-instructions-container')]/div[contains(@class, 'wprm-recipe-instruction-group')]/ol")
      if container.nil? || container.length == 0
        container = root.xpath(".//div[contains(@class, 'wprm-recipe-instructions-container')]/div[contains(@class, 'wprm-recipe-instruction-group')]/ul")
      end

      container.children.each do |elem|
        list << elem.text.strip
      end

      list
    end

    def get_time(name)
      container = root.xpath(".//div[contains(@class, 'wprm-recipe-times-container')]/div[contains(@class, 'wprm-recipe-#{name}-time-container')]")

      text = container.xpath(".//span[contains(@class, 'wprm-recipe-#{name}_time')]").map { |elem| elem.text }

      text.join(" ").strip
    end
end