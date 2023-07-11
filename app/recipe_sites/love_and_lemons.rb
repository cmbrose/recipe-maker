class LoveAndLemons
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
      @document.xpath("//body//div[@class='wprm-recipe']")
    end

    def name
      root.xpath("//h2[@class='wprm-recipe-name']").text
    end

    def preview_url
      elem = root.first_xpath([
        "//div[@class='wprm-recipe-image']//img",
    ])

      if elem.nil?
        return nil
      end

      if !elem.attribute('data-lazy-srcset').nil?
        url = elem.attribute('data-lazy-srcset').text
      elsif !elem.attribute('data-lazy-src').nil?
        url = elem.attribute('data-lazy-src').text
      elsif !elem.attribute('data-srcset').nil?
        url = elem.attribute('data-srcset').text
      elsif !elem.attribute('src').nil?
        url = elem.attribute('src').text
      end

      if url.nil?
        return nil
      end
      
      url
        .split(',')
        .map { |src| src.split(' ') }
        .sort_by { |pair| pair[1].to_i } # sorts ascending
        .last[0]
    end

    def servings
      root.xpath("//div[@class='wprm-recipe-servings-container']/span[@class='wprm-recipe-servings']").text
    end

    def prep_time
      get_time('prep')
    end

    def cook_time
      get_time('cook')
    end

    def total_time
      get_time('total')
    end

    def ingredients
      groups = []
      
      group_elems = root.xpath("//div[@class='wprm-recipe-ingredients-container']/div[@class='wprm-recipe-ingredient-group']")
      group_elems.each do |group_elem|
        group_name = group_elem.xpath("//h4").text

        ingredients = []

        ingredient_elems = group_elem.xpath("//ul")

        ingredient_elems.children.each do |ingredient_elem|
          name = ingredient_elem.xpath("/span[@class='wprm-recipe-ingredient-name']").text.strip
          amount = ingredient_elem.xpath("/span[@class='wprm-recipe-ingredient-amount']").text&.strip || ""
          unit = ingredient_elem.xpath("/span[@class='wprm-recipe-ingredient-unit']").text&.strip || ""

          ingredient = "#{amount} #{unit} #{name}".strip.capitalize
          ingredients << ingredient if ingredient.length > 0
        end

        groups << { 'name' => group_name, 'ingredients' => ingredients }
      end

      groups
    end

    def directions
      list = []
      
      container = root.first_xpath([
        "//div[@class='wprm-recipe-instructions-container']/div[@class='wprm-recipe-instruction-group']/ol/li/div",
        "//div[@class='wprm-recipe-instructions-container']/div[@class='wprm-recipe-instruction-group']/ul/li/div"])

      container.children.each do |elem|
        text = elem.text.strip.gsub(/^\d+\.\s*/, '')
        list << text if text.length > 0
      end

      list
    end

    def get_time(name)
      container = root.xpath("//div[@class='wprm-recipe-times-container']/div[@class='wprm-recipe-#{name}-time-container']")

      text = container.xpath("//span[@class='wprm-recipe-#{name}_time']").map { |elem| elem.text }

      text.join(" ").strip
    end
end