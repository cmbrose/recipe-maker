class LoveAndLemons::Type2
  def self.can_use(document)
    !LoveAndLemons::Type2.find_root_path(document).nil?
  end

  def initialize(document)
    @document = document
    @root_path = LoveAndLemons::Type2.find_root_path(document)
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
      "/body//div[@class='easyrecipe']"
    ]

    root_options.find { |path| !document.xpath(path).empty? }
  end

  def root
    @document.xpath(@root_path)
  end

    def name
      root.xpath("//h2[@class='ERSName']").text
    end

    def preview_url
      elem = root.xpath("//img[@itemprop='image']")

      if elem.nil?
        return nil
      end

      elem.attribute("src")
    end

    def servings
      root.xpath("//div[@class='ERSServes']/span").text
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
      
      ingredients_body = root.xpath("//div[@class='ERSIngredients']")
      current_group_name = ''

      ingredients_body.children.each do |elem|
        case elem.name
        when 'div'
          current_group_name = elem.text if elem.attribute("class").text == "ERSSectionHead"
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
      
      container = root.xpath("//div[@class='ERSInstructions']/ol/li")

      container.children.each do |elem|
        text = elem.text.strip.gsub(/^\d+\.\s*/, '')
        list << text if text.length > 0
      end

      list
    end

    def get_time(name)
      root.xpath("//div[@class='ERSTimes']//time[@itemprop='#{name}Time']").text.strip
    end
end