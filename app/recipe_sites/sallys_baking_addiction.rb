class SallysBakingAddiction
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
    recipe.notes = notes
  end

  private
    def root
      @document.xpath("//body//div[@class='tasty-recipes']")
    end

    def name
      root.xpath("//h2[@class='tasty-recipes-title']").text
    end

    def preview_url
      elem = root.xpath("//div[@class='tasty-recipes-image']//img")

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
      root.xpath("//span[@class='tasty-recipes-yield']").text
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
      
      ingredients_body = root.xpath("//div[@class='tasty-recipes-ingredients-body']")

      current_group_name = ''

      ingredients_body.children.each do |elem|
        case elem.name
        when 'h4'
          current_group_name = elem.text
        when 'ul'
          ingredients = []
          elem.xpath("/li").each do |item|
            ingredients << item.text
          end

          groups << { 'name' => current_group_name, 'ingredients' => ingredients }
          current_group_name = ''
        end
      end

      groups
    end

    def directions
      list = []
      
      directions_body = root.xpath("//div[@class='tasty-recipes-instructions-body']/ol")

      directions_body.children.each do |elem|
        text = elem.text.strip.gsub(/^\d+\.\s*/, '')
        list << text if text.length > 0
      end

      list
    end

    def notes
      list = []
      
      notes_body = root.xpath("//div[@class='tasty-recipes-notes-body']/ol")

      notes_body.children.each do |elem|
        text = elem.text.strip.gsub(/^\d+\.\s*/, '')
        list << text if text.length > 0
      end

      list
    end

    def get_time(name)
      root.xpath("//span[@class='tasty-recipes-#{name}-time']").text
    end
end