class RecipeSites::BudgetBytes

  def initialize(document)
    @document = document
  end

  def name
    root.xpath("//h2[contains(@class, 'wprm-recipe-name')]").text
  end

  private
    def root
      @document.xpath("/html/body/div[contains(@class, 'container')]/div[contains(@class, 'wrapper')]/div/article/div[contains(@class, 'wprm-recipe-container')]/div[contains(@class, 'wprm-recipe')]")
    end

end