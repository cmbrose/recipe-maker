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
      @document.xpath("/body/div[@class='container']/div[@class='wrapper']/div/article/div[@class='wprm-recipe-container']/div[@class='wprm-recipe']")
    end

    def name
      root.xpath("//h2[@class='wprm-recipe-name']").text
    end

    def preview_url
      elem = root.first_xpath([
        "//div[@class='wprm-recipe-image-container']/div[@class='wprm-recipe-image']/img", 
        "//div[@class='wprm-container-float-right']/div[@class='wprm-recipe-image']/img"])

      srcset = elem.attribute('data-lazy-srcset')
      if !srcset.nil?
        # Format is {url-1} {size-1}, {url-2} {size-2}, ... and last one is the biggest
        url = srcset.text.split(',').last.split(' ').first
      else
        url = elem.attribute('src')&.text
        if url.nil? || !url.starts_with?('http')
          url = elem.attribute('data-lazy-src').text
        end
      end

      url
    end

    def servings
      root.xpath("//div[@class='wprm-recipe-servings-container']/span[@class='wprm-recipe-servings-adjustable-text']").text
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
      
      group_elems = root.xpath("//div[@class='wprm-recipe-ingredients-container']/div[@class='wprm-recipe-ingredient-group']")
      group_elems.each do |group_elem|
        group_name = group_elem.xpath("//h4").text

        ingredients = []

        ingredient_elems = group_elem.xpath("//ul")        
        ingredient_elems.children.each do |ingredient_elem|
          name = ingredient_elem.xpath("//span[@class='wprm-recipe-ingredient-name']").text.strip
          amount = ingredient_elem.xpath("//span[@class='wprm-recipe-ingredient-amount']").text&.strip || ""
          unit = ingredient_elem.xpath("//span[@class='wprm-recipe-ingredient-unit']").text&.strip || ""

          ingredients << "#{name} #{amount} #{unit}".strip.capitalize
        end

        groups << { 'name' => group_name, 'ingredients' => ingredients }
      end

      groups
    end

    def directions
      list = []
      
      container = root.first_xpath([
        "//div[@class='wprm-recipe-instructions-container']/div[@class='wprm-recipe-instruction-group']/ol",
        "//div[@class='wprm-recipe-instructions-container']/div[@class='wprm-recipe-instruction-group']/ul"])

      container.children.each do |elem|
        list << elem.text.strip
      end

      list
    end

    def get_time(name)
      container = root.xpath("//div[@class='wprm-recipe-times-container']/div[@class='wprm-recipe-#{name}-time-container']")

      text = container.xpath("//span[@class='wprm-recipe-#{name}_time']").map { |elem| elem.text }

      text.join(" ").strip
    end
end