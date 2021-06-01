class KingArthur
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
      @document.xpath("/body//div[@class='page']/main")
    end

    def header_quickview_content
      root.xpath("//section[@class='page-content-header']//div[@class='quickview__content']")
    end

    def name
      header_quickview_content.xpath("//h1/span").text
    end

    def preview_url
      elem = root.first_xpath([
        "//section[@class='page-content-header']//div[@class='quickview__media']//img"])

      if !elem.attribute('data-lazy-srcset').nil?
        url = elem.attribute('data-lazy-srcset').text
      elsif !elem.attribute('data-lazy-src').nil?
        url = elem.attribute('data-lazy-src').text
      elsif !elem.attribute('data-srcset').nil?
        url = elem.attribute('data-srcset').text
      elsif !elem.attribute('src')&.nil?
        url = elem.attribute('src').text
      end
      
      url = url
        .split(',')
        .map { |src| src.split(' ') }
        .sort_by { |pair| pair[1].to_i } # sorts ascending
        .last[0]
      
      if !url.starts_with?('http')
        url = "https://www.kingarthurbaking.com#{url}"
      end

      url
    end

    def servings
      header_quickview_content.xpath("//div[@class='stat__item--yield']/span").text
    end

    def prep_time
      get_time('prep')
    end

    def cook_time
      get_time('bake')
    end

    def total_time
      get_time('total')
    end

    def ingredients
      groups = []
      
      group_elems = root.xpath("//aside[@class='recipe__ingredients']/div[@class='ingredients-list']/div[@class='ingredient-section']")
      group_elems.each do |group_elem|
        group_name = group_elem.xpath("/p").text

        ingredients = []

        ingredient_elems = group_elem.xpath("/ul")        
        ingredient_elems.children.each do |ingredient_elem|
          ingredient = ingredient_elem.text.strip.capitalize

          if ingredient.length > 0
            ingredients << ingredient
          end
        end

        groups << { 'name' => group_name, 'ingredients' => ingredients }
      end

      groups
    end

    def directions
      list = []
      
      container = root.first_xpath([
        "//article[@class='recipe__instructions']/div[@class='field--recipe-steps']/ol/li/p"])

      container.children.map do |elem|
        elem.text.strip
      end
    end

    def get_time(name)
      header_quickview_content.xpath("//div[@class='stat__item--#{name}']/span").text
    end
end