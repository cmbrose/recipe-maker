class SkinnyTaste::Type1
  def self.can_use(document)
    !SkinnyTaste::Type1.find_root_path(document).nil?
  end

  def initialize(document)
    @document = document
    @root_path = SkinnyTaste::Type1.find_root_path(document)
  end

  private
    def self.find_root_path(document)
      root_options = [
        "/body/div[@class='container']/div[@class='wrapper']/div[@id='content']/div[@class='post']/div[@class='recipe']",
        # Workaround for an un-closed <p> right before the recipe starts
        "/body/div[@class='container']/div[@class='wrapper']/div[@id='content']/div[@class='post']/p/div[@class='recipe']",
        "/body/div[@class='container']/div[@class='wrapper']/div[@id='content']/div[@class='post']/div/div[@class='recipe']"
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
      img = root.first_xpath([
        "//div[@class='photo']/img",
        "//img[@class='photo']"])

      url = img.attribute('src')&.text
      if url.nil? || !url.starts_with?('http')
        url = img.attribute('data-src').text
      end

      url
    end

    def servings
      root.xpath("//div[@class='nutrition']/p/span[@class='yield']")
        &.text
        .gsub(/\s+/m, ' ').strip
        .split(" ")
        .second        
    end

    def prep_time
      nil
    end

    def cook_time
      nil
    end

    def total_time
      root.xpath("//div[@class='post-meta']/div[@class='recipe-meta']/p")&.text
    end

    def ingredients
      groups = []
      
      curr_group_name = nil
      curr_group_ingrs = []

      group_elems = root.xpath("//div[@class='ingredients']")
      group_elems.each do |group_elem|
        if group_elem.name == 'p'
          if !curr_group_ingrs.empty?
            groups << { 'name' => curr_group_name, 'ingredients' => curr_group_ingrs }
          end

          curr_group_name = group_elem.text
          curr_group_ingrs = []
        else
          curr_group_ingrs << group_elem.text
        end
      end

      groups << { 'name' => curr_group_name, 'ingredients' => curr_group_ingrs }
      groups
    end

    def directions
      list = root.first_xpath([
        "//div[@class='instructions']/span/ol",
        "//div[@class='instructions']/ol",
        "//div[@class='instructions']"])

      list.children.map { |child| child.text }
    end
end