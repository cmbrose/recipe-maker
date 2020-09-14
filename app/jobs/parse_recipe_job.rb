require 'uri'

class ParseRecipeJob < ApplicationJob
  queue_as :default

  def perform(recipe, html)
    doc = Xml::Document.new(html)

    if recipe.source_is_url?
      domain = ParseRecipeJob.get_host_without_www(recipe.source)
      handler = ParseRecipeJob.get_site_handler(domain, doc)
    else
      raise "Cannot handle recipe source: #{recipe.source_kind}"
    end

    handler.populate_recipe(recipe)
    recipe.save
  end

  private
    def self.get_site_handler(domain, doc)
      case domain
      when 'budgetbytes.com'
        BudgetBytes.new(doc)
      end
    end

    def self.get_host_without_www(url)
      uri = URI.parse(url)
      uri = URI.parse("http://#{url}") if uri.scheme.nil?
      host = uri.host.downcase
      host.start_with?('www.') ? host[4..-1] : host
    end
end
