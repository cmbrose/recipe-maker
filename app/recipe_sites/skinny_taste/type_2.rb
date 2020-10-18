class SkinnyTaste::Type2
  def self.can_use(document)
    !SkinnyTaste::Type2.find_root_path(document).nil?
  end

  def initialize(document)
    @document = document
    @root_path = SkinnyTaste::Type2.find_root_path(document)
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
      root.xpath("//div/h2[@class='wprm-recipe-name']").text
    end

    def preview_url
      img = root.xpath("//div/div[@class='wprm-recipe-image']/img")
      
      if !img.attribute('data-srcset').nil?
        url = img.attribute('data-srcset').text
          .split(',')
          .map { |src| src.split(' ') }
          .sort_by { |pair| pair[1] } # sorts ascending
          .last[0]        
      elsif img.attribute('src')&.starts_with?('http') == true
        url = img.attribute('src').text
      else
        url = img.attribute('data-src').text
      end

      url
    end

    def servings
      root.xpath("//span[@class='wprm-recipe-servings-with-unit']")&.text
    end

    def prep_time
      cont = root.xpath("//div[@class='wprm-recipe-times-container']/div[@class='wprm-recipe-prep-time-container']/span[@class='wprm-recipe-time']")

      time = cont&.xpath("//span[@class='wprm-recipe-details']")&.text
      unit = cont&.xpath("//span[@class='wprm-recipe-details-unit']")&.text

      "#{time} #{unit}".strip
    end

    def cook_time
      cont = root.xpath("//div[@class='wprm-recipe-times-container']/div[@class='wprm-recipe-cook-time-container']/span[@class='wprm-recipe-time']")

      time = cont&.xpath("//span[@class='wprm-recipe-details']")&.text
      unit = cont&.xpath("//span[@class='wprm-recipe-details-unit']")&.text

      "#{time} #{unit}".strip
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

        groups << { 'name' => group_name&.capitalize, 'ingredients' => ingredients }
      end

      groups
    end

    def directions
      list = root.first_xpath([
        "//div[@class='wprm-recipe-instructions-container']/div[@class='wprm-recipe-instruction-group']/ol",
        "//div[@class='wprm-recipe-instructions-container']/div[@class='wprm-recipe-instruction-group']/ul"])

      list&.children.map { |child| child.text }
    end
end